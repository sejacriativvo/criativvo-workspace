// Logotipo "criativvo" — SEMPRE minúsculo, fonte AVEstiana Black, tracking
// levemente reduzido (regra de marca). Cor herda do `className` (currentColor).
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span
      style={{ fontFamily: 'var(--font-avestiana)', letterSpacing: '-0.03em' }}
      className={`inline-block select-none lowercase leading-none ${className}`}
    >
      criativvo
    </span>
  );
}
