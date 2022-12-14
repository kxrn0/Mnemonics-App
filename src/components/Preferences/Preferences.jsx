import ThemeToggle from "../ThemeToggle/ThemeToggle";
import ThemeContext from "../../theme_context";
import { useContext } from "react";
import "./preferences.css";

export default function Preferences({ change_theme, themes, sign_out }) {
  const theme = useContext(ThemeContext);

  return (
    <div className="preferences">
      <div className="content">
        <ThemeToggle
          themes={themes}
          currentTheme={theme}
          change_theme={change_theme}
        />
        <button className="sign-out" onClick={sign_out}>Sign Out</button>
      </div>
    </div>
  );
}
