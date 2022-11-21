import { useEffect, useRef } from "react";
import "./loading.css";

export default function Loading() {
    const canvasRef = useRef(null);

    function map(value, start1, end1, start2, end2) {
        return start2 + ((end2 - start2) * (value - start1)) / (end1 - start1);
    }

    function loading_icon(killer, canvas) {
        const color = Date.now() / 33;
        const dt = Date.now() / 100;
        const circles = 20;
        const distance = 45;
        const angleInc = (Math.PI * 2) / circles;
        const minRad = 1;
        const maxRad = 6;
        const context = canvas.getContext("2d");
        let angle;

        angle = 0;

        context.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < circles; i++, angle += angleInc) {
            const radius =
                minRad +
                Math.abs(
                    maxRad *
                        Math.sin(
                            map(dt % circles, 0, circles, 0, Math.PI * 2) +
                                (i * Math.PI * 3) / circles
                        )
                );
            context.beginPath();
            context.fillStyle = `hsl(${(i * 10 + color) % 360}, 100%, 65%)`;
            context.arc(
                distance * Math.cos(angle) + canvas.width / 2,
                distance * Math.sin(angle) + canvas.height / 2,
                radius,
                0,
                Math.PI * 2
            );
            context.fill();
        }

        killer.id = requestAnimationFrame(() => loading_icon(killer, canvas));
    }

    useEffect(() => {
        const animeKiller = { id: null };

        loading_icon(animeKiller, canvasRef.current);

        return () => cancelAnimationFrame(animeKiller.id);
    });

    return (
        <canvas
            width="200"
            height="200"
            className="loading-icon"
            ref={canvasRef}
        ></canvas>
    );
}
