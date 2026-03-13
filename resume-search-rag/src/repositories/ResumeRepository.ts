import { connectToMongo, getDbName } from "../config/mongodb";

export type BM25Result = {
    _id: string;
    name?: string;
    email?: string;
    role?: string;
    company?: string;
    skills?: any;
    score?: number;
    snippet?: string;
};

export class ResumeRepository {
    static async ping() {
        const start = Date.now();
        const client = await connectToMongo();
        const db = client.db(getDbName());
        await db.command({ ping: 1 });
        const latency = Date.now() - start;
        return { status: "ok", latencyMs: latency };
    }

    static async bm25Search(query: string, topK = 20, filters: Record<string, any> = {}): Promise<BM25Result[]> {
        const client = await connectToMongo();
        const db = client.db(getDbName());
        const collectionName = process.env.COLLECTION_NAME || "resumes";
        const indexName = process.env.BM25_INDEX_NAME || "bm25_index_resumes";

        const pipeline: any[] = [];

        pipeline.push({
            $search: {
                index: indexName,
                text: {
                    query,
                    path: [
                        "text",
                        "skills",
                        "role",
                        "company",
                        "experienceSummary",
                        "name",
                        "education",
                    ],
                },
                highlight: { path: ["text"] },
            },
        });

        if (filters && Object.keys(filters).length) {
            const match: any = {};
            if (filters.minYearsExperience) {
                match.totalExperience = { $gte: filters.minYearsExperience };
            }
            // extend filter translations here
            if (Object.keys(match).length) pipeline.push({ $match: match });
        }

        pipeline.push({ $limit: topK });

        pipeline.push({
            $project: {
                name: 1,
                email: 1,
                role: 1,
                company: 1,
                skills: 1,
                totalExperience: 1,
                score: { $meta: "searchScore" },
                highlights: { $meta: "searchHighlights" },
            },
        });

        // Execute aggregation with 15 second timeout
        const docs = await db.collection(collectionName).aggregate(pipeline, { maxTimeMS: 15000 }).toArray();

        return docs.map((d: any) => {
            const snippet = Array.isArray(d.highlights) && d.highlights.length
                ? d.highlights.map((h: any) => (h.texts || []).map((t: any) => t.value).join(" ")).join(" ... ")
                : undefined;

            return {
                _id: d._id?.toString(),
                name: d.name,
                email: d.email,
                role: d.role,
                company: d.company,
                skills: d.skills,
                score: d.score,
                snippet,
            } as BM25Result;
        });
    }

    static async vectorSearch(queryEmbedding: number[], topK = 20, filters: Record<string, any> = {}): Promise<BM25Result[]> {
        const client = await connectToMongo();
        const db = client.db(getDbName());
        const collectionName = process.env.COLLECTION_NAME || "resumes";
        const indexName = process.env.VECTOR_INDEX_NAME || "vector_index_resumes";

        const pipeline: any[] = [];

        // Using Atlas vector operator (not knnBeta)
        const numCandidates = process.env.VECTOR_SEARCH_NUM_CANDIDATES
            ? parseInt(process.env.VECTOR_SEARCH_NUM_CANDIDATES, 10)
            : Math.max(topK * 5, 100);

        pipeline.push({
            $search: {
                index: indexName,
                vectorSearch: {
                    path: "embedding",
                    queryVector: queryEmbedding,
                    numCandidates,
                    limit: topK,
                },
            },
        });

        if (filters && Object.keys(filters).length) {
            const match: any = {};
            if (filters.minYearsExperience) {
                match.totalExperience = { $gte: filters.minYearsExperience };
            }
            if (Object.keys(match).length) pipeline.push({ $match: match });
        }

        pipeline.push({ $limit: topK });

        pipeline.push({
            $project: {
                name: 1,
                email: 1,
                role: 1,
                company: 1,
                skills: 1,
                totalExperience: 1,
                score: { $meta: "searchScore" },
            },
        });

        try {
            // Execute aggregation with 15 second timeout
            const docs = await db.collection(collectionName).aggregate(pipeline, { maxTimeMS: 15000 }).toArray();

            return docs.map((d: any) => ({
                _id: d._id?.toString(),
                name: d.name,
                email: d.email,
                role: d.role,
                company: d.company,
                skills: d.skills,
                score: d.score,
            } as BM25Result));
        } catch (err: any) {
            // Provide actionable diagnostics for Atlas Search vector index failures
            const expectedDim = process.env.EMBEDDING_DIM ? parseInt(process.env.EMBEDDING_DIM, 10) : undefined;
            const e: any = new Error(`Cannot execute $search over vectorSearch index '${indexName}'` + (err?.message ? `: ${err.message}` : ''));
            e.code = err?.code || 'VECTOR_SEARCH_ERROR';
            e.index = indexName;
            e.path = 'embedding';
            e.expectedDimensions = expectedDim;
            e.raw = err?.response?.data || err;
            throw e;
        }
    }
}

export default ResumeRepository;