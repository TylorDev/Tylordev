import LocalObject from "./LocalObject";

// eslint-disable-next-line react/prop-types
export function Grid({ index, dragging }) {
  return (
    <div key={index} className={`Example `}>
      {Array.from({ length: 50 }, (_, index) => (
        <LocalObject key={index} isDragging={dragging}>
          <div
            className={`image-ex ${
              index + 1 == 25 || index + 1 == 26 ? "center" : ""
            }`}
          >
            <img
              src={`https://via.placeholder.com/150?text=Image${index + 1}`}
              alt=""
            />
          </div>
        </LocalObject>
      ))}
    </div>
  );
}
