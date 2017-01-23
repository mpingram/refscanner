import { ParserUtils } from "../parser-utils";

import { Match } from "../../typedefs/parser-util-types";
import { Reference, Author } from "../../typedefs/reference-types";

export class APAMainTextParser {
  

  public static parse( mainText: string, biblioRefs: Reference[] ): Reference[] {
    const normalizedMainText = ParserUtils.cleanTextInput( mainText );
    const inTextCitations: Reference[] = this.findInTextCitations( normalizedMainText, biblioRefs );
    return inTextCitations;
  }

  private static findInTextCitations( mainText: string, biblioRefs: Reference[] ): Reference[]{
   
    let references: Reference[] = [];

    // RegExps
    // ---------
    // Parse main text:
    //   finds all parenthesized substrings which come at the end of a 
    //   clause, sentence, or line.
    const citationRe = /\(([^(]+?)\)[!?.,;:\n]/g;

    // -------------

    // helper function
    function parseCitation( citationMatch: Match ): Reference {

      // Regexes
      // -----------------------------
      // Parse citations:
      //   I. finds page numbers
      const pageNumRe = /([0-9]{1,4})|([lxvi]{1,8})$|([lxvi]{1,8}),/;
      //   Remove pageNum from string.
      //   II. Take everything to the left of pageNum except 'quoted in ' and 'qtd. in '
      //const authorOrTitleRe = /quoted in (.+?) $|qtd\. in (.+?) $|(.+?) $|(.{2,}?)$/;
      const authorOrTitleRe = /quoted in (.+?) $|qtd\. in (.+?) $|(.+?\S+?) *$/;
      //   III. Try to determine if it's a single author, double author, 3+ author, or title.
      //        These categories will unfortunately be fuzzy.
      const singleAuthorRe = /^([A-Z][^ ]+?)$|^(([A-Z]\. {0,1}){1,3}[^ ]+?)$/g;
      const twoAuthorRe = / /g;
      const threePlusAuthorRe = / /g;
      // ------------------------------


      const citation = citationMatch.captures[0];

      let reference: Reference = {
        original: citation,
        index: citationMatch.index
      }

      const pageNumMatch: Match | null = ParserUtils.firstMatch( pageNumRe, citation );

      if ( pageNumMatch === null ){
        // return incomplete reference
        return reference;
      }

      const pageNum: string = pageNumMatch.captures[0];
      
      const leftOfPageNumSubstring: string = citation.slice(0, pageNumMatch.index);
      const authorOrTitleMatch: Match | null = ParserUtils.firstMatch( authorOrTitleRe, leftOfPageNumSubstring );

      if ( authorOrTitleMatch === null ){
        // assume we need to look for the author or title within the sentence: here's where we need the bibliography references
      } else {
        // assume what we captured is either the author or the title: we aren't sure.
        const authorOrTitle: string = authorOrTitleMatch.captures[0];

      }

      return reference;
    }
    
    const citationMatches: Match[] = ParserUtils.allMatches( citationRe, mainText );
    
    for (let match of citationMatches){
      const matchText: string = match.captures[0];
      const isMultipleCitation: boolean = matchText.indexOf(";") !== -1;
      
      if ( isMultipleCitation ){
        for ( let subCitation in matchText.split(";") ){
          const subCitationIndex = match.index + matchText.indexOf(subCitation);
          let subCitationMatch: Match = {
            fullMatch: match.fullMatch,
            captures: [subCitation],
            index: subCitationIndex
          };
          references.push( parseCitation( subCitationMatch ));
        }

      } else {
        references.push( parseCitation(match) );
      }
    };
  }
  
  
}