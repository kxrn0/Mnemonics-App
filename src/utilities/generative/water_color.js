import { nanoid } from "nanoid";
import create_polygon from "../create_polygon";
import deform_polygon from "../deform_polygon";
import random from "../random";

function paint(canvas, center, radius, color) {
  const context = canvas.getContext("2d");
  const brush = create_polygon(
    {
      x: 0,
      y: 0,
    },
    radius,
    50
  );

  deform_polygon(brush, 50);

  context.globalCompositeOperation = "add";
  context.fillStyle = color;
  for (let i = 0; i < 100; i++) {
    context.translate(
      center.x + canvas.width * random(-0.2, 0.2),
      center.y + canvas.height * random(-0.2, 0.2)
    );
    context.rotate(Math.random());
    context.beginPath();
    for (let point of brush) context.lineTo(point.x, point.y);
    context.fill();
    context.setTransform(1, 0, 0, 1, 0, 0);
  }
}

export default function water_color(width, height) {
  const canvas = document.createElement("canvas");
  const colors = [];

  canvas.width = width;
  canvas.height = height;

  for (let i = 0; i < 5; i++)
    colors.push(
      `rgb(${~~random(0, 255)}, ${~~random(0, 255)}, ${~~random(0, 255)}, .05)`
    );

  for (let color of colors) {
    paint(
      canvas,
      {
        x: canvas.width / 2 + random(-100, 100),
        y: canvas.height / 2 + random(-100, 100),
      },
      5,
      color
    );
  }
  return new Promise((resolve) => {
    const name = `${nanoid()}.png`;

    canvas.toBlob((blob) =>
      resolve(new File([blob], name, { type: "image/png" }))
    );
  });
}
