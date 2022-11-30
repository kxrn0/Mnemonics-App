export default function deform_polygon(points, offset) {
  for (let point of points) {
    const xOff = offset * (1 - 2 * Math.random());
    const yOff = offset * (1 - 2 * Math.random());

    point.x += xOff;
    point.y += yOff;
  }
}
