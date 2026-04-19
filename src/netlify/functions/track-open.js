// Serves a 1x1 transparent pixel and records the open event in Supabase.
// URL format: /.netlify/functions/track-open?email=foo@bar.com&campaign=CAMPAIGN_ID

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS'
};

// 1x1 transparent GIF in base64
const PIXEL_B64 = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }

  const { email, campaign } = event.queryStringParameters || {};

  // Always return the pixel regardless of errors — never break the email render
  const pixelResponse = {
    statusCode: 200,
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Access-Control-Allow-Origin': '*'
    },
    body: PIXEL_B64,
    isBase64Encoded: true
  };

  if (!email || !campaign) return pixelResponse;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseKey) return pixelResponse;

  try {
    // Check if this email already has an open recorded for this campaign
    // (avoid duplicate entries from email clients that pre-fetch images multiple times)
    const checkRes = await fetch(
      `${supabaseUrl}/rest/v1/email_events?email=eq.${encodeURIComponent(email)}&campaign_id=eq.${encodeURIComponent(campaign)}&select=id&limit=1`,
      { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } }
    );
    const existing = await checkRes.json();

    if (!existing || existing.length === 0) {
      await fetch(`${supabaseUrl}/rest/v1/email_events`, {
        method: 'POST',
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal'
        },
        body: JSON.stringify({
          email,
          campaign_id: campaign,
          opened_at: new Date().toISOString(),
          user_agent: event.headers['user-agent'] || null
        })
      });
    }
  } catch (_err) {
    // Silently ignore — never fail the pixel response
  }

  return pixelResponse;
};
