import { useRef, useState, useEffect, useContext } from "react";
import ThemeContext from "../../theme_context";
import { map } from "../../utilities/map";
import "./slider.css";

export default function Slider({ value, from, to, update_value }) {
  const sliderRef = useRef(null);
  const thumbRef = useRef(null);
  const trackRef = useRef(null);
  const [active, setActive] = useState(false);
  const theme = useContext(ThemeContext);

  function move_thumb(pageX) {
    const sliderBox = sliderRef.current.getBoundingClientRect();

    if (pageX < sliderBox.left) {
      thumbRef.current.style.left = `${thumbRef.current.offsetWidth / 2}`;
    } else if (sliderBox.right < pageX) thumbRef.current.style.rigth = 0;
    else {
      thumbRef.current.style.left = `${
        pageX - sliderBox.left - thumbRef.current.offsetWidth / 2
      }px`;
    }
  }

  function resize_track(pageX) {
    const sliderBox = sliderRef.current.getBoundingClientRect();
    const percentage = `${(100 * (pageX - sliderBox.left)) / sliderBox.width}%`;

    if (pageX < sliderBox.left || sliderBox.right < pageX) return;

    trackRef.current.style.width = percentage;
  }

  function update() {
    const sliderBox = sliderRef.current.getBoundingClientRect();
    const thumbBox = thumbRef.current.getBoundingClientRect();
    const length =
      thumbBox.left + thumbRef.current.offsetWidth / 2 - sliderBox.left;

    update_value(Math.round(map(length, 0, sliderBox.width, from, to)));
  }

  function slide_thumb(event) {
    let xCoord;

    if (event.type === "touchmove") xCoord = event.changedTouches[0].pageX;
    else xCoord = event.pageX;

    move_thumb(xCoord);
    resize_track(xCoord);
    update();
  }

  function handle_event(event) {
    const trigger =
      event.type === "touchstart"
        ? { move: "touchmove", end: "touchend" }
        : { move: "mousemove", end: "mouseup" };

    setActive(true);

    document.addEventListener(trigger.move, slide_thumb);

    document.addEventListener(
      trigger.end,
      () => {
        document.removeEventListener(trigger.move, slide_thumb);

        setActive(false);
      },
      { once: true }
    );
  }

  function handle_click(event) {
    move_thumb(event.pageX);
    resize_track(event.pageX);
    update();
  }

  useEffect(() => {
    const per = 100 - ~~((100 * (to - value)) / (to - from));

    trackRef.current.style.width = `${per}%`;
    thumbRef.current.style.left = `${per}%`;
  }, []);

  return (
    <div
      className={`slider ${active ? "active" : "inactive"} ${theme}`}
      onClick={handle_click}
      ref={sliderRef}
    >
      <span className="track" ref={trackRef}></span>
      <span
        className="thumb"
        onMouseDown={handle_event}
        onTouchStart={handle_event}
        ref={thumbRef}
      ></span>
    </div>
  );
}
