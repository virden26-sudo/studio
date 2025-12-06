import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <defs>
        <linearGradient id="tie-dye-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <text
        x="12"
        y="18"
        fontFamily="cursive"
        fontSize="24"
        fontWeight="bold"
        fontStyle="italic"
        textAnchor="middle"
        fill="url(#tie-dye-gradient)"
      >
        A+
      </text>
    </svg>
  );
}
