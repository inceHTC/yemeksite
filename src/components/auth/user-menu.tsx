"use client";

import Link from "next/link";
import { LayoutDashboard } from "lucide-react";

interface UserMenuProps {
  isAdmin?: boolean;
}

export function UserMenu({ isAdmin = false }: UserMenuProps) {
  if (!isAdmin) return null;

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
