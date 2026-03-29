"use client";

import Link from "next/link";
import { LogIn, LogOut, User, Heart, BookOpen, LayoutDashboard, Mail } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signOut } from "@/app/auth/actions";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface UserMenuProps {
  user: SupabaseUser | null;
  isAdmin?: boolean;
}

export function UserMenu({ user, isAdmin = false }: UserMenuProps) {
  if (!user) {
    return (
      <Link
        href="/giris"
        className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-full gap-1.5")}
      >
        <LogIn className="w-3.5 h-3.5" />
        Giriş
      </Link>
    );
  }

  const initials = user.user_metadata?.full_name
    ? user.user_metadata.full_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : user.email?.[0].toUpperCase() ?? "?";

  if (isAdmin) {
    return (
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 rounded-full bg-foreground text-background px-3.5 py-1.5 text-xs font-bold hover:bg-foreground/90 transition-all shadow-sm"
      >
        <LayoutDashboard className="w-3.5 h-3.5" />
        Admin Panel
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full w-9 h-9 p-0 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm shadow-sm"
        >
          {initials}
        </Button>
      } />
      <DropdownMenuContent align="end" className="w-48 rounded-2xl">
        <div className="px-3 py-2">
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/profil" className="flex items-center gap-2 w-full">
            <User className="w-4 h-4" /> Profil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/favorilerim" className="flex items-center gap-2 w-full">
            <Heart className="w-4 h-4" /> Favorilerim
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/akademi" className="flex items-center gap-2 w-full">
            <BookOpen className="w-4 h-4" /> Dergi
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/iletisim" className="flex items-center gap-2 w-full">
            <Mail className="w-4 h-4" /> İletişim
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <form action={signOut} className="w-full">
            <button type="submit" className="flex items-center gap-2 w-full text-destructive">
              <LogOut className="w-4 h-4" /> Çıkış Yap
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
