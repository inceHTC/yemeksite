function getYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1);
    if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
  } catch { /* ignore */ }
  return null;
}

export function RecipeVideo({ url }: { url: string }) {
  const youtubeId = getYouTubeId(url);

  if (youtubeId) {
    return (
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-muted">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title="Tarif videosu"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  }

  // Direkt video dosyası (mp4 vb.)
  if (url.match(/\.(mp4|webm|ogg)(\?|$)/i)) {
    return (
      <div className="rounded-2xl overflow-hidden bg-muted">
        <video controls className="w-full rounded-2xl" preload="metadata">
          <source src={url} />
        </video>
      </div>
    );
  }

  return null;
}
