import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiSearch,
  FiTrash2,
  FiX,
  FiEdit2,
  FiRefreshCw,
  FiAlertCircle,
  FiCheckCircle,
  FiPackage,
  FiFileText,
  FiEye,
  FiCopy,
} from "react-icons/fi";
import {
  createArticle,
  createProject,
  deleteArticle,
  deleteProject,
  extractApiError,
  listArticles,
  listProjects,
  mapArticle,
  mapProject,
} from "../../lib/api";
import {
  LOCALES,
  type Article,
  type Locale,
  type Project,
  type RawArticle,
  type RawProject,
} from "../../lib/types";
import Button from "../../components/Button/Button";
import Skeleton from "../../components/Skeleton/Skeleton";
import ProjectCard from "../../../components/ProjectCard/ProjectCard";
import ArticleCard from "../../../components/ArticleCard/ArticleCard";
import "./Admin.scss";

type Tab = "projects" | "articles";
type Toast = { kind: "ok" | "err"; text: string };

export default function Admin() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<Locale>("en-us");
  const [tab, setTab] = useState<Tab>("projects");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const [projects, setProjects] = useState<RawProject[]>([]);
  const [articles, setArticles] = useState<RawArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const reload = async () => {
    setLoading(true);
    try {
      const [p, a] = await Promise.all([listProjects(), listArticles()]);
      setProjects(p);
      setArticles(a);
    } catch (err) {
      setToast({ kind: "err", text: extractApiError(err) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(id);
  }, [toast]);

  const projectsView: Project[] = useMemo(
    () => projects.map((p) => mapProject(p, language)),
    [projects, language]
  );
  const articlesView: Article[] = useMemo(
    () => articles.map((a) => mapArticle(a, language)),
    [articles, language]
  );

  const statusOptions = useMemo(() => {
    const set = new Set<string>(["All"]);
    if (tab === "projects") {
      projectsView.forEach((p) => p.data.status && set.add(p.data.status));
    } else {
      articlesView.forEach((a) => a.data.category && set.add(a.data.category));
    }
    return Array.from(set);
  }, [tab, projectsView, articlesView]);

  const filteredProjects = projectsView.filter((p) => {
    const q = query.trim().toLowerCase();
    const matchesQ =
      !q ||
      p.data.tittle.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q) ||
      p.data.technologies.toLowerCase().includes(q);
    const matchesS = statusFilter === "All" || p.data.status === statusFilter;
    return matchesQ && matchesS;
  });

  const filteredArticles = articlesView.filter((a) => {
    const q = query.trim().toLowerCase();
    const matchesQ =
      !q ||
      a.data.title.toLowerCase().includes(q) ||
      a.slug.toLowerCase().includes(q);
    const matchesS = statusFilter === "All" || a.data.category === statusFilter;
    return matchesQ && matchesS;
  });

  const stats = {
    projects: projects.length,
    articles: articles.length,
    drafts:
      projects.filter((p) => !p.publishedAt).length +
      articles.filter((a) => !a.publishedAt).length,
  };

  // ─── Delete ─────────────────────────────────────────────────────────────
  const removeProject = async (slug: string) => {
    setSaving(true);
    try {
      await deleteProject(slug);
      setProjects((prev) => prev.filter((p) => p.slug !== slug));
      setConfirmDelete(null);
      setToast({ kind: "ok", text: "Project deleted." });
    } catch (err) {
      setToast({ kind: "err", text: extractApiError(err) });
    } finally {
      setSaving(false);
    }
  };

  const removeArticle = async (slug: string) => {
    setSaving(true);
    try {
      await deleteArticle(slug);
      setArticles((prev) => prev.filter((a) => a.slug !== slug));
      setConfirmDelete(null);
      setToast({ kind: "ok", text: "Article deleted." });
    } catch (err) {
      setToast({ kind: "err", text: extractApiError(err) });
    } finally {
      setSaving(false);
    }
  };

  const removeIds = (obj: any) => {
    for (const key in obj) {
      if (key === 'id') delete obj[key];
      else if (typeof obj[key] === 'object' && obj[key] !== null) removeIds(obj[key]);
    }
  };

  const duplicateProject = async (slug: string) => {
    const original = projects.find((p) => p.slug === slug);
    if (!original) return;
    setSaving(true);
    try {
      const clone = JSON.parse(JSON.stringify(original));
      removeIds(clone);
      clone.slug = `${original.slug}-copy-${Math.floor(Math.random() * 10000)}`;
      clone.publishedAt = null;
      if (clone.shared) {
        clone.shared.title = `(Copy) ${clone.shared.title || ''}`;
      }
      await createProject(clone);
      setToast({ kind: "ok", text: "Project duplicated." });
      reload();
    } catch (err) {
      setToast({ kind: "err", text: extractApiError(err) });
    } finally {
      setSaving(false);
    }
  };

  const duplicateArticle = async (slug: string) => {
    const original = articles.find((a) => a.slug === slug);
    if (!original) return;
    setSaving(true);
    try {
      const clone = JSON.parse(JSON.stringify(original));
      removeIds(clone);
      clone.slug = `${original.slug}-copy-${Math.floor(Math.random() * 10000)}`;
      clone.publishedAt = null;
      if (clone.translations && clone.translations.length > 0) {
        const enTr = clone.translations.find((t: any) => t.locale === "en-us") || clone.translations[0];
        enTr.title = `(Copy) ${enTr.title || ''}`;
      }
      await createArticle(clone);
      setToast({ kind: "ok", text: "Article duplicated." });
      reload();
    } catch (err) {
      setToast({ kind: "err", text: extractApiError(err) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="adminx fadeIn">
      <header className="container adminx-head">
        <div className="adminx-head-row">
          <div>
            <span className="eyebrow">Studio · Control panel</span>
            <h1 className="section-title">
              <span className="gradient-text">Content management</span>
            </h1>
            <p className="section-subtitle">
              Create, translate and ship projects + articles. Same data shape as the public site.
            </p>
          </div>

          <div className="adminx-langs">
            <span className="eyebrow">Preview locale</span>
            <div className="adminx-lang-row">
              {LOCALES.map((l) => (
                <button
                  key={l}
                  className={`adminx-loc ${l === language ? "active" : ""}`}
                  onClick={() => setLanguage(l)}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="adminx-stats">
          <Stat label="Projects" value={stats.projects} icon={<FiPackage />} />
          <Stat label="Articles" value={stats.articles} icon={<FiFileText />} />
          <Stat label="Drafts" value={stats.drafts} icon={<FiAlertCircle />} />
        </div>
      </header>

      <section className="container adminx-toolbar">
        <div className="adminx-tabs">
          <button
            className={`adminx-tab ${tab === "projects" ? "active" : ""}`}
            onClick={() => {
              setTab("projects");
              setStatusFilter("All");
            }}
          >
            <FiPackage /> Projects
            <span className="adminx-count">{projects.length}</span>
          </button>
          <button
            className={`adminx-tab ${tab === "articles" ? "active" : ""}`}
            onClick={() => {
              setTab("articles");
              setStatusFilter("All");
            }}
          >
            <FiFileText /> Articles
            <span className="adminx-count">{articles.length}</span>
          </button>
        </div>

        <div className="adminx-tools">
          <div className="adminx-search">
            <FiSearch />
            <input
              placeholder={`Search ${tab}…`}
              value={query}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            />
          </div>

          <div className="adminx-filters">
            {statusOptions.map((s) => (
              <button
                key={s}
                className={`projects-chip ${s === statusFilter ? "active" : ""}`}
                onClick={() => setStatusFilter(s)}
              >
                {s}
              </button>
            ))}
          </div>

          <Button variant="ghost" icon={<FiRefreshCw />} onClick={reload}>
            Refresh
          </Button>
          <Button
            variant="primary"
            icon={<FiPlus />}
            onClick={() =>
              navigate(tab === "projects" ? "/admin/edit/project" : "/admin/edit/article")
            }
          >
            New {tab === "projects" ? "project" : "article"}
          </Button>
        </div>
      </section>

      <section className="container adminx-list">
        {loading ? (
          <SkeletonGrid kind={tab} />
        ) : tab === "projects" ? (
          filteredProjects.length === 0 ? (
            <EmptyState
              onCreate={() => navigate("/admin/edit/project")}
              kind="project"
            />
          ) : (
            <div className="adminx-grid">
              {filteredProjects.map((p) => {
                const raw = projects.find((rp) => rp.slug === p.slug);
                const isDraft = !raw?.publishedAt;
                return (
                  <div key={p.slug} className="adminx-cell">
                    {isDraft && <span className="adminx-draft-flag">Draft</span>}
                    <ProjectCard
                      project={p}
                      onClick={() => navigate(`/admin/edit/project/${p.slug}`)}
                    />
                    <RowActions
                      onEdit={() => navigate(`/admin/edit/project/${p.slug}`)}
                      onPreview={() => navigate(`/admin/preview/project/${p.slug}`)}
                      onDuplicate={() => duplicateProject(p.slug)}
                      onDelete={() => setConfirmDelete(`p:${p.slug}`)}
                    />
                  </div>
                );
              })}
            </div>
          )
        ) : filteredArticles.length === 0 ? (
          <EmptyState
            onCreate={() => navigate("/admin/edit/article")}
            kind="article"
          />
        ) : (
          <div className="adminx-stack glass">
            {filteredArticles.map((a) => {
              const raw = articles.find((ra) => ra.slug === a.slug);
              const isDraft = !raw?.publishedAt;
              return (
                <div key={a.slug} className="adminx-row">
                  {isDraft && <span className="adminx-draft-flag">Draft</span>}
                  <ArticleCard
                    article={a}
                    onClick={() => navigate(`/admin/edit/article/${a.slug}`)}
                  />
                  <RowActions
                    onEdit={() => navigate(`/admin/edit/article/${a.slug}`)}
                    onPreview={() => navigate(`/admin/preview/article/${a.slug}`)}
                    onDuplicate={() => duplicateArticle(a.slug)}
                    onDelete={() => setConfirmDelete(`a:${a.slug}`)}
                  />
                </div>
              );
            })}
          </div>
        )}
      </section>

      {confirmDelete && createPortal(
        <ConfirmDialog
          slug={confirmDelete.slice(2)}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={() =>
            confirmDelete.startsWith("p:")
              ? removeProject(confirmDelete.slice(2))
              : removeArticle(confirmDelete.slice(2))
          }
          busy={saving}
        />,
        document.body
      )}

      {toast && createPortal(
        <div className={`adminx-toast ${toast.kind}`}>
          {toast.kind === "ok" ? <FiCheckCircle /> : <FiAlertCircle />}
          <span>{toast.text}</span>
          <button onClick={() => setToast(null)} aria-label="Dismiss">
            <FiX />
          </button>
        </div>,
        document.body
      )}
    </div>
  );
}

// ─── Subcomponents ────────────────────────────────────────────────────────

function Stat({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="adminx-stat glass">
      <span className="adminx-stat-icon">{icon}</span>
      <div>
        <div className="adminx-stat-value">{value}</div>
        <div className="adminx-stat-label">{label}</div>
      </div>
    </div>
  );
}

function RowActions({
  onEdit,
  onPreview,
  onDuplicate,
  onDelete,
}: {
  onEdit: () => void;
  onPreview: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="adminx-rowact">
      <button className="adminx-iconbtn" onClick={onPreview} aria-label="Preview" title="Preview">
        <FiEye />
      </button>
      <button className="adminx-iconbtn" onClick={onDuplicate} aria-label="Duplicate" title="Duplicate">
        <FiCopy />
      </button>
      <button className="adminx-iconbtn" onClick={onEdit} aria-label="Edit" title="Edit">
        <FiEdit2 />
      </button>
      <button className="adminx-iconbtn danger" onClick={onDelete} aria-label="Delete" title="Delete">
        <FiTrash2 />
      </button>
    </div>
  );
}

function SkeletonGrid({ kind }: { kind: Tab }) {
  if (kind === "projects") {
    return (
      <div className="adminx-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass" style={{ overflow: "hidden", padding: 0 }}>
            <Skeleton height={220} radius={0} />
            <div style={{ padding: 20 }}>
              <Skeleton height={14} width="40%" />
              <div style={{ height: 8 }} />
              <Skeleton height={22} width="80%" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="adminx-stack glass">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} style={{ display: "flex", gap: 18, padding: 16 }}>
          <Skeleton width={120} height={90} />
          <div style={{ flex: 1 }}>
            <Skeleton height={14} width="30%" />
            <div style={{ height: 8 }} />
            <Skeleton height={20} width="80%" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({
  onCreate,
  kind,
}: {
  onCreate: () => void;
  kind: "project" | "article";
}) {
  return (
    <div className="adminx-empty glass">
      <p>No {kind}s match the current filters.</p>
      <Button variant="primary" icon={<FiPlus />} onClick={onCreate}>
        Create {kind}
      </Button>
    </div>
  );
}

function ConfirmDialog({
  slug,
  onCancel,
  onConfirm,
  busy,
}: {
  slug: string;
  onCancel: () => void;
  onConfirm: () => void;
  busy: boolean;
}) {
  return (
    <>
      <div className="adminx-scrim" onClick={onCancel} />
      <div className="adminx-confirm glass" role="alertdialog" aria-label="Confirm delete">
        <FiAlertCircle className="adminx-confirm-icon" />
        <h3>Delete "{slug}"?</h3>
        <p>This removes all translations and sections. The action cannot be undone.</p>
        <div className="adminx-confirm-actions">
          <Button variant="ghost" onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
          <Button variant="danger" icon={<FiTrash2 />} onClick={onConfirm} disabled={busy}>
            {busy ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </div>
    </>
  );
}
