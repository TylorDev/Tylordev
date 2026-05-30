import { useState, useEffect } from "react";
import { FiDownload, FiRotateCcw, FiGithub, FiInfo, FiCheck } from "react-icons/fi";
import { examplePages } from "../../../lib/fixtures";
import { exportStaticJson } from "../../../lib/staticContent";
import "./ContentEditor.scss";

// ─── Types ────────────────────────────────────────────────────────────────────

type Locale = "en-us" | "es-mx" | "pt-br";
type Section = "Hero" | "About" | "Contact" | "Footer" | "Header";

const LOCALES: { key: Locale; label: string }[] = [
  { key: "en-us", label: "EN" },
  { key: "es-mx", label: "ES" },
  { key: "pt-br", label: "PT" },
];

const SECTIONS: { key: Section; label: string }[] = [
  { key: "Hero",    label: "Hero" },
  { key: "About",   label: "About" },
  { key: "Contact", label: "Contact" },
  { key: "Footer",  label: "Footer" },
  { key: "Header",  label: "Header" },
];

const LS_KEY = "tylordev:content-editor-draft";

type ContentData = typeof examplePages;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function deepMerge<T>(target: T, source: Partial<T>): T {
  const result = { ...target };
  for (const key in source) {
    const val = source[key];
    if (val && typeof val === "object" && !Array.isArray(val)) {
      result[key] = deepMerge(result[key] as any, val as any);
    } else if (val !== undefined) {
      result[key] = val as any;
    }
  }
  return result;
}

function loadDraft(): ContentData {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return deepMerge(getDefaults(), JSON.parse(raw));
  } catch { /* ignore */ }
  return getDefaults();
}

function getDefaults(): ContentData {
  // Deep clone of examplePages as mutable data
  return JSON.parse(JSON.stringify(examplePages)) as ContentData;
}

