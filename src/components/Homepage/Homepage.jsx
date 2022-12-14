import Calendar from "../Calendar/Calendar";
import Clock from "../Clock/Clock";
import Red from "../Red/Red";
import ReviewPreview from "../ReviewPreview/ReviewPreview";

import "./homepage.css";

export default function Homepage({ set, process, set_rotten_days, test }) {
  return (
    <div className="homepage">
      <Clock />
      <Red />
      <Calendar
        data={set}
        PreviewComponent={ReviewPreview}
        process={process}
        set_rotten_days={set_rotten_days}
        category="all"
      />
    </div>
  );
}
