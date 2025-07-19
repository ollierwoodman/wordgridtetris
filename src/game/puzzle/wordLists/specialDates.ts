import type { WordSolution } from "../../../types/game";

export function getDateSlug(date: Date) {
  return `${date.getMonth() + 1}-${date.getDate()}`;
}

export const SPECIAL_DATE_WORD_LISTS: Record<
  string,
  {
    greeting: string;
    wordSolutions: Record<number, WordSolution[]>;
  }[]
> = {
  "1-1": [
    {
      greeting: "Happy New Year!",
      wordSolutions: {
        5: [
          {
            theme: "New Year",
            words: ["cheer", "drink", "party", "toast", "count"],
          },
        ],
      },
    },
  ],
  "2-2": [
    {
      greeting: "Happy Groundhog Day!",
      wordSolutions: {
        5: [
          {
            theme: "Groundhog Day",
            words: ["again", "radio", "clock", "ramis", "movie"],
          },
        ],
        6: [
          {
            theme: "Groundhog Day",
            words: ["french", "murray", "winter", "repeat", "romcom", "cherry", "report"],
          },
        ],
      },
    },
  ],
  "2-9": [
    {
      greeting: "Happy International Pizza Day!",
      wordSolutions: {},
    },
  ],
  "2-14": [
    {
      greeting: "Happy Valentine's Day",
      wordSolutions: {},
    },
  ],
  "3-3": [
    {
      greeting: "Happy World Wildlife Day!",
      wordSolutions: {},
    },
  ],
  "3-8": [
    {
      greeting: "Happy International Women's Day!",
      wordSolutions: {},
    },
  ],
  "3-14": [
    {
      greeting: "Happy Pi Day!",
      wordSolutions: {},
    },
  ],
  "3-17": [
    {
      greeting: "Happy St. Patrick's Day!",
      wordSolutions: {},
    },
  ],
  "3-21": [
    {
      greeting: "Happy World Poetry Day!",
      wordSolutions: {},
    },
  ],
  "4-1": [
    {
      greeting: "Happy April Fool's Day!",
      wordSolutions: {},
    },
  ],
  "4-22": [
    {
      greeting: "Happy Earth Day!",
      wordSolutions: {},
    },
  ],
  "5-1": [
    {
      greeting: "Happy May Day!",
      wordSolutions: {},
    },
  ],
  "5-4": [
    {
      greeting: "May the 4th be with you.",
      wordSolutions: {},
    },
  ],
  "6-1": [
    {
      greeting: "Happy World Chocolate Day!",
      wordSolutions: {},
    },
  ],
  // "7-19": [
  //   {
  //     greeting: "Happy TestDay!",
  //     wordSolutions: {
  //       5: [
  //         {
  //           theme: "Test Day",
  //           words: ["tests", "tests", "tests", "tests", "tests"],
  //         },
  //       ],
  //     },
  //   },
  // ],
  "8-2": [
    {
      greeting: "Happy International Beer Day!",
      wordSolutions: {},
    },
  ],
  "8-8": [
    {
      greeting: "Happy International Cat Day!",
      wordSolutions: {},
    },
  ],
  "8-26": [
    {
      greeting: "Happy International Dog Day!",
      wordSolutions: {},
    },
  ],
  "9-21": [
    {
      greeting: "Happy International Day of Peace!",
      wordSolutions: {},
    },
  ],
  "9-29": [
    {
      greeting: "Happy World Heart Day!",
      wordSolutions: {},
    },
  ],
  "10-1": [
    {
      greeting: "Happy World Coffee Day!",
      wordSolutions: {},
    },
  ],
  "10-5": [
    {
      greeting: "Happy World Teachers' Day!",
      wordSolutions: {},
    },
  ],
  "10-31": [
    {
      greeting: "Happy Halloween!",
      wordSolutions: {},
    },
  ],
  "12-24": [
    {
      greeting: "Merry Christmas Eve!",
      wordSolutions: {},
    },
  ],
  "12-25": [
    {
      greeting: "Merry Christmas!",
      wordSolutions: {},
    },
  ],
};