function saveDraft(data: ContentData) {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

// ─── Field components ────────────────────────────────────────────────────────

function Field({ label, value, onChange, multiline = false }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <div className="ce-field">
      <label className="ce-label">{label}</label>
      {multiline ? (
        <textarea
          className="ce-input ce-textarea"
          value={value}
          rows={4}
          onChange={e => onChange(e.target.value)}
        />
      ) : (
        <input
          className="ce-input"
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

// ─── Section editors ─────────────────────────────────────────────────────────

function HeroEditor({ data, onChange }: {
  data: (typeof examplePages)["Hero"][Locale];
  onChange: (d: typeof data) => void;
}) {
  const set = (path: string, val: string) => {
    const next = JSON.parse(JSON.stringify(data));
    const keys = path.split(".");
    let obj: any = next;
    for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
    obj[keys[keys.length - 1]] = val;
    onChange(next);
  };

  return (
    <div className="ce-fields">
      <Field label="Main Title" value={data.hero.title} onChange={v => set("hero.title", v)} multiline />
      <Field label="Subtitle" value={data.hero.subtitle} onChange={v => set("hero.subtitle", v)} multiline />
      <Field label="CTA Button Text" value={data.hero.post.buttonText} onChange={v => set("hero.post.buttonText", v)} />
      <Field label="Intro Content" value={data.hero.post.content} onChange={v => set("hero.post.content", v)} multiline />
    </div>
  );
}

function AboutEditor({ data, onChange }: {
  data: (typeof examplePages)["About"][Locale];
  onChange: (d: typeof data) => void;
}) {
  const set = (path: string, val: string) => {
    const next = JSON.parse(JSON.stringify(data));
    const keys = path.split(".");
    let obj: any = next;
    for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
    obj[keys[keys.length - 1]] = val;
    onChange(next);
  };

  const setParagraph = (i: number, val: string) => {
    const next = JSON.parse(JSON.stringify(data));
    next.paragraphs[i] = val;
    onChange(next);
  };
  const addParagraph = () => {
    const next = JSON.parse(JSON.stringify(data));
    next.paragraphs.push("");
    onChange(next);
  };
  const removeParagraph = (i: number) => {
    const next = JSON.parse(JSON.stringify(data));
    next.paragraphs.splice(i, 1);
    onChange(next);
  };

  return (
    <div className="ce-fields">
      <Field label="Profile Name" value={data.profile.name} onChange={v => set("profile.name", v)} />
      <Field label="Profile Role" value={data.profile.role} onChange={v => set("profile.role", v)} />
      <Field label="Profile Username" value={data.profile.username} onChange={v => set("profile.username", v)} />
      <Field label="Profile Image URL" value={data.profile.imageSrc} onChange={v => set("profile.imageSrc", v)} />
      <div className="ce-section-label">Paragraphs</div>
      {data.paragraphs.map((p, i) => (
        <div key={i} className="ce-para-row">
          <textarea
            className="ce-input ce-textarea"
            value={p}
            rows={3}
            onChange={e => setParagraph(i, e.target.value)}
          />
          <button className="ce-remove-btn" onClick={() => removeParagraph(i)} title="Remove paragraph">×</button>
        </div>
      ))}
      <button className="ce-add-btn" onClick={addParagraph}>+ Add paragraph</button>
    </div>
  );
}

function ContactEditor({ data, onChange }: {
  data: (typeof examplePages)["Contact"][Locale];
  onChange: (d: typeof data) => void;
}) {
  const set = (path: string, val: string) => {
    const next = JSON.parse(JSON.stringify(data));
    const keys = path.split(".");
    let obj: any = next;
    for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
    obj[keys[keys.length - 1]] = val;
    onChange(next);
  };

  return (
    <div className="ce-fields">
      <Field label="Section Title" value={data.contactMeta.title} onChange={v => set("contactMeta.title", v)} />
      <Field label="Email" value={data.contactMeta.email} onChange={v => set("contactMeta.email", v)} />
      <Field label="Thank You Message" value={data.thankYouMessage} onChange={v => set("thankYouMessage", v)} multiline />
      <div className="ce-section-label">Form Labels</div>
      <Field label="Name Label" value={data.formFields.name.label} onChange={v => set("formFields.name.label", v)} />
      <Field label="Name Placeholder" value={data.formFields.name.placeholder} onChange={v => set("formFields.name.placeholder", v)} />
      <Field label="Email Label" value={data.formFields.email.label} onChange={v => set("formFields.email.label", v)} />
      <Field label="Message Label" value={data.formFields.message.label} onChange={v => set("formFields.message.label", v)} />
      <Field label="Message Placeholder" value={data.formFields.message.placeholder} onChange={v => set("formFields.message.placeholder", v)} multiline />
      <Field label="Submit Button" value={data.formFields.submitButton} onChange={v => set("formFields.submitButton", v)} />
    </div>
  );
}

function FooterEditor({ data, onChange }: {
  data: (typeof examplePages)["Footer"][Locale];
  onChange: (d: typeof data) => void;
}) {
  const set = (path: string, val: string) => {
    const next = JSON.parse(JSON.stringify(data));
    const keys = path.split(".");
    let obj: any = next;
    for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
    obj[keys[keys.length - 1]] = val;
    onChange(next);
  };
  const legacyFooter = data as typeof data & { footerDynamicText?: string; privacyPolicy?: string };

  return (
    <div className="ce-fields">
      <Field label="Footer Text" value={data.footerText} onChange={v => set("footerText", v)} />
      <Field label="Footer Version / Dynamic Text" value={legacyFooter.footerDynamicText ?? ""} onChange={v => set("footerDynamicText", v)} />
      <Field label="Contact Email" value={legacyFooter.privacyPolicy ?? ""} onChange={v => set("privacyPolicy", v)} />
      <div className="ce-section-label">Social Links (shared across locales)</div>
      <Field label="GitHub URL" value={data.links.github} onChange={v => set("links.github", v)} />
      <Field label="LinkedIn URL" value={data.links.linkedIn} onChange={v => set("links.linkedIn", v)} />
      <Field label="Instagram URL" value={data.links.instagram} onChange={v => set("links.instagram", v)} />
    </div>
  );
}

function HeaderEditor({ data, onChange }: {
  data: (typeof examplePages)["Header"][Locale];
  onChange: (d: typeof data) => void;
}) {
  const set = (path: string, val: string) => {
    const next = JSON.parse(JSON.stringify(data));
    const keys = path.split(".");
    let obj: any = next;
    for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
    obj[keys[keys.length - 1]] = val;
    onChange(next);
  };

  return (
    <div className="ce-fields">
      <div className="ce-section-label">Navigation Labels</div>
      <Field label="About" value={data.navItems.about} onChange={v => set("navItems.about", v)} />
      <Field label="Projects" value={data.navItems.projects} onChange={v => set("navItems.projects", v)} />
      <Field label="Contact" value={data.navItems.contact} onChange={v => set("navItems.contact", v)} />
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ContentEditor() {
  const [data, setData] = useState<ContentData>(loadDraft);
  const [section, setSection] = useState<Section>("Hero");
  const [locale, setLocale] = useState<Locale>("en-us");
  const [exported, setExported] = useState(false);

  // Autosave to localStorage on every change
  useEffect(() => { saveDraft(data); }, [data]);

  const updateSection = <S extends Section>(sec: S, loc: Locale, value: ContentData[S][typeof loc]) => {
    setData(prev => ({
      ...prev,
      [sec]: { ...prev[sec], [loc]: value },
    }));
  };

  const handleExport = () => {
    exportStaticJson(data as unknown as Record<string, Record<string, unknown>>, "static-data.json");
    setExported(true);
    setTimeout(() => setExported(false), 2500);
  };

  const handleReset = () => {
    if (!confirm("Reset all fields to the default fixture values? This will clear your draft.")) return;
    const defaults = getDefaults();
    setData(defaults);
    localStorage.removeItem(LS_KEY);
  };

  return (
    <div className="ce fadeIn">
      <header className="container ce-head">
        <div>
          <span className="eyebrow">Admin · Static content</span>
          <h1 className="section-title">
            <span className="gradient-text">Content Editor</span>
          </h1>
          <p className="section-subtitle">
            Edit page content in all three languages. Export the JSON, then upload it to GitHub.
          </p>
        </div>

        <div className="ce-actions">
          <button className="ce-btn ce-btn--ghost" onClick={handleReset}>
            <FiRotateCcw /> Reset defaults
          </button>
          <button className="ce-btn ce-btn--primary" onClick={handleExport}>
            {exported ? <><FiCheck /> Exported!</> : <><FiDownload /> Export static-data.json</>}
          </button>
        </div>
      </header>

      {/* How-to banner */}
      <div className="container">
        <div className="ce-banner glass">
          <FiInfo className="ce-banner-icon" />
          <div>
            <strong>How to publish your changes</strong>
            <ol className="ce-banner-steps">
              <li>Edit fields below and click <em>Export static-data.json</em></li>
              <li>Open <a href="https://github.com/TylorDev/Tylordev" target="_blank" rel="noreferrer"><FiGithub /> github.com/TylorDev/Tylordev</a></li>
              <li>Upload the file to the root of the <code>main</code> branch (Add file → Upload files)</li>
              <li>Wait ~5 minutes for GitHub CDN to refresh — all visitors will see the new content</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Section tabs */}
      <div className="container ce-section-tabs">
        {SECTIONS.map(s => (
          <button
            key={s.key}
            className={`ce-tab ${section === s.key ? "active" : ""}`}
            onClick={() => setSection(s.key)}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Locale tabs */}
      <div className="container ce-locale-tabs">
        {LOCALES.map(l => (
          <button
            key={l.key}
            className={`ce-loc ${locale === l.key ? "active" : ""}`}
            onClick={() => setLocale(l.key)}
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* Editor panel */}
      <div className="container ce-panel glass">
        {section === "Hero" && (
          <HeroEditor
            data={data.Hero[locale]}
            onChange={v => updateSection("Hero", locale, v)}
          />
        )}
        {section === "About" && (
          <AboutEditor
            data={data.About[locale]}
            onChange={v => updateSection("About", locale, v)}
          />
        )}
        {section === "Contact" && (
          <ContactEditor
            data={data.Contact[locale]}
            onChange={v => updateSection("Contact", locale, v)}
          />
        )}
        {section === "Footer" && (
          <FooterEditor
            data={data.Footer[locale]}
            onChange={v => updateSection("Footer", locale, v)}
          />
        )}
        {section === "Header" && (
          <HeaderEditor
            data={data.Header[locale]}
            onChange={v => updateSection("Header", locale, v)}
          />
        )}
      </div>
    </div>
  );
}
