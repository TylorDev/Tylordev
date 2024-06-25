import { Link } from "react-router-dom";

import { useLanguage } from "./../../Context/LanguageContext";

import { Void } from "./../../Components/Void/Void";
import FetchDataComponent from "./../../Components/FetchDataComponent/FetchDataComponent";
import GetData from "./../../Components/GetData/GetData";
import { TittleBar } from "./../../Components/TittleBar/TittleBar";
export function History() {
  const { language } = useLanguage();

  const PageName = "About";
  const datos = FetchDataComponent(PageName);

  const fileType = "Projects";
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

  const topLatest = sortedLatest.slice(0, 2);

  if (!datos) {
    return (
      <div className="history">
        <div className="imagen">
          <Void
            type={"img"}
            src={
              "https://gclabels.net/image/cache/data/new/inv/new/Blank-White-Square-Labels-s1w-600x600.png"
            }
          />
        </div>

        <div className="latest">
          <div className="item">
            <div className="header-cont">
              <Void type={"span"} />
              <Void type={"div"} />
            </div>
            <div className="header-tit">
              <Void type={"div"} />
            </div>
          </div>

          <Link className="item">
            <div>
              <Void type={"div"} /> <Void type={"div"} />
            </div>
            <div className="item-tittle">
              {" "}
              <Void type={"div"} />
            </div>
          </Link>
          <Link className="item">
            <div>
              <Void type={"div"} /> <Void type={"div"} />
            </div>
            <div className="item-tittle">
              {" "}
              <Void type={"div"} />
            </div>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="history">
      <div className="imagen">
        <img src={datos.History.imageSrc} alt="history-image" />
      </div>

      <div className="latest">
        <div className="item">
          <div className="header-cont">
            <span>{datos.History.latest[0].header.section}</span>{" "}
            {datos.History.latest[0].header.title}
          </div>
          <TittleBar
            tittle={datos.History.latest[0].headerTitle}
            hideButtons={true}
          />
        </div>
        {topLatest.map((item, index) => (
          <Link
            key={index}
            className="item"
            to={`/Tylordev/${language}/projects/${item.header.title.toLowerCase()}`}
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
