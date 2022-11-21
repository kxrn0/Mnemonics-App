import DaySet from "../DaySet/DaySet";
import ThemeContext from "../../theme_context";
import { useContext } from "react";
import "./day_page.css";

export default function DayPage({ date, sets }) {
    const theme = useContext(ThemeContext);

    return (
        <div className={`day-page ${theme}`}>
            <h1 className="page-date">{date.split("-").join(" ")}</h1>
            {sets.map((set) =>
                set.reviews.some(
                    (review) => review.date.split(" ").join("-") === date
                ) ? (
                    <DaySet key={set.id} set={set} date={date} />
                ) : null
            )}
        </div>
    );
}
