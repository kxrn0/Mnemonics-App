import { Link } from "react-router-dom";
import Calendar from "../Calendar/Calendar";
import Graph from "../Graph/Graph";
import DaySet from "../DaySet/DaySet";
import ThemeContext from "../../theme_context";
import { useContext } from "react";

import "./category.css";

export default function Category({
  category,
  sets,
  process,
  PreviewComponent,
  set_rotten_days,
}) {
  const theme = useContext(ThemeContext);

  function actual_process(set, date) {
    if (set.type !== category) return null;
    return process(set, date);
  }

  return (
    <div className={`category ${category} ${theme}`}>
      <h1 className="category-name">
        {category.split("-").reverse().join(" ")}
      </h1>
      <div className="category-controls">
        <button className="train">Train</button>
        <button className="settings">Settings</button>
      </div>
      <Calendar
        data={sets}
        process={actual_process}
        PreviewComponent={PreviewComponent}
        set_rotten_days={set_rotten_days}
      />
      <Graph sets={sets} category={category} />
      {sets.map((set) =>
        set.type === category ? (
          <DaySet key={set.type} set={set} date="all" />
        ) : null
      )}
    </div>
  );
}
