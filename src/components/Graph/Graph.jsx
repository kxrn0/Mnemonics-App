import { useState, useEffect, useRef, useContext } from "react";
import find_dates from "../../utilities/find_first_day";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import ThemeContext from "../../theme_context";
import "./graph.css";

export default function Graph({ sets, category }) {
  const [currentTip, setCurrentTip] = useState("");
  const [presentTime, setPresentTime] = useState(() => {
    const today = new Date();
    const parts = today.toDateString().split(" ");
    const stringDate = `${parts[1]} ${parts[3]}`;

    return {
      year: today.getFullYear(),
      month: today.getMonth(),
      stringDate,
    };
  });
  const [points, setPoints] = useState([]);
  const canvasRef = useRef(null);
  const theme = useContext(ThemeContext);
  const strokeStyle = theme === "dark" ? "#fedaea" : "#432562";

  function time_travel(direction) {
    setPresentTime((prevTime) => {
      const res = prevTime.month + direction;
      const year =
        res < 0
          ? prevTime.year - 1
          : res > 11
          ? prevTime.year + 1
          : prevTime.year;
      const month = res < 0 ? 11 : res > 11 ? 0 : res;
      const time = new Date(year, month, 1);
      const parts = time.toDateString().split(" ");
      const stringDate = `${parts[1]} ${parts[3]}`;

      return { year, month, stringDate };
    });
  }

  function show_tip(id, event) {
    const point = event.target;
    const tip = point.querySelector(".data-date-score");

    setTimeout(() => {
      const box = tip.getBoundingClientRect();

      if (box.left + box.width > window.innerWidth)
        tip.style.left = `-${box.width + box.x - window.innerWidth}px`;
    }, 33);

    setCurrentTip(id);
  }

  useEffect(() => {
    const days = find_dates(presentTime.year, presentTime.month);
    const points = [];

    for (let day of days) {
      const point = { day, scores: [] };

      for (let set of sets) {
        if (set.type === category)
          for (let review of set.reviews) {
            if (review.date === day)
              point.scores.push(
                (
                  (set.items.length - review.errors.length) /
                  set.items.length
                ).toFixed(2)
              );
          }
      }
      points.push(point);
    }

    setPoints(points);
  }, [presentTime]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const inc = canvas.width / points.length;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = strokeStyle;
    context.beginPath();
    context.moveTo(0, 0);
    context.lineWidth = 1;
    for (let i = 0, x = 0; i < points.length; i++, x += inc) {
      const scores = points[i].scores;
      const average = scores.length
        ? 1 -
          scores.reduce((acc, curr) => acc + Number(curr), 0) / scores.length
        : 1;

      context.lineTo(x, canvas.height * average);
    }
    context.stroke();
  }, [points, theme]);

  useEffect(() => {
    function close_point(event) {
      if (event.target.closest(".graph-point")) return;
      setCurrentTip("");
    }

    document.addEventListener("click", close_point);

    return () => document.removeEventListener("click", close_point);
  }, [presentTime]);

  return (
    <div className={`graph ${theme}`}>
      <div className="data-view">
        <div className="container">
          <div className="vertical-axis">
            <span>100%</span>
            <span>75%</span>
            <span>50%</span>
            <span>25%</span>
            <span>0%</span>
          </div>
          <div className="data-plot">
            <div className="points">
              {points.map((point, index) => {
                const scores = point.scores;
                const average = scores.length
                  ? 1 -
                    scores.reduce((acc, curr) => acc + Number(curr), 0) /
                      scores.length
                  : 1;
                return (
                  <span
                    key={point.day}
                    onClick={(event) => show_tip(point.day, event)}
                    className={`graph-point ${
                      currentTip === point.day ? "active" : ""
                    }`}
                    style={{
                      left: `calc(${
                        index * (300 / points.length)
                      }px - var(--width) / 2)`,
                      top: ~~(300 * average),
                    }}
                  >
                    <span className="data-date-score">{`${point.day}, ${(
                      100 *
                      (1 - average)
                    ).toFixed(0)}%`}</span>
                  </span>
                );
              })}
            </div>
            <canvas ref={canvasRef} width="300" height="300"></canvas>
          </div>
        </div>
      </div>
      <div className="controls">
        <button onClick={() => time_travel(-1)}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        {presentTime.stringDate}
        <button onClick={() => time_travel(1)}>
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    </div>
  );
}
