import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";
import { signUp } from "@/app/auth/actions";

export const metadata: Metadata = { title: "Kayıt Ol" };

export default function KayitPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background flex items-center justify-center p-4">
      <AuthForm mode="signup" action={signUp} />
    </main>
  );
}
