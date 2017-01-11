import {
  Reference,
  UnparsedReference,
  ParsedReferenceSet,
} from "./typedefs";

export class mainTextParser {

    static APA( text: string ): ParsedReferenceSet {
      let unparsedReferences: UnparsedReference[] = [];
      let parsedReferences: Reference[] = [];

      return {parsedReferences, unparsedReferences};
    }

    static Harvard( text: string ): ParsedReferenceSet {
      let unparsedReferences: UnparsedReference[] = [];
      let parsedReferences: Reference[] = [];

      return {parsedReferences, unparsedReferences};
    }

    static Chicago(text: string ): ParsedReferenceSet {
      let unparsedReferences: UnparsedReference[] = [];
      let parsedReferences: Reference[] = [];

      return {parsedReferences, unparsedReferences};
    }

    static MLA( text: string ): ParsedReferenceSet {
      let unparsedReferences: UnparsedReference[] = [];
      let parsedReferences: Reference[] = [];

      return {parsedReferences, unparsedReferences};
    }
  }