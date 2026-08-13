export async function generateMetadata({ params }) {
  const { locale } = await params;
  const isArabic = locale === "ar";

  const title = isArabic
    ? "مقالات قانونية في الإمارات | المحامي علي سعيد الشامسي"
    : "Legal Articles in the UAE | Ali Saeed Al Shamsi";

  const description = isArabic
    ? "مقالات قانونية حول القضايا الجزائية والمدنية والتجارية والأحوال الشخصية والعقارات والعقود والقوانين في دولة الإمارات العربية المتحدة."
    : "Legal articles on criminal, civil, commercial, family, real estate and contract law in the United Arab Emirates.";

  const url = `https://alilaw.ae/${locale}/articles`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ar: "https://alilaw.ae/ar/articles",
        en: "https://alilaw.ae/en/articles",
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function ArticlesLayout({ children }) {
  return children;
}
