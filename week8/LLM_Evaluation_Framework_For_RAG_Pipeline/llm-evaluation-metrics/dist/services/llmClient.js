import axios from "axios";
import { ENV } from "../config/env.js";
/**
 * Call OpenAI API
 */
async function callOpenAI(prompt, model) {
    const res = await axios.post("https://api.openai.com/v1/chat/completions", {
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
    }, {
        headers: {
            Authorization: `Bearer ${ENV.OPENAI_API_KEY}`,
            "Content-Type": "application/json"
        }
    });
    return res.data.choices[0].message.content;
}
/**
 * Call Groq API
 */
async function callGroq(prompt, model) {
    const res = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
    }, {
        headers: {
            Authorization: `Bearer ${ENV.GROQ_API_KEY}`,
            "Content-Type": "application/json"
        }
    });
    return res.data.choices[0].message.content;
}
/**
 * Call LLM with provider selection
 */
export async function callLLM(prompt, model, provider) {
    const selectedProvider = provider || ENV.LLM_PROVIDER;
    const selectedModel = model ||
        (selectedProvider === "groq" ? ENV.GROQ_MODEL : ENV.OPENAI_MODEL);
    if (!prompt || prompt.trim() === "") {
        throw new Error("Prompt cannot be empty");
    }
    try {
        if (selectedProvider === "groq") {
            return await callGroq(prompt, selectedModel);
        }
        else {
            return await callOpenAI(prompt, selectedModel);
        }
    }
    catch (err) {
        if (axios.isAxiosError(err)) {
            throw new Error(`LLM API Error: ${err.response?.status} - ${err.response?.data?.error?.message || err.message}`);
        }
        throw err;
    }
}
