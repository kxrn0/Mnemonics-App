import { Link } from "react-router-dom";
import Calendar from "../Calendar/Calendar";
import Graph from "../Graph/Graph";
import DaySet from "../DaySet/DaySet";
import ThemeContext from "../../theme_context";
import { useContext, useState, useEffect } from "react";
import SlideScreen from "../SlideScreen/SlideScreen";
import Settings from "../Settings/Settings";

import "./category.css";

export default function Category({
  category,
  sets,
  process,
  PreviewComponent,
  set_rotten_days,
}) {
  const theme = useContext(ThemeContext);
  const [seeingSettings, setSeeingSettings] = useState(false);
  // const [settingsComponent, setSettingsComponent] = useState("");

  function actual_process(set, date) {
    if (set.type !== category) return null;
    return process(set, date);
  }

  // useEffect(() => {
  //   function choose_component() {
  //     switch (category) {
  //       case "words":
  //         return 0;
  //     }
  //   }

  //   setSettingsComponent(choose_component());
  // }, []);

  return (
    <div className={`category ${category} ${theme}`}>
      <SlideScreen
        close={() => setSeeingSettings(false)}
        shown={seeingSettings}
        closeButton={true}
        closeWhenClickingOutside={true}
      >
        {/* {settingsComponent} */}
        {/* shalom */}
        {seeingSettings ? <Settings category={category} /> : null}
      </SlideScreen>
      <h1 className="category-name">
        {category.split("-").reverse().join(" ")}
      </h1>
      <div className="category-controls">
        <Link to={`/train/${category}/grounds`} state={{ newSet: true }}>
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
      />
      <Graph sets={sets} category={category} />
      {sets.map((set) =>
        set.type === category ? (
          <DaySet key={set.id} set={set} date="all" />
        ) : null
      )}
    </div>
  );
}
