// Netlify function to accept contact form POSTs. Mirrors Vercel API handler.
exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ ok: false, message: 'Method not allowed' }) };
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    const { name, email, message } = payload;

    if (!name || !email || !message) {
      return { statusCode: 400, body: JSON.stringify({ ok: false, message: 'Missing required fields' }) };
    }

    console.log('Netlify contact submission:', { name, email, message });

    return { statusCode: 200, body: JSON.stringify({ ok: true, message: 'Thank you — your message was received.' }) };
  } catch (err) {
    console.error('Netlify contact function error:', err);
    return { statusCode: 500, body: JSON.stringify({ ok: false, message: 'Server error' }) };
  }
};
