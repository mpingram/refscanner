import { BibliographyParser } from "../bibliography-parser";

import { mockInputBibliographyAPA } from "./mock-input-bibliography-apa";

import { ParsedReferenceSet } from "../typedefs";

describe( "Bibliography Parser", () => {

  describe( "APA", () => {

    const mockInput = mockInputBibliographyAPA;

    let input: string;
    let expectedOutput: ParsedReferenceSet;

    it( "should accurately parse a single input", () => {
      
      input = mockInputBibliographyAPA.smallValidSingle;
      
      expectedOutput = { 
        parsedReferences: mockInput.solution[0][0],
        unparsedReferences: [] 
      };

      let output = BibliographyParser.parseAPA( input );
      expect( output.parsedReferences ).toEqual( expectedOutput.parsedReferences );

    });





  });
});