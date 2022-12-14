import Review from "../Review/Review";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faCheck, faClose } from "@fortawesome/free-solid-svg-icons";
import ThemeContext from "../../theme_context";
import { useContext, useState } from "react";
import SlideScreen from "../SlideScreen/SlideScreen";

import "./day_set.css";

export default function DaySet({ set, date, delete_set, rename_set }) {
  const theme = useContext(ThemeContext);
  const [seeingData, setSeeingData] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(set.name);
  const [isAboutToDelete, setIsAboutToDelete] = useState(false);

  function handle_change(event) {
    setNewName(event.target.value);
  }

  function rename() {
    const value = newName.trim();

    if (!value) return;
    rename_set(set.id, value);
    setIsRenaming(false);
  }

  return (
    <div className={`day-set ${theme} ${set.type}`}>
      <SlideScreen
        close={() => {
          setSeeingData(false);
          setIsAboutToDelete(false);
        }}
        shown={seeingData || isAboutToDelete}
        closeButton={true}
        closeWhenClickingOutside={true}
      >
        {isAboutToDelete ? (
          <div className="deletion">
            <div className="message">
              <p className="question">Do you really wish to delete</p>
              <p className="name-of-the-set">{set.name}</p>
              <p className="mark">?</p>
            </div>
            <div className="buttons">
              <button
                className="continue"
                onClick={() => {
                  setIsAboutToDelete(false);
                  delete_set(set.id);
                }}
              >
                Continue
              </button>
              <button
                className="cancel"
                onClick={() => setIsAboutToDelete(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          set.items.map((item, index) => (
            <p key={index} className="showcase-element">
              <span className="index">{index + 1}.- </span>
              {set.type === "images" ? (
                <img src={item.url} className="image-item" />
              ) : (
                <span className="data">{item}</span>
              )}
            </p>
          ))
        )}
      </SlideScreen>
      <div className="set-name">
        {isRenaming ? (
          <div className="name-changer">
            <button onClick={() => setIsRenaming(false)}>
              <FontAwesomeIcon icon={faClose} />
            </button>
            <input type="text" value={newName} onChange={handle_change} />
            <button onClick={rename}>
              <FontAwesomeIcon icon={faCheck} />
            </button>
          </div>
        ) : (
          <div className="name-of-set">
            <p>{set.name}</p>
            <button onClick={() => setIsRenaming(true)}>
              <FontAwesomeIcon icon={faEdit} />
            </button>
          </div>
        )}
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
          state={{
            newSet: false,
            data: set.items,
            id: set.id,
          }}
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
              type={set.type}
            />
          ) : null
        )}
      </div>
      <button className="delete-set" onClick={() => setIsAboutToDelete(true)}>
        Delete Set
      </button>
    </div>
  );
}
