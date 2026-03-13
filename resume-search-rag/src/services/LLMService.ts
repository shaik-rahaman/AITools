import axios from 'axios';
import { config } from '../config/env';
import { Candidate, SummarizationOptions } from '../types';
import { logger } from '../middleware/logging';

export class LLMService {
    private apiUrl: string;
    private apiKey: string;

    constructor() {
        // Prefer an explicit LLM URL if provided (LLM_API_URL or config.llmApiUrl).
        // If no explicit LLM URL but a GROQ API key exists, prefer the official Groq API endpoint.
        const explicitLLM = process.env.LLM_API_URL || (config as any).llmApiUrl;
        const groqKey = process.env.GROQ_API_KEY || process.env.GROQ_KEY;

        if (!explicitLLM && groqKey) {
            this.apiUrl = 'https://api.groq.ai';
            this.apiKey = groqKey;
        } else {
            this.apiUrl = explicitLLM || (config as any).llmApiUrl;
            this.apiKey = (config as any).llmApiKey || process.env.LLM_API_KEY || process.env.LLM_KEY;
            if (!this.apiKey && groqKey) this.apiKey = groqKey;
        }

        if (!this.apiUrl) {
            throw new Error('LLM Service configuration error: missing LLM API URL (set LLM_API_URL or GROQ_API_URL in .env)');
        }

        // Validate URL parsing and hostname looks valid (contains a dot/TLD)
        try {
            const parsed = new URL(this.apiUrl);
            if (!parsed.hostname || !parsed.hostname.includes('.')) {
                throw new Error(`invalid hostname: ${parsed.hostname}`);
            }
        } catch (err: any) {
            throw new Error(`LLM Service configuration error: invalid LLM API URL "${this.apiUrl}" (${err?.message || err})`);
        }

        if (!this.apiKey) {
            throw new Error('LLM Service configuration error: missing LLM API key (set LLM_API_KEY or GROQ_API_KEY in .env)');
        }
    }

