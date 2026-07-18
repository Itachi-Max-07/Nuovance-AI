import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "outline";

type CommonProps = {
  variant?: Variant;
  children: ReactNode;
  className?: string;
};

type LinkProps = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type NativeButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonProps = LinkProps | NativeButtonProps;

// Chunky soft-brutal button: thick ink border, hard offset shadow, spring
// lift on hover, physical compress on click. All styling lives in the shared
// .btn-brutal classes (globals.css) so every CTA on the site presses alike.
const variantStyles: Record<Variant, string> = {
  primary: "btn-brutal btn-brutal-primary",
  outline: "btn-brutal btn-brutal-outline",
};

export default function Button({
  variant = "primary",
  className = "",
  children,
  href,
  ...props
}: ButtonProps) {
  const classes = `${variantStyles[variant]} ${className}`;

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
