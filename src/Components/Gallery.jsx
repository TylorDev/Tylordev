import { useContext } from "react";
import "./Gallery.scss";
import { DragContext } from "./DragContext";
import { DragComponent } from "./DragComponent";

function Gallery() {
  const { dragBoxAreaRef, position, handleMouseDown, dragging } =
    useContext(DragContext);

  return (
    <div className="Gallery">
      <DragComponent
        dragBoxAreaRef={dragBoxAreaRef}
        position={position}
        handleMouseDown={handleMouseDown}
        dragging={dragging}
      />
      ;
    </div>
  );
}
export default Gallery;
