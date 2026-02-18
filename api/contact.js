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
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #eee; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
      <div style="background: #0d0d0d; padding: 40px 20px; text-align: center;">
        <img src="https://goldenmotif.vercel.app/ASSESTS/Logo-GoldenMotif.png" alt="Golden Motif" style="width: 80px; height: auto; margin-bottom: 20px;">
        <h1 style="color: #c9a24f; margin: 0; font-size: 26px; font-weight: 300; letter-spacing: 4px; text-transform: uppercase;">GOLDEN MOTIF</h1>
        <div style="width: 40px; height: 1px; background: #c9a24f; margin: 15px auto;"></div>
        <p style="color: #999; margin: 5px 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">Inquiry Received</p>
      </div>
      <div style="padding: 40px 30px;">
        <h2 style="font-size: 18px; color: #1a1a1a; margin-top: 0; margin-bottom: 25px; font-weight: 400; border-bottom: 1px solid #f0f0f0; padding-bottom: 10px;">Contact Information</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 15px 0; border-bottom: 1px solid #f9f9f9; color: #999; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; width: 120px; vertical-align: top;">Name</td>
            <td style="padding: 15px 0; border-bottom: 1px solid #f9f9f9; color: #333; font-size: 14px; font-weight: 500;">${escapeHtml(name)}</td>
          </tr>
          <tr>
            <td style="padding: 15px 0; border-bottom: 1px solid #f9f9f9; color: #999; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; vertical-align: top;">Email</td>
            <td style="padding: 15px 0; border-bottom: 1px solid #f9f9f9; color: #333; font-size: 14px;"><a href="mailto:${escapeHtml(email)}" style="color: #c9a24f; text-decoration: none; border-bottom: 1px solid rgba(201, 162, 79, 0.2);">${escapeHtml(email)}</a></td>
          </tr>
          ${company ? `
          <tr>
            <td style="padding: 15px 0; border-bottom: 1px solid #f9f9f9; color: #999; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; vertical-align: top;">Company</td>
            <td style="padding: 15px 0; border-bottom: 1px solid #f9f9f9; color: #333; font-size: 14px;">${escapeHtml(company)}</td>
          </tr>` : ''}
          ${interest ? `
          <tr>
            <td style="padding: 15px 0; border-bottom: 1px solid #f9f9f9; color: #999; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; vertical-align: top;">Interest</td>
            <td style="padding: 15px 0; border-bottom: 1px solid #f9f9f9; color: #333; font-size: 14px;">${escapeHtml(interest)}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 20px 0; color: #999; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; vertical-align: top;">Message</td>
            <td style="padding: 20px 0; color: #444; font-size: 14px; line-height: 1.7; font-style: italic;">"${escapeHtml(message).replace(/\n/g, '<br>')}"</td>
          </tr>
        </table>
      </div>
      <div style="background: #fafafa; padding: 25px 30px; text-align: center; border-top: 1px solid #f0f0f0;">
        <p style="margin: 0; font-size: 11px; color: #aaa; letter-spacing: 1px;">&copy; ${new Date().getFullYear()} GOLDEN MOTIF &bull; MILAN, ITALY</p>
        <p style="margin: 8px 0 0; font-size: 10px; color: #bbb;">This is an automated notification from your website contact form.</p>
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
