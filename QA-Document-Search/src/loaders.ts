import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { DocxLoader } from '@langchain/community/document_loaders/fs/docx';
import { CSVLoader } from '@langchain/community/document_loaders/fs/csv';
import { promises as fs } from 'fs';
import path from 'path';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

async function getLoader(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();

  let loader;
  switch (ext) {
    case '.pdf':
      loader = new PDFLoader(filePath);
      break;
    case '.docx':
      loader = new DocxLoader(filePath);
      break;
    case '.csv':
      loader = new CSVLoader(filePath);
      break;
    default:
      return null;
  }

  return loader;
}

export async function loadDocumentToString(filePath: string): Promise<string> {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.txt' || ext === '') {
    // Handle text files directly
    const stats = await fs.stat(filePath);
    if (stats.size > MAX_FILE_SIZE) {
      const content = await fs.readFile(filePath, 'utf-8');
      return content.substring(0, MAX_FILE_SIZE) + '\n\n[Content truncated due to size limit]';
    }
    return await fs.readFile(filePath, 'utf-8');
  }

  const loader = await getLoader(filePath);
  if (!loader) {
    throw new Error(`Unsupported file type: ${ext}`);
  }

  let docs;
  try {
    docs = await loader.load();
    console.log(`Successfully loaded ${docs.length} document chunks from ${filePath}`);
  } catch (error) {
    console.error(`Failed to load document ${filePath}:`, error);
    throw new Error(`Failed to parse ${ext.toUpperCase()} file: ${error.message}`);
  }

  if (ext === '.pdf') {
    // For PDFs, format as [Page N]\ncontent
    const formattedContent = docs.map((doc, index) => `[Page ${index + 1}]\n${doc.pageContent}`).join('\n\n');
    console.log(`PDF loaded ${docs.length} pages, total content length: ${formattedContent.length}`);
    if (formattedContent.trim().length === 0) {
      console.warn(`PDF ${filePath} appears to be empty or contains no extractable text`);
    }
    return formattedContent;
  } else if (ext === '.csv') {
    // For CSVs, format as [Row N]\ncontent
    return docs.map((doc, index) => `[Row ${index + 1}]\n${doc.pageContent}`).join('\n\n');
  } else {
    // For DOCX and others, join paragraphs
    return docs.map(doc => doc.pageContent).join('\n\n');
  }
}