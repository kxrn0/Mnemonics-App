import random from "../random";

export default function draw_texture(canvas) {
  const context = canvas.getContext("2d");

  for (let i = 0; i < 5000; i++) {
    const first = {
      x: random(0, canvas.width),
      y: random(0, canvas.height),
    };
    const second = {
      x: random(0, canvas.width),
      y: random(0, canvas.height),
    };

    context.strokeStyle = `rgb(${~~random(220, 255)}, ${~~random(
      200,
      255
    )}, ${~~random(100, 240)}, .5)`;
    context.beginPath();
    context.moveTo(first.x, first.y);
    context.lineTo(second.x, second.y);
    context.stroke();
  }
}
