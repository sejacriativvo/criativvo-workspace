// Avatar do usuário: mostra a foto (se houver) ou as iniciais.
export function Avatar({
  src,
  initials,
  name,
  roleLabel,
  className = 'h-9 w-9',
}: {
  src?: string | null;
  initials: string;
  name: string;
  roleLabel: string;
  className?: string;
}) {
  const title = `${name}${roleLabel ? ` · ${roleLabel}` : ''}`;
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        title={title}
        className={`${className} shrink-0 rounded-full border border-neutral-200 object-cover`}
      />
    );
  }
  return (
    <span
      title={title}
      className={`${className} grid shrink-0 place-items-center rounded-full bg-neutral-900 text-sm font-bold text-white`}
    >
      {initials || '?'}
    </span>
  );
}
