import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/session";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = { title: "Admin girişi", robots: { index: false } };

export default async function GirisPage() {
  if (await getAdmin()) redirect("/admin");
  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-[380px] rounded-2xl border border-line bg-surface p-8">
        <h1 className="font-display text-[26px]">Admin girişi</h1>
        <p className="mt-2 text-[14px] text-ink-muted">special crafts idarəetmə paneli</p>
        <LoginForm />
      </div>
    </div>
  );
}
