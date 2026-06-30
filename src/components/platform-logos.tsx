// Brand marks for the review platforms. Used in the homepage reviews section.

export function GoogleMark({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-label="Google" role="img">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
  );
}

export function TrustpilotMark({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#00B67A" aria-label="Trustpilot" role="img">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export function TourRadarMark({ className = "h-5 w-5" }: { className?: string }) {
  // TourRadar has no widely-recognised icon mark; use a radar/pin glyph in their teal.
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#0CA4A5" strokeWidth={2} aria-label="TourRadar" role="img">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
      <path strokeLinecap="round" d="M12 12l6-3" />
    </svg>
  );
}

const MARKS: Record<string, (p: { className?: string }) => React.ReactElement> = {
  Google: GoogleMark,
  Trustpilot: TrustpilotMark,
  TourRadar: TourRadarMark,
};

/** Just the brand mark for a platform (e.g. the Google "G"). */
export function PlatformMark({ name, className = "h-5 w-5" }: { name: string; className?: string }) {
  const Mark = MARKS[name];
  return Mark ? <Mark className={className} /> : null;
}

/** Logo lockup: brand mark + platform name. */
export function PlatformLogo({
  name,
  markClassName = "h-4 w-4",
  textClassName = "text-xs font-semibold text-gray-300",
}: {
  name: string;
  markClassName?: string;
  textClassName?: string;
}) {
  const Mark = MARKS[name];
  return (
    <span className="inline-flex items-center gap-1.5">
      {Mark && <Mark className={markClassName} />}
      <span className={textClassName}>{name}</span>
    </span>
  );
}
