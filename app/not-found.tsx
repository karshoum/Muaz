import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="text-6xl font-extrabold text-gold">٤٠٤</span>
      <h1 className="text-xl font-bold text-navy">الصفحة غير موجودة</h1>
      <p className="max-w-sm text-sm leading-relaxed text-navy-300">
        ربما حُذفت الصفحة أو تغيّر رابطها. يمكنك العودة إلى الرئيسية أو تصفح المعرض.
      </p>
      <div className="mt-2 flex gap-3">
        <Link
          href="/"
          className="rounded-lg bg-gold px-5 py-2.5 text-sm font-bold text-navy transition-colors hover:bg-gold-400"
        >
          الصفحة الرئيسية
        </Link>
        <Link
          href="/products"
          className="rounded-lg border-2 border-gold px-5 py-2.5 text-sm font-bold text-navy transition-colors hover:bg-gold"
        >
          تصفح المعرض
        </Link>
      </div>
    </main>
  );
}
