import { useRef, useState, useEffect } from "react";
import { Grid } from "./Grid";

export function DragComponent({
  AreaRef,
  position,
  handleMouseDown,
  dragging,
}) {
  return (
    <div
      ref={AreaRef}
      className="BOX"
      style={{
        left: `${position.x}px`,

        top: `${position.y}px`,

        position: "absolute",
        userSelect: "none",
      }}
      onMouseDown={handleMouseDown}
    >
      {<Grid dragging={dragging} />}
    </div>
  );
}
