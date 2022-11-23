import Review from "../Review/Review";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import ThemeContext from "../../theme_context";
import { useContext, useState } from "react";
import SlideScreen from "../SlideScreen/SlideScreen";
import "./day_set.css";

export default function DaySet({ set, date }) {
  const theme = useContext(ThemeContext);
  const [seeingData, setSeeingData] = useState(false);

  function close() {
    setSeeingData(false);
  }

  return (
    <div className={`day-set ${theme} ${set.type}`}>
      <SlideScreen
        close={close}
        shown={seeingData}
        closeButton={true}
        closeWhenClickingOutside={true}
      >
        {set.items.map((item, index) => (
          <p key={index}>
            <span className="index">{index}.- </span>
            <span className="data">{item}</span>
          </p>
        ))}
      </SlideScreen>
      <div className="set-name">
        <p>{set.name}</p>
        <button>
          <FontAwesomeIcon icon={faEdit} />
        </button>
      </div>
      <div className="set-details">
        <p>Type: {set.type}</p>
        <p>Items: {set.items.length}</p>
        <p>Avg. score: {(set.avgScore * 100).toFixed(0)}%</p>
      </div>
      <div className="controls">
        <button className="see-data" onClick={() => setSeeingData(true)}>
          See data
        </button>
        <Link
          to={`/train/${set.type}/grounds`}
          state={{ newSet: false, data: set.items, id: set.id }}
        >
          <button className="review-data">Review</button>
        </Link>
      </div>
      <div className="reviews-section">
        <p className="reviews-label">Reviews:</p>
        {set.reviews.map((review) =>
          review.date.split(" ").join("-") === date || date === "all" ? (
            <Review
              key={review.id}
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
