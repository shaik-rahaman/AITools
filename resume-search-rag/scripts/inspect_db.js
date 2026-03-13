require('dotenv').config();
const { MongoClient } = require('mongodb');
(async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI missing');
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(process.env.DB_NAME || 'resumes-agent');
    const coll = db.collection(process.env.COLLECTION_NAME || 'resumes');
    const count = await coll.countDocuments();
    console.log('count=', count);
    const one = await coll.findOne();
    if (one) {
      if (one._id) one._id = one._id.toString();
      console.log('one=', JSON.stringify(one, null, 2));
    } else {
      console.log('one= null');
    }
    await client.close();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
