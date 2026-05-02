import type React from "react"
import { useRef, useEffect } from "react"
import "./LiquidMetalContainer.scss"

// ─── Shader defaults ────────────────────────────────────────────────────────

const DEFAULT_SHADER_OPTIONS = {
  u_repetition: 4,
  u_softness: 0.5,
  u_shiftRed: 0.3,
  u_shiftBlue: 0.3,
  u_distortion: 0,
  u_contour: 0,
  u_angle: 45,
  u_scale: 8,
  u_shape: 1,
  u_offsetX: 0.1,
  u_offsetY: -0.1,
}

// ─── Internal shader surface ─────────────────────────────────────────────────
// The ShaderMount library:
//  1. Creates a <canvas> and prepends it to the parentElement.
//  2. Injects its own CSS: canvas { contain: strict; width: 100%; height: 100%; }
//  3. Uses a ResizeObserver on parentElement to set canvas.width / canvas.height.
//
// Fix: the parentElement (shaderRef div) MUST have explicit pixel dimensions at
// mount time. We set width/height 100% via inline style so the ResizeObserver
// always gets a real size. We do NOT override the canvas CSS — let the library
// handle it.

interface LiquidMetalShaderSurfaceProps {
  speed?: number
  width?: string
  height?: string
}

function LiquidMetalShaderSurface({
  speed = 0.6,
  width = "100%",
  height = "100%",
}: LiquidMetalShaderSurfaceProps) {
  const shaderRef = useRef<HTMLDivElement>(null)
  const shaderMount = useRef<any>(null)

  useEffect(() => {
    const mount = async () => {
      try {
        // @ts-ignore — untyped dynamic import
        const { liquidMetalFragmentShader, ShaderMount } = await import("@paper-design/shaders")

        if (!shaderRef.current) return

        // Destroy any previous instance
        shaderMount.current?.destroy?.()

        shaderMount.current = new ShaderMount(
          shaderRef.current,
          liquidMetalFragmentShader,
          DEFAULT_SHADER_OPTIONS,
          undefined, // webGlContextAttributes
          speed,
        )
      } catch (err) {
        console.error("[LiquidMetalContainer] Failed to load shader:", err)
      }
    }

    mount()

    return () => {
      shaderMount.current?.destroy?.()
      shaderMount.current = null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    shaderMount.current?.setSpeed?.(speed)
  }, [speed])

  return (
    // This div is the parentElement that ShaderMount observes.
    // Explicit width/height ensures ResizeObserver reads real dimensions.
    <div
      ref={shaderRef}
      style={{ display: "block", width, height }}
    />
  )
}

// ─── Public: LiquidMetalDivider ─────────────────────────────────────────────

interface LiquidMetalDividerProps {
  height?: number
  speed?: number
  className?: string
}

export function LiquidMetalDivider({
  height = 5,
  speed = 0.6,
  className = "",
}: LiquidMetalDividerProps) {
  return (
    <div
      className={`liquid-metal-divider ${className}`}
      style={{ "--lmd-height": `${height}px` } as React.CSSProperties}
    >
      <LiquidMetalShaderSurface speed={speed} width="100%" height="100%" />
    </div>
  )
}

