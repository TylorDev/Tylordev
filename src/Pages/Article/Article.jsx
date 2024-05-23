import "./Article.scss";
import Research from "./../Research/Research";

function Article() {
  return (
    <div className="Article">
      <div className="ar-banner">
        <img
          src="https://i.pinimg.com/originals/b0/ad/d9/b0add980ccef7ad58b45689d7d4c8125.jpg"
          alt=""
        />
      </div>
      <div className="ar-content">
        <div className="ar-tittle">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit.Saepe,
          assumenda
        </div>
        <p className="ar-paragraf">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Saepe,
          assumenda incidunt similique aperiam natus, dolor sapiente odio,
          labore culpa excepturi hic! Ipsum dignissimos provident quos ex eum et
          mollitia impedit! Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Facilis eum aut libero repudiandae distinctio, consectetur
          explicabo impedit aperiam incidunt nobis sequi, adipisci voluptas
          blanditiis fuga! Consequatur atque qui dolore eaque. Lorem, ipsum
          dolor sit amet consectetur adipisicing elit. Inventore, dolorem.
          Repudiandae, perferendis? Ab voluptates facilis expedita asperiores
          ipsa, recusandae unde veritatis, vitae odio ea magni modi, quisquam
          dignissimos quos ex. Lorem, ipsum dolor sit amet consectetur
          adipisicing elit. Saepe, assumenda incidunt similique aperiam natus,
          dolor sapiente odio, labore culpa excepturi hic! Ipsum dignissimos
          provident quos ex eum et mollitia impedit! Lorem ipsum dolor sit amet
          consectetur adipisicing elit. Facilis eum aut libero repudiandae
          distinctio, consectetur explicabo impedit aperiam incidunt nobis
          sequi, adipisci voluptas blanditiis fuga! Consequatur atque qui dolore
          eaque. Lorem, ipsum dolor sit amet consectetur adipisicing elit.
          Inventore, dolorem. Repudiandae, perferendis? Ab voluptates facilis
          expedita asperiores ipsa, recusandae unde veritatis, vitae odio ea
          magni modi, quisquam dignissimos quos ex. Lorem, ipsum dolor sit amet
          consectetur adipisicing elit. Saepe, assumenda incidunt similique
          aperiam natus, dolor sapiente odio, labore culpa excepturi hic! Ipsum
          dignissimos provident quos ex eum et mollitia impedit! Lorem ipsum
          dolor sit amet consectetur adipisicing elit. Facilis eum aut libero
          repudiandae distinctio, consectetur explicabo impedit aperiam incidunt
          nobis sequi, adipisci voluptas blanditiis fuga! Consequatur atque qui
          dolore eaque. Lorem, ipsum dolor sit amet consectetur adipisicing
          elit. Inventore, dolorem. Repudiandae, perferendis? Ab voluptates
          facilis expedita asperiores ipsa, recusandae unde veritatis, vitae
          odio ea magni modi, quisquam dignissimos quos ex.
        </p>

        <div className="ar-img">
          <img
            src="https://i.pinimg.com/564x/a4/90/88/a4908806e02d3be2c4a526e4c0a09213.jpg"
            alt=""
          />
        </div>

        <p className="ar-paragraf">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Saepe,
          assumenda incidunt similique aperiam natus, dolor sapiente odio,
          labore culpa excepturi hic! Ipsum dignissimos provident quos ex eum et
          mollitia impedit! Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Facilis eum aut libero repudiandae distinctio, consectetur
          explicabo impedit aperiam incidunt nobis sequi, adipisci voluptas
          blanditiis fuga! Consequatur atque qui dolore eaque. Lorem, ipsum
          dolor sit amet consectetur adipisicing elit. Inventore, dolorem.
          Repudiandae, perferendis? Ab voluptates facilis expedita asperiores
          ipsa, recusandae unde veritatis, vitae odio ea magni modi, quisquam
          dignissimos quos ex. Lorem, ipsum dolor sit amet consectetur
          adipisicing elit. Saepe, assumenda incidunt similique aperiam natus,
          dolor sapiente odio, labore culpa excepturi hic! Ipsum dignissimos
          provident quos ex eum et mollitia impedit! Lorem ipsum dolor sit amet
          consectetur adipisicing elit. Facilis eum aut libero repudiandae
          distinctio, consectetur explicabo impedit aperiam incidunt nobis
          sequi, adipisci voluptas blanditiis fuga! Consequatur atque qui dolore
          eaque. Lorem, ipsum dolor sit amet consectetur adipisicing elit.
          Inventore, dolorem. Repudiandae, perferendis? Ab voluptates facilis
          expedita asperiores ipsa, recusandae unde veritatis, vitae odio ea
          magni modi, quisquam dignissimos quos ex. Lorem, ipsum dolor sit amet
          consectetur adipisicing elit. Saepe, assumenda incidunt similique
          aperiam natus, dolor sapiente odio, labore culpa excepturi hic! Ipsum
          dignissimos provident quos ex eum et mollitia impedit! Lorem ipsum
          dolor sit amet consectetur adipisicing elit. Facilis eum aut libero
          repudiandae distinctio, consectetur explicabo impedit aperiam incidunt
          nobis sequi, adipisci voluptas blanditiis fuga! Consequatur atque qui
          dolore eaque. Lorem, ipsum dolor sit amet consectetur adipisicing
          elit. Inventore, dolorem. Repudiandae, perferendis? Ab voluptates
          facilis expedita asperiores ipsa, recusandae unde veritatis, vitae
          odio ea magni modi, quisquam dignissimos quos ex.
        </p>
        <div className="ar-img">
          <img
            src="https://i.pinimg.com/736x/0d/5d/71/0d5d716fa63c699c712d390aeeaa528b.jpg"
            alt=""
          />
        </div>
      </div>
      <Research
        tittle={false}
        limit={true}
        style={{ borderTop: "2px solid white", borderBottom: "none" }}
      />
    </div>
  );
}
export default Article;
