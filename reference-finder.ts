import { ReferenceStyle,
  Reference, 
  Author,
  PossibleBiblioReferenceSet, 
  MainTextReferenceSet, 
  MissingReferenceSet } from "./typedefs";

export class ReferenceFinder {

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
      //   after which should occur a date.
      // NB - will need to add final '"' to entries that start with quote, because of "The Titles That End With A Period."
      // heuristic: if nameOrTitle was a title, the next period ends the bibliography
      //   and this re does not match due to lack of a date.
      const titleRe = /^.*?\. ?(.+?)\..+?([1][0-9][0-9][0-9]|[2][0][0-2][0-9])/m;
      // match valid date after two periods.
      const pubYearRe = /^.*?\..*?([1][0-9][0-9][0-9]|[2][0][0-2][0-9])/m;

      // helper function parses name list, using references to parent bibliography
      //   array to resolve repeated names, which are replaced with triple hyphens in MLA style 
      function parseNameListAPA( nameList: string, index: number, bibliographyArray: string[] ): Author[]|null {
        // triple hyphen indicates same as previous author
        // FIXME: remember that "---, Cohen, and Leonard" is valid.
        if( nameList === "---" || nameList === "–––" || nameList === "———"){
          return null;
        } else {
          // TODO: parse name list
        }
      }

      // helper function 
      function fixTitleQuotes( title: string ): string {
        // if title begins with a quotation mark but doesn't end with a quotation mark... 
        if( title.slice(0) === '"' && title.slice(-1) !== '"' ){
          // add a quotation mark to the end.
          title += '"';
        }
        return title;
      }

      this.bibliographyToArray( text ).forEach( (entry, index, bibliographyArray) => {

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
            let title = nameListOrTitleMatch[1];
            reference.title = fixTitleQuotes( title );
            reference.unparsedNameList = null;
            reference.parsedNameList = null;
          } else {
            // assume nameListOrTitleMatch matched nameList
            //   and titleMatch matched title
            reference.unparsedNameList = nameListOrTitleMatch[1];
            let parsedNameList: Author[] = parseNameListAPA( reference.unparsedNameList, index, bibliographyArray );

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