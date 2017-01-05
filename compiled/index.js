// rough outline of class:
// - initialized with in-text reference style, biblio style, and file paths to main text and bibliography.
// - reads in biblio and finds set of biblio references according to reference style
// - checks main text for biblio references
// - checks main text for inline references - do they exist in biblio references? -- going backwards is the hard part. We'll need titles for the MLA and Chicago citations. -- re titles: should store as split array by words, look for first 3 elements? What about one-word titles? Ughhhhhhhhhhhghghghg
'use strict';
module.exports = RefChecker;
var RefChecker = (function () {
    function RefChecker() {
    }
    RefChecker.prototype.calculateRefs = function (_a) {
        var mainText = _a.mainText, bibliography = _a.bibliography, mainTextRefStyle = _a.mainTextRefStyle, biblioRefStyle = _a.biblioRefStyle;
        var missingRefs;
        return missingRefs;
    };
    return RefChecker;
}());
function readBibliography(bibliography, mainTextRefStyle, biblioRefStyle) {
    var possibleBiblioRefs;
    return possibleBiblioRefs;
}
function readMainText(mainText, mainTextRefStyle) {
    var mainTextRefs;
    return mainTextRefs;
}
//# sourceMappingURL=index.js.map