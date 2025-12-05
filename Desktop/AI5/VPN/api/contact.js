/**
 * Simple Vercel serverless function for contact form submissions.
 * - Accepts POST application/json with {name,email,message}
 * - Responds with JSON { ok: true, message }
 * Note: This is a scaffold for demo purposes and does not persist data.
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }

  try {
    const { name, email, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ ok: false, message: 'Missing required fields' });
    }

    // Simple server-side acknowledgement. Replace with integration (email, DB)
    console.log('Contact submission:', { name, email, message });

    return res.status(200).json({ ok: true, message: 'Thank you — your message was received.' });
  } catch (err) {
    console.error('Contact function error', err);
    return res.status(500).json({ ok: false, message: 'Server error' });
  }
}
