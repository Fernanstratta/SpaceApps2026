/** Simple decorative mark: Earth and Moon. */
export function BrandMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <circle cx="13" cy="17" r="9" fill="var(--color-earth)" />
      <path d="M7 14c3 1 5-1 8 0s3 4 6 3" stroke="var(--color-earth-land)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="25" cy="8" r="3.5" fill="var(--color-moon)" />
    </svg>
  );
}