    async rerankCandidates(query: string, candidates: Candidate[], topK: number): Promise<Candidate[]> {
        // Detect Groq usage
        const parsed = (() => { try { return new URL(this.apiUrl); } catch { return null; } })();
        const host = parsed?.hostname?.toLowerCase() || '';
        const groqKeyPresent = !!(process.env.GROQ_API_KEY || process.env.GROQ_KEY);
        const useGroq = groqKeyPresent || host.includes('groq') || this.apiUrl.includes('groq.ai');

        if (useGroq) {
            // Build a prompt that asks the model to return a JSON array of resumeIds ordered by relevance
            const prompt = `Sort the following candidates by relevance to the job description. Return a JSON array of resumeIds in descending relevance order, and nothing else.\n\nJob Description:\n${query}\n\nCandidates:\n${JSON.stringify(candidates)}\n`;

            const body = { model: (config as any).llmModel || 'meta-llama/llama-4-scout-17b-16e-instruct', prompt };

            // Try both canonical and OpenAI-prefixed output endpoints
            const endpoints = ['/v1/outputs', '/openai/v1/outputs'];
            const attemptedUrls: string[] = [];
            const parsedCfg = (() => { try { return new URL(this.apiUrl); } catch { return null; } })();
            const baseCandidates: string[] = [];
            const rawBase = this.apiUrl.replace(/\/+$/,'');
            // Prefer a sanitized configured base first (remove /openai and /v1), then origin, then original configured base.
            if (parsedCfg) {
                const sanitizedPath = (parsedCfg.pathname || '').replace(/\/openai/gi,'').replace(/\/v1/gi,'').replace(/\/+$/,'');
                const sanitizedBase = `${parsedCfg.origin}${sanitizedPath}`.replace(/\/+$/,'');
                if (sanitizedBase && sanitizedBase !== rawBase) baseCandidates.push(sanitizedBase);
                baseCandidates.push(parsedCfg.origin);
                const originPlusPath = parsedCfg.origin + (parsedCfg.pathname || '').replace(/\/+$/,'');
                if (originPlusPath && originPlusPath !== sanitizedBase && originPlusPath !== rawBase) baseCandidates.push(originPlusPath);
            }
            if (useGroq) baseCandidates.push(rawBase);
            // Do not auto-fallback to hard-coded Groq origin; prefer configured bases only

            let lastErr: any = null;
            for (const base of Array.from(new Set(baseCandidates))) {
                for (const ep of endpoints) {
                    let url: string;
                    try { url = new URL(ep, base).toString(); } catch { url = `${base.replace(/\/+$/,'')}${ep}`; }
                    attemptedUrls.push(url);
                    try {
                        const resp = await axios.post(url, { model: body.model, input: prompt }, { headers: { 'Authorization': `Bearer ${this.apiKey}`, 'Content-Type': 'application/json' }, timeout: 20000 });
                        // parse outputs
                        if (Array.isArray(resp.data?.outputs)) {
                            const out = resp.data.outputs[0];
                            let text: any = undefined;
                            if (typeof out?.content === 'string') text = out.content;
                            else if (Array.isArray(out?.content)) {
                                for (const block of out.content) {
                                    if (typeof block === 'string') { text = block; break; }
                                    if (typeof block?.text === 'string') { text = block.text; break; }
                                }
                            }
                            if (typeof text === 'string') {
                                try {
                                    const parsedJson = JSON.parse(text);
                                    if (Array.isArray(parsedJson)) {
                                        // map to candidates preserving objects
                                        const ordered: Candidate[] = [];
                                        for (const id of parsedJson) {
                                            const found = candidates.find(c => c.resumeId === id || (c as any).id === id);
                                            if (found) ordered.push(found);
                                        }
                                        return ordered;
                                    }
                                } catch (e) {
                                    // not JSON — fallback to simple parse
                                }
                            }
                        }
                        // fallback to choices
                        if (Array.isArray(resp.data?.choices) && resp.data.choices[0]?.text) {
                            try {
                                const parsedJson = JSON.parse(resp.data.choices[0].text);
                                if (Array.isArray(parsedJson)) {
                                    const ordered: Candidate[] = [];
                                    for (const id of parsedJson) {
                                        const found = candidates.find(c => c.resumeId === id || (c as any).id === id);
                                        if (found) ordered.push(found);
                                    }
                                    return ordered;
                                }
                            } catch (e) {}
                        }
                        // if we couldn't parse, continue to next
                    } catch (err:any) {
                        lastErr = err;
                        if (err.response && err.response.status === 404) continue;
                        const e: any = new Error('LLM upstream error');
                        e.upstreamStatus = err.response?.status ?? null;
                        e.upstreamBody = Object.assign({}, err.response?.data || {}, { attemptedUrls, message: err.message });
                        throw e;
                    }
                }
            }
            if (lastErr && lastErr.response) {
                const e: any = new Error('LLM upstream error');
                e.upstreamStatus = lastErr.response.status;
                e.upstreamBody = Object.assign({}, lastErr.response.data || {}, { attemptedUrls });
                throw e;
            }
            throw new Error('LLM rerank failed: no endpoint responded successfully');
        }

        // Default behavior for non-Groq providers
        try {
            const response = await axios.post(`${this.apiUrl.replace(/\/+$/,'')}/rerank`, { query, candidates, topK }, { headers: { 'Authorization': `Bearer ${this.apiKey}` }, timeout: 20000 });
            if (Array.isArray(response.data?.sortedCandidates)) return response.data.sortedCandidates;
            if (Array.isArray(response.data?.results)) return response.data.results;
            if (Array.isArray(response.data?.data?.sortedCandidates)) return response.data.data.sortedCandidates;
            for (const v of Object.values(response.data || {})) if (Array.isArray(v)) return v as Candidate[];
            throw new Error('Unexpected LLM rerank response shape');
        } catch (err: any) {
            if (err.response) {
                const e: any = new Error('LLM upstream error');
                e.upstreamStatus = err.response.status;
                e.upstreamBody = err.response.data;
                throw e;
            }
            throw err;
        }
    }

