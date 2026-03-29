import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LogOut, ChefHat } from "lucide-react";
import { signOut } from "@/app/auth/actions";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = user
    ? await (supabase as any).from("profiles").select("role").eq("id", user.id).single()
    : { data: null };
  const isAdmin = profile?.role === "admin";

  if (!isAdmin) return <>{children}</>;

  return (
    <div className="min-h-screen flex bg-muted/20">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-border bg-background flex flex-col shadow-sm">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <ChefHat className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="font-heading font-bold text-base leading-none">
                <span className="text-primary">Tok</span>
                <span className="text-foreground">Bebek</span>
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <AdminNav />

        {/* Footer */}
        <div className="px-3 pb-4 border-t border-border pt-3 space-y-1">
          <div className="flex items-center gap-2.5 px-3 py-2">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-primary">
                {user?.email?.[0]?.toUpperCase() ?? "A"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Çıkış Yap
            </button>
          </form>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b border-border px-8 py-3.5 flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            <span className="text-foreground font-medium">TokBebek</span> / Yönetim
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs text-muted-foreground">Çevrimiçi</span>
          </div>
        </div>
        <div className="container mx-auto px-8 py-8 max-w-5xl">
          {children}
        </div>
      </main>
    </div>
  );
}
