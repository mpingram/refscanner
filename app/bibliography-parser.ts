import {
  Reference,
  UnparsedReference,
  ParsedReferenceSet,
  Author
} from "./typedefs";

export class BibliographyParser {

    private static bibliographyToArray( text: string ) : string[] {
      return text.split('\n').filter( entry => {
        if( entry.length > 1 ) return true;
        else return false;
      });
    }

    static parseAPA( text: string ): ParsedReferenceSet {

      let unparsedReferences: UnparsedReference[] = [];
      let parsedReferences: Reference[] = [];
      // match first block of text until first period
      const nameListOrTitleRe = /^(.+?)\./m;
      // match block of text between first and second period,
      //   after which should occur a date.
      const titleRe = /^.*?\. ?(.+?)\..+?([1][0-9][0-9][0-9]|[2][0][0-2][0-9])/m;
      // match valid date after two periods.
      const pubYearRe = /^.*?\..*?([1][0-9][0-9][0-9]|[2][0][0-2][0-9])/m;

      // helper functions
      // -------------------
      function parseNameListAPA( nameList: string, index: number, bibliographyArray: string[] ): Author[]|null {
        // triple hyphen indicates same as previous author
        // FIXME: remember that "---, Cohen, and Leonard" is valid.
        // TODO: parse name list
        //   - handle case where  first entry in nameList === "---" || name === "–––" || name === "———"
        // name parsing regex candidate: ^(.+?),|and .*?([A-Z]\S+?\b)$|and .*?([A-Z]\S+?), [a-z]+?$|^(---)$|^(–––)$|^(———)$
      }// https://regex101.com/r/nhOttU/1

      function fixTitleQuotes( title: string ): string {
        // if title begins with a quotation mark but doesn't end with a quotation mark... 
        if( title.slice(0) === '"' && title.slice(-1) !== '"' ){
          // add a quotation mark to the end.
          title += '"';
        }
        return title;
      }
      // -----------------

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
            reference.parsedNameList = parseNameListAPA( reference.unparsedNameList, index, bibliographyArray );
            reference.title = titleMatch[1];
          }
          // either way, store pubYear and add reference to parsedReferences
          reference.pubYear = pubYearMatch[1];
          parsedReferences.push( reference );
        }
      }, [] );

      return {parsedReferences, unparsedReferences};
    }

    static parseHarvard( text: string ): ParsedReferenceSet {
      let unparsedReferences: UnparsedReference[] = [];
      let parsedReferences: Reference[] = [];

      return {parsedReferences, unparsedReferences};
    }

    static parseChicago(text: string ): ParsedReferenceSet {
      let unparsedReferences: UnparsedReference[] = [];
      let parsedReferences: Reference[] = [];

      return {parsedReferences, unparsedReferences};
    }

    static parseMLA( text: string ): ParsedReferenceSet {
      let unparsedReferences: UnparsedReference[] = [];
      let parsedReferences: Reference[] = [];

      return {parsedReferences, unparsedReferences};
    }
  }