import ArticlesTabs from "./components/ArticlesTabs";
import { getDictionary } from "@/lib/getDictionary";
import { getTopicsApi } from "@/services/topicsService";

export default async function ArticlesPage({ params }) {
  const { locale = "ar" } = await params;

  const dict = getDictionary(locale);

  let categories = [];
  let articles = [];

  try {
    const data = await getTopicsApi(locale);

    categories = data?.categories || [];
    articles = data?.topics || data?.data || [];
  } catch (error) {
    console.error("Failed to load articles:", error);
  }

  return (
    <section className="container py-[200px]">
      <div className="grid grid-cols-12">
        <div className="col-span-12 text-center">
          <span className="mb-2 inline-block px-6 py-3 text-custom14 font-medium">
            {dict?.legalContent?.badge}
          </span>

          <h1 className="mx-auto w-full text-custom32 font-[700] leading-tight">
            {dict?.legalContent?.title}
          </h1>

          <p className="mx-auto mt-2 w-full text-custom16 leading-8">
            {dict?.legalContent?.description}
          </p>
        </div>

        <div className="col-span-12">
          <ArticlesTabs
            categories={categories}
            articles={articles}
            locale={locale}
          />
        </div>
      </div>
    </section>
  );
}
