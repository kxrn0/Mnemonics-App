import { useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useContext } from "react";
import ThemeContext from "../../theme_context";

import "./test.css";

export default function Test({ update_set, create_set }) {
  const data = useLocation().state;
  const [elementsOfMan, setElementsOfMan] = useState(() =>
    new Array(data.elements.length).fill("")
  );
  const beginningOfTime = useRef(new Date());
  const navigate = useNavigate();
  const theme = useContext(ThemeContext);

  function handle_change(event) {
    const value = event.target.value;
    const index = Number(event.target.dataset.index);

    setElementsOfMan((prevElms) =>
      prevElms.map((el, elIndex) => (elIndex === index ? value : el))
    );
  }

  async function check() {
    const date = beginningOfTime.current.toDateString();
    const time = `${String(beginningOfTime.current.getHours()).padStart(
      2,
      "0"
    )}:${String(beginningOfTime.current.getMinutes()).padStart(2, "0")}`;
    const duration = ~~((new Date() - beginningOfTime.current) / 1000);
    const id = Math.random().toString();
    const errors = [];
    const review = { date, time, duration, errors, id };

    for (let i = 0; i < data.elements.length; i++) {
      if (data.elements[i] !== elementsOfMan[i].trim().toLowerCase())
        errors.push({ index: i, incAnswer: elementsOfMan[i] });
    }

    if (data.id) {
      update_set(review, data.id);
    } else {
      const name = Math.random().toString(16).slice(-10);
      const id = Math.random().toString(16);
      const type = data.category;
      const avgScore =
        (data.elements.length - errors.length) / data.elements.length;
      const items = data.elements;
      const set = { name, id, type, avgScore, items, reviews: [review] };

      create_set(set);
    }

    navigate(`/train/${data.category}`);
  }

  return (
    <div className={`test ${theme}`}>
      {data.category === "images" ? (
        <div className="images container"></div>
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
        </div>
      )}
      <button className="check-button" onClick={check}>
        Check
      </button>
    </div>
  );
}
