import { useState, useEffect } from "react";
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

import "./style.css";

function App() {
  const [theme, setTheme] = useState("light");
  const [rottenDays, setRottenDays] = useState([]);

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
      key: `${component.date} ${component.time}`,
    }));
  }

  function change_theme(event) {
    setTheme(event.target.dataset.theme);
  }

  return (
    <div className={`App ${theme}`}>
      <BrowserRouter>
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
              <Link to="settings">
                <FontAwesomeIcon icon={faGear} />
              </Link>
              <Link to="info">
                <FontAwesomeIcon icon={faCircleInfo} />
              </Link>
            </div>
          </nav>
          <Routes>
            <Route
              path="/"
              element={
                <Homepage
                  set={memData}
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
                element={<DayPage sets={memData} date={day} />}
              />
            ))}
            <Route
              path="/train/words"
              element={
                <Category
                  category="words"
                  sets={memData}
                  process={process}
                  PreviewComponent={ReviewPreview}
                  set_rotten_days={set_rotten_days}
                />
              }
            />
            <Route
              path="/train/images"
              element={
                <Category
                  category="images"
                  sets={memData}
                  process={process}
                  PreviewComponent={ReviewPreview}
                  set_rotten_days={set_rotten_days}
                />
              }
            />
            <Route
              path="/train/numbers-decimal"
              element={
                <Category
                  category="numbers-decimal"
                  sets={memData}
                  process={process}
                  PreviewComponent={ReviewPreview}
                  set_rotten_days={set_rotten_days}
                />
              }
            />
            <Route
              path="/train/numbers-binary"
              element={
                <Category
                  category="numbers-binary"
                  sets={memData}
                  process={process}
                  PreviewComponent={ReviewPreview}
                  set_rotten_days={set_rotten_days}
                />
              }
            />
          </Routes>
          <ThemeToggle
            themes={["light", "dark", "neom"]}
            currentTheme={theme}
            change_theme={change_theme}
          />
        </ThemeContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
