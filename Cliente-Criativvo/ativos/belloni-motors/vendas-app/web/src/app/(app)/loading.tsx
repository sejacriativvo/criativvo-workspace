// Skeleton mostrado na hora ao trocar de aba (dá sensação de instantâneo
// enquanto o servidor busca os dados).
export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-7 w-40 bg-neutral-200 rounded mb-4" />
      <div className="h-10 w-full bg-neutral-200 rounded-xl mb-3" />
      <div className="flex gap-2 mb-4">
        <div className="h-7 w-20 bg-neutral-200 rounded-full" />
        <div className="h-7 w-24 bg-neutral-200 rounded-full" />
        <div className="h-7 w-20 bg-neutral-200 rounded-full" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
            <div className="aspect-[4/3] bg-neutral-200" />
            <div className="p-3 space-y-2">
              <div className="h-4 w-3/4 bg-neutral-200 rounded" />
              <div className="h-3 w-1/2 bg-neutral-200 rounded" />
              <div className="h-4 w-1/3 bg-neutral-200 rounded mt-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
