// rough outline of class:
// - initialized with in-text reference style, biblio style, and file paths to main text and bibliography.
// - reads in biblio and finds set of biblio references according to reference style
// - checks main text for biblio references
// - checks main text for inline references - do they exist in biblio references? -- going backwards is the hard part. We'll need titles for the MLA and Chicago citations. -- re titles: should store as split array by words, look for first 3 elements? What about one-word titles? Ughhhhhhhhhhhghghghg
"use strict";

import { ReferenceStyle,
  Reference, 
  Author,
  ParsedReferenceSet,
  PossibleBiblioReferenceSet, 
  MainTextReferenceSet, 
  MissingReferenceSet } from "./typedefs";

import { ReferenceFinder } from "./reference-finder";

export class RefChecker {
  public calculateRefs( { mainText, bibliography, mainTextRefStyle, biblioRefStyle }
                       : { mainText: string, bibliography: string, mainTextRefStyle: ReferenceStyle, biblioRefStyle: ReferenceStyle } ) : MissingReferenceSet {
    let missingRefs: MissingReferenceSet;

    return missingRefs;
  }
}


function parseBibliography( bibliography: string, biblioRefStyle: ReferenceStyle ): ParsedReferenceSet {
  
  let possibleBiblioRefs: ParsedReferenceSet;

  switch( biblioRefStyle ){
    case ReferenceStyle.APA:
      possibleBiblioRefs = ReferenceFinder.bibliography.APA( bibliography );
      break;
    case ReferenceStyle.Chicago:
      possibleBiblioRefs = ReferenceFinder.bibliography.Chicago( bibliography );
      break;
    case ReferenceStyle.Harvard:
      possibleBiblioRefs = ReferenceFinder.bibliography.Harvard( bibliography );
      break;
    case ReferenceStyle.MLA:
      possibleBiblioRefs = ReferenceFinder.bibliography.MLA( bibliography );
      break;
  }

  return possibleBiblioRefs;
}


function readMainText( mainText: string, mainTextRefStyle: ReferenceStyle ): MainTextReferenceSet {
  let mainTextRefs: MainTextReferenceSet;

  return mainTextRefs;
}

