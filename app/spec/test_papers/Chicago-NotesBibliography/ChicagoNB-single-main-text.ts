import { ParserReport, Reference } from "../../../typedefs/reference-types";

export const mainText: string = `1. Michael Pollan, The Omnivore’s Dilemma: A Natural History of Four Meals (New York: Penguin, 2006), 99–100.
`;

export const mainTextWithDuplicates: string = `1. Michael Pollan, The Omnivore’s Dilemma: A Natural History of Four Meals (New York: Penguin, 2006), 99–100.
2. Ibid., 30.
3. Pollan, Omnivore’s Dilemma, 3.
`;

export const mainTextwithInvalidIbid: string =  `1. Ibid., 30.
2. Michael Pollan, The Omnivore’s Dilemma: A Natural History of Four Meals (New York: Penguin, 2006), 99–100.
3. Pollan, Omnivore’s Dilemma, 3.
`;

export const mainTextwithInvalidOrder: string = `2. Michael Pollan, The Omnivore’s Dilemma: A Natural History of Four Meals (New York: Penguin, 2006), 99–100.
1. Ibid., 30.
3. Pollan, Omnivore’s Dilemma, 3.
`;

/*
export const singleBibliography: string = `Pollan, Michael. The Omnivore’s Dilemma: A Natural History of Four Meals. New York: Penguin, 2006.
`;
*/


const references: Reference[] = [
  {
    unparsedNameList: "Michael Pollan",
    parsedNameList: [
      {
        firstname: "Michael",
        lastname: "Pollan",
        firstInitial: "M"
      }
    ],
    title: "The Omnivore’s Dilemma: A Natural History of Four Meals",
    pubYear: "2006",

    original: "Pollan, Michael. The Omnivore’s Dilemma: A Natural History of Four Meals. New York: Penguin, 2006.",
    index: 0,
  }
];

export const parserReport: ParserReport = {
  references: references,
  formattingProblems: null,
}
export const parserReportInvalidIbid: ParserReport = {
  references: references,
  formattingProblems: null,
}
export const parserReportInvalidNumberingOrder: ParserReport = {
  references: references,
  formattingProblems: null,
}
export const parserReportInvalidShortForm: ParserReport = {
  references: references,
  formattingProblems: null,
}


/*

export const parsedSingleBibliography: ParserReport = {
  references: [
    {
      unparsedNameList: "Michael Pollan",
      parsedNameList: [
        {
          firstname: "Michael",
          lastname: "Pollan",
          firstInitial: "M"
        }
      ],
      title: "The Omnivore’s Dilemma: A Natural History of Four Meals",
      pubYear: "2006",

      original: "1. Michael Pollan, The Omnivore’s Dilemma: A Natural History of Four Meals (New York: Penguin, 2006), 99–100.",
      index: 0,
    }
  ],

  formattingProblems: null,
}

*/