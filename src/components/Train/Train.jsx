import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import get_words from "../../utilities/get_words";
import get_numbers from "../../utilities/get_numbers";
import get_images from "../../utilities/get_images";

export default function Train({ category, settings }) {
  const params = useLocation().state;
  const [elements, _] = useState(() => {
    if (!params.newSet) return params.data;

    switch (category) {
      case "words":
        return get_words(settings.elements);
      case "images":
        return get_images(settings.elements, settings.types);
      case "numbers-decimal":
      case "numbers-binary":
        return get_numbers(settings.elements, settings.digits, category);
      default:
        throw new Error("Error! unknown type of elements!");
    }
  });
  const [currentIndex, setCurrentIndex] = useState(() => 0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (currentIndex < elements.length)
        setCurrentIndex((prevIndex) => prevIndex + 1);
    }, settings.secsPerEl * 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="train">
      {currentIndex < elements.length ? (
        <p>{elements[currentIndex]}</p>
      ) : (
        <Link
          to="/test/"
          state={{ elements, category, id: params.newSet ? null : params.id }}
        >
          Check
        </Link>
      )}
    </div>
  );
}
