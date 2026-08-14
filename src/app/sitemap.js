export default async function sitemap() {
  const baseUrl = "https://alilaw.ae";
  const apiUrl = "https://admin.alilaw.ae/api/v1";
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
      priority: page === "" ? 1 : 0.8,
    }))
  );

  const articleUrls = [];

  for (const locale of locales) {
    try {
      const response = await fetch(`${apiUrl}/topics`, {
        headers: {
          lang: locale,
          Accept: "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) continue;

      const data = await response.json();

      const articles = Array.isArray(data)
  ? data
  : Array.isArray(data?.data)
  ? data.data
  : Array.isArray(data?.topics)
  ? data.topics
  : [];

      for (const article of articles) {
        if (!article?.id) continue;

        articleUrls.push({
          url: `${baseUrl}/${locale}/articles/${article.id}`,
          lastModified: article.updated_at
            ? new Date(article.updated_at)
            : new Date(),
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    } catch (error) {
      console.error(`Sitemap error for ${locale}:`, error);
    }
  }

  return [...staticUrls, ...articleUrls];
}
