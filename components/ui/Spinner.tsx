import { cn } from '@/lib/utils';

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="جاري التحميل"
      className={cn(
        'inline-block h-6 w-6 animate-spin rounded-full border-[3px] border-gold border-t-transparent',
        className,
      )}
    />
  );
}

export function PageLoader({ label = 'جاري التحميل...' }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
      <Spinner className="h-9 w-9" />
      <p className="text-sm text-navy-300">{label}</p>
    </div>
  );
}

export function EmptyState({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-softgray bg-white/60 px-6 py-14 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-2xl">
        🛋️
      </div>
      <h3 className="mb-1.5 text-lg font-bold text-navy">{title}</h3>
      <p className="mb-5 max-w-sm text-sm leading-relaxed text-navy-300">{message}</p>
      {action}
    </div>
  );
}
