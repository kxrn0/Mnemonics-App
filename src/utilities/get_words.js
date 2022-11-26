import words from "../assets/words.js";

export default function get_words(n) {
  const myWords = [];

  while (n) {
    const word = words[~~(Math.random() * words.length)];

    if (!myWords.includes(word)) {
      myWords.push(word);
      n--;
    }
  }
  return myWords;
}
