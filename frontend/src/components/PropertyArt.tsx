import type { PropertyType } from '../types/property';

// Una ilustración dibujada a mano para cada tipo de propiedad. Se muestra arriba de la tarjeta.
interface PropertyArtProps {
  type: PropertyType;
}

const Clouds = () => (
  <g fill="#fff" opacity="0.75">
    <ellipse cx="52" cy="26" rx="22" ry="7" />
    <ellipse cx="68" cy="21" rx="14" ry="7" />
    <ellipse cx="262" cy="36" rx="20" ry="6" />
    <ellipse cx="276" cy="31" rx="12" ry="6" />
  </g>
);

const Tree = ({ x, scale = 1 }: { x: number; scale?: number }) => (
  <g transform={`translate(${x} 0) scale(${scale})`} style={{ transformOrigin: `${x}px 108px` }}>
    <rect x="-2.5" y="88" width="5" height="22" rx="2" fill="#7a5230" />
    <circle cx="0" cy="80" r="14" fill="#2f9e6b" />
    <circle cx="-8" cy="88" r="9" fill="#3fb67f" />
    <circle cx="8" cy="87" r="9" fill="#38ab76" />
  </g>
);

const House = () => (
  <>
    <rect width="320" height="130" fill="url(#art-casa)" />
    <circle cx="268" cy="30" r="15" fill="#ffe28a" />
    <Clouds />
    <rect y="106" width="320" height="24" fill="#5fbf9a" />
    <Tree x={62} />
    <Tree x={258} scale={0.85} />
    <rect x="186" y="30" width="11" height="22" fill="#b4552d" />
    <rect x="114" y="62" width="92" height="46" fill="#fff7e6" />
    <polygon points="102,65 160,24 218,65" fill="#0f766e" />
    <polygon points="116,65 160,34 204,65" fill="#14998d" />
    <rect x="150" y="78" width="21" height="30" rx="3" fill="#f59e0b" />
    <circle cx="166" cy="94" r="1.6" fill="#fff7e6" />
    <rect x="123" y="73" width="19" height="17" rx="2" fill="#a5e3f7" />
    <rect x="179" y="73" width="19" height="17" rx="2" fill="#a5e3f7" />
    <path d="M132.500 73v17M123 81.500h19M188.500 73v17M179 81.500h19" stroke="#fff7e6" strokeWidth="1.600" />
  </>
);

const Apartments = () => {
  const lit = (col: number, row: number) => (col + row * 2) % 3 === 0;
  return (
    <>
      <rect width="320" height="130" fill="url(#art-departamento)" />
      <circle cx="46" cy="32" r="14" fill="#fff" opacity="0.8" />
      <Clouds />
      <rect y="108" width="320" height="22" fill="#8b8fe8" />
      <rect x="76" y="48" width="40" height="60" fill="#8b7ff0" />
      {[0, 1].flatMap((c) =>
        [0, 1, 2].map((r) => (
          <rect key={`l${c}${r}`} x={83 + c * 16} y={56 + r * 15} width="9" height="9" rx="1.500" fill={lit(c, r) ? '#fde68a' : '#e0e7ff'} />
        )),
      )}
      <rect x="204" y="38" width="46" height="70" fill="#7c83f4" />
      {[0, 1].flatMap((c) =>
        [0, 1, 2, 3].map((r) => (
          <rect key={`r${c}${r}`} x={212 + c * 18} y={46 + r * 15} width="10" height="9" rx="1.500" fill={lit(c + 1, r) ? '#fde68a' : '#e0e7ff'} />
        )),
      )}
      <rect x="120" y="14" width="80" height="94" fill="#5457e6" />
      <rect x="120" y="14" width="80" height="6" fill="#4338ca" />
      {[0, 1, 2, 3].flatMap((c) =>
        [0, 1, 2, 3, 4].map((r) => (
          <rect key={`m${c}${r}`} x={130 + c * 18} y={26 + r * 15} width="10" height="9" rx="1.500" fill={lit(c, r) ? '#fde68a' : '#dfe4ff'} />
        )),
      )}
      <rect x="150" y="94" width="20" height="14" rx="2" fill="#312e81" />
    </>
  );
};

