import { ParserUtils } from "../parser-utils";

import { Match } from "../../typedefs/parser-util-types";
import { Reference, Author } from "../../typedefs/reference-types";

export class APAMainTextParser {
  
  public static parse( mainText: string ): Reference[] {
    const normalizedMainText = ParserUtils.cleanTextInput( mainText );
    const inTextCitations: Reference[] = this.searchForCitations( normalizedMainText );
    return inTextCitations;

  }

  public static parseWithBiblioRefs( mainText: string, biblioRefs: Reference[] ): Reference[] {
    const normalizedMainText = ParserUtils.cleanTextInput( mainText );
    const inTextCitations: Reference[] = this.searchForCitations( normalizedMainText, biblioRefs );
    return inTextCitations;
  }

  private static searchForCitations( mainText: string, biblioRefs?: Reference[] ): Reference[]{
    
    // set a flag if we've been passed the bibliography References
    // to compare against the main text.
    let biblioFlag = false;
    if (biblioRefs !== undefined){
      biblioFlag = true;
    }

    // RegExps
    // ---------
    // Parse main text:
    // finds all parenthesized substrings which come at the end of a 
    // clause, sentence, or line.
    const citationRe = /\(([^(]+?)\)[!?.,;:\n]/g;
    
    // Parse citation:
    // Notes: strategy... hm
    //  -- try to sort citation into different bins
    //     -- Single Author ([Author|A. Author|Firstname Author] PageNum)
    //     -- Multiple Author ([Author] and [Author] PageNum)
    //     -- Single/Multiple Author with Title
    //     -- Multiple Citations (rare) (Citation; Citation)
    //     -- Title Only ([Title|"Title"] PageNum)
    //     -- PageNum Only (PageNum)
    // 
    // Using that information, construct partial reference.
    // ----------

    // store all citations found in main text in an array
    let matches: Match[] = ParserUtils.allMatches( citationRe, mainText );

    // sort these matches into references, with the help of biblioRefs if provided
  }

  
  
}