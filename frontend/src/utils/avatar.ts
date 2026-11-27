// Las iniciales de un nombre: "María José Pérez" -> "MP". Con una sola palabra, usa sus dos primeras letras.
export const getInitials = (name: string): string => {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return '?';
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

// Degradados para los avatares. Cada nombre siempre cae en el mismo color.
const AVATAR_GRADIENTS: string[] = [
  'linear-gradient(135deg, #8b5cf6, #5b21b6)',
  'linear-gradient(135deg, #14b8a6, #0e7490)',
  'linear-gradient(135deg, #f97316, #c2410c)',
  'linear-gradient(135deg, #ec4899, #be185d)',
  'linear-gradient(135deg, #3b82f6, #1d4ed8)',
  'linear-gradient(135deg, #22c55e, #15803d)',
];

export const getAvatarGradient = (name: string): string => {
  let hash = 0;

  for (const char of name) {
    hash = (hash * 31 + char.charCodeAt(0)) % 997;
  }

  return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length];
};
