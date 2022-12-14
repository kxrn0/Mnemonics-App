import { Link } from "react-router-dom";
import Calendar from "../Calendar/Calendar";
import Graph from "../Graph/Graph";
import DaySet from "../DaySet/DaySet";
import ThemeContext from "../../theme_context";
import { useContext, useState } from "react";
import SlideScreen from "../SlideScreen/SlideScreen";
import Settings from "../Settings/Settings";

import "./category.css";

export default function Category({
  category,
  sets,
  process,
  PreviewComponent,
  set_rotten_days,
  save_settings,
  delete_set,
  rename_set,
}) {
  const theme = useContext(ThemeContext);
  const [seeingSettings, setSeeingSettings] = useState(false);

  function actual_process(sets, date) {
    return process(
      sets.filter((set) => set.type === category.type),
      date
    );
  }

  function change_settings(settings) {
    save_settings(category.type, settings);
    setSeeingSettings(false);
  }

  return (
    <div className={`category ${category.type} ${theme}`}>
      <SlideScreen
        close={() => setSeeingSettings(false)}
        shown={seeingSettings}
        closeButton={true}
        closeWhenClickingOutside={true}
      >
        {seeingSettings ? (
          <Settings category={category} change_settings={change_settings} />
        ) : null}
      </SlideScreen>
      <h1 className="category-name">
        {category.type.split("-").reverse().join(" ")}
      </h1>
      <div className="category-controls">
        <Link to={`/train/${category.type}/grounds`} state={{ newSet: true }}>
          <button className="train">Train</button>
        </Link>
        <button className="settings" onClick={() => setSeeingSettings(true)}>
          Settings
        </button>
      </div>
      <Calendar
        data={sets}
        process={actual_process}
        PreviewComponent={PreviewComponent}
        set_rotten_days={set_rotten_days}
        category={category.type}
      />
      <Graph sets={sets} category={category.type} />
      {sets.map((set) =>
        set.type === category.type ? (
          <DaySet
            key={set.id}
            set={set}
            delete_set={delete_set}
            rename_set={rename_set}
            date="all"
          />
        ) : null
      )}
    </div>
  );
}
