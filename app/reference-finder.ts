import { ReferenceStyle,
  Reference, 
  UnparsedReference,
  Author,
  ParsedReferenceSet,
  PossibleBiblioReferenceSet, 
  MainTextReferenceSet, 
  MissingReferenceSet } from "./typedefs";

import { BibliographyParser } from "./bibliography-parser";
//import { MainTextParser } from "./main-text-parser";

export class ReferenceFinder {

  static bibliography = {
    APA( text: string ): ParsedReferenceSet {
      return BibliographyParser.parseAPA( text );
    },
    Chicago( text: string ): ParsedReferenceSet {
      return BibliographyParser.parseChicago( text );
    },
    Harvard( text: string ): ParsedReferenceSet {
      return BibliographyParser.parseHarvard( text );
    },
    MLA( text: string ): ParsedReferenceSet {
      return BibliographyParser.parseMLA( text );
    }

  }

  static mainText = {
    
  }

}