// component
import { ChicagoNBMainTextParser } from "./ChicagoNB-main-text-parser";

// typedefs
import { ParserReport, Reference, FormattingProblem } from "../../typedefs/reference-types";

// mocks
import * as SingleMainText from "../../spec/test_papers/Chicago-NotesBibliography/ChicagoNB-single-main-text";

describe( "Chicago Notes/Bibliography Main Text parser", () => {

  let output: ParserReport;
  let expected_output: ParserReport;
  let expected_formattingProblems: FormattingProblem[];
  let input: string;

  function runParser( input: string ): ParserReport {
    return ChicagoNBMainTextParser.parse( input );
  }

  function buildParserReport( references: Reference[], formattingProblems: FormattingProblem[] = null): ParserReport {
     return {
       references: references,
       formattingProblems: formattingProblems
     }
  }

  describe( "single reference tests", () => {


    it( "should accurately parse a single main text reference", () => {

      input = SingleMainText.mainText;
      expected_output = SingleMainText.parserReport;
      output = runParser( input );

      expect( output ).toEqual( expected_output );

    });

    it( "should reduce valid ibid and short form references.", () => {
      input = SingleMainText.mainTextWithDuplicates;
      expected_output = SingleMainText.parserReport;
      output = runParser( input );

      expect( output ).toEqual( expected_output );
    });

    it( "should report invalid ibid references.", () => {
      input = SingleMainText.mainTextwithInvalidIbid;
      expected_output = SingleMainText.parserReportInvalidIbid;
      output = runParser( input );

      expect( output ).toEqual( expected_output );
    });

    it( "should report invalid numbering order.", () => {
      input = SingleMainText.mainTextwithInvalidOrder;
      expected_output = SingleMainText.parserReportInvalidIbid;
    });

  });

  describe( "multiple reference tests", () => {
    it( "should accurately parse a large set of valid main text references", () => {

    });

    it( "should accurately parse a large set of mixed valid and invalid references", () => {

    });

    it( "should report incorrect alphabetical order when parsing.", () => {

    });

    it( "should report duplicate references when parsing.", () => {

    });

  });
  



});