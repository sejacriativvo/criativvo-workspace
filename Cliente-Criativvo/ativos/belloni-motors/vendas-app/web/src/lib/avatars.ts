// Foto de perfil por usuário (id do profile → caminho em /public).
// Quem não tiver foto cai nas iniciais.
export const AVATARS: Record<string, string> = {
  'ddc088a3-918a-4696-8e77-ef7a1c5122b8': '/avatars/italo.jpg', // Italo Pereira (admin)
};

export function avatarFor(id: string | null | undefined): string | null {
  return id ? AVATARS[id] ?? null : null;
}
