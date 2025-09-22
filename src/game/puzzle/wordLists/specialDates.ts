import type { WordSolution } from "../../../types/game";

export function getDateSlug(date: Date) {
  const strMonth = (date.getMonth() + 1).toString();
  const strDay = date.getDate().toString();
  return `${strMonth}-${strDay}`;
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
            "theme": "New Year",
            "words": ["cheer", "drink", "party", "toast", "count"],
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
            "theme": "Groundhog Day",
            "words": ["again", "radio", "clock", "ramis", "movie"],
          },
        ],
        6: [
          {
            "theme": "Groundhog Day",
            "words": ["french", "murray", "winter", "repeat", "romcom", "cherry", "report"],
          },
        ],
      },
    },
  ],
  "2-9": [
    {
      greeting: "Happy International Pizza Day!",
      wordSolutions: {
        5: [
          {
            "theme": "Pizza",
            "words": ["pizza", "slice", "crust", "sauce", "flour", "dough", "onion", "olive", "basil", "bacon"],
          },
        ],
        6: [
          {
            "theme": "Pizza",
            "words": ["cheese", "pepper", "tomato", "garlic", "salami", "potato"],
          },
        ],
      },
    },
  ],
  "2-14": [
    {
      greeting: "Happy Valentine's Day",
      wordSolutions: {
        5: [
          {
            "theme": "Valentine's Day",
            "words": ["heart", "lover", "movie", "dress", "cupid"],
          },
        ],
      },
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
      wordSolutions: {
        5: [
          {
            "theme": "Famous Women",
            "words": ["curie", "diana", "parks", "kahlo", "woolf", "bassi", "tabei"],
          },
        ],
        6: [
          {
            "theme": "Famous Women",
            "words": ["austen", "stopes", "butler", "teresa", "atkins", "anning", "hopper", "keller", "tubman", "chanel", "graham", "gandhi", "barton", "ederle"],
          },
        ],
        7: [
          {
            "theme": "Famous Women",
            "words": ["earhart", "boudica", "seacole", "shelley", "maathai", "hypatia", "meitner", "coleman", "hurston", "mistral", ],
          },
        ],
      },
    },
  ],
  "3-14": [
    {
      greeting: "Happy Pi Day!",
      wordSolutions: {
        6: [
          {
            "theme": "3.14159",
            "words": ["radius", "circle", "volume", "sphere", "around", "newton"],
          },
        ]
      },
    },
  ],
  "3-17": [
    {
      greeting: "Happy St. Patrick's Day!",
      wordSolutions: {
        5: [
          {
            "theme": "St. Patrick's Day",
            "words": ["green", "lucky", "irish", "paddy", "drink"],
          },
        ],
      },
    },
  ],
  "3-21": [
    {
      greeting: "Happy World Poetry Day!",
      wordSolutions: {
        5: [
          {
            "theme": "Poetry",
            "words": ["verse", "rhyme", "lyric", "meter", "frost"],
          },
        ],
      },
    },
  ],
  "4-1": [
    {
      greeting: "Happy April Fool's Day!",
      wordSolutions: {
        5: [
          {
            "theme": "Have a laugh!",
            "words": ["prank", "laugh", "trick", "wacky", "funny", "silly"],
          },
        ],
      },
    },
  ],
  "4-22": [
    {
      greeting: "Happy Earth Day!",
      wordSolutions: {
        5: [
          {
            "theme": "Save the Earth",
            "words": ["earth", "grass", "ocean", "crust", "plant", "water", "ozone", "reuse", "solar", "waste", "clean"],
          },
        ],
        6: [
          {
            "theme": "Save the Earth",
            "words": ["mother", "nature", "forest", "flower", "ground", "reduce", "energy", "global", "planet"],
          },
        ],
        7: [
          {
            "theme": "Save the Earth",
            "words": ["protect", "climate", "pollute", "sustain", "recycle", "restore", "natural"],
          },
        ],
      },
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
      wordSolutions: {
        5: [
          // {
          //   "theme": "Star Wars",
          //   "words": [],
          // },
        ],
      },
    },
  ],
  "6-1": [
    {
      greeting: "Happy World Chocolate Day!",
      wordSolutions: {
        5: [
          {
            "theme": "Chocolate",
            "words": ["sweet", "cocoa", "sugar", "candy", "treat"],
          },
        ],
      },
    },
  ],
  // "7-19": [
  //   {
  //     greeting: "Happy TestDay!",
  //     wordSolutions: {
  //       5: [
  //         {
  //           "theme": "Test Day",
  //           "words": ["tests", "tests", "tests", "tests", "tests"],
  //         },
  //       ],
  //     },
  //   },
  // ],
  "8-2": [
    {
      greeting: "Happy International Beer Day!",
      wordSolutions: {
        5: [
          {
            "theme": "Beer",
            "words": ["yeast", "wheat", "maize", "craft", "drink", "drunk", "light", "lager", "brown"],
          },
        ],
      },
    },
  ],
  "8-8": [
    {
      greeting: "Happy International Cat Day!",
      wordSolutions: {
        6: [
          {
            "theme": "Cat",
            "words": ["feline", "kitten", "pounce", "litter", "reflex", "sphynx"],
          },
        ],
      },
    },
  ],
  "8-26": [
    {
      greeting: "Happy International Dog Day!",
      wordSolutions: {
        5: [
          {
            "theme": "Dog",
            "words": ["puppy", "pooch", "hound", "doggy", "chase", "fetch"],
          },
        ],
      },
    },
  ],
  "9-21": [
    {
      greeting: "Happy International Day of Peace!",
      wordSolutions: {
        5: [
          {
            "theme": "Peace",
            "words": ["peace", "share", "unity", "equal", "human"],
          },
        ],
      },
    },
  ],
  "9-29": [
    {
      greeting: "Happy World Heart Day!",
      wordSolutions: {
        5: [
          {
            "theme": "Heart",
            "words": ["heart", "blood", "pulse", "atria", "organ", "chest", "aorta", "valve"],
          },
        ],
      },
    },
  ],
  "10-1": [
    {
      greeting: "Happy World Coffee Day!",
      wordSolutions: {
        5: [
          {
            "theme": "Coffee",
            "words": ["drink", "latte", "mocha", "decaf", "roast", "cuppa", "grind", "sugar"],
          },
        ],
      },
    },
  ],
  "10-5": [
    {
      greeting: "Happy World Teachers' Day!",
      wordSolutions: {
        5: [
          {
            "theme": "Teacher",
            "words": ["teach", "pupil", "learn", "class", "grade", "chalk"],
          },
        ],
      },
    },
  ],
  "10-31": [
    {
      greeting: "Happy Halloween!",
      wordSolutions: {
        5: [
          {
            "theme": "Halloween",
            "words": ["ghost", "witch", "trick", "treat", "candy", "spook", "scary", "skull"],
          },
        ],
      },
    },
  ],
  "12-24": [
    {
      greeting: "Merry Christmas Eve!",
      wordSolutions: {
        5: [
          {
            "theme": "Christmas",
            "words": ["santa", "frost", "kevin", "carol", "merry", "jesus"],
          }
        ],
        6: [
          {
            "theme": "Christmas",
            "words": ["jingle", "sleigh", "grinch", "advent", "cookie", "carrot"],
          },
        ]
      },
    },
  ],
  "12-25": [
    {
      greeting: "Merry Christmas!",
      wordSolutions: {
        5: [
          {
            "theme": "Christmas",
            "words": ["santa", "frost", "kevin", "carol", "merry", "jesus"],
          }
        ],
        6: [
          {
            "theme": "Christmas",
            "words": ["jingle", "sleigh", "grinch", "advent", "cookie", "carrot"],
          },
        ]
      },
    },
  ],
};
