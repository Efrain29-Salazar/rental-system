// El logo del sistema: una casa con una llave en forma de ojo de cerradura, sobre un degradado turquesa-violeta.
interface LogoProps {
  size?: number;
}

export const Logo = ({ size = 44 }: LogoProps) => {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-label="Logo de Sistema de Arriendos">
      <defs>
        <linearGradient id="logo-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#19c3b1" />
          <stop offset="0.55" stopColor="#4f7cf0" />
          <stop offset="1" stopColor="#8b4dff" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="14" fill="url(#logo-bg)" />
      <path d="M9 24.5 24 11l15 13.5" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.5 22.5V36a1.5 1.5 0 0 0 1.5 1.5h18A1.5 1.5 0 0 0 34.5 36V22.5L24 13z" fill="#fff" fillOpacity="0.94" />
      <circle cx="24" cy="25.5" r="3.4" fill="#5b52e8" />
      <path d="M22.4 27.2h3.2l.9 6h-5z" fill="#5b52e8" />
      <circle cx="37" cy="12" r="3" fill="#ffd166" />
    </svg>
  );
};
