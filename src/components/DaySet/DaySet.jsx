import Review from "../Review/Review";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import ThemeContext from "../../theme_context";
import { useContext } from "react";

import "./day_set.css";

export default function DaySet({ set, date }) {
  const theme = useContext(ThemeContext);

  return (
    <div className={`day-set ${theme} ${set.type}`}>
      <div className="set-name">
        <p>{set.name}</p>
        <button>
          <FontAwesomeIcon icon={faEdit} />
        </button>
      </div>
      <div className="set-details">
        <p>Type: {set.type}</p>
        <p>Items: {set.items.length}</p>
        <p>Avg. score: {set.avgScore * 100}%</p>
      </div>
      <div className="controls">
        <button className="see-data">See data</button>
        <button className="review-data">Review</button>
      </div>
      <div className="reviews-section">
        <p>Reviews:</p>
        {set.reviews.map((review) =>
          review.date.split(" ").join("-") === date || date === "all" ? (
            <Review
              key={`${review.date} ${review.time}`}
              review={review}
              totalItems={set.items.length}
            />
          ) : null
        )}
      </div>
      <button className="delete-set">Delete Set</button>
    </div>
  );
}
