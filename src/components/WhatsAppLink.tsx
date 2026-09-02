import { WhatsAppIcon } from "./Icons";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "outline" | "dark";
  className?: string;
  icon?: boolean;
};

const styles = {
  solid: "bg-emerald text-surface hover:bg-emerald-dark",
  outline: "border border-ink text-ink hover:bg-ink hover:text-surface",
  dark: "border border-dark-line text-dark-ink hover:bg-dark-line",
};

export function WhatsAppLink({ href, children, variant = "solid", className = "", icon = true }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2.5 rounded-xl px-7 py-4 text-base font-bold transition-colors ${styles[variant]} ${className}`}
    >
      {icon && <WhatsAppIcon />}
      {children}
    </a>
  );
}
