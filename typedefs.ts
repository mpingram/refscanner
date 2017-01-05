export const enum ReferenceStyle {
  APA,
  MLA,
  Chicago,
  Harvard
};

export type PossibleBiblioReferenceSet = Array<Array<string>>;
export type MainTextReferenceSet = Array<string>;
export type MissingReferenceSet = Array<string>;