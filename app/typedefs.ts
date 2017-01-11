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

export interface Reference {
  unparsedNameList?: string|null;
  parsedNameList?: Author[]|null;
  title?: string|null;
  pubYear: string;
}

export type UnparsedReference = string;
export interface ParsedReferenceSet {
  unparsedReferences: UnparsedReference[],
  parsedReferences: Reference[]
}

export type PossibleBiblioReferenceSet = Array<Array<string>>;
export type MainTextReferenceSet = Array<string>;
export type MissingReferenceSet = Array<string>;
