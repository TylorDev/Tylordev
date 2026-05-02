import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getArticle, mapArticle, extractApiError } from "../../lib/api";
import { type Locale, type RawArticle } from "../../lib/types";
import { ArticleDetailView } from "../../../pages/ArticleDetail/ArticleDetail";
import "../../../pages/ArticleDetail/ArticleDetail.scss";
import PreviewToolbar from "../../components/PreviewToolbar/PreviewToolbar";
import Skeleton from "../../components/Skeleton/Skeleton";

export default function ArticlePreview() {
  const { slug } = useParams<{ slug: string }>();
  const [locale, setLocale] = useState<Locale>("en-us");
  const [raw, setRaw] = useState<RawArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getArticle(slug)
      .then((a) => { setRaw(a); setError(null); })
      .catch((err) => setError(extractApiError(err)))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="container" style={{ padding: "80px 24px" }}>
        <Skeleton height={48} width="60%" />
        <div style={{ height: 24 }} />
        <Skeleton height={300} radius={20} />
      </div>
    );
  }

  if (error || !raw) {
    return (
      <div className="container" style={{ padding: "120px 24px", textAlign: "center" }}>
        <h2>Could not load article</h2>
        <p style={{ color: "var(--text-dim)" }}>{error ?? "Not found"}</p>
      </div>
    );
  }

  const data = mapArticle(raw, locale);

  return (
    <>
      <PreviewToolbar
        locale={locale}
        onLocale={setLocale}
        editPath={`/admin/edit/article/${slug}`}
        isDraft={!raw.publishedAt}
      />
      <div style={{ paddingTop: 52 }}>
        <ArticleDetailView data={data} backTo="/admin" />
      </div>
    </>
  );
}