    async summarizeCandidateFit(query: string, candidate: Candidate, options: SummarizationOptions): Promise<string> {
        // If provider is Groq (we have a Groq-like endpoint), translate using a completion-style request
        try {
            const parsed = new URL(this.apiUrl);
            const host = parsed.hostname.toLowerCase();

            // Detect Groq usage by hostname or presence of a Groq API key in env
            const groqKeyPresent = !!(process.env.GROQ_API_KEY || process.env.GROQ_KEY);
            const useGroq = groqKeyPresent || host.includes('groq') || this.apiUrl.includes('groq.ai');

            if (useGroq) {
                // Load prompt template and fill
                const promptTemplate = `Generate a concise summary of the candidate's qualifications and experiences based on the following resume snippet. Focus on the key skills, relevant experiences, and educational background that make the candidate suitable for the specified role.\n\nResume Snippet:\n"${candidate.snippet}"\n\nRole Description:\n"${query}"\n\nPlease provide a summary that highlights the candidate's fit for the role, including any specific skills or experiences that align with the job requirements.`;

                const body = {
                    model: (config as any).llmModel || 'meta-llama/llama-4-scout-17b-16e-instruct',
                    prompt: promptTemplate,
                    max_tokens: options.maxTokens || 150,
                };

                // Build completions URL carefully: normalize base path by removing any
                // provider-specific prefixes like '/openai' or stray '/v1' so we call
                // the canonical '/v1/completions' endpoint expected by Groq.
                let completionsUrl: string;
                try {
                    const parsedUrl = new URL(this.apiUrl);
                    // normalize pathname: remove occurrences of '/openai' and any leading '/v1'
                    let p = (parsedUrl.pathname || '').replace(/\/openai/gi, '');
                    // remove any '/v1' occurrences to avoid duplicates
                    p = p.replace(/\/v1/gi, '');
                    // assemble base (origin + sanitized path)
                    const base = `${parsedUrl.origin}${p}`.replace(/\/+$/,'');
                    completionsUrl = `${base}/v1/completions`;
                } catch (e) {
                    completionsUrl = `${this.apiUrl.replace(/\/+$/,'')}/v1/completions`;
                }

                // Try multiple possible completion endpoints until one succeeds.
                // For Groq hosts prefer canonical Groq paths and avoid '/openai' prefixed variants
                const endpoints = useGroq
                    ? ['/v1/outputs', '/openai/v1/outputs']
                    : ['/v1/completions', '/openai/v1/completions', '/v1/outputs', '/openai/v1/outputs'];

                let lastError: any = null;
                const parsed = (() => { try { return new URL(this.apiUrl); } catch { return null; } })();
                const baseCandidates: string[] = [];
                const rawBase = this.apiUrl.replace(/\/+$/,'');
                // If we're using Groq and the user provided a configured GROQ_API_URL, try that raw configured base first
                if (useGroq) {
                    baseCandidates.push(rawBase);
                }
                // If the configured base has extra '/openai' or '/v1' segments, add a sanitized variant
                if (parsed) {
                    const sanitizedPath = (parsed.pathname || '').replace(/\/openai/gi,'').replace(/\/v1/gi,'').replace(/\/+$/,'');
                    const sanitizedBase = `${parsed.origin}${sanitizedPath}`.replace(/\/+$/,'');
                    if (sanitizedBase && sanitizedBase !== rawBase) baseCandidates.push(sanitizedBase);
                    // then try origin-only
                    baseCandidates.push(parsed.origin);
                    // then try origin + original path (without trailing slash)
                    const originPlusPath = parsed.origin + (parsed.pathname || '').replace(/\/+$/,'');
                    if (originPlusPath && originPlusPath !== sanitizedBase && originPlusPath !== rawBase) baseCandidates.push(originPlusPath);
                }
                // Do not auto-fallback to hard-coded Groq origin; prefer configured bases only

                const attemptedUrls: string[] = [];
                for (const base of Array.from(new Set(baseCandidates))) {
                    for (const ep of endpoints) {
                        let url: string;
                        try {
                            // Use URL resolution to avoid duplicated path segments
                            url = new URL(ep, base).toString();
                        } catch (errUrl) {
                            url = `${base.replace(/\/+$/,'')}${ep}`;
                        }
                        attemptedUrls.push(url);
                        logger.info({ msg: 'llm.call.attempt', url, useGroq });
                        try {
                            const requestBody = useGroq ? { model: body.model, input: promptTemplate } : body;
                            const resp = await axios.post(url, requestBody, {
                                headers: {
                                    'Authorization': `Bearer ${this.apiKey}`,
                                    'Content-Type': 'application/json'
                                },
                                timeout: 20000,
                            });

                            // Groq outputs parsing: try common shapes first
                            if (Array.isArray(resp.data?.outputs)) {
                                const out = resp.data.outputs[0];
                                if (!out) return JSON.stringify(resp.data);
                                // outputs[0].content might be a string or an array of content blocks
                                if (typeof out.content === 'string') return out.content;
                                if (Array.isArray(out.content)) {
                                    for (const block of out.content) {
                                        if (typeof block === 'string') return block;
                                        if (typeof block?.text === 'string') return block.text;
                                        if (block?.type === 'output_text' && typeof block?.text === 'string') return block.text;
                                    }
                                }
                                if (Array.isArray(out?.content) && typeof out.content[0]?.text === 'string') return out.content[0].text;
                            }

                            // fallback: older 'choices' shape
                            if (resp.data?.choices && Array.isArray(resp.data.choices) && (resp.data.choices[0]?.text || resp.data.choices[0]?.message)) {
                                return resp.data.choices[0].text || resp.data.choices[0].message;
                            }

                            if (typeof resp.data === 'string') return resp.data;

                            // found a 2xx response but couldn't parse — return JSON as string
                            return JSON.stringify(resp.data);
                        } catch (err: any) {
                            lastError = err;
                            // on 404 try next endpoint; on other HTTP errors bubble up with details
                            if (err.response && err.response.status === 404) {
                                continue;
                            }
                            const e: any = new Error('LLM upstream error');
                            e.upstreamStatus = err.response?.status ?? null;
                            e.upstreamBody = Object.assign({}, err.response?.data || {}, { attemptedUrls, message: err.message });
                            throw e;
                        }
                    }
                }

                // If we reach here, none of the endpoints succeeded — surface last error
                if (lastError && lastError.response) {
                    const e: any = new Error('LLM upstream error');
                    e.upstreamStatus = lastError.response.status;
                    e.upstreamBody = Object.assign({}, lastError.response.data || {}, { attemptedUrls });
                    throw e;
                }
                throw new Error('LLM summarization failed: no endpoint responded successfully');
            }

            // Default path for other providers: call /summarize
            const response = await axios.post(`${this.apiUrl.replace(/\/+$/,'')}/summarize`, {
                query,
                candidate,
                style: options.style,
                maxTokens: options.maxTokens
            }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                },
                timeout: 20000,
            });

