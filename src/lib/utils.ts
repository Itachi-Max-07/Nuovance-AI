type ClassValue = string | number | null | undefined | false;

export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}

// wa.me needs a digits-only number (country code included), so strip every
// non-digit (spaces, "+", dashes) before building the click-to-chat link.
export const whatsappLink = (phone: string, message: string) =>
  `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
