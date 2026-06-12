'use client';

import { useRef, useState, useCallback } from 'react';

/* ------------------------------------------------------------------ */
/* Input de moeda — formata R$ 85.000 em tempo real                   */
/* ------------------------------------------------------------------ */
export function MoneyInput({
  name,
  defaultValue,
  placeholder = '0',
  required,
}: {
  name: string;
  defaultValue?: number | null;
  placeholder?: string;
  required?: boolean;
}) {
  function fmt(n: number) { return n > 0 ? n.toLocaleString('pt-BR') : ''; }

  const [raw, setRaw]         = useState<number>(defaultValue ?? 0);
  const [display, setDisplay] = useState(fmt(defaultValue ?? 0));

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, '');
    const n = parseInt(digits || '0', 10);
    setRaw(n);
    setDisplay(n > 0 ? n.toLocaleString('pt-BR') : '');
  }

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400 pointer-events-none select-none">R$</span>
      <input type="text" inputMode="numeric" value={display} onChange={onChange}
        placeholder={placeholder} required={required}
        className="w-full rounded-lg border border-neutral-300 pl-9 pr-3 py-2 outline-none focus:border-neutral-900 text-sm bg-white" />
      <input type="hidden" name={name} value={raw || ''} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Input de quilometragem — formata 45.000 km em tempo real           */
/* ------------------------------------------------------------------ */
export function KmInput({ name, defaultValue }: { name: string; defaultValue?: string | null }) {
  function parseKm(raw: string | null | undefined) {
    if (!raw) return 0;
    return parseInt(raw.replace(/\D/g, '') || '0', 10);
  }

  const init = parseKm(defaultValue);
  const [raw, setRaw]         = useState<number>(init);
  const [display, setDisplay] = useState(init > 0 ? init.toLocaleString('pt-BR') : '');

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, '');
    const n = parseInt(digits || '0', 10);
    setRaw(n);
    setDisplay(n > 0 ? n.toLocaleString('pt-BR') : '');
  }

  return (
    <div>
      <input type="text" inputMode="numeric" value={display} onChange={onChange}
        placeholder="45.000"
        className="w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none focus:border-neutral-900 text-sm bg-white" />
      <input type="hidden" name={name} value={raw > 0 ? `${raw.toLocaleString('pt-BR')} km` : ''} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Upload de múltiplas fotos com drag & drop                          */
/* Primeira foto = capa. Pode arrastar mais a qualquer momento.       */
/* ------------------------------------------------------------------ */
export function MultiPhotoUpload({
  photos,
  onChange,
}: {
  photos: string[];
  onChange: (photos: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState('');
  const [dragging, setDragging]   = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File): Promise<string | null> {
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res  = await fetch('/api/upload-car-image', { method: 'POST', body: fd });
      const data = await res.json();
      return data.url ?? null;
    } catch { return null; }
  }

  async function handleFiles(files: FileList | File[]) {
    const arr = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (!arr.length) return;
    setUploading(true); setError('');
    const results = await Promise.all(arr.map(uploadFile));
    const urls    = results.filter(Boolean) as string[];
    if (urls.length < arr.length) setError('Algumas fotos falharam. Tente novamente.');
    onChange([...photos, ...urls]);
    setUploading(false);
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    handleFiles(e.dataTransfer.files);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photos]);

  function remove(idx: number) {
    onChange(photos.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-3">
      {/* Grid de fotos já enviadas */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {photos.map((url, idx) => (
            <div key={url} className="relative group aspect-square rounded-xl overflow-hidden border border-neutral-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Foto ${idx + 1}`} className="h-full w-full object-cover" />
              {idx === 0 && (
                <span className="absolute top-1 left-1 rounded-full bg-neutral-900/80 text-white text-[10px] font-semibold px-1.5 py-0.5">
                  Capa
                </span>
              )}
              <button
                type="button"
                onClick={() => remove(idx)}
                className="absolute top-1 right-1 h-5 w-5 rounded-full bg-rose-600 text-white text-xs hidden group-hover:flex items-center justify-center leading-none"
              >
                ×
              </button>
            </div>
          ))}

          {/* Botão de adicionar mais fotos no final do grid */}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="aspect-square rounded-xl border-2 border-dashed border-neutral-300 hover:border-neutral-500 flex flex-col items-center justify-center text-neutral-400 hover:text-neutral-600 transition disabled:opacity-50"
          >
            {uploading ? (
              <span className="text-xs">Enviando…</span>
            ) : (
              <>
                <span className="text-2xl leading-none">+</span>
                <span className="text-[11px] mt-1">Adicionar</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Zona de drop — aparece quando não tem foto ainda */}
      {photos.length === 0 && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`cursor-pointer rounded-xl border-2 border-dashed transition h-40 flex flex-col items-center justify-center gap-2 text-neutral-400 select-none
            ${dragging ? 'border-neutral-900 bg-neutral-100' : 'border-neutral-300 bg-neutral-50 hover:bg-neutral-100'}`}
        >
          {uploading ? (
            <span className="text-sm font-medium text-neutral-600">Enviando…</span>
          ) : (
            <>
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
              </svg>
              <span className="text-sm font-medium">Arrastar fotos ou clicar para selecionar</span>
              <span className="text-xs">JPG, PNG ou WEBP · várias de uma vez · máx. 10MB cada</span>
            </>
          )}
        </div>
      )}

      {error && <p className="text-xs text-rose-600">{error}</p>}

      {/* Inputs ocultos: um por foto */}
      {photos.map((url, idx) => (
        <input key={idx} type="hidden" name="photos[]" value={url} />
      ))}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => { if (e.target.files) handleFiles(e.target.files); e.target.value = ''; }}
      />
    </div>
  );
}
