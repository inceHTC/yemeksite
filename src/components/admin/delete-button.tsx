"use client";

import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
  id: string;
  action: (id: string) => Promise<void>;
}

export function DeleteButton({ id, action }: DeleteButtonProps) {
  return (
    <form
      action={action.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm("Bu tarifi silmek istediğinize emin misiniz?")) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </form>
  );
}
