import random from "../random";
import distance from "../distance";
import { nanoid } from "nanoid";

function create_circles(width, height, minRad, maxRad) {
  const circles = [];
  const maxCount = 5000;
  let circle, count;

  count = 0;
  while (count < maxCount) {
    const radius = random(minRad, maxRad);
    const x = random(radius, width - radius);
    const y = random(radius, height - radius);

    circle = {
      center: {
        x,
        y,
      },
      radius,
    };

    if (
      circles.some(
        (other) =>
          distance(other.center, circle.center) < other.radius + circle.radius
      )
    )
      count++;
    else {
      circles.push(circle);
      count = 0;
    }
  }
  return circles;
}

export default function circle_packing(width, height) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const circles = create_circles(width, height, 1, 50);

  canvas.width = width;
  canvas.height = height;

  context.fillStyle = "#ffffff";
  context.rect(0, 0, canvas.width, canvas.height);
  context.fill();
  circles.forEach((circle) => {
    context.beginPath();
    context.arc(
      circle.center.x,
      circle.center.y,
      circle.radius,
      0,
      Math.PI * 2
    );
    context.stroke();
  });
  return new Promise((resolve) => {
    const name = `${nanoid()}.png`;

    canvas.toBlob((blob) =>
      resolve(new File([blob], name, { type: "image/png" }))
    );
  });
}
