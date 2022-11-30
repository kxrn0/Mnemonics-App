export default function create_polygon(center, radius, sides) {
  const inc = (Math.PI * 2) / sides;
  const points = [];

  for (let i = 0, a = 0; i < sides; i++, a += inc)
    points.push({
      x: radius * Math.cos(a) + center.x,
      y: radius * Math.sin(a) + center.y,
    });
  return points;
}
