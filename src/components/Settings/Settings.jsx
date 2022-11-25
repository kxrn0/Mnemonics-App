import Slider from "../Slider/Slider";
import Drawer from "../Drawer/Drawer";
import { useState, useContext, useEffect, useRef } from "react";
import ThemeContext from "../../theme_context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronCircleRight } from "@fortawesome/free-solid-svg-icons";

import "./settings.css";

export default function Settings({ category }) {
  const [animeChoice, setAnimeChoice] = useState("drop");
  const [animeIsPlaying, setAnimeIsPlaying] = useState(false);
  const theme = useContext(ThemeContext);
  const animes = ["drop", "scale", "fade"];
  const range =
    category === "images" ? { from: 100, to: 200 } : { from: 16, to: 80 };
  const [size, setSize] = useState(() => (category === "images" ? 150 : 20));
  // const sample = category === "numbers-decimal" ? "10" :
  // const byme = useRef((() => "shalom"));
  

  useEffect(() => {
    function fun(event) {
      if (event.target.closest(".choices") || event.target.closest(".anime"))
        return;
      setAnimeIsPlaying(false);
    }

    document.addEventListener("click", fun);

    return () => document.removeEventListener("click", fun);
  }, []);

  return (
    <form className={`settings ${theme}`}>
      <button type="button" onClick={() => console.log(byme)}>
        shalom
      </button>
      <label htmlFor="elements" className="based">
        <span>Elements : </span>
        <input type="number" />
      </label>
      <label htmlFor="secs" className="based">
        <span>Seconds per Element : </span>
        <input type="number" />
      </label>
      {category === "numbers-decimal" || category === "numbers-binary" ? (
        <label htmlFor="digits" className="based">
          <span>Digits : </span>
          <input type="number" />
        </label>
      ) : null}
      <div className="selector">
        <p>Animation : </p>
        <div className="container">
          <div className="anime">
            <label htmlFor="animation-name">{animeChoice}</label>
            <div className="toggle-container">
              <input
                id="animation-name"
                type="checkbox"
                checked={animeIsPlaying}
                onChange={() => setAnimeIsPlaying((prevAnime) => !prevAnime)}
              />
              <FontAwesomeIcon icon={faChevronCircleRight} />
            </div>
          </div>
          <div className={`choices ${animeIsPlaying ? "active" : "inactive"}`}>
            {animes.map((anime) => (
              <label key={anime} htmlFor={`anime-${anime}`}>
                <input
                  type="radio"
                  id={`anime-${anime}`}
                  name="anime-choice"
                  value={anime}
                  checked={animeChoice === anime}
                  onChange={(event) => setAnimeChoice(event.target.value)}
                />
                <span>{anime}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      <div className="size">
        <p>Size</p>
        <Slider
          from={range.from}
          to={range.to}
          update_value={(value) => setSize(value)}
        />
      </div>
      <div className="screen"></div>
      <button>Save</button>
    </form>
  );
}
