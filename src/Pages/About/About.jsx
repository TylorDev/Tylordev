import { Link } from "react-router-dom";
import "./About.scss";
import { GoArrowDownLeft } from "react-icons/go";
import { useEffect, useState } from "react";
import profile from "./Profile.json";
import blog from "./BlogEntries.json";
import content from "./historyContent.json";
import { CButton } from "../../Components/Button/CButton";

import { useParams } from "react-router-dom";
import { useLanguage } from "./../../Context/LanguageContext";
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
  const { language, setLanguage } = useLanguage();
  const { lang } = useParams();
  console.log(lang);
  if (lang !== language) {
    setLanguage(lang);
  }

  console.log(language);

  const datos = content.History;

  const [filenames, setFilenames] = useState([]);
  useEffect(() => {
    async function fetchData() {
      // Importar todos los archivos JSON en la carpeta `src/API/Projects`
      const jsonFiles = import.meta.glob("/src/API/Projects/*.json");

      // Array para almacenar los nombres de los archivos
      const fileNamesArray = [];

      // Iterar sobre los archivos y obtener sus nombres
      for (const path in jsonFiles) {
        // Extraer el nombre del archivo del path
        const fileName = path.split("/").pop();
        fileNamesArray.push(fileName);
      }

      // Actualizar el estado con los nombres de los archivos
      setFilenames(fileNamesArray);
    }

    fetchData();
  }, []);

  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all(
          filenames.map((filename) =>
            fetch(
              `https://raw.githubusercontent.com/TylorDev/Tylordev/main/src/API/Projects/${filename}`
            )
          )
        );

        const data = await Promise.all(
          responses.map((response) => response.json())
        );
        setData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [filenames]);

  const latest = data;

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
        <img src={datos.imageSrc} alt="history-image" />
      </div>

      <div className="latest">
        <div className="item">
          <div className="header-cont">
            <span>{datos.latest[0].header.section}</span>{" "}
            {datos.latest[0].header.title}
          </div>
          <div className="header-tit">{datos.latest[0].headerTitle}</div>
        </div>
        {topLatest.map((item, index) => (
          <Link
            key={index}
            className="item"
            to={`/${language}/projects/${item.header.title.toLowerCase()}`}
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
  const { language, setLanguage } = useLanguage();
  const { lang } = useParams();
  console.log(lang);
  if (lang !== language) {
    setLanguage(lang);
  }

  console.log(language);

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

            <CButton onClick={handlePrev} left={true} />

            <CButton onClick={handleNext} />
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
  const datos = blog;
  const { language, setLanguage } = useLanguage();
  const { lang } = useParams();
  console.log(lang);
  if (lang !== language) {
    setLanguage(lang);
  }

  console.log(language);

  const [filenames, setFilenames] = useState([]);

  useEffect(() => {
    async function fetchData() {
      // Importar todos los archivos JSON en la carpeta `src/API/Projects`
      const jsonFiles = import.meta.glob("/src/API/Articles/*.json");

      // Array para almacenar los nombres de los archivos
      const fileNamesArray = [];

      // Iterar sobre los archivos y obtener sus nombres
      for (const path in jsonFiles) {
        // Extraer el nombre del archivo del path
        const fileName = path.split("/").pop();
        fileNamesArray.push(fileName);
      }

      // Actualizar el estado con los nombres de los archivos
      setFilenames(fileNamesArray);
    }

    fetchData();
  }, []);

  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all(
          filenames.map((filename) =>
            fetch(
              `https://raw.githubusercontent.com/TylorDev/Tylordev/main/src/API/Articles/${filename}`
            )
          )
        );

        const data = await Promise.all(
          responses.map((response) => response.json())
        );
        setData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [filenames]);

  const latest = data;

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split("/").map(Number);
    return new Date(year + 2000, month - 1, day); // Asume fechas en el formato DD/MM/YY
  };

  // Ordenar los datos por fecha de más reciente a más antiguo
  const sortedLatest = latest.sort(
    (a, b) => parseDate(b.data.date) - parseDate(a.data.date)
  );

  const topLatest = sortedLatest.slice(0, 4);

  return (
    <div className="blog-cont">
      <div className="header-cont">
        <span>{datos.header.section} </span>
        {datos.header.title}
      </div>
      <div className="blog">
        <div className="tittle-blog">{datos.blog.title}</div>
        <div className="entries">
          {topLatest.map((entry, index) => (
            <Link
              key={index}
              className="entry"
              to={`/${language}/research/${entry.data.id}`}
            >
              <div>{entry.data.date}</div>
              <div>{entry.contentTitle}</div>
            </Link>
          ))}
        </div>
        <Link className="corner-blog" to={`/${language}/research`}>
          <div className="arrow">
            <GoArrowDownLeft />
          </div>
        </Link>
      </div>
    </div>
  );
}
