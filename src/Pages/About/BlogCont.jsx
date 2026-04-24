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
  const emptyMessage = "En construccion";
  const fileType = "Articles";
  const data = GetData({ fileType });
  const sortedLatest = [...data].sort(
    (a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0)
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
          {topLatest.length ? (
            topLatest.map((entry, index) => (
              <Link
                key={index}
                className="entry"
                to={`/${language}/research/${entry.slug}`}
              >
                <div>{entry.data.date}</div>
                <div>{entry.contentTitle}</div>
              </Link>
            ))
          ) : (
            <div
              style={{
                width: "100%",
                padding: "1.5rem 0",
                textAlign: "center",
              }}
            >
              {emptyMessage}
            </div>
          )}
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
