import { ParserUtils } from "../parser-utils";
import { Reference,
  Author,
  AuthorList,
} from "../../typedefs";


export class APABibliographyParser {


  static parse( bibliography: string ): Reference[] {

    let parsedReferences: Reference[] = [];

    const bibliographyArr: string[] = ParserUtils.bibliographyToArray( bibliography );
    
    bibliographyArr.forEach( entry => {
      parsedReferences.push( this.parseReference( entry, parsedReferences ) );
    });

    return parsedReferences;
  }

  private static parseNameList( nameListString: string, previouslyParsedReferences: Reference[] ): AuthorList {


      let authorList: AuthorList = {} as AuthorList;
      authorList.firstAuthor = {} as Author;
      authorList.secondAuthor = {} as Author;
      authorList.threeOrMoreAuthors = null;

      // RegExps
      const tripleHyphenRe: RegExp = /^(---)|^(–––)|^(———)/;
      const etAlRe: RegExp = / et al/;
      const primaryAuthorLastNameRe: RegExp = /^(.+?),/;
      const secondaryAuthorLastNameRe: RegExp = /and .*?([A-Z]\S+?\b)$|and .*?([A-Z]\S+?), [a-z]+?$/;
      const primaryAuthorFirstNameRe: RegExp = /^.+?, (.+?),|^.+?, (.+?)$/;


      // =======================

      // parse first author's name
      // -------------------------
      const primaryAuthorLastName: string   = ParserUtils.firstMatch( primaryAuthorLastNameRe, nameListString );
      const primaryAuthorFirstName: string  = ParserUtils.firstMatch( primaryAuthorFirstNameRe, nameListString );

      authorList.firstAuthor.lastname     = primaryAuthorLastName;
      authorList.firstAuthor.firstname    = primaryAuthorFirstName;
      authorList.firstAuthor.firstInitial = ParserUtils.getInitialChar( authorList.firstAuthor.firstname );
      // check to see if first author's name has been ommitted, indicating
      // same author as previous entry
      const nameOmitted: boolean = tripleHyphenRe.test(nameListString);
      if ( nameOmitted === true ){
        const previousReference = previouslyParsedReferences[previouslyParsedReferences.length - 1];
        authorList.firstAuthor = previousReference.parsedNameList.firstAuthor;
      }
      
      // parse second author's last name, if exists
      // -------------------------
      const secondaryAuthorLastName: string = ParserUtils.firstMatch( secondaryAuthorLastNameRe, nameListString );
      if ( secondaryAuthorLastName === null ){
        authorList.secondAuthor = null;
      } else {
        authorList.secondAuthor.lastname = secondaryAuthorLastName;
      }
      
      // check for three or more authors
      // -------------------------
      const containsEtAl: boolean = etAlRe.test(nameListString);
      if ( containsEtAl === true ){
        authorList.threeOrMoreAuthors = true;
      } else {
        authorList.threeOrMoreAuthors = false;
      }

      // ========================

      return authorList;
  }

  private static parseReference( unparsedReference: string, previouslyParsedReferences: Reference[] ): Reference | null {
    // match first block of text until first period, so long as 
    const nameListOrTitleRe = /^.*?et al\.|^.*?[\S]{3,}\./m;
    // TODO: write RE to examine corner case where nameListOrTitle is a Name List
    // wchich ended with 'Jr.', 'Sr.', or an initial.
    // Strat: step back by one period. Is there an 'and' to the left?
    // if so, look for Jr. or Sr. immediately to left.
    // if not, look for single initial immediately to left.
    // the result of this is important -- it'll determine where we look for the title. (!!)
    const nameListEndCheck = /[implement me]/g;
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

    let reference: Reference = { 
      unparsedNameList: undefined,
      parsedNameList: undefined,
      title: undefined,
      pubYear: undefined,
      original: unparsedReference,
    };

    const nameListOrTitleMatch: RegExpExecArray = nameListOrTitleRe.exec( unparsedReference );
    const titleMatch: RegExpExecArray = titleRe.exec( unparsedReference );
    const pubYearMatch: RegExpExecArray = pubYearRe.exec( unparsedReference );


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
      reference.parsedNameList = this.parseNameList( reference.unparsedNameList, previouslyParsedReferences );
      let title = titleMatch[1];
      reference.title = ParserUtils.fixMissingQuotationMark( title );
    }
    // either way, store pubYear and add reference to parsedReferences
    reference.pubYear = pubYearMatch[1];
    
    return reference;
  }


}