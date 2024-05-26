import { Link } from "react-router-dom";
import "./About.scss";
import { GoArrowDownLeft, GoArrowLeft, GoArrowRight } from "react-icons/go";
import { useEffect, useState } from "react";
import profile from "./Profile.json";
import blog from "./BlogEntries.json";
import content from "./historyContent.json";
function About() {
  return (
    <div className="About">
      <BlogCont />
      <ProfileCont />
      <History />
    </div>
  );
}
export default About;

function History() {
  const data = content.History;
  const [Latest, setLatest] = useState([]);

  useEffect(() => {
    async function fetchData() {
      // Importar todos los archivos JSON en la carpeta `src/API/Projects`
      const jsonFiles = import.meta.glob("/src/API/Projects/*.json");

      // Array para almacenar los datos de los proyectos
      const projectData = [];

      // Iterar sobre los archivos y obtener sus nombres y contenido
      for (const path in jsonFiles) {
        const module = await jsonFiles[path]();
        projectData.push({
          path,
          data: module.default,
        });
      }

      // Actualizar el estado con los datos de los proyectos
      setLatest(projectData);
    }

    fetchData();
  }, []);

  const latest = Latest.map((article) => article.data);

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split("/").map(Number);
    return new Date(year + 2000, month - 1, day); // Asume fechas en el formato DD/MM/YY
  };

  // Ordenar los datos por fecha de más reciente a más antiguo
  const sortedLatest = latest.sort(
    (a, b) => parseDate(b.data.date) - parseDate(a.data.date)
  );

  const topLatest = sortedLatest.slice(0, 2);
  return (
    <div className="history">
      <div className="imagen">
        <img src={data.imageSrc} alt="history-image" />
      </div>

      <div className="latest">
        <div className="item">
          <div className="header-cont">
            <span>{data.latest[0].header.section}</span>{" "}
            {data.latest[0].header.title}
          </div>
          <div className="header-tit">{data.latest[0].headerTitle}</div>
        </div>
        {topLatest.map((item, index) => (
          <Link
            key={index}
            className="item"
            to={`/projects/${item.header.title}`}
          >
            <div>
              {item.data.status} {item.data.date}
            </div>
            <div className="item-tittle">{item.header.title}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ProfileCont() {
  const [index, setIndex] = useState(0);
  const [data, setData] = useState(null);

  useEffect(() => {
    // Simulating fetching data from JSON file
    setData(profile);
  }, []);

  const handlePrev = () => {
    setIndex((prevIndex) =>
      prevIndex === 0 ? data.paragraphs.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setIndex((prevIndex) =>
      prevIndex === data.paragraphs.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-cont">
      <div className="header-cont">
        <span>{data.header.section}</span> {data.header.title}
      </div>
      <div className="profile">
        <div className="sec-1">
          <div className="profile-pic">
            <img src={data.profile.imageSrc} alt="profilepic" />
          </div>
          <div>
            <div>{data.profile.name}</div>
            <div>{data.profile.role}</div>
            <div>{data.profile.username}</div>
            <button onClick={handlePrev}>
              <GoArrowLeft />
            </button>
            <button onClick={handleNext}>
              <GoArrowRight />
            </button>
          </div>
        </div>
        <div className="profile-content">
          <p>{data.paragraphs[index]}</p>
        </div>
      </div>
    </div>
  );
}

function BlogCont() {
  const data = blog;
  const [blogLatest, setBloglatest] = useState([]);

  useEffect(() => {
    async function fetchData() {
      // Importar todos los archivos JSON en la carpeta `src/API/Projects`
      const jsonFiles = import.meta.glob("/src/API/Articles/*.json");

      // Array para almacenar los datos de los proyectos
      const projectData = [];

      // Iterar sobre los archivos y obtener sus nombres y contenido
      for (const path in jsonFiles) {
        const module = await jsonFiles[path]();
        projectData.push({
          path,
          data: module.default,
        });
      }

      // Actualizar el estado con los datos de los proyectos
      setBloglatest(projectData);
    }

    fetchData();
  }, []);

  const latest = blogLatest.map((article) => article.data);

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split("/").map(Number);
    return new Date(year + 2000, month - 1, day); // Asume fechas en el formato DD/MM/YY
  };

  // Ordenar los datos por fecha de más reciente a más antiguo
  const sortedLatest = latest.sort(
    (a, b) => parseDate(b.data.date) - parseDate(a.data.date)
  );

  const topLatest = sortedLatest.slice(0, 4);
  console.log(sortedLatest);

  return (
    <div className="blog-cont">
      <div className="header-cont">
        <span>{data.header.section} </span>
        {data.header.title}
      </div>
      <div className="blog">
        <div className="tittle-blog">{data.blog.title}</div>
        <div className="entries">
          {topLatest.map((entry, index) => (
            <Link
              key={index}
              className="entry"
              to={`/research/${entry.data.id}`}
            >
              <div>{entry.data.date}</div>
              <div>{entry.contentTitle}</div>
            </Link>
          ))}
        </div>
        <Link className="corner-blog" to={data.blog.cornerLink.url}>
          <div className="arrow">
            <GoArrowDownLeft />
          </div>
        </Link>
      </div>
    </div>
  );
}
