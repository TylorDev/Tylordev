import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProject, mapProject, extractApiError } from "../../lib/api";
import { type Locale, type RawProject } from "../../lib/types";
import { ProjectDetailView } from "../../../pages/ProjectDetail/ProjectDetail";
import "../../../pages/ProjectDetail/ProjectDetail.scss";
import PreviewToolbar from "../../components/PreviewToolbar/PreviewToolbar";
import Skeleton from "../../components/Skeleton/Skeleton";

export default function ProjectPreview() {
  const { slug } = useParams<{ slug: string }>();
  const [locale, setLocale] = useState<Locale>("en-us");
  const [raw, setRaw] = useState<RawProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getProject(slug)
      .then((p) => { setRaw(p); setError(null); })
      .catch((err) => setError(extractApiError(err)))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="container" style={{ padding: "80px 24px" }}>
        <Skeleton height={48} width="40%" />
        <div style={{ height: 24 }} />
        <Skeleton height={400} radius={20} />
      </div>
    );
  }

  if (error || !raw) {
    return (
      <div className="container" style={{ padding: "120px 24px", textAlign: "center" }}>
        <h2>Could not load project</h2>
        <p style={{ color: "var(--text-dim)" }}>{error ?? "Not found"}</p>
      </div>
    );
  }

  const data = mapProject(raw, locale);

  return (
    <>
      <PreviewToolbar
        locale={locale}
        onLocale={setLocale}
        editPath={`/admin/edit/project/${slug}`}
        isDraft={!raw.publishedAt}
      />
      <div style={{ paddingTop: 52 }}>
        <ProjectDetailView data={data} backTo="/admin" />
      </div>
    </>
  );
}
