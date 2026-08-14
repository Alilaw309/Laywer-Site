import ArticleDetailsClient from "./ArticleDetailsClient";

const API_URL = "https://admin.alilaw.ae/api/v1";
const SITE_URL = "https://alilaw.ae";

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

function stripHtml(html = "") {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function generateMetadata({ params }) {
  const { locale = "ar", id } = await params;
  const article = await getArticle(id, locale);

  if (!article) {
    return {
      title:
        locale === "ar"
          ? "المقالات القانونية | علي سعيد الشامسي"
          : "Legal Articles | Ali Saeed Al Shamsi",
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const canonical = `${SITE_URL}/${locale}/articles/${id}`;

  const rawDescription =
    article.meta_description ||
    article.description ||
    stripHtml(article.content);

  const description =
    rawDescription?.slice(0, 160) ||
    (locale === "ar"
      ? "مقالات ومعلومات قانونية وفق تشريعات دولة الإمارات العربية المتحدة."
      : "Legal articles and information based on the laws of the United Arab Emirates.");

  const title =
    locale === "ar"
      ? `${article.title} | علي سعيد الشامسي`
      : `${article.title} | Ali Saeed Al Shamsi`;

  return {
    title,
    description,

    alternates: {
      canonical,
    },

    openGraph: {
      title,
      description,
      url: canonical,
      siteName:
        locale === "ar" ? "علي سعيد الشامسي" : "Ali Saeed Al Shamsi",
      type: "article",
      locale: locale === "ar" ? "ar_AE" : "en_AE",
      images: article.image
        ? [
            {
              url: article.image,
              alt: article.title,
            },
          ]
        : [],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: article.image ? [article.image] : [],
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

export default async function Page({ params }) {
  const { locale = "ar", id } = await params;
  const article = await getArticle(id, locale);

  const canonical = `${SITE_URL}/${locale}/articles/${id}`;

  const articleSchema = article
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description:
          article.meta_description ||
          article.description ||
          stripHtml(article.content).slice(0, 160),
        image: article.image ? [article.image] : undefined,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": canonical,
        },
        author: {
          "@type": "Person",
          name:
            locale === "ar"
              ? "علي سعيد الشامسي"
              : "Ali Saeed Al Shamsi",
          url: SITE_URL,
        },
        publisher: {
          "@type": "Person",
          name:
            locale === "ar"
              ? "علي سعيد الشامسي"
              : "Ali Saeed Al Shamsi",
          url: SITE_URL,
        },
        inLanguage: locale === "ar" ? "ar-AE" : "en-AE",
        url: canonical,
      }
    : null;

  return (
    <>
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c"),
          }}
        />
      )}

      <ArticleDetailsClient
        initialArticle={article}
        locale={locale}
        id={id}
      />
    </>
  );
}
