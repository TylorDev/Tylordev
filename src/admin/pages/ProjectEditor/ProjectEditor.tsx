import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiSave,
  FiUploadCloud,
  FiEye,
  FiTrash2,
  FiAlertCircle,
  FiCheckCircle,
  FiX,
} from "react-icons/fi";
import {
  createProject,
  deleteProject,
  extractApiError,
  getProject,
  mapProject,
  updateProject,
} from "../../lib/api";
import {
  emptyProject,
  emptyProjectButton,
  emptyProjectSection,
  slugify,
} from "../../lib/factories";
import { LOCALES, type Locale, type RawProject } from "../../lib/types";
import { Field, Row, Divider, Repeatable, RepeatableItem } from "../../components/EditorFields/EditorFields";
import ProjectCard from "../../../components/ProjectCard/ProjectCard";
import Button from "../../components/Button/Button";
import Skeleton from "../../components/Skeleton/Skeleton";
import TechSelector from "../../components/TechSelector/TechSelector";
import "./ProjectEditor.scss";

type Toast = { kind: "ok" | "err"; text: string };

const STATUS_OPTIONS = {
  "en-us": ["Completed", "In Progress", "Canceled"],
  "es-mx": ["Completado", "En Proceso", "Cancelado"],
  "pt-br": ["Concluído", "Em Andamento", "Cancelado"],
};

const TYPE_OPTIONS = [
  "FullStack",
  "Backend",
  "Frontend",
  "Experiment",
  "Discord-bot",
  "Desktop App",
  "Game",
  "Mobile App",
  "Other",
];

