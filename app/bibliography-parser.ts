import {
  Reference,
  UnparsedReference,
  ParsedReferenceSet,
  Author,
  AuthorList
} from "./typedefs";

export class BibliographyParser {

    private static bibliographyToArray( text: string ) : string[] {
      return text.split('\n').filter( entry => {
        if( entry.length > 1 ) return true;
        else return false;
      });
    }

    // helper routine to get first match from regex, regardless
    // of capturing group order
    private static getFirstMatch( regex: RegExp, text: string ): string | null {
      const match: RegExpExecArray = regex.exec( text );
      if ( match === null ){
        return null;
      }
      for ( let groupNumber = 1; groupNumber < match.length; groupNumber++ ){
        let capturingGroup = match[ groupNumber ];
        if ( capturingGroup !== undefined ) {
          // trim just in case
          return capturingGroup.trim();
        }
      }
      return null;
    }

    private static getInitial( name: string | null ): string | null {
      if ( name === null ) return null;
      return name.slice(0,1);   
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

      // NOTES: regex testing urls
      // names only:
      // https://regex101.com/r/nhOttU/1
      // full text:
      // https://regex101.com/r/XyvvRy/1

      // helper functions
      // ==========================
      function parseNameListAPA( nameListString: string, previouslyParsedReferences: Reference[] ): AuthorList {

        // initialize output
        let authorList: AuthorList = {} as AuthorList;
        let firstAuthor: Author = {} as Author;
        let secondAuthor: Author = {} as Author;
        let threeOrMoreAuthors: boolean;

        // RegExps
        // -------
        const tripleHyphenRe: RegExp = /^(---)|^(–––)|^(———)/;
        const etAlRe: RegExp = /et al/;
        const primaryAuthorLastNameRe: RegExp = /^(.+?),/;
        const secondaryAuthorLastNameRe: RegExp = /and .*?([A-Z]\S+?\b)$|and .*?([A-Z]\S+?), [a-z]+?$/;
        const primaryAuthorFirstNameRe: RegExp = /^.+?, (.+?),|^.+?, (.+?)$/;
        // -------

        // parse name list
        // ============

        const primaryAuthorLastName: string = BibliographyParser.getFirstMatch( primaryAuthorLastNameRe, nameListString );
        const secondaryAuthorLastName: string = BibliographyParser.getFirstMatch( secondaryAuthorLastNameRe, nameListString );
        const primaryAuthorFirstName: string = BibliographyParser.getFirstMatch( primaryAuthorFirstNameRe, nameListString );

        firstAuthor.lastname = primaryAuthorLastName
        firstAuthor.firstname = primaryAuthorFirstName
        firstAuthor.firstInitial = BibliographyParser.getInitial( firstAuthor.firstname );
        // if we didn't match a second author, null the second author in our output AuthorList
        if ( secondaryAuthorLastName === null ){
          secondAuthor = null;
        } else {
          secondAuthor.lastname = secondaryAuthorLastName;
        }
       

        const nameOmitted: boolean = tripleHyphenRe.test(nameListString);
        const containsEtAl: boolean = etAlRe.test(nameListString);
        if ( nameOmitted === true ){
          const previousReference = previouslyParsedReferences[previouslyParsedReferences.length - 1];
          firstAuthor = previousReference.parsedNameList.firstAuthor;
        }
        if ( containsEtAl === true ){
          threeOrMoreAuthors = true;
        }

        authorList.firstAuthor = firstAuthor;
        authorList.secondAuthor = secondAuthor;
        authorList.threeOrMoreAuthors = threeOrMoreAuthors;
        return authorList;
      }


      function fixTitleQuotes( title: string ): string {
        // if title begins with a quotation mark but doesn't end with a quotation mark... 
        // FIXME: account for inner quotations (“ ”). Wow, not sure how to deal with that inconsistency
        if( title.slice(0,1) === '"' && title.slice(-1) !== '"' ){
          // add a quotation mark to the end.
          title += '"';
        } else if ( title.slice(0,1) === '“' && title.slice(-1) !== '”'){
          title += '”';
        }
        return title;
      }
      // ==========================


      this.bibliographyToArray( text ).forEach( (entry, index, bibliographyArray) => {

        let reference: Reference = { 
          unparsedNameList: undefined,
          parsedNameList: undefined,
          title: undefined,
          pubYear: undefined,
          original: entry,
        };

        const nameListOrTitleMatch: RegExpExecArray = nameListOrTitleRe.exec( entry );
        const titleMatch: RegExpExecArray = titleRe.exec( entry );
        const pubYearMatch: RegExpExecArray = pubYearRe.exec( entry );

        if( nameListOrTitleMatch === null || pubYearMatch === null ){
          // give up; we'll let the user figure this one out.
          parsedReferences.push( reference );
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
            reference.parsedNameList = parseNameListAPA( reference.unparsedNameList, parsedReferences );
            let title = titleMatch[1];
            reference.title = fixTitleQuotes( title );
          }
          // either way, store pubYear and add reference to parsedReferences
          reference.pubYear = pubYearMatch[1];
          parsedReferences.push( reference );
        }
      });

      return parsedReferences;
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