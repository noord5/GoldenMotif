/* ========================================
   API/CONTACT.JS — Golden Motif
   Vercel Serverless Function
   Receives form data and sends email via
   GoDaddy SMTP using Nodemailer
   ======================================== */

const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers (allow your domain)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { name, email, company, interest, message } = req.body;

  // --- Basic validation ---
  if (!name || !email || !message) {
    return res.status(400).json({
      error: 'Missing required fields: name, email, and message are required.'
    });
  }

  // Simple email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  // --- Build email content ---
  const htmlBody = `
    <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: #faf9f6; border: 1px solid #e8e4dd; border-radius: 8px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #1a1a2e 0%, #0d0d1a 100%); padding: 30px; text-align: center;">
        <h1 style="color: #c9a24f; margin: 0; font-size: 24px; letter-spacing: 2px;">GOLDEN MOTIF</h1>
        <p style="color: #a09880; margin: 8px 0 0; font-size: 13px; letter-spacing: 1px;">New Contact Inquiry</p>
      </div>
      <div style="padding: 30px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e8e4dd; color: #8a7d6b; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; width: 140px; vertical-align: top;">Name</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e8e4dd; color: #2c2c2c; font-size: 15px;">${escapeHtml(name)}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e8e4dd; color: #8a7d6b; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; vertical-align: top;">Email</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e8e4dd; color: #2c2c2c; font-size: 15px;"><a href="mailto:${escapeHtml(email)}" style="color: #c9a24f;">${escapeHtml(email)}</a></td>
          </tr>
          ${company ? `
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e8e4dd; color: #8a7d6b; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; vertical-align: top;">Company</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e8e4dd; color: #2c2c2c; font-size: 15px;">${escapeHtml(company)}</td>
          </tr>` : ''}
          ${interest ? `
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e8e4dd; color: #8a7d6b; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; vertical-align: top;">Interest</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e8e4dd; color: #2c2c2c; font-size: 15px;">${escapeHtml(interest)}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 12px 0; color: #8a7d6b; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; vertical-align: top;">Message</td>
            <td style="padding: 12px 0; color: #2c2c2c; font-size: 15px; line-height: 1.6;">${escapeHtml(message).replace(/\n/g, '<br>')}</td>
          </tr>
        </table>
      </div>
      <div style="background: #f0ede6; padding: 16px 30px; text-align: center; font-size: 12px; color: #8a7d6b;">
        This message was sent from the Golden Motif website contact form.
      </div>
    </div>
  `;

  // --- Send via GoDaddy SMTP ---
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtpout.secureserver.net',
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: true, // true for 465 (SSL)
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: `"Golden Motif Website" <${process.env.SMTP_USER}>`,
      to: 'info@GoldenMotif.com',
      replyTo: email,
      subject: `New Inquiry from ${name}${interest ? ` — ${interest}` : ''}`,
      html: htmlBody,
      text: `New Contact Inquiry\n\nName: ${name}\nEmail: ${email}${company ? `\nCompany: ${company}` : ''}${interest ? `\nInterest: ${interest}` : ''}\n\nMessage:\n${message}`
    });

    return res.status(200).json({ success: true, message: 'Email sent successfully.' });
  } catch (error) {
    console.error('Email send error:', error);
    return res.status(500).json({
      error: 'Failed to send email. Please try again later.'
    });
  }
};

/**
 * Escape HTML to prevent XSS in email body
 */
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
