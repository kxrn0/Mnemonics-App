import Slider from "../Slider/Slider";
import Drawer from "../Drawer/Drawer";
import { useState, useContext, useEffect, useRef } from "react";
import ThemeContext from "../../theme_context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleChevronDown,
  faCircleChevronRight,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import get_words from "../../utilities/get_words";
import get_numbers from "../../utilities/get_numbers";
import random from "../../utilities/random";
import tenPrintSample from "../../assets/smap/ten_print_sample.png";
import waterColorSample from "../../assets/smap/water_color_sample.png";
import shapesSample from "../../assets/smap/shapes_sample.png";
import circlePackingSample from "../../assets/smap/circle_packing_sample.png";
import "./settings.css";

export default function Settings({ category, change_settings }) {
  const [animeIsPlaying, setAnimeIsPlaying] = useState(false);
  const theme = useContext(ThemeContext);
  const animes = ["drop", "scale", "fade"];
  const range =
    category.type === "images" ? { from: 100, to: 300 } : { from: 16, to: 80 };
  const sampleImages = useRef([
    { src: waterColorSample, type: "water_color" },
    { src: tenPrintSample, type: "ten_print" },
    { src: shapesSample, type: "shapes" },
    { src: circlePackingSample, type: "circle_packing" },
  ]);
  const [sample, setSample] = useState(() =>
    category.type === "numbers-decimal" ||
    category.type === "numbers-binary" ? (
      get_numbers(1, category.digits, category.type)[0]
    ) : category.type === "words" ? (
      get_words(1)[0]
    ) : (
      <img
        src={sampleImages.current[~~random(0, sampleImages.current.length)].src}
        alt="sample image"
      />
    )
  );
  const measureRef = useRef(category === "images" ? "width" : "fontSize");
  const [localSettings, setLocalSettings] = useState(() => {
    const settings = { ...category };

    if (category.type === "images") settings.types = [...category.types];

    return settings;
  });

  function select_types(event) {
    const type = event.target.dataset.type;

    if (event.target.checked)
      setLocalSettings((prevSettings) => ({
        ...prevSettings,
        types: [...prevSettings.types, type],
      }));
    else if (localSettings.types.length > 1)
      setLocalSettings((prevSettings) => ({
        ...prevSettings,
        types: [...prevSettings.types.filter((other) => other !== type)],
      }));
  }

  function update_value(event) {
    setLocalSettings((prevSettings) => {
      const value = Math.abs(~~Number(event.target.value));

      if (event.target.name === "digits")
        setSample(get_numbers(1, value ? value : 1, category.type)[0]);
      return { ...prevSettings, [event.target.name]: value ? value : 1 };
    });
  }

  function save_settings(event) {
    event.preventDefault();
    change_settings(localSettings);
  }

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
    <form className={`settings ${theme}`} onSubmit={save_settings}>
      <label htmlFor="elements" className="based label-element">
        <span>Elements : </span>
        <input
          id="elements"
          required
          type="number"
          name="elements"
          value={localSettings.elements}
          onChange={update_value}
        />
      </label>
      <label htmlFor="secs" className="based label-element">
        <span>Seconds per Element : </span>
        <input
          id="secs"
          required
          type="number"
          name="secsPerEl"
          value={localSettings.secsPerEl}
          onChange={update_value}
        />
      </label>
      {category.type === "numbers-decimal" ||
      category.type === "numbers-binary" ? (
        <label htmlFor="digits" className="based label-element">
          <span>Digits : </span>
          <input
            id="digits"
            required
            type="number"
            name="digits"
            value={localSettings.digits}
            onChange={update_value}
          />
        </label>
      ) : null}
      <div className="selector">
        <p className="label-element">Animation : </p>
        <div className="container">
          <div className="anime">
            <label htmlFor="animation-name">{localSettings.animation}</label>
            <div className="toggle-container">
              <input
                id="animation-name"
                type="checkbox"
                checked={animeIsPlaying}
                onChange={() => setAnimeIsPlaying((prevAnime) => !prevAnime)}
              />
              <FontAwesomeIcon icon={faCircleChevronRight} />
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
                  checked={localSettings.animation === anime}
                  onChange={(event) =>
                    setLocalSettings((prevSettings) => ({
                      ...prevSettings,
                      animation: event.target.value,
                    }))
                  }
                />
                <span className="label-element">{anime}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      {category.type === "images" ? (
        <Drawer
          top={<p>Types</p>}
          bottom={
            <ul>
              {sampleImages.current.map((image) => (
                <li key={image.type}>
                  <label htmlFor={`${image.type}-sample`}>
                    <div className="image">
                      <img
                        src={image.src}
                        alt={image.type}
                        width="100"
                        height="100"
                      />
                      <input
                        id={`${image.type}-sample`}
                        type="checkbox"
                        checked={localSettings.types.some(
                          (type) => type === image.type
                        )}
                        data-type={image.type}
                        onChange={select_types}
                      />
                      <FontAwesomeIcon icon={faCheck} />
                    </div>
                  </label>
                </li>
              ))}
            </ul>
          }
          icon={{
            fun: (icon) => <FontAwesomeIcon icon={icon} />,
            parts: {
              iconOpen: faCircleChevronDown,
              iconClosed: faCircleChevronRight,
            },
          }}
        />
      ) : null}
      <div className="size">
        <p className="label-element">Size : </p>
        <Slider
          value={
            category.type === "images"
              ? localSettings.width
              : localSettings.fontSize
          }
          from={range.from}
          to={range.to}
          update_value={(value) =>
            setLocalSettings((prevSettings) => ({
              ...prevSettings,
              [measureRef.current]: value,
            }))
          }
        />
      </div>
      <div
        className="screen"
        style={{ "--duration": `${localSettings.secsPerEl}s` }}
      >
        <div
          className={`content ${localSettings.animation} label-element`}
          style={
            category.type === "images"
              ? { width: localSettings[measureRef.current] }
              : { fontSize: localSettings[measureRef.current] }
          }
        >
          {sample}
        </div>
      </div>
      <button className="submit">Save</button>
    </form>
  );
}
