const baseUrl = "https://alilaw.ae";
const apiUrl = "https://admin.alilaw.ae/api/v1";

export default async function sitemap() {
  const locales = ["ar", "en"];

  const pages = [
    "",
    "/about-us",
    "/articles",
    "/contact",
    "/privacy-policy",
    "/terms-conditions",
  ];

  const staticUrls = locales.flatMap((locale) =>
    pages.map((page) => ({
      url: `${baseUrl}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: page === "" ? 1 : 0.8,
    }))
  );

  const articleUrls = [];

  for (const locale of locales) {
    try {
      const response = await fetch(`${apiUrl}/topics`, {
        headers: {
          lang: locale,
        },
        next: { revalidate: 3600 },
      });

      if (!response.ok) continue;

      const result = await response.json();

      const articles = Array.isArray(result)
        ? result
        : result?.data || [];

      articles.forEach((article) => {
        if (article?.id) {
          articleUrls.push({
            url: `${baseUrl}/${locale}/articles/${article.id}`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
          });
        }
      });
    } catch (error) {
      console.error(`Sitemap error (${locale}):`, error);
    }
  }

  return [...staticUrls, ...articleUrls];
}
