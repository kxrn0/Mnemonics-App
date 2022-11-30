import { useContext } from "react";
import { Link } from "react-router-dom";
import words from "./images/words.svg";
import images from "./images/images.svg";
import decimals from "./images/numbers.svg";
import binary from "./images/binary.svg";
import ThemeContext from "../../theme_context";

import "./dojo.css";

export default function Dojo() {
    const theme = useContext(ThemeContext);
    return (
        <div className={`dojo ${theme}`}>
            <Link to="/train/words" id="words">
                <img src={words} alt="words" />
                <p className="category">Words</p>
            </Link>
            <Link to="/train/images" id="images">
                <img src={images} alt="images" />
                <p className="category">Abstract Images</p>
            </Link>
            <Link to="/train/numbers-decimal" id="numbers-decimal">
                <img src={decimals} alt="decimal numbers" />
                <p className="category">Decimal Numbers</p>
            </Link>
            <Link to="/train/numbers-binary" id="numbers-binary">
                <img src={binary} alt="Binary Numbers" />
                <p className="category">Binary Numbers</p>
            </Link>
        </div>
    );
}
