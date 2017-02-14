import { Match } from "../typedefs/parser-util-types";


export function bibliographyToArray( text: string ) : string[] {
  return text.split('\n').filter( entry => {
    if( entry.length > 1 ) return true;
    else return false;
  });
}

export function firstCapturingGroup( regex: RegExp, text: string ): string | null {
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

export function execArrayToMatch( execArr: RegExpExecArray | null ): Match | null {

  if ( execArr === null ){
    return null;
  }

  let captures: string[] = [];

  for ( let i = 1; i < execArr.length; i++){
    if ( execArr[i] !== undefined ){
      captures.push( execArr[i] );
    }
  }

  const match: Match = {
    fullMatch: execArr[0],
    captures: captures,
    index: execArr.index
  }

  return match;
}

export function allMatches( regex: RegExp, text: string ): Match[] | null {
  
  let matches: Match[] = [ {} as Match ];
  let noMatches: boolean = true;

  let execArr: RegExpExecArray;
  while ( ( execArr = regex.exec( text ) ) !== null ){
    if ( noMatches !== false ){
      noMatches = false;
    }
    // convert to Match and push to output array
    matches.push( this.execArrayToMatch( execArr ))
  }

  if ( noMatches === true ){
    return null;
  } else {
    return matches;
  }
}

export function firstMatch( regex: RegExp, text: string ): Match | null {
  const execArr: RegExpExecArray | null = regex.exec( text );
  return this.execArrayToMatch( execArr );
}

export function getInitialChar( name: string | null ): string | null {
  if ( name === null ) return null;
  return name.slice(0,1);   
}

  
export function fixMissingQuotationMark( title: string ): string {
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

export function cleanTextInput( text: string ): string {
  let cleanText = this.standardizeQuotationMarks( text );
  return cleanText;
}

function standardizeQuotationMarks( text: string ): string {
  return text.replace( /“|”|‘|’/g, function( match: string, doubleQuotes: string, singleQuotes: string ){
    if ( match === "“" || match === "”" ){
      return "\"";
    } else if ( match === "‘" || match === "’" ){
      return "\'";
    }
  });
}