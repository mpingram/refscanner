import { Author, 
  AuthorList, 
  Reference, 
  ParserReport, 
  FormattingProblem } from "../../typedefs/reference-types";
import * as ParserUtils from "../parser-utils";
import { Match } from "../../typedefs/parser-util-types";


export class ChicagoNBMainTextParser {

  static parse( mainText: string ): ParserReport {
    let report: ParserReport;

    const cleanMainText = ParserUtils.cleanTextInput( mainText );
    const references: string[] = this.filterReferences( mainText );
    report = this.parseReferences( references );

    return report;
  }
  
  //-----------------------------

  private static filterReferences( text: string ): string[] {
    let references: string[];
    // assumption: only references, and not main text, is passed in
    references = text.split( "\n" );
    return references;
  }

  private static parseReferences( unparsedReferences: string[] ): ParserReport {
    // RegExps 
    // -----------
    const re_footNoteNumber: RegExp = /^([0-9]{1,5})\.?/;
    const re_ibid: RegExp = /ibid|Ibid|---/;
    // ----------

    let parsedReferences: Reference[];
    let formattingProblems: FormattingProblem[] = null;

    unparsedReferences.forEach( unparsedReference => {

    });

    const parserReport: ParserReport = {
      formattingProblems,
      references: parsedReferences
    }

    return parserReport;
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

  private static parseReference( unparsedReference: string, previouslyParsedReferences: Reference[] ): Reference | null {
    
    const ibidRe: RegExp = /^\s*ibid|^\s*Ibid/;

    let reference: Reference;
    reference.original = unparsedReference;

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

    const nameListOrTitle: string | null = ParserUtils.firstCapturingGroup( nameListOrTitleRe, unparsedReference );
    const title: string | null           = ParserUtils.firstCapturingGroup( titleRe, unparsedReference );
    const pubYear: string | null         = ParserUtils.firstCapturingGroup( pubYearRe, unparsedReference );
   

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
      reference.pubYear = ParserUtils.firstCapturingGroup( pubYearRe, referenceWithoutTitle );
    } else {
      // if we don't have a title, we're already in a bad way, so give up and
      // let the human parse this one.
      reference.pubYear = null;
    }
    
    return reference;
  }

}