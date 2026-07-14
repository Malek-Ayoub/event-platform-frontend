/** Tailwind default `md` breakpoint — keep media queries aligned with the shared preset. */
export const SCREEN_BREAKPOINTS = {
  md: '768px',
} as const;

export const MEDIA_QUERIES = {
  mdUp: `(min-width: ${SCREEN_BREAKPOINTS.md})`,
  belowMd: `(max-width: 767px)`,
} as const;
