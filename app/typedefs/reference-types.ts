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
  unparsedNameList: string | null;
  parsedNameList: Author[] | null
  title: string | null;
  pubYear: string | null;

  original: string;
  index: number;
}


export interface ParserReport {
  references: Reference[],
  formattingProblems: FormattingProblem[] | null,
}

export interface FormattingProblem {
  type: FormattingProblemType,
  original: string,
  index: number,
}

export enum FormattingProblemType {
  "alphabeticalOrder",
  "numericalOrder",
  "duplicate",
}

export type ParsedReferenceSet = Reference[];

export type PossibleBiblioReferenceSet = Array<Array<string>>;
export type MainTextReferenceSet = Array<string>;
export type MissingReferenceSet = Array<string>;
