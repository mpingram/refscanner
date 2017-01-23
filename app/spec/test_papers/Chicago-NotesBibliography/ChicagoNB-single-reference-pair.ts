import { Reference } from "../../../typedefs/reference-types";

export const singleMainText: string = `1. Michael Pollan, The Omnivore’s Dilemma: A Natural History of Four Meals (New York: Penguin, 2006), 99–100.
`;

export const singleMainTextWithDuplicates: string = `1. Michael Pollan, The Omnivore’s Dilemma: A Natural History of Four Meals (New York: Penguin, 2006), 99–100.
2. Ibid., 30.
3. Pollan, Omnivore’s Dilemma, 3.
`;

export const singleBibliography: string = `Pollan, Michael. The Omnivore’s Dilemma: A Natural History of Four Meals. New York: Penguin, 2006.
`;


export const parsedSingleMainText: Reference[] = [
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
]


export const parsedSingleBibliography: Reference[] = [
  {
    unparsedNameList: "Michael Pollan",
    parsedNameList: [
      {
        firstname: "Michael",
        lastname: "Pollan",
        firstInitial: "M"
      }
    ],
    original: "1. Michael Pollan, The Omnivore’s Dilemma: A Natural History of Four Meals (New York: Penguin, 2006), 99–100.",
    index: 0,
  }
]