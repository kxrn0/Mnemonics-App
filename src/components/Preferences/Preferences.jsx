import ThemeToggle from "../ThemeToggle/ThemeToggle";
import ThemeContext from "../../theme_context";
import { useContext } from "react";
import "./preferences.css";

export default function Preferences({ change_theme, themes }) {
  const theme = useContext(ThemeContext);

  return (
    <div className="preferences">
      <ThemeToggle
        themes={themes}
        currentTheme={theme}
        change_theme={change_theme}
      />
    </div>
  );
}