export default function ProjectEditor() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isNew = !slug;

  const [data, setData] = useState<RawProject | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [editorLocale, setEditorLocale] = useState<Locale>("en-us");
  const [previewLocale, setPreviewLocale] = useState<Locale>("en-us");
  const [toast, setToast] = useState<Toast | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (isNew) {
      setData(emptyProject());
      return;
    }
    setLoading(true);
    getProject(slug)
      .then((p) => setData(JSON.parse(JSON.stringify(p))))
      .catch((err) => setToast({ kind: "err", text: extractApiError(err) }))
      .finally(() => setLoading(false));
  }, [slug, isNew]);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(id);
  }, [toast]);

  const preview = useMemo(
    () => (data ? mapProject(data, previewLocale) : null),
    [data, previewLocale]
  );

  if (loading) {
    return (
      <div className="container peditor" style={{ padding: "60px 24px" }}>
        <Skeleton height={48} width="60%" />
        <div style={{ height: 16 }} />
        <Skeleton height={400} radius={12} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container peditor" style={{ padding: "120px 24px", textAlign: "center" }}>
        <h2>Project not found</h2>
        <Button variant="ghost" icon={<FiArrowLeft />} onClick={() => navigate("/admin")}>
          Back to dashboard
        </Button>
      </div>
    );
  }

  // ─── Field helpers ───────────────────────────────────────────────────────
  const patch = (p: Partial<RawProject>) => setData((cur) => (cur ? { ...cur, ...p } : cur));
  const patchShared = (p: Partial<RawProject["shared"]>) =>
    setData((cur) => (cur ? { ...cur, shared: { ...cur.shared, ...p } } : cur));
  const patchTr = (locale: Locale, field: string, value: string) =>
    setData((cur) => {
      if (!cur) return cur;
      const hasLocale = cur.translations.some((t) => t.locale === locale);
      let nextTr = cur.translations;
      if (!hasLocale) {
        nextTr = [...nextTr, { locale, subtitle: "" }];
      }
      nextTr = nextTr.map((t) => (t.locale === locale ? { ...t, [field]: value } : t));
      return { ...cur, translations: nextTr };
    });

  const patchSharedTitle = (value: string) => {
    setData((cur) => {
      if (!cur) return cur;
      const nextSlug =
        !cur.slug || cur.slug === slugify(cur.shared.title || "") ? slugify(value) : cur.slug;
      return { ...cur, slug: nextSlug, shared: { ...cur.shared, title: value } };
    });
  };

  const tr = data.translations.find((t) => t.locale === editorLocale);

  // ─── Validation ──────────────────────────────────────────────────────────
  const canSave =
    (data.shared.title ?? "").trim().length > 0 &&
    (data.shared.coverImageSrc ?? "").trim().length > 0 &&
    (data.shared.status ?? "").trim().length > 0 &&
    (data.shared.type ?? "").trim().length > 0;

  // ─── Actions ─────────────────────────────────────────────────────────────
  const doSave = async (publish: boolean) => {
    if (!canSave) {
      setToast({ kind: "err", text: "Title, Cover image, Status, and Type are required." });
      return;
    }
    setSaving(true);
    const payload: RawProject = {
      ...data,
      publishedAt: publish ? (data.publishedAt || new Date().toISOString()) : null,
    };
    try {
      const exists = !isNew;
      const result = exists
        ? await updateProject(slug as string, payload)
        : await createProject(payload);
      const saved = result ?? payload;
      setToast({ kind: "ok", text: publish ? "Published!" : "Draft saved." });
      if (saved.slug && saved.slug !== slug) {
        navigate(`/admin/edit/project/${saved.slug}`, { replace: true });
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
      await deleteProject(slug as string);
      setToast({ kind: "ok", text: "Project deleted." });
      navigate("/admin");
    } catch (err) {
      setToast({ kind: "err", text: extractApiError(err) });
    } finally {
      setSaving(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div className="peditor fadeIn">
      {/* ─── Sticky toolbar ─────────────────────────────────────────── */}
      <header className="peditor-toolbar">
        <div className="container peditor-toolbar-inner">
          <Button variant="ghost" icon={<FiArrowLeft />} onClick={() => navigate("/admin")}>
            Dashboard
          </Button>
          <div className="peditor-toolbar-title">
            <span className="eyebrow">{isNew ? "New project" : `Editing · ${data.slug}`}</span>
            {!data.publishedAt && <span className="peditor-draft-badge">Draft</span>}
            {data.publishedAt && <span className="peditor-pub-badge">Published</span>}
          </div>
          <div className="peditor-toolbar-actions">
            {!isNew && (
              <Button
                variant="ghost"
                icon={<FiEye />}
                onClick={() => navigate(`/admin/preview/project/${data.slug}`)}
              >
                Preview
              </Button>
            )}
          </div>
          {/* Buttons */}
          <div className="peditor-actions">
            <Button
              variant="ghost"
              icon={<FiSave />}
              onClick={() => doSave(false)}
              disabled={saving}
            >
              Save Draft
            </Button>
            <Button
              variant="primary"
              icon={<FiUploadCloud />}
              onClick={() => doSave(true)}
              disabled={saving}
            >
              Publish
            </Button>
          </div>
        </div>
      </header>

      {/* ─── Body: editor + preview ──────────────────────────────────── */}
      <div className="container peditor-body">
        <div className="peditor-form">
          {/* Locale tabs */}
          <div className="peditor-locales">
            <span className="eyebrow">Editor locale</span>
            <div className="peditor-locale-row">
              {LOCALES.map((l) => (
                <button
                  key={l}
                  className={`peditor-loc ${l === editorLocale ? "active" : ""}`}
                  onClick={() => setEditorLocale(l)}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Shared fields */}
          <div className="peditor-section">
            <h3 className="peditor-section-title">General</h3>
            <Field label="Slug">
              <input
                value={data.slug}
                onChange={(e) => patch({ slug: slugify(e.target.value) })}
                placeholder="auto-generated from English title"
              />
            </Field>
            <Field label="Title (Global)" required>
              <input
                value={data.shared.title ?? ""}
                onChange={(e) => patchSharedTitle(e.target.value)}
                placeholder="Project title..."
              />
            </Field>
            <Field label="Cover image (URL)" required>
              <input
                value={data.shared.coverImageSrc ?? ""}
                onChange={(e) => patchShared({ coverImageSrc: e.target.value })}
                placeholder="https://..."
              />
            </Field>
            <Field label="Background image (URL)">
              <input
                value={data.shared.backgroundImage ?? ""}
                onChange={(e) => patchShared({ backgroundImage: e.target.value })}
              />
            </Field>
            <Row>
              <Field label={`Status (${editorLocale})`} required>
                <select
                  value={data.shared.status ?? ""}
                  onChange={(e) => patchShared({ status: e.target.value })}
                  required
                >
                  <option value="" disabled>Select status</option>
                  {STATUS_OPTIONS[editorLocale].map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Type" required>
                <select
                  value={data.shared.type ?? ""}
                  onChange={(e) => patchShared({ type: e.target.value })}
                  required
                >
                  <option value="" disabled>Select type</option>
                  {TYPE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </Field>
            </Row>
            <Field label="Technologies">
              <TechSelector
                value={data.shared.technologies ?? ""}
                onChange={(technologies) => patchShared({ technologies })}
              />
            </Field>
          </div>

          {/* Translation fields */}
          <div className="peditor-section">
            <Divider label={`Translation · ${editorLocale}`} />
            <Field label="Subtitle">
              <input
                value={tr?.subtitle ?? ""}
                onChange={(e) => patchTr(editorLocale, "subtitle", e.target.value)}
              />
            </Field>
          </div>

          {/* Buttons */}
          <div className="peditor-section">
            <Repeatable
              label="Buttons"
              count={data.shared.buttons?.length ?? 0}
              onAdd={() =>
                patchShared({
                  buttons: [...(data.shared.buttons ?? []), emptyProjectButton()],
                })
              }
            >
              {(data.shared.buttons ?? []).map((btn, i) => {
                const btnTr = btn.translations?.find((t) => t.locale === editorLocale);
                return (
                  <RepeatableItem
                    key={i}
                    index={i}
                    onRemove={() =>
                      patchShared({
                        buttons: (data.shared.buttons ?? []).filter((_, idx) => idx !== i),
                      })
                    }
                  >
                    <Row>
                      <Field label="Icon">
                        <select
                          value={btn.icon ?? ""}
                          onChange={(e) => {
                            const next = [...(data.shared.buttons ?? [])];
                            next[i] = { ...next[i], icon: e.target.value };
                            patchShared({ buttons: next });
                          }}
                        >
                          <option value="">None</option>
                          <option value="preview">Live Preview (Eye/Link)</option>
                          <option value="github">GitHub</option>
                          <option value="docs">Docs (Book/File)</option>
                        </select>
                      </Field>
                      <Field label="URL">
                        <input
                          value={btn.url ?? ""}
                          onChange={(e) => {
                            const next = [...(data.shared.buttons ?? [])];
                            next[i] = { ...next[i], url: e.target.value };
                            patchShared({ buttons: next });
                          }}
                        />
                      </Field>
                    </Row>
                    <Field label={`Label (${editorLocale})`}>
                      <input
                        value={btnTr?.text ?? ""}
                        onChange={(e) => {
                          const next = [...(data.shared.buttons ?? [])];
                          const translations = (next[i].translations ?? []).map((t) =>
                            t.locale === editorLocale ? { ...t, text: e.target.value } : t
                          );
                          if (!translations.some((t) => t.locale === editorLocale)) {
                            translations.push({ locale: editorLocale, text: e.target.value });
                          }
                          next[i] = { ...next[i], translations };
                          patchShared({ buttons: next });
                        }}
                      />
                    </Field>
                  </RepeatableItem>
                );
              })}
            </Repeatable>
          </div>

          {/* Sections */}
          <div className="peditor-section">
            <Repeatable
              label="Sections"
              count={data.sections?.length ?? 0}
              onAdd={() =>
                patch({
                  sections: [...(data.sections ?? []), emptyProjectSection()],
                })
              }
            >
              {(data.sections ?? []).map((sec, i) => {
                const secTr = sec.translations?.find((t) => t.locale === editorLocale) as
                  | { summary?: string; readMore?: string; modalContent?: string; close?: string }
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
                    <Row>
                      <Field label="Cover image">
                        <input
                          value={sec.coverImage ?? ""}
                          onChange={(e) => {
                            const next = [...(data.sections ?? [])];
                            next[i] = { ...next[i], coverImage: e.target.value };
                            patch({ sections: next });
                          }}
                        />
                      </Field>
                      <Field label="Direction">
                        <select
                          value={sec.flexDirection ?? "row"}
                          onChange={(e) => {
                            const next = [...(data.sections ?? [])];
                            next[i] = { ...next[i], flexDirection: e.target.value };
                            patch({ sections: next });
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
                        value={secTr?.summary ?? ""}
                        onChange={(e) => {
                          const next = [...(data.sections ?? [])];
                          const translations = (next[i].translations ?? []).map((t) =>
                            t.locale === editorLocale ? { ...t, summary: e.target.value } : t
                          );
                          next[i] = { ...next[i], translations };
                          patch({ sections: next });
                        }}
                      />
                    </Field>
                    <Field label="Modal content">
                      <textarea
                        rows={4}
                        value={secTr?.modalContent ?? ""}
                        onChange={(e) => {
                          const next = [...(data.sections ?? [])];
                          const translations = (next[i].translations ?? []).map((t) =>
                            t.locale === editorLocale ? { ...t, modalContent: e.target.value } : t
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
            <div className="peditor-danger-zone">
              <h3>Danger zone</h3>
              <Button variant="danger" icon={<FiTrash2 />} onClick={() => setConfirmDelete(true)}>
                Delete project
              </Button>
            </div>
          )}
        </div>

        {/* ─── Live preview sidebar ──────────────────────────────────── */}
        <aside className="peditor-preview">
          <div className="peditor-preview-head">
            <span className="eyebrow">Card preview</span>
            <div className="peditor-locale-row small">
              {LOCALES.map((l) => (
                <button
                  key={l}
                  className={`peditor-loc ${l === previewLocale ? "active" : ""}`}
                  onClick={() => setPreviewLocale(l)}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          {preview && (
            <div className="peditor-preview-card">
              <ProjectCard project={preview} onClick={() => { }} />
            </div>
          )}
        </aside>
      </div>

      {/* ─── Confirm delete dialog ─────────────────────────────────── */}
      {confirmDelete && (
        <>
          <div className="peditor-scrim" onClick={() => setConfirmDelete(false)} />
          <div className="peditor-confirm glass" role="alertdialog">
            <FiAlertCircle className="peditor-confirm-icon" />
            <h3>Delete "{data.slug}"?</h3>
            <p>This removes all translations and sections. The action cannot be undone.</p>
            <div className="peditor-confirm-actions">
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
        <div className={`peditor-toast ${toast.kind}`}>
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
