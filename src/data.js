export function update_set(review, id) {
  const set = memData.find((set) => set.id === id);

  set.reviews.push(review);
  set.avgScore =
    set.reviews.reduce(
      (acc, curr) =>
        acc + (set.items.length - curr.errors.length) / set.items.length,
      0
    ) / set.reviews.length;
}

export function create_set(set) {
  memData.push(set);
}

const memData = [
  {
    name: "g3ckl2",
    id: "123",
    type: "numbers-decimal",
    avgScore: 0.8,
    items: [2, 2, 5, 2, 6, 3, 2, 1, 1, 3, 1, 5, 7, 4, 3, 7, 1, 8, 3, 2],
    reviews: [
      {
        date: "Tue Nov 01 2022",
        time: "08:32",
        id: "hi",
        duration: 61,
        errors: [
          {
            index: 2,
            incAnswer: 2,
          },
          {
            index: 4,
            incAnswer: 5,
          },
          {
            index: 5,
            incAnswer: 0,
          },
          {
            index: 6,
            incAnswer: 3,
          },
          {
            index: 9,
            incAnswer: 9,
          },
        ],
      },
      {
        date: "Fri Nov 04 2022",
        time: "09:43",
        id: "bye",
        duration: 126,
        errors: [
          {
            index: 0,
            incAnswer: 3,
          },
          {
            index: 1,
            incAnswer: 5,
          },
          {
            index: 3,
            incAnswer: 6,
          },
        ],
      },
      {
        date: "Sat Nov 05 2022",
        time: "08:12",
        id: "byme",
        duration: 154,
        errors: [
          {
            index: 1,
            incAnswer: 9,
          },
          {
            index: 3,
            incAnswer: 8,
          },
          {
            index: 5,
            incAnswer: 1,
          },
          {
            index: 7,
            incAnswer: 2,
          },
        ],
      },
    ],
  },
  {
    name: "dq34gc5c",
    id: "456",
    type: "words",
    avgScore: 0.84,
    items: [
      "computer",
      "monitor",
      "cursor",
      "mouse",
      "signal",
      "telegram",
      "perception",
      "increase",
      "tail",
      "recursion",
      "media",
      "number",
      "end",
      "board",
      "rabbit",
    ],
    reviews: [
      {
        date: "Sun Nov 06 2022",
        time: "09:55",
        id: "one",
        duration: 63,
        errors: [
          {
            index: 3,
            incAnswer: "rat",
          },
          {
            index: 5,
            incAnswer: "paper",
          },
        ],
      },
      {
        date: "Tue Nov 08 2022",
        time: "15:55",
        id: "two",
        duration: 585,
        errors: [
          {
            index: 3,
            incAnswer: "cat",
          },
          {
            index: 5,
            incAnswer: "notebook",
          },
        ],
      },
      {
        date: "Mon Nov 14 2022",
        time: "11:55",
        id: "three",
        duration: 232,
        errors: [
          {
            index: 3,
            incAnswer: "chess",
          },
          {
            index: 5,
            incAnswer: "fish",
          },
          {
            index: 7,
            incAnswer: "reddit",
          },
        ],
      },
    ],
  },
];

export default memData;
