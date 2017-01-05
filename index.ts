// rough outline of class:
// - initialized with in-text reference style, biblio style, and file paths to main text and bibliography.
// - reads in biblio and finds set of biblio references according to reference style
// - checks main text for biblio references
// - checks main text for inline references - do they exist in biblio references? -- going backwards is the hard part. We'll need titles for the MLA and Chicago citations. -- re titles: should store as split array by words, look for first 3 elements? What about one-word titles? Ughhhhhhhhhhhghghghg
'use strict';

import { ReferenceStyle, PossibleBiblioReferenceSet, MainTextReferenceSet, MissingReferenceSet } from "./typedefs";

module.exports = RefChecker;
class RefChecker {
  
  public calculateRefs( { mainText, bibliography, mainTextRefStyle, biblioRefStyle }
                       : { mainText: string, bibliography: string, mainTextRefStyle: ReferenceStyle, biblioRefStyle: ReferenceStyle } ) : MissingReferenceSet {

    let missingRefs: MissingReferenceSet;

    return missingRefs;
  }

}

function readBibliography( bibliography: string, mainTextRefStyle: ReferenceStyle, biblioRefStyle: ReferenceStyle ): PossibleBiblioReferenceSet {
  let possibleBiblioRefs: PossibleBiblioReferenceSet;

  return possibleBiblioRefs;
}

function readMainText( mainText: string, mainTextRefStyle: ReferenceStyle ): MainTextReferenceSet {
  let mainTextRefs: MainTextReferenceSet;

  return mainTextRefs;
}
