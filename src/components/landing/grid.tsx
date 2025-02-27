'use client';

export function SvgGrid() {
  return (
    <svg
      className="pointer-events-none absolute inset-[unset] left-1/2 -z-40 top-0 w-[1200px] -translate-x-1/2 text-neutral-500 [mask-image:linear-gradient(transparent,black_70%)]"
      width="100%"
      height="100%"
    >
      <defs>
        <pattern
          id="grid-:Rh7mqnb:"
          x="0"
          y="-53.5"
          width="80"
          height="80"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 80 0 L 0 0 0 80"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="1"
          ></path>
        </pattern>
      </defs>
      <rect fill="url(#grid-:Rh7mqnb:)" width="100%" height="100%"></rect>
    </svg>
  );
}
