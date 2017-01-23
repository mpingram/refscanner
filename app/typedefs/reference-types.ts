export const enum ReferenceStyle {
  APA,
  MLA,
  Chicago,
  Harvard
};

export interface Author {
  lastname: string;
  firstname?: string;
  firstInitial?: string;
}

export interface AuthorList {
  firstAuthor: Author;
  secondAuthor?: Author;
  threeOrMoreAuthors?: boolean;// "et al." | "and colleagues"
}

export interface Reference {
  unparsedNameList?: string|null;
  parsedNameList?: AuthorList|null;
  title?: string|null;
  pubYear?: string;
  original: string;
  index: number;
}

export type UnparsedReference = string;
export type ParsedReferenceSet = Reference[];

export type PossibleBiblioReferenceSet = Array<Array<string>>;
export type MainTextReferenceSet = Array<string>;
export type MissingReferenceSet = Array<string>;
