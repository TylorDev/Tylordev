import "./Grid.scss";
import LocalObject from "./LocalObject";

function Grid() {
  const images = [
    "https://i.pinimg.com/564x/ce/72/49/ce7249d5518114c2052e0ac7c2b7be33.jpg",
    "https://i.pinimg.com/564x/ae/c2/81/aec2810c31ad926ed58e98409ce5b457.jpg",
    "https://i.pinimg.com/736x/22/13/70/221370197a312d51a9d0e6ad9d3542f6.jpg",
    "https://i.pinimg.com/564x/4d/fd/20/4dfd20846d14c9076e8c1905a81b7bc4.jpg",
    "https://i.pinimg.com/originals/41/83/54/4183547526a27e7afa355138a496ab6d.jpg",
    "https://i.pinimg.com/736x/a0/6b/2b/a06b2b78f51e03162f75df17f68df467.jpg",
    "https://i.pinimg.com/564x/53/6f/a1/536fa18ecac47dcc0aa94b3f5c8927c8.jpg",
    "https://i.pinimg.com/564x/6a/9d/55/6a9d55d309e076079f2e928b7499c3b1.jpg",
    "https://i.pinimg.com/736x/de/26/4c/de264cc538aa261e25572f6249ebdaad.jpg",
    "https://i.pinimg.com/564x/76/78/de/7678de2ecf246fa7e92e331bd21dd92c.jpg",
    "https://i.pinimg.com/564x/d5/ea/d3/d5ead30d8c0b581bd5ebcac2df847fe2.jpg",
    "https://i.pinimg.com/564x/df/2d/f1/df2df17f6a435ef8e98b92151fc825af.jpg",
    "https://i.pinimg.com/564x/1a/f1/ff/1af1ff00cbf0e6ac5cf19844602db582.jpg",
    "https://i.pinimg.com/736x/06/d5/55/06d555382436fbf791cbb293122639a8.jpg",
    "https://i.pinimg.com/564x/97/0f/0c/970f0caa089b4a185b19e954b96b71c5.jpg",
  ];

  const imageElements = images.map((imageUrl, index) => (
    <LocalObject key={index}>
      <div>
        <img
          style={{ width: "100%", aspectRatio: "9/12" }}
          src={imageUrl}
          alt=""
        />
      </div>
    </LocalObject>
  ));
  return <div className="Grid">{imageElements}</div>;
}
export default Grid;
