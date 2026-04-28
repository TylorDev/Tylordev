import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import {
  FiPlus,
  FiSearch,
  FiSave,
  FiTrash2,
  FiX,
  FiEdit2,
  FiRefreshCw,
  FiAlertCircle,
  FiCheckCircle,
  FiPackage,
  FiFileText,
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
  updateArticle,
  updateProject,
} from "../../lib/api";
import {
  emptyArticle,
  emptyArticleSection,
  emptyProject,
  emptyProjectButton,
  emptyProjectSection,
  slugify,
} from "../../lib/factories";
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
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import ArticleCard from "../../components/ArticleCard/ArticleCard";
import "./Admin.scss";

type Tab = "projects" | "articles";
type Toast = { kind: "ok" | "err"; text: string };

export default function Admin() {
  const [language, setLanguage] = useState<Locale>("en-us");
  const [tab, setTab] = useState<Tab>("projects");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const [projects, setProjects] = useState<RawProject[]>([]);
  const [articles, setArticles] = useState<RawArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<RawProject | null>(null);
  const [editingArticle, setEditingArticle] = useState<RawArticle | null>(null);
  const [editorLocale, setEditorLocale] = useState<Locale>("en-us");
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
      p.data.tags.toLowerCase().includes(q);
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
      projects.filter((p) =>
        p.translations.some((t) => (t.status ?? "").toLowerCase() === "draft")
      ).length +
      articles.filter((a) => !a.publishedAt).length,
  };

  // ─── Editor open / close ────────────────────────────────────────────────
  const openNewProject = () => {
    setEditingProject(emptyProject());
    setEditorLocale("en-us");
  };
  const openNewArticle = () => {
    setEditingArticle(emptyArticle());
    setEditorLocale("en-us");
  };
  const editProject = (slug: string) => {
    const found = projects.find((p) => p.slug === slug);
    if (found) {
      setEditingProject(JSON.parse(JSON.stringify(found)));
      setEditorLocale("en-us");
    }
  };
  const editArticle = (slug: string) => {
    const found = articles.find((a) => a.slug === slug);
    if (found) {
      setEditingArticle(JSON.parse(JSON.stringify(found)));
      setEditorLocale("en-us");
    }
  };
  const closeEditor = () => {
    setEditingProject(null);
    setEditingArticle(null);
    setConfirmDelete(null);
  };

  // ─── Save (create or update) ────────────────────────────────────────────
  const saveProject = async () => {
    if (!editingProject) return;
    if (!editingProject.slug) {
      setToast({ kind: "err", text: "Slug is required." });
      return;
    }
    setSaving(true);
    try {
      const exists = projects.some((p) => p.slug === editingProject.slug);
      const result = exists
        ? await updateProject(editingProject.slug, editingProject)
        : await createProject(editingProject);
      const saved = result ?? editingProject;
      setProjects((prev) => {
        const next = prev.filter((p) => p.slug !== saved.slug);
        return [saved, ...next];
      });
      setEditingProject(null);
      setToast({ kind: "ok", text: exists ? "Project updated." : "Project created." });
    } catch (err) {
      setToast({ kind: "err", text: extractApiError(err) });
    } finally {
      setSaving(false);
    }
  };

  const saveArticle = async () => {
    if (!editingArticle) return;
    if (!editingArticle.slug) {
      setToast({ kind: "err", text: "Slug is required." });
      return;
    }
    setSaving(true);
    try {
      const exists = articles.some((a) => a.slug === editingArticle.slug);
      const result = exists
        ? await updateArticle(editingArticle.slug, editingArticle)
        : await createArticle(editingArticle);
      const saved = result ?? editingArticle;
      setArticles((prev) => {
        const next = prev.filter((a) => a.slug !== saved.slug);
        return [saved, ...next];
      });
      setEditingArticle(null);
      setToast({ kind: "ok", text: exists ? "Article updated." : "Article created." });
    } catch (err) {
      setToast({ kind: "err", text: extractApiError(err) });
    } finally {
      setSaving(false);
    }
  };

  // ─── Delete ─────────────────────────────────────────────────────────────
  const removeProject = async (slug: string) => {
    setSaving(true);
    try {
      await deleteProject(slug);
      setProjects((prev) => prev.filter((p) => p.slug !== slug));
      setEditingProject(null);
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
      setEditingArticle(null);
      setConfirmDelete(null);
      setToast({ kind: "ok", text: "Article deleted." });
    } catch (err) {
      setToast({ kind: "err", text: extractApiError(err) });
    } finally {
      setSaving(false);
    }
  };

  // ─── Editor: project field setters ──────────────────────────────────────
  const patchProject = (patch: Partial<RawProject>) =>
    setEditingProject((cur) => (cur ? { ...cur, ...patch } : cur));
  const patchProjectShared = (patch: Partial<RawProject["shared"]>) =>
    setEditingProject((cur) =>
      cur ? { ...cur, shared: { ...cur.shared, ...patch } } : cur
    );
  const patchProjectTranslation = (locale: Locale, field: string, value: string) =>
    setEditingProject((cur) => {
      if (!cur) return cur;
      const translations = cur.translations.map((t) =>
        t.locale === locale ? { ...t, [field]: value } : t
      );
      const englishTitle = cur.translations.find((t) => t.locale === "en-us")?.title ?? "";
      const nextSlug =
        field === "title" && locale === "en-us" && (!cur.slug || cur.slug === slugify(englishTitle))
          ? slugify(value)
          : cur.slug;
      return { ...cur, slug: nextSlug, translations };
    });

  // ─── Editor: article field setters ──────────────────────────────────────
  const patchArticle = (patch: Partial<RawArticle>) =>
    setEditingArticle((cur) => (cur ? { ...cur, ...patch } : cur));
  const patchArticleShared = (patch: Partial<RawArticle["shared"]>) =>
    setEditingArticle((cur) =>
      cur ? { ...cur, shared: { ...cur.shared, ...patch } } : cur
    );
  const patchArticleTranslation = (locale: Locale, field: string, value: string) =>
    setEditingArticle((cur) => {
      if (!cur) return cur;
      const translations = cur.translations.map((t) =>
        t.locale === locale ? { ...t, [field]: value } : t
      );
      const englishTitle = cur.translations.find((t) => t.locale === "en-us")?.title ?? "";
      const nextSlug =
        field === "title" && locale === "en-us" && (!cur.slug || cur.slug === slugify(englishTitle))
          ? slugify(value)
          : cur.slug;
      return { ...cur, slug: nextSlug, translations };
    });

  const projectTr = editingProject?.translations.find((t) => t.locale === editorLocale);
  const articleTr = editingArticle?.translations.find((t) => t.locale === editorLocale);

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
            onClick={tab === "projects" ? openNewProject : openNewArticle}
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
            <EmptyState onCreate={openNewProject} kind="project" />
          ) : (
            <div className="adminx-grid">
              {filteredProjects.map((p) => (
                <div key={p.slug} className="adminx-cell">
                  <ProjectCard project={p} onClick={() => editProject(p.slug)} />
                  <RowActions
                    onEdit={() => editProject(p.slug)}
                    onDelete={() => setConfirmDelete(`p:${p.slug}`)}
                  />
                </div>
              ))}
            </div>
          )
        ) : filteredArticles.length === 0 ? (
          <EmptyState onCreate={openNewArticle} kind="article" />
        ) : (
          <div className="adminx-stack glass">
            {filteredArticles.map((a) => (
              <div key={a.slug} className="adminx-row">
                <ArticleCard article={a} onClick={() => editArticle(a.slug)} />
                <RowActions
                  onEdit={() => editArticle(a.slug)}
                  onDelete={() => setConfirmDelete(`a:${a.slug}`)}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ─── Drawer: project editor ───────────────────────────────────── */}
      {editingProject && projectTr && (
        <Drawer
          title={projects.some((p) => p.slug === editingProject.slug) ? `Edit · ${editingProject.slug}` : "New project"}
          onClose={closeEditor}
          locale={editorLocale}
          onLocale={setEditorLocale}
          saving={saving}
          onSave={saveProject}
          onDelete={
            projects.some((p) => p.slug === editingProject.slug)
              ? () => setConfirmDelete(`p:${editingProject.slug}`)
              : undefined
          }
        >
          <Field label="Slug">
            <input
              value={editingProject.slug}
              onChange={(e) => patchProject({ slug: slugify(e.target.value) })}
              placeholder="auto-generated from English title"
            />
          </Field>
          <Field label="Published at">
            <input
              type="date"
              value={(editingProject.publishedAt ?? "").slice(0, 10)}
              onChange={(e) => patchProject({ publishedAt: e.target.value })}
            />
          </Field>
          <Field label="Cover image (URL)">
            <input
              value={editingProject.shared.coverImageSrc ?? ""}
              onChange={(e) => patchProjectShared({ coverImageSrc: e.target.value })}
            />
          </Field>
          <Field label="Cover alt">
            <input
              value={editingProject.shared.coverImageAlt ?? ""}
              onChange={(e) => patchProjectShared({ coverImageAlt: e.target.value })}
            />
          </Field>
          <Field label="Background image (URL)">
            <input
              value={editingProject.shared.backgroundImage ?? ""}
              onChange={(e) => patchProjectShared({ backgroundImage: e.target.value })}
            />
          </Field>

          <Divider label={`Translation · ${editorLocale}`} />

          <Field label="Title">
            <input
              value={projectTr.title ?? ""}
              onChange={(e) => patchProjectTranslation(editorLocale, "title", e.target.value)}
            />
          </Field>
          <Row>
            <Field label="Status">
              <input
                value={projectTr.status ?? ""}
                onChange={(e) => patchProjectTranslation(editorLocale, "status", e.target.value)}
                placeholder="Draft / Live / Beta"
              />
            </Field>
            <Field label="Type">
              <input
                value={projectTr.type ?? ""}
                onChange={(e) => patchProjectTranslation(editorLocale, "type", e.target.value)}
                placeholder="Web App, Design System…"
              />
            </Field>
          </Row>
          <Field label="Tags">
            <input
              value={projectTr.tags ?? ""}
              onChange={(e) => patchProjectTranslation(editorLocale, "tags", e.target.value)}
              placeholder="#react #typescript"
            />
          </Field>
          <Field label="Subtitle">
            <input
              value={projectTr.subtitle ?? ""}
              onChange={(e) => patchProjectTranslation(editorLocale, "subtitle", e.target.value)}
            />
          </Field>
          <Field label="Hero message">
            <textarea
              rows={2}
              value={projectTr.message ?? ""}
              onChange={(e) => patchProjectTranslation(editorLocale, "message", e.target.value)}
            />
          </Field>

          <Repeatable
            label="Buttons"
            count={editingProject.shared.buttons?.length ?? 0}
            onAdd={() =>
              patchProjectShared({
                buttons: [...(editingProject.shared.buttons ?? []), emptyProjectButton()],
              })
            }
          >
            {(editingProject.shared.buttons ?? []).map((btn, i) => {
              const tr = btn.translations?.find((t) => t.locale === editorLocale);
              return (
                <RepeatableItem
                  key={i}
                  index={i}
                  onRemove={() =>
                    patchProjectShared({
                      buttons: (editingProject.shared.buttons ?? []).filter((_, idx) => idx !== i),
                    })
                  }
                >
                  <Field label="URL">
                    <input
                      value={btn.url ?? ""}
                      onChange={(e) => {
                        const next = [...(editingProject.shared.buttons ?? [])];
                        next[i] = { ...next[i], url: e.target.value };
                        patchProjectShared({ buttons: next });
                      }}
                    />
                  </Field>
                  <Field label={`Label (${editorLocale})`}>
                    <input
                      value={tr?.text ?? ""}
                      onChange={(e) => {
                        const next = [...(editingProject.shared.buttons ?? [])];
                        const translations = (next[i].translations ?? []).map((t) =>
                          t.locale === editorLocale ? { ...t, text: e.target.value } : t
                        );
                        if (!translations.some((t) => t.locale === editorLocale)) {
                          translations.push({ locale: editorLocale, text: e.target.value });
                        }
                        next[i] = { ...next[i], translations };
                        patchProjectShared({ buttons: next });
                      }}
                    />
                  </Field>
                </RepeatableItem>
              );
            })}
          </Repeatable>

          <Repeatable
            label="Sections"
            count={editingProject.sections?.length ?? 0}
            onAdd={() =>
              patchProject({
                sections: [...(editingProject.sections ?? []), emptyProjectSection()],
              })
            }
          >
            {(editingProject.sections ?? []).map((sec, i) => {
              const tr = sec.translations?.find((t) => t.locale === editorLocale) as
                | { summary?: string; readMore?: string; modalContent?: string; close?: string }
                | undefined;
              return (
                <RepeatableItem
                  key={i}
                  index={i}
                  onRemove={() =>
                    patchProject({
                      sections: (editingProject.sections ?? []).filter((_, idx) => idx !== i),
                    })
                  }
                >
                  <Row>
                    <Field label="Cover image">
                      <input
                        value={sec.coverImage ?? ""}
                        onChange={(e) => {
                          const next = [...(editingProject.sections ?? [])];
                          next[i] = { ...next[i], coverImage: e.target.value };
                          patchProject({ sections: next });
                        }}
                      />
                    </Field>
                    <Field label="Direction">
                      <select
                        value={sec.flexDirection ?? "row"}
                        onChange={(e) => {
                          const next = [...(editingProject.sections ?? [])];
                          next[i] = { ...next[i], flexDirection: e.target.value };
                          patchProject({ sections: next });
                        }}
                      >
                        <option value="row">row</option>
                        <option value="row-reverse">row-reverse</option>
                      </select>
                    </Field>
                  </Row>
                  <Field label="Summary">
                    <textarea
                      rows={2}
                      value={tr?.summary ?? ""}
                      onChange={(e) => {
                        const next = [...(editingProject.sections ?? [])];
                        const translations = (next[i].translations ?? []).map((t) =>
                          t.locale === editorLocale ? { ...t, summary: e.target.value } : t
                        );
                        next[i] = { ...next[i], translations };
                        patchProject({ sections: next });
                      }}
                    />
                  </Field>
                  <Field label="Modal content">
                    <textarea
                      rows={4}
                      value={tr?.modalContent ?? ""}
                      onChange={(e) => {
                        const next = [...(editingProject.sections ?? [])];
                        const translations = (next[i].translations ?? []).map((t) =>
                          t.locale === editorLocale ? { ...t, modalContent: e.target.value } : t
                        );
                        next[i] = { ...next[i], translations };
                        patchProject({ sections: next });
                      }}
                    />
                  </Field>
                </RepeatableItem>
              );
            })}
          </Repeatable>
        </Drawer>
      )}

      {/* ─── Drawer: article editor ───────────────────────────────────── */}
      {editingArticle && articleTr && (
        <Drawer
          title={articles.some((a) => a.slug === editingArticle.slug) ? `Edit · ${editingArticle.slug}` : "New article"}
          onClose={closeEditor}
          locale={editorLocale}
          onLocale={setEditorLocale}
          saving={saving}
          onSave={saveArticle}
          onDelete={
            articles.some((a) => a.slug === editingArticle.slug)
              ? () => setConfirmDelete(`a:${editingArticle.slug}`)
              : undefined
          }
        >
          <Field label="Slug">
            <input
              value={editingArticle.slug}
              onChange={(e) => patchArticle({ slug: slugify(e.target.value) })}
              placeholder="auto-generated from English title"
            />
          </Field>
          <Field label="Published at">
            <input
              type="date"
              value={(editingArticle.publishedAt ?? "").slice(0, 10)}
              onChange={(e) => patchArticle({ publishedAt: e.target.value })}
            />
          </Field>
          <Field label="Cover image (URL)">
            <input
              value={editingArticle.shared.coverImageSrc ?? ""}
              onChange={(e) => patchArticleShared({ coverImageSrc: e.target.value })}
            />
          </Field>
          <Field label="Banner image (URL)">
            <input
              value={editingArticle.shared.bannerImage ?? ""}
              onChange={(e) => patchArticleShared({ bannerImage: e.target.value })}
            />
          </Field>

          <Divider label={`Translation · ${editorLocale}`} />

          <Row>
            <Field label="Category">
              <input
                value={articleTr.category ?? ""}
                onChange={(e) => patchArticleTranslation(editorLocale, "category", e.target.value)}
              />
            </Field>
            <Field label="Title">
              <input
                value={articleTr.title ?? ""}
                onChange={(e) => patchArticleTranslation(editorLocale, "title", e.target.value)}
              />
            </Field>
          </Row>
          <Field label="Headline">
            <textarea
              rows={2}
              value={articleTr.contentTitle ?? ""}
              onChange={(e) => patchArticleTranslation(editorLocale, "contentTitle", e.target.value)}
            />
          </Field>
          <Field label="Excerpt">
            <textarea
              rows={3}
              value={articleTr.content ?? ""}
              onChange={(e) => patchArticleTranslation(editorLocale, "content", e.target.value)}
            />
          </Field>

          <Repeatable
            label="Sections"
            count={editingArticle.sections?.length ?? 0}
            onAdd={() =>
              patchArticle({
                sections: [...(editingArticle.sections ?? []), emptyArticleSection()],
              })
            }
          >
            {(editingArticle.sections ?? []).map((sec, i) => {
              const tr = sec.translations?.find((t) => t.locale === editorLocale) as
                | { title?: string; paragraph?: string }
                | undefined;
              return (
                <RepeatableItem
                  key={i}
                  index={i}
                  onRemove={() =>
                    patchArticle({
                      sections: (editingArticle.sections ?? []).filter((_, idx) => idx !== i),
                    })
                  }
                >
                  <Field label="Image (URL)">
                    <input
                      value={sec.image ?? ""}
                      onChange={(e) => {
                        const next = [...(editingArticle.sections ?? [])];
                        next[i] = { ...next[i], image: e.target.value };
                        patchArticle({ sections: next });
                      }}
                    />
                  </Field>
                  <Field label="Subtitle">
                    <input
                      value={tr?.title ?? ""}
                      onChange={(e) => {
                        const next = [...(editingArticle.sections ?? [])];
                        const translations = (next[i].translations ?? []).map((t) =>
                          t.locale === editorLocale ? { ...t, title: e.target.value } : t
                        );
                        next[i] = { ...next[i], translations };
                        patchArticle({ sections: next });
                      }}
                    />
                  </Field>
                  <Field label="Paragraph">
                    <textarea
                      rows={4}
                      value={tr?.paragraph ?? ""}
                      onChange={(e) => {
                        const next = [...(editingArticle.sections ?? [])];
                        const translations = (next[i].translations ?? []).map((t) =>
                          t.locale === editorLocale ? { ...t, paragraph: e.target.value } : t
                        );
                        next[i] = { ...next[i], translations };
                        patchArticle({ sections: next });
                      }}
                    />
                  </Field>
                </RepeatableItem>
              );
            })}
          </Repeatable>
        </Drawer>
      )}

      {confirmDelete && (
        <ConfirmDialog
          slug={confirmDelete.slice(2)}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={() =>
            confirmDelete.startsWith("p:")
              ? removeProject(confirmDelete.slice(2))
              : removeArticle(confirmDelete.slice(2))
          }
          busy={saving}
        />
      )}

      {toast && (
        <div className={`adminx-toast ${toast.kind}`}>
          {toast.kind === "ok" ? <FiCheckCircle /> : <FiAlertCircle />}
          <span>{toast.text}</span>
          <button onClick={() => setToast(null)} aria-label="Dismiss">
            <FiX />
          </button>
        </div>
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

function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="adminx-rowact">
      <button className="adminx-iconbtn" onClick={onEdit} aria-label="Edit">
        <FiEdit2 />
      </button>
      <button className="adminx-iconbtn danger" onClick={onDelete} aria-label="Delete">
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

function Drawer({
  title,
  onClose,
  locale,
  onLocale,
  saving,
  onSave,
  onDelete,
  children,
}: {
  title: string;
  onClose: () => void;
  locale: Locale;
  onLocale: (l: Locale) => void;
  saving: boolean;
  onSave: () => void;
  onDelete?: () => void;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="adminx-scrim" onClick={onClose} />
      <aside className="adminx-drawer glass" role="dialog" aria-label={title}>
        <header className="adminx-drawer-head">
          <div>
            <span className="eyebrow">Editor</span>
            <h2>{title}</h2>
          </div>
          <button className="adminx-iconbtn" onClick={onClose} aria-label="Close editor">
            <FiX />
          </button>
        </header>

        <div className="adminx-drawer-locales">
          {LOCALES.map((l) => (
            <button
              key={l}
              className={`adminx-loc ${l === locale ? "active" : ""}`}
              onClick={() => onLocale(l)}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="adminx-drawer-body">{children}</div>

        <footer className="adminx-drawer-foot">
          {onDelete && (
            <Button variant="danger" icon={<FiTrash2 />} onClick={onDelete} disabled={saving}>
              Delete
            </Button>
          )}
          <div style={{ flex: 1 }} />
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button variant="primary" icon={<FiSave />} onClick={onSave} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </footer>
      </aside>
    </>
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
        <h3>Delete “{slug}”?</h3>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="adminx-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="adminx-fieldrow">{children}</div>;
}

function Divider({ label }: { label: string }) {
  return (
    <div className="adminx-divider">
      <span className="eyebrow">{label}</span>
    </div>
  );
}

function Repeatable({
  label,
  count,
  onAdd,
  children,
}: {
  label: string;
  count: number;
  onAdd: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="adminx-repeatable">
      <header>
        <h4>
          {label} <span className="adminx-count">{count}</span>
        </h4>
        <button type="button" className="projects-chip" onClick={onAdd}>
          <FiPlus /> Add
        </button>
      </header>
      <div className="adminx-repeatable-body">{children}</div>
    </section>
  );
}

function RepeatableItem({
  index,
  onRemove,
  children,
}: {
  index: number;
  onRemove: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="adminx-rep-item">
      <div className="adminx-rep-head">
        <span className="adminx-rep-index">#{index + 1}</span>
        <button className="adminx-iconbtn danger" onClick={onRemove} aria-label="Remove">
          <FiTrash2 />
        </button>
      </div>
      <div className="adminx-rep-fields">{children}</div>
    </div>
  );
}
