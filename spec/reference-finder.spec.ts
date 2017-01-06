import { ReferenceFinder } from "../reference-finder";
import { referenceFinderMockInput } from "./reference-finder-mock-input";

const mockInput = referenceFinderMockInput;

describe( "Bibliography", () => {

  describe( "APA parser", () => {

    let out: any;
    beforeEach( () => {
      out = mockInput.solution;
    });

    it( "should accurately parse a single input", () => {
      const firstInput = mockInput.smallValidSingle;
      const firstSolution = out[1]
      expect( firstInput ).toEqual( firstSolution );
    })

  }
})