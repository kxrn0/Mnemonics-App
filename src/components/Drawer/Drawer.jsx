import { useState, useRef, useEffect } from "react";

import "./drawer.css";

export default function Drawer({ top, bottom, icon }) {
    const [isOpen, setIsOpen] = useState(false);
    const bottomRef = useRef(null);
    const [bottomHeight, setBottomHeight] = useState("auto");

    useEffect(() => {
        const clone = bottomRef.current.cloneNode(true);

        document.body.appendChild(clone);
        setBottomHeight(window.getComputedStyle(clone).height);
        document.body.removeChild(clone);
    }, []);

    return (
        <div className="drawer">
            <div className="top">
                {top}
                <div className="icon">
                    <input
                        type="checkbox"
                        checked={isOpen}
                        onChange={(event) => setIsOpen(event.target.checked)}
                    />
                    {icon.fun(
                        isOpen ? icon.parts.iconOpen : icon.parts.iconClosed
                    )}
                </div>
            </div>
            <div
                className={`bottom ${isOpen ? "open" : "closed"}`}
                ref={bottomRef}
                style={{
                    maxHeight:
                        isOpen || bottomHeight === "auto" ? bottomHeight : 0,
                }}
            >
                {bottom}
            </div>
        </div>
    );
}
