"use client";

import { useState } from "react";
import { Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { sendContactMessage } from "./actions";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const result = await sendContactMessage(formData);

    if (result.success) {
      setStatus("success");
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? "Bir hata oluştu.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 space-y-4">
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="font-heading text-xl font-bold">Mesajınız İletildi!</h3>
        <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
          Geri bildiriminiz için teşekkürler. En kısa sürede size dönüş yapacağız.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="text-sm text-primary hover:underline mt-2"
        >
          Yeni mesaj gönder
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">Ad Soyad</label>
          <input
            type="text"
            name="name"
            placeholder="Adınız Soyadınız"
            required
            className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">E-posta</label>
          <input
            type="email"
            name="email"
            placeholder="ornek@mail.com"
            required
            className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">Konu</label>
        <select
          name="subject"
          className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-foreground"
        >
          <option value="">Konu seçin...</option>
          <option value="Tarif Önerisi">Tarif Önerisi</option>
          <option value="İçerik Geri Bildirimi">İçerik Geri Bildirimi</option>
          <option value="Genel Görüş">Genel Görüş</option>
          <option value="İşbirliği & Medya">İşbirliği & Medya</option>
          <option value="Diğer">Diğer</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">Mesajınız</label>
        <textarea
          name="message"
          rows={5}
          required
          placeholder="Mesajınızı buraya yazın..."
          className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
        />
      </div>

      {status === "error" && (
        <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/8 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full flex items-center justify-center gap-2 bg-primary text-white rounded-xl px-6 py-3 text-sm font-bold hover:bg-primary/90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-md shadow-primary/20"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Gönderiliyor...
          </>
        ) : (
          <>
            <Mail className="w-4 h-4" />
            Mesaj Gönder
          </>
        )}
      </button>
    </form>
  );
}
