import { z } from 'zod';

export const InvokeSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  documentPath: z.string().optional(),
  documentText: z.string().optional(),
  promptType: z.enum(['default', 'detailed', 'concise', 'technical']).optional().default('default'),
}).refine(
  (data) => data.documentPath || data.documentText,
  {
    message: 'Either documentPath or documentText must be provided',
    path: ['documentPath'],
  }
);

export const FileUploadSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  promptType: z.enum(['default', 'detailed', 'concise', 'technical']).optional().default('default'),
});

export type InvokeRequest = z.infer<typeof InvokeSchema>;
export type FileUploadRequest = z.infer<typeof FileUploadSchema>;

export interface QAChainResponse {
  output: string;
  model: string;
  provider: string;
  promptType: string;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  model: string;
}