const Shop = () => (
  <>
    <rect width="320" height="130" fill="url(#art-local)" />
    <circle cx="48" cy="30" r="14" fill="#ffd9a0" />
    <Clouds />
    <rect y="108" width="320" height="22" fill="#f4a261" />
    <rect x="96" y="54" width="128" height="54" fill="#fffaf2" />
    {Array.from({ length: 8 }, (_, i) => (
      <rect key={i} x={90 + i * 17.500} y="36" width="17.500" height="20" fill={i % 2 === 0 ? '#f97316' : '#fff'} />
    ))}
    {Array.from({ length: 8 }, (_, i) => (
      <circle key={i} cx={98.750 + i * 17.500} cy="56" r="8.750" fill={i % 2 === 0 ? '#f97316' : '#fff'} />
    ))}
    <rect x="106" y="68" width="64" height="40" rx="3" fill="#bfe9fb" />
    <path d="M106 96 138 68h14l-34 40z" fill="#fff" opacity="0.35" />
    <rect x="184" y="68" width="28" height="40" rx="3" fill="#ea580c" />
    <circle cx="206" cy="90" r="1.800" fill="#fff" />
    <rect x="124" y="26" width="72" height="12" rx="6" fill="#7c2d12" />
    <rect x="132" y="30" width="56" height="4" rx="2" fill="#fed7aa" />
    <rect x="62" y="92" width="18" height="16" rx="3" fill="#c2410c" />
    <circle cx="71" cy="86" r="10" fill="#34a56f" />
    <rect x="240" y="92" width="18" height="16" rx="3" fill="#c2410c" />
    <circle cx="249" cy="86" r="10" fill="#2f9e6b" />
  </>
);

const Office = () => (
  <>
    <rect width="320" height="130" fill="url(#art-oficina)" />
    <circle cx="274" cy="28" r="14" fill="#fff" opacity="0.85" />
    <Clouds />
    <rect y="108" width="320" height="22" fill="#7cc8e8" />
    <rect x="60" y="56" width="44" height="52" fill="#0284c7" />
    {[0, 1].flatMap((c) =>
      [0, 1, 2].map((r) => <rect key={`a${c}${r}`} x={68 + c * 18} y={63 + r * 14} width="12" height="8" rx="1.500" fill="#e0f7ff" opacity="0.9" />),
    )}
    <rect x="216" y="40" width="50" height="68" fill="#38bdf8" />
    {[0, 1].flatMap((c) =>
      [0, 1, 2, 3].map((r) => <rect key={`b${c}${r}`} x={224 + c * 20} y={48 + r * 14} width="12" height="8" rx="1.500" fill="#f0fbff" opacity="0.9" />),
    )}
    <rect x="110" y="10" width="100" height="98" fill="#0ea5e9" />
    <rect x="110" y="10" width="100" height="6" fill="#0369a1" />
    {Array.from({ length: 6 }, (_, r) =>
      Array.from({ length: 5 }, (_, c) => (
        <rect key={`t${c}${r}`} x={118 + c * 19} y={21 + r * 13} width="14" height="8" rx="1.500" fill="#e0f7ff" opacity={(c + r) % 2 === 0 ? 0.95 : 0.6} />
      )),
    )}
    <rect x="148" y="92" width="24" height="16" rx="2" fill="#075985" />
    <line x1="160" y1="92" x2="160" y2="108" stroke="#7dd3fc" strokeWidth="1.500" />
  </>
);

export const PropertyArt = ({ type }: PropertyArtProps) => {
  return (
    <svg
      className="property-art"
      viewBox="0 0 320 130"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`Ilustración de ${type}`}
    >
      <defs>
        <linearGradient id="art-casa" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a8ece0" />
          <stop offset="1" stopColor="#e9fbf6" />
        </linearGradient>
        <linearGradient id="art-departamento" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c9c9ff" />
          <stop offset="1" stopColor="#f1efff" />
        </linearGradient>
        <linearGradient id="art-local" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd0a0" />
          <stop offset="1" stopColor="#fff3e3" />
        </linearGradient>
        <linearGradient id="art-oficina" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a9e0ff" />
          <stop offset="1" stopColor="#eaf8ff" />
        </linearGradient>
      </defs>
      {type === 'casa' && <House />}
      {type === 'departamento' && <Apartments />}
      {type === 'local' && <Shop />}
      {type === 'oficina' && <Office />}
    </svg>
  );
};
