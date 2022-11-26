import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import get_words from "../../utilities/get_words";
import get_numbers from "../../utilities/get_numbers";
import get_images from "../../utilities/get_images";

import "./train.css";

export default function Train({ category }) {
  const params = useLocation().state;
  const [elements, _] = useState(() => {
    if (!params.newSet) return params.data;

    switch (category.type) {
      case "words":
        return get_words(category.elements);
      case "images":
        return get_images(category.elements, category.types);
      case "numbers-decimal":
      case "numbers-binary":
        return get_numbers(category.elements, category.digits, category.type);
      default:
        throw new Error("Error! unknown type of elements!");
    }
  });
  const [currentIndex, setCurrentIndex] = useState(() => 0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (currentIndex < elements.length)
        setCurrentIndex((prevIndex) => prevIndex + 1);
    }, category.secsPerEl * 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="train" style={{ "--duration": `${category.secsPerEl}s` }}>
      {currentIndex < elements.length ? (
        <p className={`item ${category.animation}`}>{elements[currentIndex]}</p>
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
  );
}
