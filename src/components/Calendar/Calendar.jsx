import { useState, useRef, useEffect, useContext } from "react";
import find_dates from "../../utilities/find_first_day";
import ThemeContext from "../../theme_context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "./calendar.css";
import { nanoid } from "nanoid";

export default function Calendar({
  data,
  process,
  PreviewComponent,
  set_rotten_days,
}) {
  const theme = useContext(ThemeContext);
  const [days, setDays] = useState([]);
  const presentDay = useRef(new Date().toDateString());
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
  const [activeDay, setActiveDay] = useState("");

  function init() {
    const days = find_dates(presentTime.year, presentTime.month);
    const processed = days.map((day) => {
      let components;

      components = [];

      for (let elem of data) components.push(process(elem, day));

      components = components.filter((cmp) => cmp !== null);

      return { day, components, date: day.split(" ")[2], key: nanoid() };
    });

    set_rotten_days(
      processed
        .filter((day) => day.components.length)
        .map((day) => day.day.split(" ").join("-"))
    );

    setDays(processed);
  }

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

  function activate_day(day, event) {
    if (activeDay === day) setActiveDay("");
    else {
      const parent = event.target.parentElement;
      const toolTip = parent.querySelector(".tooltip");
      const tip = toolTip.querySelector(".tip");

      setTimeout(() => {
        const boxTip = toolTip.getBoundingClientRect();
        const parentBox = parent.getBoundingClientRect();

        if (boxTip.x < 0) {
          toolTip.style.left = `-${parentBox.x}px`;
          tip.style.left = `${parentBox.x}px`;
        }
        if (boxTip.x + boxTip.width > window.innerWidth) {
          const offset = boxTip.width + parentBox.x - window.innerWidth;

          toolTip.style.left = `-${offset}px`;
          tip.style.left = `${offset}px`;
        }
        if (boxTip.y + boxTip.height > window.innerHeight) {
          toolTip.style.top = `${-boxTip.height - 16}px`;
          tip.style.transform = "rotate(180deg)";
          tip.style.top = `${boxTip.height}px`;
        }
      }, 333);

      setActiveDay(day);
    }
  }

  useEffect(init, [presentTime]);

  useEffect(() => {
    function close_cell(event) {
      if (event.target.closest(".tooltip")) return;

      const cell = event.target.closest(".day.fullfilled");

      if (!cell) setActiveDay("");
    }

    document.addEventListener("click", close_cell);

    return () => document.removeEventListener("click", close_cell);
  }, []);

  return (
    <div className={`calendar ${theme}`}>
      <div className="month">
        <button className="navigation-button" onClick={() => time_travel(-1)}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <div className="name">{presentTime.stringDate}</div>
        <button className="navigation-button" onClick={() => time_travel(1)}>
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
      <div className="days">
        <ul>
          <li>S</li>
          <li>M</li>
          <li>T</li>
          <li>W</li>
          <li>T</li>
          <li>F</li>
          <li>S</li>
        </ul>
      </div>
      <div className="dates">
        {days.map((day) => {
          const isABrightDay = day.components.length;

          return (
            <div
              key={day.key}
              className={`day ${isABrightDay ? "fullfilled" : "unfullfilled"} ${
                presentDay.current === day.day ? "today" : ""
              }`}
            >
              <div
                className="cell-body"
                onClick={
                  isABrightDay ? (event) => activate_day(day.day, event) : null
                }
              >
                {day.date}
              </div>
              {isABrightDay ? (
                <div
                  className={`tooltip ${
                    activeDay === day.day ? "active" : "inactive"
                  }`}
                >
                  <span className="tip"></span>
                  <ul>
                    {day.components[0].map((component) => (
                      <li key={component.key}>
                        <PreviewComponent body={component.body} />
                      </li>
                    ))}
                  </ul>
                  <Link
                    className="new-page-button"
                    to={`/days/${day.day.split(" ").join("-")}`}
                  >
                    Open
                  </Link>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
