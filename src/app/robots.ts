import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/auth/",
          "/admin/",
          "/profil",
          "/favorilerim",
          "/basla",
          "/giris",
          "/kayit",
          "/sifremi-unuttum",
        ],
      },
    ],
    sitemap: "https://tokbebek.com.tr/sitemap.xml",
    host: "https://tokbebek.com.tr",
  };
}
