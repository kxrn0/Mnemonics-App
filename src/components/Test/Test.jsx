import { useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useContext, useEffect } from "react";
import ThemeContext from "../../theme_context";
import random from "../../utilities/random";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faExpand, faUpload } from "@fortawesome/free-solid-svg-icons";
import { faCircleArrowUp } from "@fortawesome/free-solid-svg-icons";
import SlideScreen from "../SlideScreen/SlideScreen";
import { nanoid } from "nanoid";
import "./test.css";

export default function Test({ update_set, create_set }) {
  const data = useLocation().state;
  const [elementsOfMan, setElementsOfMan] = useState(() =>
    new Array(data.elements.length).fill("")
  );
  const beginningOfTime = useRef(new Date());
  const navigate = useNavigate();
  const theme = useContext(ThemeContext);
  const [currentSlot, setCurrentSlot] = useState(0);
  const [randomized, setRandomized] = useState([]);
  const [currentImage, setCurrentImage] = useState("");
  const [toastError, setToastError] = useState(false);

  function handle_change(event) {
    const value = event.target.value;
    const index = Number(event.target.dataset.index);

    setElementsOfMan((prevElms) =>
      prevElms.map((el, elIndex) => (elIndex === index ? value : el))
    );
  }

  async function check() {
    if (elementsOfMan.some((element) => element.trim() === "")) {
      setToastError(true);

      setTimeout(() => setToastError(false), 3333);
      return;
    }

    const date = beginningOfTime.current.toDateString();
    const time = `${String(beginningOfTime.current.getHours()).padStart(
      2,
      "0"
    )}:${String(beginningOfTime.current.getMinutes()).padStart(2, "0")}`;
    const duration = ~~((new Date() - beginningOfTime.current) / 1000);
    const id = nanoid();
    const errors = [];
    const review = { date, time, duration, errors, id };

    for (let i = 0; i < data.elements.length; i++) {
      if (data.elements[i] !== elementsOfMan[i].trim().toLowerCase())
        errors.push({ index: i, incAnswer: elementsOfMan[i] });
    }

    if (data.id) {
      await update_set(review, data.id);
    } else {
      const name = Math.random().toString(16).slice(-10);
      const id = nanoid();
      const type = data.category;
      const avgScore =
        (data.elements.length - errors.length) / data.elements.length;
      const items = data.elements;
      const set = { name, id, type, avgScore, items, reviews: [review] };

      await create_set(set);
    }

    navigate(`/train/${data.category}`);
  }

  function fill_slot(src) {
    setElementsOfMan((prevElements) =>
      prevElements.map((element, elIndex) =>
        currentSlot === elIndex ? src : element
      )
    );
    setCurrentSlot((prevSlot) => {
      const nextIndex = elementsOfMan.findIndex(
        (element, index) => element === "" && index > prevSlot
      );

      if (~nextIndex) return nextIndex;
      else return elementsOfMan.findIndex((element) => element === "");
    });
  }

  function remove_image(index) {
    setElementsOfMan((prevElements) => {
      if (prevElements.every((element) => element !== ""))
        setCurrentSlot(index);

      return prevElements.map((element, elIndex) =>
        elIndex === index ? "" : element
      );
    });
  }

  function close_screen() {
    setCurrentImage("");
  }

  useEffect(() => {
    setRandomized([...data.elements].sort(() => random(-1, 1)));
  }, []);

  return (
    <div className={`test ${theme}`}>
      <div className={`toast ${toastError ? "shown" : "hidden"}`}>
        Please fiill out all fields!
      </div>
      {data.category === "images" ? (
        <div className="images">
          <SlideScreen
            close={close_screen}
            shown={currentImage !== ""}
            closeButton={true}
            closeWhenClickingOutside={true}
          >
            <img src={currentImage} />
          </SlideScreen>
          <ul className="slots">
            {elementsOfMan.map((element, index) => (
              <li key={index}>
                <p>{index + 1}.-</p>
                {element === "" ? (
                  <div
                    className={`slot ${currentSlot === index ? "active" : ""}`}
                    onClick={() => setCurrentSlot(index)}
                  ></div>
                ) : (
                  <div className="image">
                    <img src={element} />
                    <button onClick={() => remove_image(index)}>
                      <FontAwesomeIcon icon={faClose} />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <div className="bottom-text">
            <ul className="images-to-select">
              {randomized.map((element, index) => (
                <li key={index}>
                  {!elementsOfMan.includes(element.src) ? (
                    <div className="active-image">
                      <img src={element.src} />
                      <button
                        className="add"
                        onClick={() => fill_slot(element.src)}
                      >
                        <FontAwesomeIcon icon={faCircleArrowUp} />
                      </button>
                      <button
                        className="expand"
                        onClick={() => setCurrentImage(element.src)}
                      >
                        <FontAwesomeIcon icon={faExpand} />
                      </button>
                    </div>
                  ) : (
                    <span className="byme"></span>
                  )}
                </li>
              ))}
            </ul>
            <button className="check-button" onClick={check}>
              Check
            </button>
          </div>
        </div>
      ) : (
        <div className="everything-else container">
          <ul>
            {data.elements.map((_, index) => (
              <li key={index}>
                <label htmlFor={`input-${index}`}>
                  <span>{index + 1}.-</span>
                  <input
                    id={`input-${index}`}
                    type="text"
                    data-index={index}
                    onChange={handle_change}
                  />
                </label>
              </li>
            ))}
          </ul>
          <button className="check-button" onClick={check}>
            Check
          </button>
        </div>
      )}
    </div>
  );
}
