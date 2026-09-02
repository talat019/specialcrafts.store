import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-[1440px] flex-col items-start px-5 py-24 lg:px-14 lg:py-32">
      <span className="eyebrow text-gold">404</span>
      <h1 className="mt-4 text-[38px] leading-tight lg:text-[52px]">Belə səhifə yoxdur</h1>
      <p className="mt-4 max-w-[46ch] leading-relaxed text-ink-muted">
        Ola bilsin ki, axtardığınız iş satılıb və ya link köhnəlib. Kataloqa baxın — bənzərini
        tapa bilərik.
      </p>
      <Link
        href="/kataloq"
        className="mt-8 rounded-full bg-emerald px-7 py-3.5 font-semibold text-surface transition-colors hover:bg-emerald-dark"
      >
        Kataloqa bax
      </Link>
    </div>
  );
}
