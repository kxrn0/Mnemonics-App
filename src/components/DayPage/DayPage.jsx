import DaySet from "../DaySet/DaySet";
import ThemeContext from "../../theme_context";
import { useContext } from "react";
import { useLocation } from "react-router-dom";
import "./day_page.css";

export default function DayPage({ date, sets, delete_set, rename_set }) {
  const theme = useContext(ThemeContext);
  const category = useLocation().state.category;

  return (
    <div className={`day-page ${theme}`}>
      <h1 className="page-date">{date.split("-").join(" ")}</h1>
      {sets
        .filter((set) => set.type === category || category === "all")
        .map((set) =>
          set.reviews.some(
            (review) => review.date.split(" ").join("-") === date
          ) ? (
            <DaySet
              key={set.id}
              set={set}
              date={date}
              delete_set={delete_set}
              rename_set={rename_set}
            />
          ) : null
        )}
    </div>
  );
}
