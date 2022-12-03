import ten_print from "./generative/ten_print";
import circle_packing from "./generative/circle_packing";
import shapes from "./generative/shapes";
import water_color from "./generative/water_color";
import random from "./random";

const byme = {};

byme.ten_print = ten_print;
byme.circle_packing = circle_packing;
byme.shapes = shapes;
byme.water_color = water_color;

export default async function get_images(items, types) {
  const images = [];

  for (let i = 0; i < items; i++) {
    const type = types[~~random(0, types.length)];
    const image = await byme[type](300, 300, 20);

    images.push(image);
  }
  return images;
}
