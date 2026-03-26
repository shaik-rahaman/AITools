import axios from "axios";
import { ENV } from "../config/env.js";
/**
 * Call Deepeval service to evaluate faithfulness
 */
export async function evalFaithfulness(source, output, provider) {
    if (!source || source.trim() === "") {
        throw new Error("Source cannot be empty");
    }
    if (!output || output.trim() === "") {
        throw new Error("Output cannot be empty");
    }
    try {
        const payload = {
            source,
            output
        };
        // Include provider if specified
        if (provider) {
            payload.provider = provider;
        }
        const res = await axios.post(ENV.DEEPEVAL_URL, payload);
        return res.data;
    }
    catch (err) {
        if (axios.isAxiosError(err)) {
            if (err.code === "ECONNREFUSED") {
                throw new Error(`Deepeval service unavailable at ${ENV.DEEPEVAL_URL}. Is it running?`);
            }
            throw new Error(`Deepeval Error: ${err.response?.status} - ${err.message}`);
        }
        throw err;
    }
}
