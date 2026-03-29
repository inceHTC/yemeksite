"use client";

import { useActionState } from "react";
import { adminSignIn } from "./admin-actions";

export function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(adminSignIn, null);

  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-heading text-2xl font-bold">
            <span className="text-primary">Tok</span>Bebek
          </p>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Admin Paneli</p>
        </div>

        <div className="bg-background rounded-2xl border border-border shadow-sm p-6 space-y-5">
          <div>
            <h1 className="font-heading text-lg font-bold">Yönetici Girişi</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Sadece yetkili hesaplar erişebilir.</p>
          </div>

          {state?.error && (
            <div className="rounded-xl bg-destructive/10 text-destructive text-sm px-4 py-3">
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium">E-posta</label>
              <input
                id="email" name="email" type="email" required
                placeholder="admin@example.com"
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium">Şifre</label>
              <input
                id="password" name="password" type="password" required
                placeholder="••••••••"
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-xl bg-primary text-white py-2.5 text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors"
            >
              {isPending ? "Giriş yapılıyor…" : "Giriş Yap"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
