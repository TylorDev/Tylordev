import { Grid } from "./Grid";

export function DragComponent({
  dragBoxAreaRef,
  position,
  handleMouseDown,
  dragging,
}) {
  return (
    <div
      ref={dragBoxAreaRef}
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
