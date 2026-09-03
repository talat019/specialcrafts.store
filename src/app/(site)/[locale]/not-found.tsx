import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-[1440px] flex-col items-start px-5 py-24 lg:px-14 lg:py-32">
      <span className="eyebrow text-gold">404</span>
      <h1 className="mt-4 text-[38px] leading-tight lg:text-[52px]">Page not found</h1>
      <p className="mt-4 max-w-[48ch] leading-relaxed text-ink-muted">
        The piece you were looking for may have sold, or the link is out of date.
      </p>
      <Link href="/en/kataloq" className="mt-8 rounded-full bg-emerald px-7 py-3.5 font-semibold text-surface transition-colors hover:bg-emerald-dark">
        Browse the catalog
      </Link>
    </div>
  );
}
