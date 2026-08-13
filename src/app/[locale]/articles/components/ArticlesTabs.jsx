"use client";

import { useState } from "react";
import ArticleDetails from "./ArticleDetails";
import { useTopics } from "@/hooks/useTopics";
import LoadingCard from "@/app/components/LoadingCard";
import ErrorState from "@/app/components/ErrorState";
import { getDictionary } from "@/lib/getDictionary";

export default function ArticlesTabs({ categories = [], locale }) {
  const { data, isLoading, error } = useTopics(locale);
  const articles = data?.topics || [];
  const dict = getDictionary(locale);

  const [activeTab, setActiveTab] = useState("all");

  if (isLoading) return <LoadingCard />;
  if (error) return <ErrorState />;

  const filteredArticles =
    activeTab === "all"
      ? articles: articles.filter((article) => String(article.category?.id) === String(activeTab));
  return (
    <section className="mt-[50px] pb-28">
      <div className="container">
        <div className="mb-10 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`rounded-full border px-6 py-3 text-custom14 font-[600] transition ${
              activeTab === "all"
                ? "border-secondary bg-secondary text-white"
                : "border-[#263B58] bg-transparent text-white hover:border-secondary hover:text-secondary"
            }`}
          >
            {dict?.articles?.all}
          </button>

          {categories.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(String(tab?.id || ""))}
                  className={`rounded-full border px-6 py-3 text-custom14 font-[600] transition ${
  activeTab === String(tab?.id || "")
    ? "border-secondary bg-secondary text-white"
    : "border-[#263B58] bg-transparent text-white hover:border-secondary hover:text-secondary"
}`}
            >
              {tab?.title}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-6">
          {filteredArticles.map((article, index) => (
            <div key={article?.id || ""} className="col-span-12 md:col-span-6 lg:col-span-4">
              <ArticleDetails locale={locale} article={article} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
