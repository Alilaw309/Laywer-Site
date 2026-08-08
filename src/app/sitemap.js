import { getTopicsApi } from "@/services/topicsService";

export default async function sitemap() {
  const baseUrl = "https://alilaw.ae";
  const locales = ["ar", "en"];

  // 1. الصفحات الثابتة
  const staticPages = [
    "",
    "/about",
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

  // 2. جلب المقالات ديناميكياً لكل لغة
  let dynamicArticleUrls = [];
  try {
    for (const locale of locales) {
      const response = await getTopicsApi(locale);
      const articles = Array.isArray(response) ? response : response?.data || [];

      const urls = articles.map((article) => ({
        url: `${baseUrl}/${locale}/articles/${article.slug || article.id}`,
        lastModified: article.updatedAt ? new Date(article.updatedAt) : new Date(),
        changeFrequency: "daily",
        priority: 0.7,
      }));

      dynamicArticleUrls.push(...urls);
    }
  } catch (error) {
    console.error("Error generating dynamic articles sitemap:", error);
  }

  return [...staticUrls, ...dynamicArticleUrls];
}
