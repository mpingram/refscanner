// rough outline of class:
// - initialized with in-text reference style, biblio style, and file paths to main text and bibliography.
// - reads in biblio and finds set of biblio references according to reference style
// - checks main text for biblio references
// - checks main text for inline references - do they exist in biblio references? -- going backwards is the hard part. We'll need titles for the MLA and Chicago citations. -- re titles: should store as split array by words, look for first 3 elements? What about one-word titles? Ughhhhhhhhhhhghghghg
"use strict";

import { ReferenceStyle,
  Reference, 
  Author,
  PossibleBiblioReferenceSet, 
  MainTextReferenceSet, 
  MissingReferenceSet } from "./typedefs";

module.exports = RefChecker;
class RefChecker {
  public calculateRefs( { mainText, bibliography, mainTextRefStyle, biblioRefStyle }
                       : { mainText: string, bibliography: string, mainTextRefStyle: ReferenceStyle, biblioRefStyle: ReferenceStyle } ) : MissingReferenceSet {
    let missingRefs: MissingReferenceSet;

    return missingRefs;
  }
}


function readBibliography( bibliography: string, biblioRefStyle: ReferenceStyle ): PossibleBiblioReferenceSet {
  
  let possibleBiblioRefs: PossibleBiblioReferenceSet;

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

class ReferenceFinder {

  private static bibliographyToArray( text: string ) : string[] {
    return text.split('\n').filter( entry => {
      if( entry.length > 1 ) return true;
      else return false;
    });
  }


  static bibliography = {

    APA( text: string ): PossibleBiblioReferenceSet {

      const unparsedReferences: string[] = [];
      const parsedReferences: Reference[] = [];
      
      // match first block of text until first period
      const nameListOrTitleRe = /^(.+?)\./m;
      // match block of text between first and second period,
      // after which should occur a date.
      // NB - will need to add final '"' to entries that start with quote, because of "The Titles That End With A Period."
      // heuristic: if nameOrTitle was a title, the next period ends the bibliography
      //   and this re does not match due to lack of a date.
      const titleRe = /^.*?\. ?(.+?)\..+?([1][0-9][0-9][0-9]|[2][0][0-2][0-9])/m;
      // match valid date after two periods.
      const pubYearRe = /^.*?\..*?([1][0-9][0-9][0-9]|[2][0][0-2][0-9])/m;

      function parseNameListAPA( nameList: string ): Author[]|null {
        // triple hyphen indicates same as previous author
        // ooh, but that also hm gah ok.
        if( nameList === "---" || nameList === "–––" || nameList === "———"){
          return null;
        } else {
          // TODO: parse name list
        }
      }

      this.bibliographyToArray( text ).forEach( (entry, index) => {

        let reference: Reference = { 
          unparsedNameList: undefined,
          parsedNameList: undefined,
          title: undefined,
          pubYear: undefined,
        };
        const nameListOrTitleMatch: RegExpExecArray = nameListOrTitleRe.exec( entry );
        const titleMatch: RegExpExecArray = titleRe.exec( entry );
        const pubYearMatch: RegExpExecArray = pubYearRe.exec( entry );

        if( nameListOrTitleMatch === null || pubYearMatch === null ){
          unparsedReferences.push( entry );
        } else {
          if ( titleMatch === null ){
            // assume nameListOrTitleMatch matched title
            reference.title = nameListOrTitleMatch[1];
            reference.unparsedNameList = null;
            reference.parsedNameList = null;
          } else {
            // assume nameListOrTitleMatch matched nameList
            // and titleMatch matched title
            reference.unparsedNameList = nameListOrTitleMatch[1];
            let parsedNameList: Author[]|null = this.parseNameListAPA( reference.unparsedNameList );

            reference.parsedNameList = parsedNameList;
            reference.title = titleMatch[1];
          }
          // either way, store pubYear and add reference to parsedReferences
          reference.pubYear = pubYearMatch[1];
          parsedReferences.push( reference );
        }
      }, [] );

    },
    Harvard( text: string ): PossibleBiblioReferenceSet {

    },
    Chicago(text: string ): PossibleBiblioReferenceSet {

    },
    MLA( text: string ): PossibleBiblioReferenceSet {

    }
  }

  static mainText = {
    APA( text: string ): MainTextReferenceSet {

    },
    Harvard( text: string ): MainTextReferenceSet {

    },
    Chicago(text: string ): MainTextReferenceSet {

    },
    MLA( text: string ): MainTextReferenceSet {

    }
  }
}


function readMainText( mainText: string, mainTextRefStyle: ReferenceStyle ): MainTextReferenceSet {
  let mainTextRefs: MainTextReferenceSet;

  return mainTextRefs;
}

