import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let body: { name?: string; email?: string; subject?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request body' }, 400);
  }

  const { name, email, subject, message } = body;

  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    return json({ error: 'All fields are required' }, 400);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'Invalid email address' }, 400);
  }

  const port = Number(import.meta.env.SMTP_PORT) || 587;

  const transporter = nodemailer.createTransport({
    host: import.meta.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: import.meta.env.SMTP_USER,
      pass: import.meta.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Cloudzy.AI" <${import.meta.env.SMTP_FROM}>`,
      replyTo: `"${name}" <${email}>`,
      to: import.meta.env.SMTP_REPLY,
      subject: `[Contact] ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#374151">
          <h2 style="color:#6366f1;margin-bottom:16px">New Contact Form Submission</h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
            <tr><td style="padding:6px 12px 6px 0;color:#6b7280;font-weight:600;white-space:nowrap">Name</td><td style="padding:6px 0">${name}</td></tr>
            <tr><td style="padding:6px 12px 6px 0;color:#6b7280;font-weight:600;white-space:nowrap">Email</td><td style="padding:6px 0"><a href="mailto:${email}" style="color:#6366f1">${email}</a></td></tr>
            <tr><td style="padding:6px 12px 6px 0;color:#6b7280;font-weight:600;white-space:nowrap">Subject</td><td style="padding:6px 0">${subject}</td></tr>
          </table>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0"/>
          <p style="white-space:pre-wrap;line-height:1.6">${message}</p>
        </div>
      `,
    });
  } catch (err) {
    console.error('SMTP send failed:', err);
    return json({ error: 'Failed to send email' }, 500);
  }

  return json({ success: true }, 200);
};

function json(data: unknown, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
