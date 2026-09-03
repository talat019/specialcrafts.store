"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/admin-actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, null as { error?: string } | null);
  const field = "w-full rounded-xl border border-line-strong bg-ground px-4 py-3 text-[15px] outline-none focus:border-emerald";

  return (
    <form action={action} className="mt-6 flex flex-col gap-3">
      <input name="email" type="email" required placeholder="E-poçt" className={field} autoComplete="username" />
      <input name="sifre" type="password" required placeholder="Şifrə" className={field} autoComplete="current-password" />
      {state?.error && (
        <p className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-[13.5px] text-red-800">{state.error}</p>
      )}
      <button type="submit" disabled={pending} className="mt-1 rounded-xl bg-emerald px-6 py-3.5 font-bold text-surface disabled:opacity-60">
        {pending ? "Yoxlanılır…" : "Daxil ol"}
      </button>
    </form>
  );
}
