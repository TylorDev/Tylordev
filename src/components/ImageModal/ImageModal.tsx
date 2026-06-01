import type React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { FiX, FiDownload, FiZoomIn, FiZoomOut } from "react-icons/fi";
import "./ImageModal.scss";

const MIN_ZOOM  = 0.5;
const MAX_ZOOM  = 5;
const ZOOM_DBL  = 2.5;
const ZOOM_EPSILON = 0.05;

interface ImageModalProps {
  src: string;
  alt?: string;
  onClose: () => void;
}

function ImageModal({ src, alt, onClose }: ImageModalProps) {
  const [zoom, setZoom]         = useState(1);
  const [pan,  setPan]          = useState({ x: 0, y: 0 });
  const [isDragging, setDrag]   = useState(false);

  const stageRef    = useRef<HTMLDivElement>(null);
  const imgRef      = useRef<HTMLImageElement>(null);
  const activePointers = useRef(new Map<number, { x: number; y: number }>());
  const gestureStart = useRef<
    | { type: "pan"; pointerId: number; x: number; y: number; pan: { x: number; y: number } }
    | {
        type: "pinch";
        distance: number;
        center: { x: number; y: number };
        zoom: number;
        pan: { x: number; y: number };
      }
    | null
  >(null);
  // Store image rendered size at zoom=1 so clamping is accurate
  const imgBaseSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });

  const constrainZoom = (value: number) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, value));

  const onImgLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    imgBaseSize.current = { w: img.offsetWidth, h: img.offsetHeight };

    // Compute initial zoom so the image fills 90% of viewport height,
    // but never exceeds 92% of viewport width.
    const targetH  = window.innerHeight * 0.9;
    const targetW  = window.innerWidth  * 0.92;
    const zoomByH  = targetH / img.naturalHeight;
    const zoomByW  = targetW / img.naturalWidth;
    const initZoom = constrainZoom(Math.min(zoomByH, zoomByW));
    setZoom(initZoom);
  };

  // ── Clamping based on actual image size, not stage size ──────────────────
  const clampPan = useCallback((x: number, y: number, z: number) => {
    const stage = stageRef.current;
    if (!stage) return { x, y };
    const { width: sw, height: sh } = stage.getBoundingClientRect();
    const iw = imgBaseSize.current.w * z;
    const ih = imgBaseSize.current.h * z;
    // How far we can pan: half of the overflow past the stage edge
    const maxX = Math.max(0, (iw - sw) / 2);
    const maxY = Math.max(0, (ih - sh) / 2);
    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    };
  }, []);

  const getStagePoint = useCallback((x: number, y: number) => {
    const stage = stageRef.current;
    if (!stage) return { x: 0, y: 0 };
    const { left, top, width, height } = stage.getBoundingClientRect();
    return {
      x: x - left - width / 2,
      y: y - top - height / 2,
    };
  }, []);

  const getPointerPair = useCallback(() => {
    const [first, second] = Array.from(activePointers.current.values());
    if (!first || !second) return null;

    const dx = second.x - first.x;
    const dy = second.y - first.y;
    return {
      distance: Math.hypot(dx, dy),
      center: getStagePoint((first.x + second.x) / 2, (first.y + second.y) / 2),
    };
  }, [getStagePoint]);

  const resetGesture = useCallback(() => {
    activePointers.current.clear();
    gestureStart.current = null;
    setDrag(false);
  }, []);

  // ── ESC + scroll lock ─────────────────────────────────────────────────────
  useEffect(() => {
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = orig;
      document.removeEventListener("keydown", onKey);
      resetGesture();
    };
  }, [onClose, resetGesture]);

  // ── Apply zoom helper (button clicks) ─────────────────────────────────────
  const applyZoom = (next: number) => {
    const z = constrainZoom(next);
    if (z <= MIN_ZOOM) { setZoom(MIN_ZOOM); setPan({ x: 0, y: 0 }); return; }
    setZoom(z);
    setPan(p => clampPan(p.x, p.y, z));
  };

  // ── Wheel zoom — always zooms to stage center to avoid image escaping ─────
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 1.12 : 1 / 1.12; // multiplicative step
    setZoom(prev => {
      const next = constrainZoom(prev * delta);
      if (next <= MIN_ZOOM) { setPan({ x: 0, y: 0 }); return MIN_ZOOM; }
      setPan(p => clampPan(p.x, p.y, next));
      return next;
    });
  }, [clampPan]);

  // ── Double-click: toggle zoom at click point ───────────────────────────────
  const handleDblClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const stage = stageRef.current;
    if (!stage) return;
    const { left, top, width: sw, height: sh } = stage.getBoundingClientRect();
    const cx = e.clientX - left - sw / 2;
    const cy = e.clientY - top  - sh / 2;
    setZoom(prev => {
      const next = prev > MIN_ZOOM + ZOOM_EPSILON ? MIN_ZOOM : ZOOM_DBL;
      if (next === MIN_ZOOM) { setPan({ x: 0, y: 0 }); return MIN_ZOOM; }
      const scale = next / prev;
      setPan(p => clampPan(
        p.x * scale + cx * (1 - scale),
        p.y * scale + cy * (1 - scale),
        next,
      ));
      return next;
    });
  }, [clampPan]);

  // ── Drag-to-pan ───────────────────────────────────────────────────────────
  const startPanGesture = useCallback((pointerId: number, point: { x: number; y: number }) => {
    if (zoom <= MIN_ZOOM + ZOOM_EPSILON) {
      gestureStart.current = null;
      setDrag(false);
      return;
    }

    gestureStart.current = { type: "pan", pointerId, x: point.x, y: point.y, pan };
    setDrag(true);
  }, [zoom, pan]);

  const startPinchGesture = useCallback(() => {
    const pair = getPointerPair();
    if (!pair || pair.distance <= 0) return;

    gestureStart.current = {
      type: "pinch",
      distance: pair.distance,
      center: pair.center,
      zoom,
      pan,
    };
    setDrag(true);
  }, [getPointerPair, zoom, pan]);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;

    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);

    activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (activePointers.current.size >= 2) {
      startPinchGesture();
      return;
    }

    startPanGesture(e.pointerId, { x: e.clientX, y: e.clientY });
  }, [startPanGesture, startPinchGesture]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!activePointers.current.has(e.pointerId)) return;

    e.preventDefault();
    e.stopPropagation();
    activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    const gesture = gestureStart.current;
    if (!gesture) return;

    if (activePointers.current.size >= 2) {
      if (gesture.type !== "pinch") {
        startPinchGesture();
        return;
      }

      const pair = getPointerPair();
      if (!pair || pair.distance <= 0) return;

      const nextZoom = constrainZoom(gesture.zoom * (pair.distance / gesture.distance));
      if (nextZoom <= MIN_ZOOM) {
        setZoom(MIN_ZOOM);
        setPan({ x: 0, y: 0 });
        return;
      }

      const scale = nextZoom / gesture.zoom;
      setZoom(nextZoom);
      setPan(clampPan(
        pair.center.x - (gesture.center.x - gesture.pan.x) * scale,
        pair.center.y - (gesture.center.y - gesture.pan.y) * scale,
        nextZoom,
      ));
      return;
    }

    if (gesture.type !== "pan" || gesture.pointerId !== e.pointerId) return;

    const dx = e.clientX - gesture.x;
    const dy = e.clientY - gesture.y;
    setPan(clampPan(gesture.pan.x + dx, gesture.pan.y + dy, zoom));
  }, [clampPan, getPointerPair, startPinchGesture, zoom]);

  const handlePointerEnd = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    activePointers.current.delete(e.pointerId);

    if (activePointers.current.size >= 2) {
      startPinchGesture();
      return;
    }

    const [remaining] = Array.from(activePointers.current.entries());
    if (remaining) {
      const [pointerId, point] = remaining;
      startPanGesture(pointerId, point);
      return;
    }

    gestureStart.current = null;
    setDrag(false);
  }, [startPanGesture, startPinchGesture]);

  // ── Download ──────────────────────────────────────────────────────────────
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const a = document.createElement("a");
    a.href = src;
    a.download = alt || "image";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const transform = `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`;
  const isZoomed  = zoom > MIN_ZOOM + ZOOM_EPSILON;

  const modal = (
    <div className="img-modal-overlay" onClick={onClose}>

      {/* ── Controls ── */}
      <div className="img-modal-controls" onClick={e => e.stopPropagation()}>
        <button className="img-ctrl-btn" onClick={e => { e.stopPropagation(); applyZoom(zoom + 0.5); }} title="Zoom in">
          <FiZoomIn size={18} />
        </button>
        <button className="img-ctrl-btn" onClick={e => { e.stopPropagation(); applyZoom(zoom - 0.5); }} title="Zoom out">
          <FiZoomOut size={18} />
        </button>
        <button className="img-ctrl-btn" onClick={handleDownload} title="Download">
          <FiDownload size={18} />
        </button>
        <button className="img-ctrl-btn img-ctrl-btn--close" onClick={e => { e.stopPropagation(); onClose(); }} title="Close">
          <FiX size={18} />
        </button>
      </div>

      {/* ── Zoom slider — visible when image fills the screen ── */}
      {isZoomed && (
        <div className="img-modal-slider-wrap" onClick={e => e.stopPropagation()}>
          <FiZoomOut size={14} />
          <input
            type="range"
            className="img-modal-slider"
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            step={0.05}
            value={zoom}
            onChange={e => applyZoom(Number(e.target.value))}
          />
          <FiZoomIn size={14} />
          <span className="img-modal-zoom-label">{Math.round(zoom * 100)}%</span>
        </div>
      )}

      {/* ── Stage ── */}
      <div
        ref={stageRef}
        className={`img-modal-stage ${isDragging ? "is-dragging" : ""}`}
        onClick={e => e.stopPropagation()}
        onDoubleClick={handleDblClick}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onLostPointerCapture={handlePointerEnd}
        style={{ cursor: isZoomed ? (isDragging ? "grabbing" : "grab") : "zoom-in" }}
      >
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className="img-modal-img"
          draggable={false}
          decoding="async"
          onLoad={onImgLoad}
          style={{ transform, transition: isDragging ? "none" : "transform 0.18s cubic-bezier(0.4,0,0.2,1)" }}
        />
      </div>

      {/* ── Hint ── */}
      {!isZoomed && (
        <div className="img-modal-hint">Double-click, scroll, or pinch to zoom</div>
      )}
    </div>
  );

  return createPortal(modal, document.body);
}

// ─── ArticleImage trigger ─────────────────────────────────────────────────────

interface ArticleImageProps {
  src: string;
  alt?: string;
}

export default function ArticleImage({ src, alt }: ArticleImageProps) {
  const [open, setOpen] = useState(false);
  const modalHistoryActive = useRef(false);

  const openModal = useCallback(() => {
    if (!modalHistoryActive.current) {
      window.history.pushState({ imageModal: true }, "", window.location.href);
      modalHistoryActive.current = true;
    }
    setOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);

    if (modalHistoryActive.current) {
      modalHistoryActive.current = false;
      window.history.back();
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      if (!modalHistoryActive.current) return;

      modalHistoryActive.current = false;
      setOpen(false);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <>
      <img
        src={src}
        alt={alt}
        className="article-img-trigger"
        onClick={openModal}
        loading="lazy"
        decoding="async"
        title="Click to enlarge"
        style={{
          "--img-accent": "#2e2e34",
          "--img-accent-rgb": "46, 46, 52",
        } as React.CSSProperties}
      />
      {open && <ImageModal src={src} alt={alt} onClose={closeModal} />}
    </>
  );
}

export { ImageModal };
