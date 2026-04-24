// Checks which emails in the batch were already sent to in the last 30 days.
// Returns: { duplicates: ['email1@...', 'email2@...'] }

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Método não permitido' }) };
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  // If Supabase isn't configured, skip duplicate check — don't block sending
  if (!supabaseUrl || !supabaseKey) {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ duplicates: [] })
    };
  }

  let parsed;
  try {
    parsed = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Body inválido' }) };
  }

  const { emails } = parsed;

  if (!emails || !Array.isArray(emails) || emails.length === 0) {
    return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Campo emails obrigatório' }) };
  }

  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    // Query email_sends table for emails sent in the last 30 days
    const emailFilter = emails.map(e => `"${e}"`).join(',');
    const res = await fetch(
      `${supabaseUrl}/rest/v1/email_sends?select=email&email=in.(${emailFilter})&sent_at=gte.${thirtyDaysAgo}`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`
        }
      }
    );

    const data = await res.json();
    const duplicates = Array.isArray(data) ? [...new Set(data.map(r => r.email))] : [];

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ duplicates })
    };
  } catch (err) {
    // On error, allow sending — don't block the user
    console.error('Duplicate check error:', err);
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ duplicates: [] })
    };
  }
};
