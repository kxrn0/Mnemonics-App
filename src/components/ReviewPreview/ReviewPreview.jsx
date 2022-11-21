import { useRef, useContext, useEffect } from "react";
import { map } from "../../utilities/map";
import ThemeContext from "../../theme_context";
import "./review_preview.css";

export default function ReviewPreview({ body }) {
    const { percentage, type } = body;
    const canvasRef = useRef(null);
    const theme = useContext(ThemeContext);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        context.beginPath();
        context.strokeStyle = "#dceebb";
        context.lineWidth = 5;
        context.arc(
            canvas.width / 2,
            canvas.height / 2,
            22,
            -Math.PI / 2,
            map(percentage, 0, 100, 0, Math.PI * 2) - Math.PI / 2
        );
        context.stroke();
    }, []);

    return (
        <div className={`review-preview ${theme}`}>
            <div className="percentage">
                <canvas width="50" height="50" ref={canvasRef}></canvas>
                <p>{percentage}%</p>
            </div>
            <p className="type">{type}</p>
        </div>
    );
}
