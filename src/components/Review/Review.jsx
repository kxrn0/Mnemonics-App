import format_time from "../../utilities/format_time";
import Drawer from "../Drawer/Drawer";
import ThemeContext from "../../theme_context";
import { useContext, useEffect, useRef } from "react";
import { map } from "../../utilities/map";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleChevronDown,
  faCircleChevronRight,
} from "@fortawesome/free-solid-svg-icons";

import "./review.css";

export default function Review({ review, totalItems }) {
  const theme = useContext(ThemeContext);
  const canvasRef = useRef(null);
  const percentage = useRef(
    ((100 * (totalItems - review.errors.length)) / totalItems).toFixed(0)
  );

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
      <div className="percentage">
        <canvas ref={canvasRef} width="60" height="60"></canvas>
        <span>{percentage.current}%</span>
      </div>
      <p className="date">{review.date}</p>
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
                    <td>{error.index}</td>
                    <td>{error.incAnswer}</td>
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
