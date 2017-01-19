import { APABibliographyParser } from "../parsers/APA/APA-bibliography-parser";

import { mockInputBibliographyAPA } from "./mock-input-bibliography-apa";

import { ParsedReferenceSet } from "../typedefs";

describe( "Bibliography Parser", () => {

  describe( "APA", () => {

    const mockInput = mockInputBibliographyAPA;

    let input: string;
    let expectedOutput: ParsedReferenceSet;

    xit( "should accurately parse a single input", () => {
      
      input = mockInputBibliographyAPA.smallValidSingle;
      
      expectedOutput = mockInput.solution[0];
      

      let output = BibliographyParser.parseAPA( input );
      expect( output ).toEqual( expectedOutput );

    });


    it( "This is just to see what it does", () => {


      input = mockInputBibliographyAPA.smallValid;
      let output = BibliographyParser.parseAPA( input );
      console.log( JSON.stringify( output, undefined, 4 ) );
      expect( "your ass" ).toBe( "amazed or sad, maybe both" );
    })





  });
});