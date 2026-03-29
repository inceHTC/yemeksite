import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";
import { signIn } from "@/app/auth/actions";

export const metadata: Metadata = { title: "Giriş Yap" };

export default function GirisPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background flex items-center justify-center p-4">
      <AuthForm mode="signin" action={signIn} />
    </main>
  );
}
