/* eslint-disable react/prop-types */
import Request from "../../Pages/Requests/Request";
import Skills from "../../Pages/Skills/Skills";
import Steps from "../../Pages/Steps/Steps";
import "./Resources.scss";
import { useState, useEffect, useRef } from "react";

function Resources() {
  const requestRef = useRef();
  const stepsRef = useRef();
  const skillsRef = useRef();

  const [visibleComponent, setVisibleComponent] = useState(null);

  useEffect(() => {
    const callback = (entries) => {
      const visibility = entries.map((entry) => ({
        id: entry.target.id,
        ratio: entry.intersectionRatio,
      }));

      const mostVisible = visibility.reduce(
        (prev, current) => (current.ratio > prev.ratio ? current : prev),
        { ratio: 0 }
      );

      setVisibleComponent(mostVisible.id);
    };

    const observer = new IntersectionObserver(callback, {
      threshold: Array.from({ length: 101 }, (_, i) => i / 100), // Array [0, 0.01, ..., 1]
    });

    const currentRequestRef = requestRef.current;
    const currentStepsRef = stepsRef.current;
    const currentSkillsRef = skillsRef.current;

    if (currentRequestRef) observer.observe(currentRequestRef);
    if (currentStepsRef) observer.observe(currentStepsRef);
    if (currentSkillsRef) observer.observe(currentSkillsRef);

    return () => {
      if (currentRequestRef) observer.unobserve(currentRequestRef);
      if (currentStepsRef) observer.unobserve(currentStepsRef);
      if (currentSkillsRef) observer.unobserve(currentSkillsRef);
    };
  }, []);

  return (
    <div className="resources">
      <ScrollPercentage visible={visibleComponent} />
      <div id="request" ref={requestRef}>
        <Request />
      </div>
      <div id="steps" ref={stepsRef}>
        <Steps />
      </div>
      <div id="skills" ref={skillsRef}>
        <Skills />
      </div>
      {visibleComponent && (
        <div className="visible-component">
          Visible Component: {visibleComponent}
        </div>
      )}
    </div>
  );
}
export default Resources;

const ScrollPercentage = ({ visible }) => {
  const [scrollPercent, setScrollPercent] = useState(0);

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    setScrollPercent(scrollPercent);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="scroll-percentage">
      {Math.round(scrollPercent)}% - {visible}
    </div>
  );
};
