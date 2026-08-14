import { getTopicsApi } from "@/services/topicsService";

export default async function sitemap() {
  const baseUrl = "https://alilaw.ae";
  const locales = ["ar", "en"];

  const staticPages = [
    "",
    "/about-us",
    "/articles",
    "/contact",
    "/privacy-policy",
    "/terms-conditions",
  ];

  const staticUrls = locales.flatMap((locale) =>
    staticPages.map((page) => ({
      url: `${baseUrl}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: page === "" ? 1.0 : 0.8,
    }))
  );

  let articleUrls = [];

  try {
    for (const locale of locales) {
      const response = await getTopicsApi(locale);
      const articles = Array.isArray(response)
        ? response
        : response?.data || [];

      const urls = articles.map((article) => ({
        url: `${baseUrl}/${locale}/articles/${article.id}`,
        lastModified: new Date(
          article.updated_at || article.created_at || Date.now()
        ),
        changeFrequency: "weekly",
        priority: 0.7,
      }));

      articleUrls.push(...urls);
    }
  } catch (error) {
    console.error("Sitemap articles error:", error);
  }

  return [...staticUrls, ...articleUrls];
}
