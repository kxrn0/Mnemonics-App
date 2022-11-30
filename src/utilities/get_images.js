import ten_print from "./generative/ten_print";
import circle_packing from "./generative/circle_packing";
import shapes from "./generative/shapes";
import water_color from "./generative/water_color";

export default function get_images(index) {
  switch (index) {
    case 1:
      return ten_print(300, 300);
    case 2:
      return circle_packing(300, 300);
    case 3:
      return shapes(300, 300, 20);
    case 4:
      return water_color(300, 300);
  }
}
