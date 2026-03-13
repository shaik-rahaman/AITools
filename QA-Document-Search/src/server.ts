import express from 'express';
import multer from 'multer';
import path from 'path';
import { promises as fs } from 'fs';
import fsSync from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

import { createChatModel, getModelInfo } from './model.js';
import { buildQAChain } from './chain.js';
import { loadDocumentToString } from './loaders.js';
import { InvokeSchema, FileUploadSchema, QAChainResponse, HealthResponse } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8787;
const HOST = process.env.HOST || 'localhost';

// Middleware
app.use(express.json({ limit: '50mb' }));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    // Ensure directory exists synchronously
    try {
      fsSync.accessSync(uploadDir);
    } catch {
      fsSync.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    cb(null, `${timestamp}-${random}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['.pdf', '.docx', '.txt', '.csv'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${ext} not allowed. Only ${allowedTypes.join(', ')} are permitted.`));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
    files: 10
  }
});

// Request logging middleware
app.use((req, res, next) => {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  console.log(`[${requestId}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.get('/health', (req, res) => {
  const { model, provider } = getModelInfo();
  const response: HealthResponse = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    model
  };
  res.json(response);
});

app.post('/search/document', async (req, res) => {
  try {
    const validatedData = InvokeSchema.parse(req.body);
    const { question, documentText, promptType = 'default' } = validatedData;

    const model = createChatModel();
    const chain = buildQAChain(model, promptType);

    const result = await chain.invoke({
      document: documentText || '',
      question
    });

    const { model: modelName, provider } = getModelInfo();
    const response: QAChainResponse = {
      output: result,
      model: modelName,
      provider,
      promptType
    };

    res.json(response);
  } catch (error) {
    console.error('Error in /search/document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/search/documents', upload.array('files', 10), async (req, res) => {
  const files = req.files as Express.Multer.File[];
  const { question, promptType = 'default' } = req.body;

  try {
    FileUploadSchema.parse({ question, promptType });

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // Load all documents
    const documentContents: string[] = [];
    for (const file of files) {
      try {
        const content = await loadDocumentToString(file.path);
        console.log(`Document content length for ${file.originalname}: ${content.length} characters`);
        console.log(`First 500 characters: ${content.substring(0, 500)}`);
        documentContents.push(`=== ${file.originalname} ===\n${content}`);
      } catch (error) {
        console.error(`Error loading ${file.originalname}:`, error);
        // Continue with other files
      }
    }

    if (documentContents.length === 0) {
      return res.status(400).json({ error: 'No valid documents could be processed' });
    }

    const combinedDocument = documentContents.join('\n\n---\n\n');
    console.log(`Combined document length: ${combinedDocument.length}`);
    console.log(`Combined document preview:\n${combinedDocument.substring(0, 1000)}`);

    const model = createChatModel();
    const chain = buildQAChain(model, promptType);

    if (combinedDocument.trim().length < 30) {
      return res.status(400).json({
        error: 'Unable to extract text from the uploaded document. If this is a scanned image or a protected PDF, convert it to text (OCR) and try again.'
      });
    }

    const result = await chain.invoke({
      document: combinedDocument,
      question
    });

    const finalOutput =
      typeof result === 'string' &&
      result.trim() === 'I don\'t have enough information in the provided document to answer this question.'
        ? 'I could not find a clear answer in the document. Try asking a more specific question or make sure the document contains the relevant information.'
        : result;

    const { model: modelName, provider } = getModelInfo();
    const response: QAChainResponse = {
      output: finalOutput,
      model: modelName,
      provider,
      promptType
    };

    res.json(response);
  } catch (error) {
    console.error('Error in /search/documents:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    // Cleanup uploaded files
    if (files) {
      for (const file of files) {
        try {
          await fs.unlink(file.path);
        } catch (err) {
          console.error(`Error deleting ${file.path}:`, err);
        }
      }
    }
  }
});

// Global error handler for multer + other errors
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);

  if (err instanceof multer.MulterError) {
    // Multer-specific errors are usually client issues (file too large, too many files, etc.)
    return res.status(400).json({ error: err.message });
  }

  if (err && err.message) {
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`QA Bot server running at http://${HOST}:${PORT}`);
});