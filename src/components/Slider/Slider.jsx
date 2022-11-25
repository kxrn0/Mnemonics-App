import { map } from "../../utilities/map";
import "./slider.css";

export default function Slider({ from, to, update_value }) {
  function move_thumb(pageX) {
    const slider = document.querySelector(".slider");
    const thumb = slider.querySelector(".thumb");
    const sliderBox = slider.getBoundingClientRect();

    if (pageX < sliderBox.left) {
      thumb.style.left = `${thumb.offsetWidth / 2}`;
    } else if (sliderBox.right < pageX) thumb.style.rigth = 0;
    else {
      thumb.style.left = `${pageX - sliderBox.left - thumb.offsetWidth / 2}px`;
    }
  }

  function resize_track(pageX) {
    const slider = document.querySelector(".slider");
    const track = slider.querySelector(".track");
    const sliderBox = slider.getBoundingClientRect();
    const percentage = `${(100 * (pageX - sliderBox.left)) / sliderBox.width}%`;

    if (pageX < sliderBox.left || sliderBox.right < pageX) return;

    track.style.width = percentage;
  }

  function update() {
    const slider = document.querySelector(".slider");
    const thumb = slider.querySelector(".thumb");
    const sliderBox = slider.getBoundingClientRect();
    const thumbBox = thumb.getBoundingClientRect();
    const length = thumbBox.left + thumb.offsetWidth / 2 - sliderBox.left;

    update_value(map(length, 0, sliderBox.width, from, to));
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
    const slider = document.querySelector(".slider");
    const trigger =
      event.type === "touchstart"
        ? { move: "touchmove", end: "touchend" }
        : { move: "mousemove", end: "mouseup" };

    slider.classList.toggle("active");
    slider.classList.toggle("inactive");

    document.addEventListener(trigger.move, slide_thumb);

    document.addEventListener(
      trigger.end,
      () => {
        document.removeEventListener(trigger.move, slide_thumb);

        slider.classList.toggle("active");
        slider.classList.toggle("inactive");
      },
      { once: true }
    );
  }

  function handle_click(event) {
    move_thumb(event.pageX);
    resize_track(event.pageX);
    update();
  }

  return (
    <div className="slider inactive" onClick={handle_click}>
      <span className="track"></span>
      <span
        className="thumb"
        onMouseDown={handle_event}
        onTouchStart={handle_event}
      ></span>
    </div>
  );
}
