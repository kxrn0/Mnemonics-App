import { useEffect, useState, useContext } from "react";
import ThemeContext from "../../theme_context";

import "./clock.css";

export default function Clock() {
    const [date, setDate] = useState(() => new Date());
    const theme = useContext(ThemeContext);

    useEffect(() => {
        const id = setInterval(() => setDate(new Date()), 1000);

        return () => clearInterval(id);
    }, []);

    return (
        <div className={`clock ${theme}`}>
            <p className="hours">{`${String(date.getHours()).padStart(
                2,
                "0"
            )}:${String(date.getMinutes()).padStart(2, "0")}:${String(
                date.getSeconds()
            ).padStart(2, "0")}`}</p>
            <p className="date">{date.toDateString()}</p>
        </div>
    );
}
