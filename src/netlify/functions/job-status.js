import { getStore } from '@netlify/blobs';

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

  const store = getStore('email-jobs');
  const job = await store.get(jobId, { type: 'json' });

  if (!job) {
    return { statusCode: 404, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Job não encontrado' }) };
  }

  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify(job)
  };
};
