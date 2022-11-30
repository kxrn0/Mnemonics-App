export default function get_numbers(items, digits, type) {
  const numbers = [];
  const chars = [];
  const cap = type === "numbers-decimal" ? 10 : 2;

  for (let i = 0; i < cap; i++) chars.push(String(i));

  for (let i = 0; i < items; i++) {
    let number;

    number = "";

    for (let j = 0; j < digits; j++)
      number += chars[~~(chars.length * Math.random())];
    numbers.push(number);
  }
  // return new Promise((resolve, _) => setTimeout(() => resolve(numbers), 5000));
  return numbers;
}
