import Link from "next/link";
import { getAdmin } from "@/lib/session";
import { logoutAction } from "@/lib/admin-actions";

export const metadata = { title: "Admin", robots: { index: false, follow: false } };
export const revalidate = 0;

const nav = [
  { href: "/admin", label: "İcmal" },
  { href: "/admin/mehsullar", label: "Məhsullar" },
  { href: "/admin/sifarisler", label: "Sifarişlər" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdmin();

  // giriş səhifəsinin öz çərçivəsi var
  if (!admin) return <div className="min-h-screen bg-band">{children}</div>;

  return (
    <div className="min-h-screen bg-band">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-4 px-5 py-3.5 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-display text-[18px]">special crafts <span className="text-ink-faint">admin</span></Link>
            <nav className="flex gap-5 text-[14.5px]">
              {nav.map((n) => (
                <Link key={n.href} href={n.href} className="hover:text-emerald">{n.label}</Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4 text-[13.5px]">
            <Link href="/" className="text-ink-muted hover:text-ink">Sayta bax →</Link>
            <span className="text-ink-faint">{admin.email}</span>
            <form action={logoutAction}>
              <button type="submit" className="rounded-lg border border-line-strong px-3 py-1.5 hover:border-ink">Çıxış</button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1240px] px-5 py-8 lg:px-8">{children}</main>
    </div>
  );
}
