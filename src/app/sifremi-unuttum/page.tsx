import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";
import { resetPassword } from "@/app/auth/actions";

export const metadata: Metadata = { title: "Şifremi Unuttum" };

export default function SifremiUnuttumPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background flex items-center justify-center p-4">
      <AuthForm mode="reset" action={resetPassword} />
    </main>
  );
}
