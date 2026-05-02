import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiSave,
  FiSend,
  FiEye,
  FiTrash2,
  FiAlertCircle,
  FiCheckCircle,
  FiX,
} from "react-icons/fi";
import {
  createArticle,
  deleteArticle,
  extractApiError,
  getArticle,
  mapArticle,
  updateArticle,
} from "../../lib/api";
import {
  emptyArticle,
  emptyArticleSection,
  slugify,
} from "../../lib/factories";
import { LOCALES, type Locale, type RawArticle } from "../../lib/types";
import { Field, Row, Divider, Repeatable, RepeatableItem } from "../../components/EditorFields/EditorFields";
import ArticleCard from "../../../components/ArticleCard/ArticleCard";
import Button from "../../components/Button/Button";
import Skeleton from "../../components/Skeleton/Skeleton";
import "./ArticleEditor.scss";

type Toast = { kind: "ok" | "err"; text: string };

export default function ArticleEditor() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isNew = !slug;

  const [data, setData] = useState<RawArticle | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [editorLocale, setEditorLocale] = useState<Locale>("en-us");
  const [previewLocale, setPreviewLocale] = useState<Locale>("en-us");
  const [toast, setToast] = useState<Toast | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (isNew) {
      setData(emptyArticle());
      return;
    }
    setLoading(true);
    getArticle(slug)
      .then((a) => setData(JSON.parse(JSON.stringify(a))))
      .catch((err) => setToast({ kind: "err", text: extractApiError(err) }))
      .finally(() => setLoading(false));
  }, [slug, isNew]);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(id);
  }, [toast]);

  const preview = useMemo(
    () => (data ? mapArticle(data, previewLocale) : null),
    [data, previewLocale]
  );

  if (loading) {
    return (
      <div className="container aeditor" style={{ padding: "60px 24px" }}>
        <Skeleton height={48} width="60%" />
        <div style={{ height: 16 }} />
        <Skeleton height={400} radius={12} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container aeditor" style={{ padding: "120px 24px", textAlign: "center" }}>
        <h2>Article not found</h2>
        <Button variant="ghost" icon={<FiArrowLeft />} onClick={() => navigate("/admin")}>
          Back to dashboard
        </Button>
      </div>
    );
  }

  // ─── Field helpers ───────────────────────────────────────────────────────
  const patch = (p: Partial<RawArticle>) => setData((cur) => (cur ? { ...cur, ...p } : cur));
  const patchShared = (p: Partial<RawArticle["shared"]>) =>
    setData((cur) => (cur ? { ...cur, shared: { ...cur.shared, ...p } } : cur));
  const patchTr = (locale: Locale, field: string, value: string) =>
    setData((cur) => {
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

  const tr = data.translations.find((t) => t.locale === editorLocale);
  const englishTitle = data.translations.find((t) => t.locale === "en-us")?.title ?? "";

  // ─── Validation ──────────────────────────────────────────────────────────
  const canSave = englishTitle.trim().length > 0 && (data.shared.coverImageSrc ?? "").trim().length > 0;

  // ─── Actions ─────────────────────────────────────────────────────────────
  const doSave = async (publish: boolean) => {
    if (!canSave) {
      setToast({ kind: "err", text: "English title and cover image are required." });
      return;
    }
    setSaving(true);
    const payload: RawArticle = {
      ...data,
      publishedAt: publish ? (data.publishedAt || new Date().toISOString()) : null,
    };
    try {
      const exists = !isNew;
      const result = exists
        ? await updateArticle(slug as string, payload)
        : await createArticle(payload);
      const saved = result ?? payload;
      setToast({ kind: "ok", text: publish ? "Published!" : "Draft saved." });
      if (saved.slug && saved.slug !== slug) {
        navigate(`/admin/edit/article/${saved.slug}`, { replace: true });
      } else {
        setData(JSON.parse(JSON.stringify(saved)));
      }
    } catch (err) {
      setToast({ kind: "err", text: extractApiError(err) });
    } finally {
      setSaving(false);
    }
  };

  const doDelete = async () => {
    setSaving(true);
    try {
      await deleteArticle(slug as string);
      setToast({ kind: "ok", text: "Article deleted." });
      navigate("/admin");
    } catch (err) {
      setToast({ kind: "err", text: extractApiError(err) });
    } finally {
      setSaving(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div className="aeditor fadeIn">
      {/* ─── Sticky toolbar ─────────────────────────────────────────── */}
      <header className="aeditor-toolbar">
        <div className="container aeditor-toolbar-inner">
          <Button variant="ghost" icon={<FiArrowLeft />} onClick={() => navigate("/admin")}>
            Dashboard
          </Button>
          <div className="aeditor-toolbar-title">
            <span className="eyebrow">{isNew ? "New article" : `Editing · ${data.slug}`}</span>
            {!data.publishedAt && <span className="aeditor-draft-badge">Draft</span>}
            {data.publishedAt && <span className="aeditor-pub-badge">Published</span>}
          </div>
          <div className="aeditor-toolbar-actions">
            {!isNew && (
              <Button
                variant="ghost"
                icon={<FiEye />}
                onClick={() => navigate(`/admin/preview/article/${data.slug}`)}
              >
                Preview
              </Button>
            )}
            <Button
              variant="ghost"
              icon={<FiSave />}
              onClick={() => doSave(false)}
              disabled={saving || !canSave}
            >
              {saving ? "Saving…" : "Save draft"}
            </Button>
            <Button
              variant="primary"
              icon={<FiSend />}
              onClick={() => doSave(true)}
              disabled={saving || !canSave}
            >
              {saving ? "Publishing…" : "Publish"}
            </Button>
          </div>
        </div>
      </header>

      {/* ─── Body: editor + preview ──────────────────────────────────── */}
      <div className="container aeditor-body">
        <div className="aeditor-form">
          {/* Locale tabs */}
          <div className="aeditor-locales">
            <span className="eyebrow">Editor locale</span>
            <div className="aeditor-locale-row">
              {LOCALES.map((l) => (
                <button
                  key={l}
                  className={`aeditor-loc ${l === editorLocale ? "active" : ""}`}
                  onClick={() => setEditorLocale(l)}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Shared fields */}
          <div className="aeditor-section">
            <h3 className="aeditor-section-title">General</h3>
            <Field label="Slug">
              <input
                value={data.slug}
                onChange={(e) => patch({ slug: slugify(e.target.value) })}
                placeholder="auto-generated from English title"
              />
            </Field>
            <Field label="Cover image (URL)" required>
              <input
                value={data.shared.coverImageSrc ?? ""}
                onChange={(e) => patchShared({ coverImageSrc: e.target.value })}
                placeholder="https://..."
              />
            </Field>
            <Field label="Banner image (URL)">
              <input
                value={data.shared.bannerImage ?? ""}
                onChange={(e) => patchShared({ bannerImage: e.target.value })}
              />
            </Field>
          </div>

          {/* Translation fields */}
          <div className="aeditor-section">
            <Divider label={`Translation · ${editorLocale}`} />
            <Field label="Title" required={editorLocale === "en-us"}>
              <input
                value={tr?.title ?? ""}
                onChange={(e) => patchTr(editorLocale, "title", e.target.value)}
              />
            </Field>
            <Row>
              <Field label="Category">
                <input
                  value={tr?.category ?? ""}
                  onChange={(e) => patchTr(editorLocale, "category", e.target.value)}
                />
              </Field>
              <Field label="Headline">
                <input
                  value={tr?.contentTitle ?? ""}
                  onChange={(e) => patchTr(editorLocale, "contentTitle", e.target.value)}
                />
              </Field>
            </Row>
            <Field label="Excerpt">
              <textarea
                rows={3}
                value={tr?.content ?? ""}
                onChange={(e) => patchTr(editorLocale, "content", e.target.value)}
              />
            </Field>
          </div>

          {/* Sections */}
          <div className="aeditor-section">
            <Repeatable
              label="Sections"
              count={data.sections?.length ?? 0}
              onAdd={() =>
                patch({
                  sections: [...(data.sections ?? []), emptyArticleSection()],
                })
              }
            >
              {(data.sections ?? []).map((sec, i) => {
                const secTr = sec.translations?.find((t) => t.locale === editorLocale) as
                  | { title?: string; paragraph?: string }
                  | undefined;
                return (
                  <RepeatableItem
                    key={i}
                    index={i}
                    onRemove={() =>
                      patch({
                        sections: (data.sections ?? []).filter((_, idx) => idx !== i),
                      })
                    }
                  >
                    <Field label="Image (URL)">
                      <input
                        value={sec.image ?? ""}
                        onChange={(e) => {
                          const next = [...(data.sections ?? [])];
                          next[i] = { ...next[i], image: e.target.value };
                          patch({ sections: next });
                        }}
                      />
                    </Field>
                    <Field label="Subtitle">
                      <input
                        value={secTr?.title ?? ""}
                        onChange={(e) => {
                          const next = [...(data.sections ?? [])];
                          const translations = (next[i].translations ?? []).map((t) =>
                            t.locale === editorLocale ? { ...t, title: e.target.value } : t
                          );
                          next[i] = { ...next[i], translations };
                          patch({ sections: next });
                        }}
                      />
                    </Field>
                    <Field label="Paragraph">
                      <textarea
                        rows={4}
                        value={secTr?.paragraph ?? ""}
                        onChange={(e) => {
                          const next = [...(data.sections ?? [])];
                          const translations = (next[i].translations ?? []).map((t) =>
                            t.locale === editorLocale ? { ...t, paragraph: e.target.value } : t
                          );
                          next[i] = { ...next[i], translations };
                          patch({ sections: next });
                        }}
                      />
                    </Field>
                  </RepeatableItem>
                );
              })}
            </Repeatable>
          </div>

          {/* Delete zone */}
          {!isNew && (
            <div className="aeditor-danger-zone">
              <h3>Danger zone</h3>
              <Button variant="danger" icon={<FiTrash2 />} onClick={() => setConfirmDelete(true)}>
                Delete article
              </Button>
            </div>
          )}
        </div>

        {/* ─── Live preview sidebar ──────────────────────────────────── */}
        <aside className="aeditor-preview">
          <div className="aeditor-preview-head">
            <span className="eyebrow">Card preview</span>
            <div className="aeditor-locale-row small">
              {LOCALES.map((l) => (
                <button
                  key={l}
                  className={`aeditor-loc ${l === previewLocale ? "active" : ""}`}
                  onClick={() => setPreviewLocale(l)}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          {preview && (
            <div className="aeditor-preview-card">
              <ArticleCard article={preview} onClick={() => {}} />
            </div>
          )}
        </aside>
      </div>

      {/* ─── Confirm delete dialog ─────────────────────────────────── */}
      {confirmDelete && (
        <>
          <div className="aeditor-scrim" onClick={() => setConfirmDelete(false)} />
          <div className="aeditor-confirm glass" role="alertdialog">
            <FiAlertCircle className="aeditor-confirm-icon" />
            <h3>Delete "{data.slug}"?</h3>
            <p>This removes all translations and sections. The action cannot be undone.</p>
            <div className="aeditor-confirm-actions">
              <Button variant="ghost" onClick={() => setConfirmDelete(false)} disabled={saving}>
                Cancel
              </Button>
              <Button variant="danger" icon={<FiTrash2 />} onClick={doDelete} disabled={saving}>
                {saving ? "Deleting…" : "Delete"}
              </Button>
            </div>
          </div>
        </>
      )}

      {/* ─── Toast ──────────────────────────────────────────────────── */}
      {toast && createPortal(
        <div className={`aeditor-toast ${toast.kind}`}>
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
