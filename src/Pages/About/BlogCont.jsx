import { Link } from "react-router-dom";
import { GoArrowDownLeft } from "react-icons/go";
import FetchDataComponent from "./../../Components/FetchDataComponent/FetchDataComponent";
import { useLanguage } from "./../../Context/LanguageContext";
import { Void } from "./../../Components/Void/Void";

import GetData from "./../../Components/GetData/GetData";
import { TittleBar } from "./../../Components/TittleBar/TittleBar";
FetchDataComponent;
export function BlogCont() {
  const PageName = "About";
  const datos = FetchDataComponent(PageName);
  const { language } = useLanguage();
  const fileType = "Articles";
  const data = GetData({ fileType });
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

  if (!datos) {
    return (
      <div className="blog-cont">
        <div className="header-cont">
          <Void type={"span"} char={5} />
          <Void type={"div"} />
        </div>
        <div className="blog">
          <div className="tittle-blog">
            <Void type={"div"} char={"5"} />
          </div>
          <div className="entries">
            <Link className="entry">
              <div>
                <Void type={"div"} />
              </div>
              <div>
                <Void type={"div"} />
              </div>
            </Link>
            <Link className="entry">
              <div>
                <Void type={"div"} />
              </div>
              <div>
                <Void type={"div"} />
              </div>
            </Link>
            <Link className="entry">
              <div>
                <Void type={"div"} />
              </div>
              <div>
                <Void type={"div"} />
              </div>
            </Link>
            <Link className="entry">
              <div>
                <Void type={"div"} />
              </div>
              <div>
                <Void type={"div"} />
              </div>
            </Link>
          </div>
          <Link className="corner-blog">
            <div className="arrow">
              <GoArrowDownLeft />
            </div>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-cont">
      <div className="header-cont">
        <span>{datos.blogHeader.section} </span>
        {datos.blogHeader.title}
      </div>
      <div className="blog">
        <TittleBar
          tittle={datos.blog.title}
          hideButtons={true}
          hiddeLine={true}
        />
        <div className="entries">
          {topLatest.map((entry, index) => (
            <Link
              key={index}
              className="entry"
              to={`/Tylordev/${language}/research/${entry.data.id}`}
            >
              <div>{entry.data.date}</div>
              <div>{entry.contentTitle}</div>
            </Link>
          ))}
        </div>
        <Link className="corner-blog" to={`/Tylordev/${language}/research`}>
          <div className="arrow">
            <GoArrowDownLeft />
          </div>
        </Link>
      </div>
    </div>
  );
}
