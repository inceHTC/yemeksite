"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AuthFormProps {
  mode: "signin" | "signup" | "reset";
  action: (formData: FormData) => Promise<{ error?: string; success?: string } | void>;
}

const CONFIG = {
  signin: {
    title: "Tekrar hoş geldiniz",
    subtitle: "Hesabınıza giriş yapın",
    submit: "Giriş Yap",
    footer: (
      <p className="text-sm text-muted-foreground">
        Hesabınız yok mu?{" "}
        <Link href="/kayit" className="text-primary hover:underline font-medium">
          Ücretsiz kayıt olun
        </Link>
      </p>
    ),
  },
  signup: {
    title: "Tok Bebek'e katılın",
    subtitle: "Bebeğiniz için kişisel hesap oluşturun",
    submit: "Hesap Oluştur",
    footer: (
      <p className="text-sm text-muted-foreground">
        Zaten hesabınız var mı?{" "}
        <Link href="/giris" className="text-primary hover:underline font-medium">
          Giriş yapın
        </Link>
      </p>
    ),
  },
  reset: {
    title: "Şifrenizi mi unuttunuz?",
    subtitle: "E-postanıza sıfırlama bağlantısı göndereceğiz",
    submit: "Bağlantı Gönder",
    footer: (
      <p className="text-sm text-muted-foreground">
        <Link href="/giris" className="text-primary hover:underline font-medium">
          ← Giriş sayfasına dön
        </Link>
      </p>
    ),
  },
};

export function AuthForm({ mode, action }: AuthFormProps) {
  const [state, formAction, isPending] = useActionState(
    async (_prev: { error?: string; success?: string } | null, formData: FormData) => {
      const result = await action(formData);
      return result ?? null;
    },
    null
  );

  const config = CONFIG[mode];
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-sm">
      {/* Logo */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-block font-heading text-3xl font-bold text-primary">
          Tok<span className="text-foreground">Bebek</span>
        </Link>
      </div>

      <div className="bg-card rounded-3xl border border-border shadow-card p-6 sm:p-8 space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold">{config.title}</h1>
          <p className="text-muted-foreground text-sm mt-1">{config.subtitle}</p>
        </div>

        <form action={formAction} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Ad Soyad</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Ayşe Yılmaz"
                required
                className="rounded-xl"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="email">E-posta</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="ornek@mail.com"
              required
              autoComplete="email"
              className="rounded-xl"
            />
          </div>

          {mode !== "reset" && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Şifre</Label>
                {mode === "signin" && (
                  <Link href="/sifremi-unuttum" className="text-xs text-muted-foreground hover:text-primary">
                    Şifremi unuttum
                  </Link>
                )}
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={mode === "signup" ? "En az 8 karakter" : "••••••••"}
                  required
                  minLength={mode === "signup" ? 8 : undefined}
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  className="rounded-xl pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Hata / Başarı mesajı */}
          {state?.error && (
            <div className="rounded-xl bg-destructive/10 text-destructive text-sm px-4 py-3">
              {state.error}
            </div>
          )}
          {state?.success && (
            <div className="rounded-xl bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 text-sm px-4 py-3">
              {state.success}
            </div>
          )}

          <Button type="submit" className="w-full rounded-xl" disabled={isPending}>
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {config.submit}
          </Button>
        </form>

        <div className="text-center">{config.footer}</div>
      </div>
    </div>
  );
}
