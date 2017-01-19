import { ParserUtils } from "../parser-utils";
import { Reference,
  Author,
  AuthorList,
} from "../../typedefs/reference-types";


export class APABibliographyParser {

  public static parse( bibliography: string ): Reference[] {

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

      // parse first author's name and add to AuthorList
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
      
      // parse second author's last name, if exists, and add to AuthorList
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
    

    let reference: Reference = { 
      unparsedNameList: undefined,
      parsedNameList: undefined,
      title: undefined,
      pubYear: undefined,
      original: unparsedReference,
    };

    // RegExps
    // ===========
    // I. match first "block" of text.
    //   Group 1: (3+ authors) Match first string ending with et al.
    //   Group 2: (Titles, hyphens, and single-name authors) Match a string without commas in it that ends with a period. (Titles.)
    //   Groups 3-9: (One author) Match everything after the first period, if
    //               the first period doesn't end with an initial or family designations
    //               (eg , Jr., Sr., I, II, III, IV, or V.)
    //   Group 10: (Multiple Authors)
    // Regex101 URL: https://regex101.com/r/ltAgTV/1
    const nameListOrTitleRe = /(^.*?et al)\.|(^[^,]*?[\S]{3,})\.|(^[^,]+?,[^,]+?)\.|(^[^,]+?,[^,]+?, Jr)\.|(^[^,]+?,[^,]+?, Sr)\.|(^[^,]+?,[^,]+?, II)\.|(^[^,]+?,[^,]+?, III)\.|(^[^,]+?,[^,]+?, IV)\.|(^[^,]+?,[^,]+?, V)\.|(^.*?[\S]{3,})\./g;
    
    // II. match second "block" of text, if it appears to be a title.
    //   Group 1: (Title) match block of text between first and second period,
    //             after which should occur a date.
    const titleRe = /^.*?\. ?(.+?)\..+?([1][0-9][0-9][0-9]|[2][0][0-2][0-9])/m;

    // III. match publication year, which is located in different places
    //    Group 1: match valid date that occurs after the title, after two periods.
    const pubYearRe = /^.*?\. ?.+?\..+?([1][0-9][0-9][0-9]|[2][0][0-2][0-9])/m;
    // ============

    const nameListOrTitle: string | null = ParserUtils.firstMatch( nameListOrTitleRe, unparsedReference );
    const title: string | null           = ParserUtils.firstMatch( titleRe, unparsedReference );
    const pubYear: string | null         = ParserUtils.firstMatch( pubYearRe, unparsedReference );
   

    // figure out if nameListOrTitle matched the name list or the title.
    // ----
    if ( title === null ){
      // assume nameListOrTitleMatch matched title
      let title = nameListOrTitle;
      reference.title = ParserUtils.fixMissingQuotationMark( title );
      reference.unparsedNameList = null;
      reference.parsedNameList = null;
    } else {
      // assume nameListOrTitleMatch matched nameList
      //   and titleMatch matched title
      reference.title = ParserUtils.fixMissingQuotationMark( title );
      reference.unparsedNameList = nameListOrTitle;
      reference.parsedNameList = this.parseNameList( reference.unparsedNameList, previouslyParsedReferences );
    }


    // search for the publication year
    if ( reference.title !== null ){
      // if we found the title, search for the pub year after it.
      // (That way, we don't pick up years that are inside titles.)
      const indexOfTitle = unparsedReference.indexOf( reference.title );
      const referenceWithoutTitle: string = unparsedReference.slice( indexOfTitle );
      reference.pubYear = ParserUtils.firstMatch( pubYearRe, referenceWithoutTitle );
    } else {
      // if we don't have a title, we're already in a bad way, so give up and
      // let the human parse this one.
      reference.pubYear = null;
    }
    
    return reference;
  }


}