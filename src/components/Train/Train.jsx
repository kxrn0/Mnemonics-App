import { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import Loading from "../Loading/Loading";
import ThemeContext from "../../theme_context";
import get_words from "../../utilities/get_words";
import get_numbers from "../../utilities/get_numbers";
import get_images from "../../utilities/get_images";

import "./train.css";

export default function Train({ category }) {
  const params = useLocation().state;
  const [elements, setElements] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    async function get_data() {
      if (!params.newSet) return setElements(params.data);

      let data;

      switch (category.type) {
        case "words":
          data = get_words(category.elements);
          break;
        case "images":
          data = await get_images(category.elements, category.types);
          data = data.map((file) => ({ file, src: URL.createObjectURL(file) }));
          break;
        case "numbers-decimal":
        case "numbers-binary":
          data = get_numbers(category.elements, category.digits, category.type);
          break;
        default:
          throw new Error("Error! unknown type of elements!");
      }
      setElements(data);
    }

    get_data();
  }, []);

  useEffect(() => {
    let intervalId;

    if (elements.length) {
      intervalId = setInterval(() => {
        console.log(`${currentIndex}, ${Math.random().toString(16).slice(-5)}`);
        if (currentIndex < elements.length)
          setCurrentIndex((prevIndex) => prevIndex + 1);
      }, category.secsPerEl * 1000);
    }

    return () => (intervalId ? clearInterval(intervalId) : "");
  }, [elements]);

  return (
    <div
      className={`train ${theme}`}
      style={{ "--duration": `${category.secsPerEl}s` }}
    >
      {elements.length ? (
        <div className="content">
          {currentIndex < elements.length ? (
            category.type === "images" ? (
              <img
                className={`item ${category.animation}`}
                style={{ width: category.width }}
                src={
                  params.newSet
                    ? elements[currentIndex].src
                    : elements[currentIndex].url
                }
                alt="image"
              />
            ) : (
              <p
                className={`item ${category.animation}`}
                style={{ fontSize: `${category.fontSize}px` }}
              >
                {elements[currentIndex]}
              </p>
            )
          ) : (
            <Link
              to="/test/"
              state={{
                elements,
                category: category.type,
                id: params.newSet ? null : params.id,
              }}
            >
              Check
            </Link>
          )}
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
}
