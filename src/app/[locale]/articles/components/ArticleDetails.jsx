"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { getDictionary } from "@/lib/getDictionary";

export default function ArticleDetails({
  article,
  index,
  locale,
}) {
  const isArabic = locale === "ar";
  const dict = getDictionary(locale);

  const stripHtml = (html = "") => {
    return html.replace(/<[^>]+>/g, "");
  };

  const createSlug = (title = "") => {
    return String(title)
      .trim()
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const articleSlug = String(article?.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12 }}
      className="group relative min-h-[340px] overflow-hidden rounded-2xl border border-[#0D2749]"
    >
      <Image
        src={article?.image || "/images/icon-1.png"}
        alt={article?.title || "article"}
        fill
        className="object-cover transition duration-700 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/65 to-transparent" />

      <div className="absolute bottom-0 right-0 z-10 p-8 text-right">
        <h3 className="mb-4 text-custom22 font-bold text-white">
          {article?.title}
        </h3>

        <p className="mb-5 line-clamp-2 text-custom14 leading-7 text-[#95AAC7]">
          {stripHtml(article?.content || "")}
        </p>

        <Link
          href={`/${locale}/articles/${articleSlug}`}
          className="inline-flex items-center gap-2 text-secondary"
        >
          {dict?.articles?.readMore}

          {isArabic ? (
            <FaArrowLeft />
          ) : (
            <FaArrowRight />
          )}
        </Link>
      </div>
    </motion.div>
  );
}
