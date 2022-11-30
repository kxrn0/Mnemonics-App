import { nanoid } from "nanoid";

const colors = [
  {
    bg: "rgb(20, 5, 10)",
    right: "rgb(255, 10, 50)",
    left: "rgb(10, 255, 50)",
  },
  {
    bg: "rgb(50, 150, 255)",
    right: "rgb(25, 7, 10)",
    left: "rgb(250, 255, 253)",
  },
  {
    bg: "rgb(255, 100, 200)",
    right: "rgb(255, 200, 250)",
    left: "rgb(100, 24, 150)",
  },
  {
    bg: "rgb(25, 255, 50)",
    right: "rgb(255, 10, 54)",
    left: "rgb(175, 190, 255)",
  },
  {
    bg: "rgb(255, 220, 250)",
    right: "rgb(10, 12, 255)",
    left: "rgb(200, 10, 20)",
  },
];

export default function ten_print(width, height) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  let edge, cellsX, cellsY, color;

  canvas.width = width;
  canvas.height = height;
  edge = ~~(Math.random() * 20 + 20);
  cellsX = canvas.width / edge;
  cellsY = canvas.height / edge;
  color = colors[~~(Math.random() * colors.length)];

  context.fillStyle = color.bg;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.lineWidth = 2;
  for (let x = 0; x < cellsX; x++)
    for (let y = 0; y < cellsY; y++) {
      context.beginPath();
      let rand = Math.random();
      if (rand < 0.5) {
        context.strokeStyle = color.right;
        context.moveTo(x * edge, y * edge);
        context.lineTo((x + 1) * edge, (y + 1) * edge);
      } else {
        context.strokeStyle = color.left;
        context.moveTo((x + 1) * edge, y * edge);
        context.lineTo(x * edge, (y + 1) * edge);
      }
      context.stroke();
    }
  return new Promise((resolve) => {
    const name = `${nanoid()}.png`;

    canvas.toBlob((blob) =>
      resolve(new File([blob], name, { type: "image/png" }))
    );
  });
}
