// component
import { ChicagoNBMainTextParser } from "./ChicagoNB-main-text-parser";

// typedefs
import { Reference } from "../../typedefs/reference-types";

// mocks
import { singleMainText, parsedSingleMainText } from "../../spec/test_papers/Chicago-NotesBibliography/ChicagoNB-single-reference-pair";

describe( "Chicago Notes/Bibliography parser", () => {

  it( "should accurately parse a single bilbiography reference", () => {

    const output: Reference[] = ChicagoNBMainTextParser.parse( singleMainText );
    const expected_output: Reference[] = parsedSingleMainText;

    expect( output ).toEqual( expected_output );

  });



  it( "should accurately parse a large set of valid bibliography references", () => {

  });

  it( "should accurately parse a large set of mixed valid and invalid references", () => {

  });

  it( "should check for incorrect alphabetical order.", () => {

  });
  
});