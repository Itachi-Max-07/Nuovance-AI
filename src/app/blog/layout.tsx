import type { ReactNode } from "react";

interface BlogLayoutProps {
  children: ReactNode;
}

/* Both /blog routes render in the light paper scope, matching the Hero — they
   read the untouched `:root` tokens rather than the black system used below
   the Hero on the home page. The wrapper — not the individual pages — owns the
   ground so it stays paper past the end of short articles. */
export default function BlogLayout({ children }: BlogLayoutProps) {
  return <div className="min-h-screen bg-brand-paper">{children}</div>;
}
