/**
 * Script to generate embeddings for sample resumes and insert them into MongoDB
 * This enables vector search to work once the Atlas Search index is created
 */

const axios = require('axios');
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const EMBEDDING_API_URL = process.env.EMBEDDING_API_URL || 'https://api.mistral.ai/v1/embeddings';
const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || 'mistral-embed';
const EMBEDDING_API_KEY = process.env.API_KEY;

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'resumes-agent';
const COLLECTION_NAME = process.env.COLLECTION_NAME || 'resumes';

// Sample resumes with banking domain experience
const SAMPLE_RESUMES = [
  {
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@bank.com',
    role: 'Senior Banking Software Engineer',
    company: 'ICICI Bank',
    totalExperience: 12,
    text: 'Senior Banking Software Engineer with 12 years of experience in banking domain. Proficient in Java, Spring Boot, microservices architecture, and payment processing systems. Led development of core banking platform serving 2M+ customers. Expertise in ISO 20022, SWIFT, and regulatory compliance (RBI, SEBI). Strong knowledge of distributed systems, database optimization, and real-time transaction processing.',
    skills: ['Java', 'Spring Boot', 'Banking', 'Microservices', 'Payment Systems', 'SWIFT', 'SQL', 'MongoDB'],
    education: 'B.Tech Computer Science from IIT Bombay'
  },
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@bank.com',
    role: 'Banking Domain Architect',
    company: 'HDFC Bank',
    totalExperience: 15,
    text: 'Banking Domain Architect with 15 years of experience designing and implementing large-scale banking solutions. Expert in core banking systems, digital banking platforms, and fintech integrations. Proficient in Node.js, TypeScript, REST APIs, and microservices. Experience with regulatory compliance, data security, and blockchain technology. Led cross-functional teams to deliver banking products for retail and corporate segments.',
    skills: ['Node.js', 'TypeScript', 'Banking Architecture', 'Fintech', 'REST APIs', 'Blockchain', 'PostgreSQL', 'Redis'],
    education: 'M.Tech from BITS Pilani'
  },
  {
    name: 'Amit Patel',
    email: 'amit.patel@bank.com',
    role: 'Full Stack Developer - Banking',
    company: 'Axis Bank',
    totalExperience: 8,
    text: 'Full Stack Developer with 8 years of experience in banking and financial services. Skilled in Python, Node.js, React, and cloud platforms (AWS). Worked on payment gateways, loan management systems, and customer onboarding platforms. Experience with agile methodologies, CI/CD pipelines, and containerization. Strong problem-solving skills with focus on security and performance optimization.',
    skills: ['Python', 'Node.js', 'React', 'AWS', 'Docker', 'Banking Systems', 'Payment Gateways', 'PostgreSQL'],
    education: 'B.E from NIT Surat'
  },
  {
    name: 'Sneha Gupta',
    email: 'sneha.gupta@bank.com',
    role: 'Banking Data Scientist',
    company: 'Yes Bank',
    totalExperience: 10,
    text: 'Banking Data Scientist with 10 years of experience in predictive analytics and risk management. Expert in machine learning, statistical modeling, and credit risk assessment. Proficient in Python, R, SQL, and big data technologies (Spark, Hadoop). Experience with fraud detection systems, customer segmentation, and portfolio optimization. Published research in financial technology and regulatory compliance.',
    skills: ['Python', 'Machine Learning', 'Risk Analytics', 'SQL', 'Spark', 'Banking', 'Statistical Modeling', 'Big Data'],
    education: 'MS Statistics from Delhi University'
  },
  {
    name: 'Vikram Singh',
    email: 'vikram.singh@bank.com',
    role: 'Banking Infrastructure Engineer',
    company: 'SBI',
    totalExperience: 14,
    text: 'Banking Infrastructure Engineer with 14 years of experience managing high-availability banking systems. Expertise in Linux, Kubernetes, Docker, and cloud infrastructure. Experience with banking security (HSM, PKI), network design, and disaster recovery. Led migration of legacy banking systems to cloud. Strong knowledge of compliance requirements (Basel III, GDPR) and IT governance.',
    skills: ['Kubernetes', 'Docker', 'Linux', 'AWS', 'Banking Infrastructure', 'Security', 'Terraform', 'CI/CD'],
    education: 'B.Tech from Anna University'
  },
  {
    name: 'Deepa Nair',
    email: 'deepa.nair@bank.com',
    role: 'Banking QA Lead',
    company: 'Kotak Mahindra Bank',
    totalExperience: 11,
    text: 'Banking QA Lead with 11 years of experience in quality assurance and testing. Specialized in banking application testing, regulatory compliance testing, and security testing. Proficient in automation frameworks, performance testing, and UAT coordination. Experience with payment systems, forex trading platforms, and digital banking solutions. Led teams to deliver high-quality banking software.',
    skills: ['QA Automation', 'Testing', 'Banking', 'Selenium', 'JIRA', 'Performance Testing', 'Security Testing', 'Banking Compliance'],
    education: 'MCA from Cochin University'
  }
];

