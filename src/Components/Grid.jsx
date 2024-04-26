import LocalObject from "./LocalObject";
import jsonData from "./../API/imagenes.json";

// eslint-disable-next-line react/prop-types
export function Grid({ index, dragging }) {
  const { images } = jsonData.props.pageProps;

  return (
    <div key={index} className={`Example `}>
      {images.slice(0, 30).map((image, i) => (
        <LocalObject key={i} isDragging={dragging}>
          <div
            className={`image-ex ${
              i + 1 === 25 || i + 1 === 26 ? "center" : ""
            }`}
          >
            <img src={image.srcSet.original} alt={image.title} />
          </div>
        </LocalObject>
      ))}
    </div>
  );
}
