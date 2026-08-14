import ArticleDetailsClient from "./ArticleDetailsClient";

const API_URL = "https://admin.alilaw.ae/api/v1";

async function getArticle(id, locale) {
  try {
    const topicId = id?.split("-")[0];

    const response = await fetch(`${API_URL}/topics/${topicId}`, {
      headers: {
        lang: locale,
        Accept: "application/json",
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data?.topic || data?.data || data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { locale, id } = await params;
  const article = await getArticle(id, locale);

  if (!article) {
    return {
      title: "المقالات القانونية | علي سعيد الشامسي",
    };
  }

  const title = article.title;
  const description =
    article.meta_description ||
    article.description ||
    article.content?.replace(/<[^>]*>/g, "").slice(0, 160);

  return {
    title,
    description,
    alternates: {
      canonical: `https://alilaw.ae/${locale}/articles/${id}`,
    },
    openGraph: {
      title,
      description,
      url: `https://alilaw.ae/${locale}/articles/${id}`,
      type: "article",
      images: article.image ? [article.image] : [],
    },
  };
}

export default function Page() {
  return <ArticleDetailsClient />;
}
