// Polling endpoint — frontend calls this every 3s to get real progress
import { jobs } from './send-emails-background.js';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS'
};

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }

  const jobId = event.queryStringParameters?.jobId;

  if (!jobId) {
    return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'jobId obrigatório' }) };
  }

  const job = jobs[jobId];

  if (!job) {
    return { statusCode: 404, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Job não encontrado' }) };
  }

  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify(job)
  };
};
