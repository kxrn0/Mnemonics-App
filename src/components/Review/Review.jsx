import format_time from "../../utilities/format_time";
import Drawer from "../Drawer/Drawer";
import ThemeContext from "../../theme_context";
import { useContext, useEffect, useRef, useState } from "react";
import { map } from "../../utilities/map";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleChevronDown,
  faCircleChevronRight,
  faExpand,
} from "@fortawesome/free-solid-svg-icons";
import SlideScreen from "../SlideScreen/SlideScreen";

import "./review.css";

export default function Review({ review, totalItems, type }) {
  const theme = useContext(ThemeContext);
  const canvasRef = useRef(null);
  const percentage = useRef(
    ((100 * (totalItems - review.errors.length)) / totalItems).toFixed(0)
  );
  const [currentImage, setCurrentImage] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    context.beginPath();
    context.strokeStyle = "#ffffff";
    context.lineWidth = 5;
    context.arc(
      canvas.width / 2,
      canvas.height / 2,
      27,
      -Math.PI / 2,
      map(percentage.current, 0, 100, 0, Math.PI * 2) - Math.PI / 2
    );
    context.stroke();
  }, []);

  return (
    <div className={`review ${theme}`}>
      <SlideScreen
        close={() => setCurrentImage("")}
        shown={currentImage !== ""}
        closeButton={true}
        closeWhenClickingOutside={true}
      >
        <img src={currentImage} />
      </SlideScreen>
      <div className="percentage">
        <canvas ref={canvasRef} width="60" height="60"></canvas>
        <span>{percentage.current}%</span>
      </div>
      <p className="date">
        {review.date}, {review.time}
      </p>
      <div className="details">
        <p>Correct: {totalItems - review.errors.length}</p>
        <p>Incorrect: {review.errors.length}</p>
        <p>Duration: {format_time(review.duration)}</p>
        <Drawer
          top={"Errors"}
          bottom={
            <table className="errors">
              <thead>
                <tr>
                  <th>Index</th>
                  <th>Your answer</th>
                </tr>
              </thead>
              <tbody>
                {review.errors.map((error) => (
                  <tr key={error.index}>
                    <td>{error.index + 1}</td>
                    <td>
                      {type === "images" ? (
                        <div className="image-error">
                          <button
                            onClick={() => setCurrentImage(error.incAnswer)}
                          >
                            <FontAwesomeIcon icon={faExpand} />
                          </button>
                          <img src={error.incAnswer} width="100" height="100" />
                        </div>
                      ) : (
                        error.incAnswer
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          }
          icon={{
            fun: (icon) => <FontAwesomeIcon icon={icon} />,
            parts: {
              iconOpen: faCircleChevronDown,
              iconClosed: faCircleChevronRight,
            },
          }}
        />
      </div>
    </div>
  );
}
