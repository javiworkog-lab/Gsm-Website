import type { APIRoute } from 'astro';

export const prerender = false;

interface ContactPayload {
  topic?: string;
  name?: string;
  email?: string;
  phone?: string;
  org?: string;
  message?: string;
  terms?: string | boolean;
}

const TOPIC_LABELS: Record<string, string> = {
  athlete: 'Representación de atleta',
  institution: 'Sport Performance · Clubes / Federaciones',
  education: 'GSM Educación · Colegios / Universidades',
  funding: 'Funding & Projects',
  press: 'Prensa o medios',
  other: 'Otro',
};

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export const POST: APIRoute = async ({ request }) => {
  let data: ContactPayload;
  try {
    data = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'invalid_json' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { topic, name, email, phone = '', org = '', message, terms } = data;

  if (!topic || !name || !email || !message || !terms) {
    return new Response(JSON.stringify({ ok: false, error: 'missing_fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  if (!isEmail(email)) {
    return new Response(JSON.stringify({ ok: false, error: 'invalid_email' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const topicLabel = TOPIC_LABELS[topic] ?? topic;
  const subject = `[GSM Web] ${topicLabel} — ${name}`;
  const text = [
    `Tipo de consulta: ${topicLabel}`,
    `Nombre: ${name}`,
    `Email: ${email}`,
    `Teléfono: ${phone || '—'}`,
    `Organización: ${org || '—'}`,
    '',
    'Mensaje:',
    message,
  ].join('\n');

  const html = `
    <h2 style="font-family:system-ui,sans-serif">Nuevo contacto desde gsm.cl</h2>
    <p><strong>Tipo:</strong> ${escapeHtml(topicLabel)}</p>
    <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Teléfono:</strong> ${escapeHtml(phone || '—')}</p>
    <p><strong>Organización:</strong> ${escapeHtml(org || '—')}</p>
    <hr />
    <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
  `;

  const apiKey = import.meta.env.RESEND_API_KEY;
  const toEmail = import.meta.env.CONTACT_TO_EMAIL ?? 'contacto@gsm.cl';
  const fromEmail = import.meta.env.CONTACT_FROM_EMAIL ?? 'GSM Web <web@gsm.cl>';

  if (!apiKey) {
    // Sin API key configurada: aceptamos el envío y dejamos rastro en logs del servidor.
    console.log('[contact:fallback]', subject, '\n', text);
    return new Response(JSON.stringify({ ok: true, mode: 'logged' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email,
        subject,
        text,
        html,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error('[contact:resend_error]', res.status, body);
      return new Response(JSON.stringify({ ok: false, error: 'send_failed' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ ok: true, mode: 'sent' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[contact:exception]', err);
    return new Response(JSON.stringify({ ok: false, error: 'exception' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
