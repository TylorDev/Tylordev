import type { ReactNode } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import "./EditorFields.scss";

export function Field({ label, children, required }: { label: string; children: ReactNode; required?: boolean }) {
  return (
    <label className="edf-field">
      <span>
        {label}
        {required && <span className="edf-required">*</span>}
      </span>
      {children}
    </label>
  );
}

export function Row({ children }: { children: ReactNode }) {
  return <div className="edf-fieldrow">{children}</div>;
}

export function Divider({ label }: { label: string }) {
  return (
    <div className="edf-divider">
      <span className="eyebrow">{label}</span>
    </div>
  );
}

export function Repeatable({
  label,
  count,
  onAdd,
  children,
}: {
  label: string;
  count: number;
  onAdd: () => void;
  children: ReactNode;
}) {
  return (
    <section className="edf-repeatable">
      <header>
        <h4>
          {label} <span className="edf-count">{count}</span>
        </h4>
        <button type="button" className="edf-chip" onClick={onAdd}>
          <FiPlus /> Add
        </button>
      </header>
      <div className="edf-repeatable-body">{children}</div>
    </section>
  );
}

export function RepeatableItem({
  index,
  onRemove,
  children,
}: {
  index: number;
  onRemove: () => void;
  children: ReactNode;
}) {
  return (
    <div className="edf-rep-item">
      <div className="edf-rep-head">
        <span className="edf-rep-index">#{index + 1}</span>
        <button className="edf-iconbtn danger" onClick={onRemove} aria-label="Remove">
          <FiTrash2 />
        </button>
      </div>
      <div className="edf-rep-fields">{children}</div>
    </div>
  );
}
