import axios from 'axios';

export class EmbeddingService {
    private apiUrl: string;
    private apiKey: string;
    private defaultModel: string;

    constructor() {
        this.apiUrl = process.env.EMBEDDING_API_URL || 'https://api.mistral.ai/v1/embeddings';
        this.apiKey = process.env.API_KEY || process.env.MISTRAL_API_KEY || '';
        this.defaultModel = process.env.EMBEDDING_MODEL || 'mistral-embed-small';
    }

    public getModelName() {
        return this.defaultModel;
    }

    public async generateEmbedding(input: string, model?: string): Promise<number[]> {
        if (typeof input !== 'string' || !input.trim()) {
            const e: any = new Error('INVALID_INPUT: input must be a non-empty string');
            e.code = 'INVALID_INPUT';
            throw e;
        }

        const modelToUse = model || this.defaultModel;
        const requestBody = {
            model: modelToUse,
            input,
        };

        try {
            // Some envs set EMBEDDING_API_URL to the full embeddings endpoint
            const url = this.apiUrl.endsWith('/embeddings') ? this.apiUrl : `${this.apiUrl}`;

            const response = await axios.post(url, requestBody, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                timeout: 10000,
            });

            const data = response.data || {};

            // Support multiple response shapes
            if (Array.isArray(data?.data) && Array.isArray(data.data[0]?.embedding)) {
                return data.data[0].embedding;
            }
            if (Array.isArray(data?.embedding)) {
                return data.embedding;
            }
            if (Array.isArray(data?.embeddings) && Array.isArray(data.embeddings[0])) {
                return data.embeddings[0];
            }

            // Fallback: try to find first numeric array in response
            for (const v of Object.values(data)) {
                if (Array.isArray(v) && typeof v[0] === 'number') return v as number[];
            }

            throw new Error('Unexpected embedding response');
        } catch (error: any) {
            console.error('Error generating embedding:', error?.message || error);
            throw error;
        }
    }
}