            return response.data.summary;
        } catch (err: any) {
            // Log the upstream error and return a safe local fallback summary
            logger.error({ msg: 'llm.summarize.error', error: err?.message || err, upstream: err?.response?.data || null });
            try {
                const fallback = this.localSummarizeFallback(query, candidate, options);
                return fallback;
            } catch (fallbackErr:any) {
                // If fallback unexpectedly fails, preserve original error semantics
                if (err.response) {
                    const e: any = new Error('LLM upstream error');
                    e.upstreamStatus = err.response.status;
                    e.upstreamBody = err.response.data;
                    throw e;
                }
                throw err;
            }
        }
    }

    // Lightweight local summarizer used when the LLM upstream is unavailable.
    // Produces an extractive summary from `candidate.snippet` with simple keyword matching against the `query`.
    private localSummarizeFallback(query: string, candidate: Candidate, options: SummarizationOptions): string {
        const maxSentences = (options?.style === 'short' || options?.maxTokens && options.maxTokens < 60) ? 1 : 3;
        const text = (candidate?.snippet || '').replace(/\s+/g, ' ').trim();
        if (!text) return 'No candidate text available for summarization.';

        // Split into sentences and trim
        const sentences = text.split(/(?<=[\.\?\!])\s+/).map(s => s.trim()).filter(Boolean);
        // Score sentences by overlap with query keywords
        const qTokens = query.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
        const scores = sentences.map(s => {
            const sTokens = s.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
            const common = sTokens.filter(t => qTokens.includes(t));
            return common.length;
        });

        // Pick top scoring sentences up to maxSentences
        const idxs = scores
            .map((sc, i) => ({ sc, i }))
            .sort((a, b) => b.sc - a.sc || a.i - b.i)
            .slice(0, maxSentences)
            .sort((a, b) => a.i - b.i)
            .map(x => x.i);

        let summary = '';
        if (idxs.length === 0) {
            // fallback to first N sentences
            summary = sentences.slice(0, maxSentences).join(' ');
        } else {
            summary = idxs.map(i => sentences[i]).join(' ');
        }

        // Add a short note that this is an auto-generated fallback
        if (options?.style === 'short') {
            // keep it concise
            const short = summary.split(/(?<=[\.\?\!])\s+/)[0] || summary;
            return `${short} (auto-summary)`;
        }

        return `${summary} (auto-summary)`;
    }

    async extractMetadata(rawText: string): Promise<{ skills: string[], jobTitles: string[], experienceSummary: string }> {
        const response = await axios.post(`${this.apiUrl}/extract-metadata`, {
            text: rawText
        }, {
            headers: {
                'Authorization': `Bearer ${this.apiKey}`
            }
        });

        return response.data.metadata;
    }
}