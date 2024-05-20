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
        {data.latest.slice(1).map((item, index) => (
          <Link key={index} className="item" to={"/project"}>
            <div>{item.type}</div>
            <div className="item-tittle">{item.title}</div>
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

  return (
    <div className="blog-cont">
      <div className="header-cont">
        <span>{data.header.section} </span>
        {data.header.title}
      </div>
      <div className="blog">
        <div className="tittle-blog">{data.blog.title}</div>
        <div className="entries">
          {data.blog.entries.map((entry, index) => (
            <Link key={index} className="entry" to={"/blog"}>
              <div>{entry.date}</div>
              <div>{entry.content}</div>
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
