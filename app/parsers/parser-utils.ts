export class ParserUtils {

  static bibliographyToArray( text: string ) : string[] {
    return text.split('\n').filter( entry => {
      if( entry.length > 1 ) return true;
      else return false;
    });
  }

  static firstMatch( regex: RegExp, text: string ): string | null {
    // helper routine to get first match from regex, regardless
    // of capturing group order
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

  static getInitialChar( name: string | null ): string | null {
    if ( name === null ) return null;
    return name.slice(0,1);   
  }

  static fixMissingQuotationMark( title: string ): string {
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

  static cleanTextInput( text: string ): string {
    let cleanText = this._standardizeQuotationMarks( text );
    return cleanText;
  }

  private static standardizeQuotationMarks( text: string ): string {
    return text.replace( /“|”/g, "\"");
  }


}