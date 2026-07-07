type OrbitMotifProps = {
  className?: string;
};

export default function OrbitMotif({ className = "h-7 w-7" }: OrbitMotifProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <circle
        cx="16"
        cy="16"
        r="12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeOpacity="0.45"
      />
      <circle cx="16" cy="4" r="2.5" fill="currentColor" />
    </svg>
  );
}
