import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.akturturizm.com";

  // Tüm statik sayfa URL'lerimiz (lang path'i hariç ana yapılar)
  const routes = [
    "",
    "/vip-transfer",
    "/car-rental",
    "/event-organization",
    "/school-transport",
    "/staff-transport",
    "/student-register",
    "/sustainability"
  ];

  const sitemapEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${siteUrl}/tr${route}`, // default dil varsayımı
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === "" ? 1 : 0.8,
    alternates: {
      languages: {
        tr: `${siteUrl}/tr${route}`,
        en: `${siteUrl}/en${route}`,
      },
    },
  }));

  return sitemapEntries;
}
