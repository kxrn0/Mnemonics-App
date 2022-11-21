import "./theme_toggle.css";
import { useContext } from "react";
import ThemeContext from "../../theme_context";

export default function ThemeToggle({ themes, currentTheme, change_theme }) {
    const theme = useContext(ThemeContext);
    
    return (
        <div className={`theme-toggle ${theme}`}>
            <div className="labels">
                {themes.map((theme) => (
                    <label key={theme} htmlFor={`theme-toggler-${theme}`}>
                        {theme}
                    </label>
                ))}
            </div>
            <div className="inputs">
                {themes.map((theme) => (
                    <input
                        key={theme}
                        type="radio"
                        id={`theme-toggler-${theme}`}
                        checked={theme === currentTheme}
                        name="theme-toggler"
                        onChange={change_theme}
                        data-theme={theme}
                    />
                ))}
                <span className="ball"></span>
            </div>
        </div>
    );
}
