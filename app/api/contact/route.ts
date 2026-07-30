import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  message?: unknown;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * مسار اختياري لاستقبال نموذج التواصل.
 *
 * بلا إعداد: يردّ 501 صراحةً، والواجهة تتراجع تلقائيًا إلى فتح تطبيق البريد.
 * لا نُظهر نجاحًا كاذبًا أبدًا.
 *
 * لتفعيله: اضبط CONTACT_WEBHOOK_URL في متغيّرات البيئة
 * (Formspree أو Zapier أو أي نقطة نهاية تقبل JSON).
 */
export async function POST(request: Request) {
  let body: ContactPayload;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'صيغة الطلب غير صالحة.' },
      { status: 400 },
    );
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';

  if (name.length < 2 || !EMAIL_RE.test(email) || message.length < 10) {
    return NextResponse.json(
      { ok: false, error: 'البيانات المُرسَلة غير مكتملة أو غير صالحة.' },
      { status: 422 },
    );
  }

  const webhook = process.env.CONTACT_WEBHOOK_URL;

  if (!webhook) {
    return NextResponse.json(
      {
        ok: false,
        configured: false,
        error: 'خدمة الإرسال غير مُفعَّلة على الخادم.',
      },
      { status: 501 },
    );
  }

  try {
    const response = await fetch(webhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ name, email, message, source: 'portfolio' }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { ok: false, error: 'تعذّر إرسال الرسالة. حاول لاحقًا.' },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: 'تعذّر الاتصال بخدمة الإرسال.' },
      { status: 502 },
    );
  }
}
