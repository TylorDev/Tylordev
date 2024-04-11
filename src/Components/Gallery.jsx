import { useState } from "react";
import Draggable from "react-draggable";
import Slider from "react-slick";
import "./Gallery.scss";
const Gallery = ({ images }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "0",
    beforeChange: (current, next) => setCurrentSlide(next),
  };

  return (
    <Draggable axis="x" bounds="parent">
      <div className="gallery-container">
        <Slider {...settings}>
          {images.map((image, index) => (
            <div
              key={index}
              className={index === currentSlide ? "slide active" : "slide"}
            >
              <img src={image} alt={`Image ${index}`} />
            </div>
          ))}
        </Slider>
      </div>
    </Draggable>
  );
};

export default Gallery;
