import { useState, useEffect, useRef } from "react";
import ThemeContext from "./theme_context";
import ThemeToggle from "./components/ThemeToggle/ThemeToggle";
import memData from "./data";
import Homepage from "./components/Homepage/Homepage";
import Dojo from "./components/Dojo/Dojo";
import DayPage from "./components/DayPage/DayPage";
import Category from "./components/Category/Category";
import ReviewPreview from "./components/ReviewPreview/ReviewPreview";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faDumbbell,
  faGear,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import logo from "./assets/app_logo.svg";
import Train from "./components/Train/Train";
import Test from "./components/Test/Test";
import ScrollWrapper from "./components/ScrollWrapper/ScrollWrapper";
import "./style.css";

import { update_set, create_set } from "./data";

function App() {
  const [theme, setTheme] = useState("light");
  const [data, setData] = useState(() => JSON.parse(JSON.stringify(memData)));
  const [rottenDays, setRottenDays] = useState([]);
  const categoriesRef = useRef([
    "words",
    "images",
    "numbers-decimal",
    "numbers-binary",
  ]);
  const settingsRef = useRef({
    words: {
      elements: 5,
      secsPerEl: 3,
      animation: "none",
    },
    images: {
      elements: 10,
      secsPerEl: 3,
      animation: "none",
      types: ["shimmer", "print"],
    },
    "numbers-decimal": {
      elements: 5,
      secsPerEl: 1,
      animation: "none",
      digits: 1,
    },
    "numbers-binary": {
      elements: 3,
      secsPerEl: 1,
      animation: "none",
      digits: 3,
    },
  });

  function set_rotten_days(days) {
    setRottenDays(days);
  }

  function process(set, date) {
    const components = [];

    for (let review of set.reviews) {
      if (review.date === date) components.push(review);
    }

    if (!components.length) return null;

    return components.map((component) => ({
      body: {
        type: set.type,
        percentage: (
          (100 * (set.items.length - component.errors.length)) /
          set.items.length
        ).toFixed(0),
      },
      key: component.id,
    }));
  }

  function change_theme(event) {
    setTheme(event.target.dataset.theme);
  }

  function update(review, id) {
    update_set(review, id);

    // setData((prevData) =>
    //   prevData.map((item) => {
    //     if (item.id !== id) return item;
    //     else {
    //       const newAvg =
    //         item.avgScore +
    //         ((item.items.length - review.errors.length) / item.items.length -
    //           item.avgScore) /
    //           (item.items.length + 1);
    //       return {
    //         ...item,
    //         avgScore: newAvg,
    //         reviews: [...item.reviews, review],
    //       };
    //     }
    //   })
    // );
  }

  function create(set) {
    create_set(set);

    setData((prevData) => [...prevData, set]);
  }

  return (
    <div className={`App ${theme}`}>
      <BrowserRouter>
        <ScrollWrapper>
          <ThemeContext.Provider value={theme}>
            <nav className="navbar">
              <div className="logo">
                <img src={logo} alt="" />
                <p className="user">byme</p>
              </div>
              <div className="links">
                <Link to="/">
                  <FontAwesomeIcon icon={faHome} />
                </Link>
                <Link to="/train">
                  <FontAwesomeIcon icon={faDumbbell} />
                </Link>
                <Link to="/settings">
                  <FontAwesomeIcon icon={faGear} />
                </Link>
                <Link to="/info">
                  <FontAwesomeIcon icon={faCircleInfo} />
                </Link>
              </div>
            </nav>
            <Routes>
              <Route
                path="/"
                element={
                  <Homepage
                    set={data}
                    process={process}
                    set_rotten_days={set_rotten_days}
                  />
                }
              />
              <Route path="/train" element={<Dojo />} />
              {rottenDays.map((day) => (
                <Route
                  key={day}
                  path={`/days/${day}`}
                  element={<DayPage sets={data} date={day} />}
                />
              ))}
              {categoriesRef.current.map((cat) => (
                <Route
                  key={cat}
                  path={`/train/${cat}`}
                  element={
                    <Category
                      category={cat}
                      sets={data}
                      process={process}
                      PreviewComponent={ReviewPreview}
                      set_rotten_days={set_rotten_days}
                    />
                  }
                />
              ))}
              {categoriesRef.current.map((cat) => (
                <Route
                  key={cat}
                  path={`/train/${cat}/grounds`}
                  element={
                    <Train category={cat} settings={settingsRef.current[cat]} />
                  }
                />
              ))}
              <Route
                path="/test/"
                element={<Test update_set={update} create_set={create} />}
              />
            </Routes>
            <div
              style={{
                position: "fixed",
                bottom: "10rem",
                right: "2rem",
              }}
            >
              <ThemeToggle
                themes={["light", "dark", "neom"]}
                currentTheme={theme}
                change_theme={change_theme}
              />
            </div>
          </ThemeContext.Provider>
        </ScrollWrapper>
      </BrowserRouter>
    </div>
  );
}

export default App;