async function generateEmbedding(text) {
  try {
    const response = await axios.post(EMBEDDING_API_URL, {
      model: EMBEDDING_MODEL,
      input: text
    }, {
      headers: {
        'Authorization': `Bearer ${EMBEDDING_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    if (response.data?.data?.[0]?.embedding) {
      return response.data.data[0].embedding;
    }
    throw new Error('Invalid embedding response shape');
  } catch (err) {
    console.error('Failed to generate embedding:', err.message);
    throw err;
  }
}

async function run() {
  let client;
  try {
    console.log('Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const coll = db.collection(COLLECTION_NAME);

    console.log(`Using database: ${DB_NAME}, collection: ${COLLECTION_NAME}`);
    console.log(`\nGenerating embeddings and inserting ${SAMPLE_RESUMES.length} sample resumes...`);
    console.log('This may take a minute.\n');

    let inserted = 0;
    for (const resume of SAMPLE_RESUMES) {
      try {
        console.log(`Processing: ${resume.name}...`);
        const embedding = await generateEmbedding(resume.text);
        const doc = {
          ...resume,
          embedding,
          createdAt: new Date(),
          source: 'seed_script'
        };
        const result = await coll.insertOne(doc);
        inserted++;
        console.log(`  ✓ Inserted with ID: ${result.insertedId}`);
      } catch (err) {
        console.error(`  ✗ Failed for ${resume.name}: ${err.message}`);
      }
    }

    console.log(`\n✓ Successfully inserted ${inserted}/${SAMPLE_RESUMES.length} resumes with embeddings`);
    console.log('\n--- NEXT STEPS ---');
    console.log('1. Create the Atlas Search vector index in MongoDB Atlas UI:');
    console.log('   - Go to Clusters → Collections → Search');
    console.log('   - Click "Create Index"');
    console.log('   - Database: resumes-agent');
    console.log('   - Collection: resumes');
    console.log('   - Index Name: vector_index_resumes');
    console.log('   - Use the JSON definition below:\n');
    console.log(JSON.stringify({
      "mappings": {
        "dynamic": false,
        "fields": {
          "embedding": {
            "type": "knnVector",
            "dimensions": 1024
          },
          "text": { "type": "string" },
          "skills": { "type": "string" },
          "role": { "type": "string" },
          "company": { "type": "string" },
          "name": { "type": "string" }
        }
      }
    }, null, 2));
    console.log('\n2. After the index builds (5-10 minutes), test vector search:');
    console.log('   curl -sS -X POST http://localhost:3000/v1/search/vector \\');
    console.log('     -H "Content-Type: application/json" \\');
    console.log('     -d \'{"query":"banking domain experience","topK":5}\'');

  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  } finally {
    if (client) await client.close();
  }
}

run();
