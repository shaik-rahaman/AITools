import { connectToMongo, getDbName } from "../src/config/mongodb";
import { EmbeddingService } from "../src/services/EmbeddingService";
import dotenv from "dotenv";

dotenv.config({ path: require('path').resolve(__dirname, '../.env') });

async function run() {
  const client = await connectToMongo();
  const db = client.db(getDbName());
  const coll = db.collection(process.env.COLLECTION_NAME || 'resumes');

  const embSvc = new EmbeddingService();

  // Find docs missing embedding or with wrong length
  const cursor = coll.find({ $or: [ { embedding: { $exists: false } }, { embedding: { $size: 0 } } ] }).limit(500);

  let count = 0;
  while (await cursor.hasNext()) {
    const doc = await cursor.next();
    if (!doc) break;
    const text = doc.text || `${doc.role || ''} ${doc.company || ''}`.trim();
    try {
      const emb = await embSvc.generateEmbedding(text);
      await coll.updateOne({ _id: doc._id }, { $set: { embedding: emb } });
      count++;
      console.log(`Updated _id=${doc._id.toString()} (${count})`);
    } catch (err:any) {
      console.error('failed to embed', doc._id?.toString(), err?.message || err);
    }
  }

  console.log(`Done. Updated ${count} documents.`);
  await client.close();
}

run().catch(err => { console.error(err); process.exit(1); });
