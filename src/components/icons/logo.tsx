import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
        <circle cx="50" cy="50" r="50" className="fill-primary" />
        <text
            x="50"
            y="50"
            fontFamily="Space Grotesk, sans-serif"
            fontSize="60"
            fontWeight="bold"
            textAnchor="middle"
            alignmentBaseline="central"
            className="fill-primary-foreground"
        >
            T
        </text>
    </svg>
  );
}
