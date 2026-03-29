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
          "/giris",
        ],
      },
    ],
    sitemap: "https://tokbebek.com.tr/sitemap.xml",
    host: "https://tokbebek.com.tr",
  };
}
