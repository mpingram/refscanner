import { Author, 
  AuthorList, 
  Reference,
  UnparsedReference,
  FormattingProblem } from "../../typedefs/reference-types";
import { firstMatch,
  fixMissingQuotationMark,
  initialChar,
  cleanTextInput
} from "../parser-utils";
import { Match } from "../../typedefs/parser-util-types";


export class ChicagoNBMainTextParser {

  static parse( mainText: string ): Reference[] {
    let references: Reference[] = [];

    mainText = cleanTextInput( mainText );
    const unparsedReferences: UnparsedReference[] = this.getReferences( mainText );

    for ( let unparsedReference of unparsedReferences ){
      const reference: Reference | null = this.parseReference( unparsedReference, references );
      if ( reference !== null ){
        references.push( reference );
      }
    }

    return references;
  }
  
  //-----------------------------

  private static getReferences( text: string ): UnparsedReference[] {
    // assumption: only references, and not main text, is passed in
    let unparsedReferences: UnparsedReference[] = [];
    const unparsedReferenceTextArr: string[] = text.split( "\n" );

    let lastIndex: number = 0;
    for ( let original of unparsedReferenceTextArr ){
      let index: number = text.indexOf( , lastIndex );
      lastIndex = index;

      unparsedReferences.push( {
        original,
        index
      });
    }

    return unparsedReferences;

  }

  private static parseReference( unparsedReference: UnparsedReference, previouslyParsedReferences: Reference[] ): Reference | null {

    // RegExps
    const re = {
      ibid: /^\s*ibid|^\s*Ibid/,
      footNoteNumber: /^([0-9]{1,5})\.?/,
      // match first "block" of text.
      //   Group 1: (3+ authors) Match first string ending with et al.
      //   Group 2: (Titles, hyphens, and single-name authors) Match a string without commas in it that ends with a period. (Titles.)
      //   Groups 3-9: (One author) Match everything after the first period, if
      //               the first period doesn't end with an initial or family designations
      //               (eg , Jr., Sr., I, II, III, IV, or V.)
      //   Group 10: (Multiple Authors)
      // Regex101 URL: https://regex101.com/r/ltAgTV/1
      nameListOrTitle: /(^.*?et al)\.|(^[^,]*?[\S]{3,})\.|(^[^,]+?,[^,]+?)\.|(^[^,]+?,[^,]+?, Jr)\.|(^[^,]+?,[^,]+?, Sr)\.|(^[^,]+?,[^,]+?, II)\.|(^[^,]+?,[^,]+?, III)\.|(^[^,]+?,[^,]+?, IV)\.|(^[^,]+?,[^,]+?, V)\.|(^.*?[\S]{3,})\./,
      // match second "block" of text, if it appears to be a title.
      //   Group 1: (Title) match block of text between first and second period,
      //             after which should occur a date.
      title: /^.*?\. ?(.+?)\..+?([1][0-9][0-9][0-9]|[2][0][0-2][0-9])/,
      // match publication year, which is located in different places
      //    Group 1: match valid date that occurs after the title, after two periods.
      pubYear: /^.*?\. ?.+?\..+?([1][0-9][0-9][0-9]|[2][0][0-2][0-9])/,
    }
    
    let reference: Reference;
    reference.original = unparsedReference;
    reference.index = 0; // FIXME

    const nameListOrTitleMatch: Match | null = firstMatch( re.nameListOrTitle, unparsedReference );
    const titleMatch: Match | null = firstMatch( re.title, unparsedReference );
    const pubYear: Match | null = firstMatch( re.pubYear, unparsedReference );
     

    // If reference is Ibid, skip it
    if ( re.ibid.test( unparsedReference ) === true ){
      if ( previouslyParsedReferences.length > 1 ){
        return null;
      // if there are no references already parsed, have the human take a look
      } else {
        return reference;
      }
    }

    // I. Parse name list and title.
    // -----------------------------
    if ( titleMatch === null ){
      // assume nameListOrTitleMatch matched title
      const title: string = nameListOrTitleMatch.captures[0];
      reference.title = fixMissingQuotationMark( title );
      reference.unparsedNameList = null;
      reference.parsedNameList = null;

    } else {
      // assume nameListOrTitleMatch matched nameList
      //   and titleMatch matched title
      const title: string = titleMatch.captures[0];
      const unparsedNameList: string = nameListOrTitleMatch.captures[0];
      reference.title = fixMissingQuotationMark( title );
      reference.unparsedNameList = unparsedNameList;
      reference.parsedNameList = this.parseNameList( unparsedNameList, previouslyParsedReferences );
    }

    // II. Parse publication year
    // -----------------------------
    if ( reference.title !== null ){
      // if we found the title, search for the pub year after it.
      // (That way, we don't pick up years that are inside titles.)
      const indexOfTitle = unparsedReference.indexOf( reference.title );
      const referenceWithoutTitle: string = unparsedReference.slice( indexOfTitle );
      const pubYearMatch = firstMatch( re.pubYear, referenceWithoutTitle );
      reference.pubYear = pubYearMatch.captures[0];
    } else {
      // if we don't have a title, we're already in a bad way, so give up and
      // let the human parse this one.
      reference.pubYear = null;
    }
    
    return [ reference, formattingProblem ];
  }

  private static parseNameList( nameListString: string, previouslyParsedReferences: Reference[] ): AuthorList {

      // RegExps
      // ======================
      const re_repeatedAuthor: RegExp = /^\s*---|^\s*–––|^\s*———/g;
      const re_etAl: RegExp = / et al/;
      const re_primaryAuthorLastName: RegExp = /^(.+?),/;
      const re_secondaryAuthorLastName: RegExp = /and .*?([A-Z]\S+?\b)$|and .*?([A-Z]\S+?), [a-z]+?$/;
      const re_primaryAuthorFirstName: RegExp = /^.+?, (.+?),|^.+?, (.+?)$/;
      // =======================


      let authorList: AuthorList;

      // parse first author's name and add to AuthorList
      let firstAuthor: Author;
      firstAuthor.lastname = ParserUtils.firstCapturingGroup( re_primaryAuthorLastName, nameListString );
      firstAuthor.firstname = ParserUtils.firstCapturingGroup( re_primaryAuthorFirstName, nameListString );
      firstAuthor.firstInitial = ParserUtils.getInitialChar( firstAuthor.firstname );
      // check to see if first author's name has been ommitted, indicating
      // same author as previous entry
      const isRepeatedAuthor: boolean = re_repeatedAuthor.test( nameListString );
      if ( isRepeatedAuthor === true ){
        const previousReference = previouslyParsedReferences[previouslyParsedReferences.length - 1];
        firstAuthor = previousReference.parsedNameList[0];
      }
      
      // parse second author's last name, if exists, and add to AuthorList
      // -------------------------
      let secondAuthor: Author;
      const secondaryAuthorLastName: string = ParserUtils.firstCapturingGroup( re_secondaryAuthorLastName, nameListString );
      if ( secondaryAuthorLastName === null ){
        secondAuthor = null;
      } else {
        secondAuthor.lastname = secondaryAuthorLastName;
      }
      
      // check for three or more authors
      // -------------------------
      const containsEtAl: boolean = re_etAl.test(nameListString);
      if ( containsEtAl === true ){
        authorList.etAl = true;
      } else {
        authorList.etAl = false;
      }

      // ========================

      return authorList;
  }

}