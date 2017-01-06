export const enum ReferenceStyle {
  APA,
  MLA,
  Chicago,
  Harvard
};

export type PossibleBiblioReferenceSet = Array<Array<string>>;
export type MainTextReferenceSet = Array<string>;
export type MissingReferenceSet = Array<string>;

export interface Author {
  firstname: string;
  lastname: string;
  firstInitial: string;
}

export interface Reference {
  unparsedNameList?: string|null;
  parsedNameList?: Author[]|null;
  title?: string|null;
  pubYear: string;
}