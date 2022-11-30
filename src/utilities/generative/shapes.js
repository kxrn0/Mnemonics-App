import { nanoid } from "nanoid";
import create_polygon from "../create_polygon";
import deform_polygon from "../deform_polygon";
import random from "../random";

function draw_outline(points, context, offset) {
  context.lineWidth = 2;
  for (let i = 0; i < points.length - 1; i++) {
    context.beginPath();
    context.moveTo(
      points[i].x + random(-offset, offset),
      points[i].y + random(-offset, offset)
    );
    context.lineTo(
      points[i + 1].x + random(-offset, offset),
      points[i + 1].y + random(-offset, offset)
    );
    context.stroke();
  }
  context.beginPath();
  context.moveTo(points[0].x, points[0].y);
  context.lineTo(points[points.length - 1].x, points[points.length - 1].y);
  context.stroke();
}

export default function shapes(width, height, n) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = width;
  canvas.height = height;

  context.fillStyle = "rgb(234, 247, 253)";
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < n; i++) {
    const sides = ~~random(3, 6);
    const radius = random(20, 50);
    const polygon = create_polygon(
      {
        x: random(0, canvas.width),
        y: random(0, canvas.height),
      },
      radius,
      sides
    );
    const color = `rgb(${~~random(0, 255)}, ${~~random(0, 255)}, ${~~random(
      0,
      255
    )})`;

    deform_polygon(polygon, 20);
    context.fillStyle = color;
    context.beginPath();
    for (let point of polygon) context.lineTo(point.x, point.y);
    context.fill();
    draw_outline(polygon, context, 5);
  }
  return new Promise((resolve) => {
    const name = `${nanoid()}.png`;

    canvas.toBlob((blob) =>
      resolve(new File([blob], name, { type: "image/png" }))
    );
  });
}
