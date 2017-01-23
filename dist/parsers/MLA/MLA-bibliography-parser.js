"use strict";
var parser_utils_1 = require("../parser-utils");
var APABibliographyParser = (function () {
    function APABibliographyParser() {
    }
    APABibliographyParser.parse = function (bibliography) {
        var _this = this;
        var parsedReferences = [];
        var bibliographyArr = parser_utils_1.ParserUtils.bibliographyToArray(bibliography);
        bibliographyArr.forEach(function (entry) {
            parsedReferences.push(_this.parseReference(entry, parsedReferences));
        });
        return parsedReferences;
    };
    APABibliographyParser.parseNameList = function (nameListString, previouslyParsedReferences) {
        var authorList = {};
        authorList.firstAuthor = {};
        authorList.secondAuthor = {};
        authorList.threeOrMoreAuthors = null;
        // RegExps
        var tripleHyphenRe = /^(---)|^(–––)|^(———)/;
        var etAlRe = / et al/;
        var primaryAuthorLastNameRe = /^(.+?),/;
        var secondaryAuthorLastNameRe = /and .*?([A-Z]\S+?\b)$|and .*?([A-Z]\S+?), [a-z]+?$/;
        var primaryAuthorFirstNameRe = /^.+?, (.+?),|^.+?, (.+?)$/;
        // =======================
        // parse first author's name
        // -------------------------
        var primaryAuthorLastName = parser_utils_1.ParserUtils.firstMatch(primaryAuthorLastNameRe, nameListString);
        var primaryAuthorFirstName = parser_utils_1.ParserUtils.firstMatch(primaryAuthorFirstNameRe, nameListString);
        authorList.firstAuthor.lastname = primaryAuthorLastName;
        authorList.firstAuthor.firstname = primaryAuthorFirstName;
        authorList.firstAuthor.firstInitial = parser_utils_1.ParserUtils.getInitialChar(authorList.firstAuthor.firstname);
        // check to see if first author's name has been ommitted, indicating
        // same author as previous entry
        var nameOmitted = tripleHyphenRe.test(nameListString);
        if (nameOmitted === true) {
            var previousReference = previouslyParsedReferences[previouslyParsedReferences.length - 1];
            authorList.firstAuthor = previousReference.parsedNameList.firstAuthor;
        }
        // parse second author's last name, if exists
        // -------------------------
        var secondaryAuthorLastName = parser_utils_1.ParserUtils.firstMatch(secondaryAuthorLastNameRe, nameListString);
        if (secondaryAuthorLastName === null) {
            authorList.secondAuthor = null;
        }
        else {
            authorList.secondAuthor.lastname = secondaryAuthorLastName;
        }
        // check for three or more authors
        // -------------------------
        var containsEtAl = etAlRe.test(nameListString);
        if (containsEtAl === true) {
            authorList.threeOrMoreAuthors = true;
        }
        else {
            authorList.threeOrMoreAuthors = false;
        }
        // ========================
        return authorList;
    };
    APABibliographyParser.parseReference = function (unparsedReference, previouslyParsedReferences) {
        // match first block of text until first period, so long as 
        var nameListOrTitleRe = /^.*?et al\.|^.*?[\S]{3,}\./m;
        // TODO: write RE to examine corner case where nameListOrTitle is a Name List
        // wchich ended with 'Jr.', 'Sr.', or an initial.
        // Strat: step back by one period. Is there an 'and' to the left?
        // if so, look for Jr. or Sr. immediately to left.
        // if not, look for single initial immediately to left.
        // the result of this is important -- it'll determine where we look for the title. (!!)
        var nameListEndCheck = /[implement me]/g;
        // match block of text between first and second period,
        //   after which should occur a date.
        var titleRe = /^.*?\. ?(.+?)\..+?([1][0-9][0-9][0-9]|[2][0][0-2][0-9])/m;
        // match valid date after two periods.
        var pubYearRe = /^.*?\..*?([1][0-9][0-9][0-9]|[2][0][0-2][0-9])/m;
        // NOTES: regex testing urls
        // names only:
        // https://regex101.com/r/nhOttU/1
        // full text:
        // https://regex101.com/r/XyvvRy/1
        var reference = {
            unparsedNameList: undefined,
            parsedNameList: undefined,
            title: undefined,
            pubYear: undefined,
            original: unparsedReference,
        };
        var nameListOrTitleMatch = nameListOrTitleRe.exec(unparsedReference);
        var titleMatch = titleRe.exec(unparsedReference);
        var pubYearMatch = pubYearRe.exec(unparsedReference);
        if (titleMatch === null) {
            // assume nameListOrTitleMatch matched title
            var title = nameListOrTitleMatch[1];
            reference.title = fixTitleQuotes(title);
            reference.unparsedNameList = null;
            reference.parsedNameList = null;
        }
        else {
            // assume nameListOrTitleMatch matched nameList
            //   and titleMatch matched title
            reference.unparsedNameList = nameListOrTitleMatch[1];
            reference.parsedNameList = this.parseNameList(reference.unparsedNameList, previouslyParsedReferences);
            var title = titleMatch[1];
            reference.title = parser_utils_1.ParserUtils.fixMissingQuotationMark(title);
        }
        // either way, store pubYear and add reference to parsedReferences
        reference.pubYear = pubYearMatch[1];
        return reference;
    };
    return APABibliographyParser;
}());
exports.APABibliographyParser = APABibliographyParser;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9jb21waWxlZC9hcHAvYXBwL3BhcnNlcnMvQVBBL0FQQS1iaWJsaW9ncmFwaHktcGFyc2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxnREFBOEM7QUFPOUM7SUFBQTtJQWlJQSxDQUFDO0lBOUhRLDJCQUFLLEdBQVosVUFBYyxZQUFvQjtRQUFsQyxpQkFXQztRQVRDLElBQUksZ0JBQWdCLEdBQWdCLEVBQUUsQ0FBQztRQUV2QyxJQUFNLGVBQWUsR0FBYSwwQkFBVyxDQUFDLG1CQUFtQixDQUFFLFlBQVksQ0FBRSxDQUFDO1FBRWxGLGVBQWUsQ0FBQyxPQUFPLENBQUUsVUFBQSxLQUFLO1lBQzVCLGdCQUFnQixDQUFDLElBQUksQ0FBRSxLQUFJLENBQUMsY0FBYyxDQUFFLEtBQUssRUFBRSxnQkFBZ0IsQ0FBRSxDQUFFLENBQUM7UUFDMUUsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsZ0JBQWdCLENBQUM7SUFDMUIsQ0FBQztJQUVjLG1DQUFhLEdBQTVCLFVBQThCLGNBQXNCLEVBQUUsMEJBQXVDO1FBR3pGLElBQUksVUFBVSxHQUFlLEVBQWdCLENBQUM7UUFDOUMsVUFBVSxDQUFDLFdBQVcsR0FBRyxFQUFZLENBQUM7UUFDdEMsVUFBVSxDQUFDLFlBQVksR0FBRyxFQUFZLENBQUM7UUFDdkMsVUFBVSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQztRQUVyQyxVQUFVO1FBQ1YsSUFBTSxjQUFjLEdBQVcsc0JBQXNCLENBQUM7UUFDdEQsSUFBTSxNQUFNLEdBQVcsUUFBUSxDQUFDO1FBQ2hDLElBQU0sdUJBQXVCLEdBQVcsU0FBUyxDQUFDO1FBQ2xELElBQU0seUJBQXlCLEdBQVcsb0RBQW9ELENBQUM7UUFDL0YsSUFBTSx3QkFBd0IsR0FBVywyQkFBMkIsQ0FBQztRQUdyRSwwQkFBMEI7UUFFMUIsNEJBQTRCO1FBQzVCLDRCQUE0QjtRQUM1QixJQUFNLHFCQUFxQixHQUFhLDBCQUFXLENBQUMsVUFBVSxDQUFFLHVCQUF1QixF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QixDQUFFLENBQUM7UUFHMUUsRUFBRSxDQUFDLENBQUUsVUFBVSxLQUFLLElBQUssQ0FBQyxDQUFBLENBQUM7WUFDekIsNENBQTRDO1lBQzVDLElBQUksS0FBSyxHQUFHLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsY0FBYyxDQUFFLEtBQUssQ0FBRSxDQUFDO1lBQzFDLFNBQVMsQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7WUFDbEMsU0FBUyxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7UUFDbEMsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sK0NBQStDO1lBQy9DLGlDQUFpQztZQUNqQyxTQUFTLENBQUMsZ0JBQWdCLEdBQUcsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckQsU0FBUyxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFFLFNBQVMsQ0FBQyxnQkFBZ0IsRUFBRSwwQkFBMEIsQ0FBRSxDQUFDO1lBQ3hHLElBQUksS0FBSyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxQixTQUFTLENBQUMsS0FBSyxHQUFHLDBCQUFXLENBQUMsdUJBQXVCLENBQUUsS0FBSyxDQUFFLENBQUM7UUFDakUsQ0FBQztRQUNELGtFQUFrRTtRQUNsRSxTQUFTLENBQUMsT0FBTyxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVwQyxNQUFNLENBQUMsU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFHSCw0QkFBQztBQUFELENBaklBLEFBaUlDLElBQUE7QUFqSVksc0RBQXFCIiwiZmlsZSI6InBhcnNlcnMvQVBBL0FQQS1iaWJsaW9ncmFwaHktcGFyc2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGFyc2VyVXRpbHMgfSBmcm9tIFwiLi4vcGFyc2VyLXV0aWxzXCI7XHJcbmltcG9ydCB7IFJlZmVyZW5jZSxcclxuICBBdXRob3IsXHJcbiAgQXV0aG9yTGlzdCxcclxufSBmcm9tIFwiLi4vLi4vdHlwZWRlZnNcIjtcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgQVBBQmlibGlvZ3JhcGh5UGFyc2VyIHtcclxuXHJcblxyXG4gIHN0YXRpYyBwYXJzZSggYmlibGlvZ3JhcGh5OiBzdHJpbmcgKTogUmVmZXJlbmNlW10ge1xyXG5cclxuICAgIGxldCBwYXJzZWRSZWZlcmVuY2VzOiBSZWZlcmVuY2VbXSA9IFtdO1xyXG5cclxuICAgIGNvbnN0IGJpYmxpb2dyYXBoeUFycjogc3RyaW5nW10gPSBQYXJzZXJVdGlscy5iaWJsaW9ncmFwaHlUb0FycmF5KCBiaWJsaW9ncmFwaHkgKTtcclxuICAgIFxyXG4gICAgYmlibGlvZ3JhcGh5QXJyLmZvckVhY2goIGVudHJ5ID0+IHtcclxuICAgICAgcGFyc2VkUmVmZXJlbmNlcy5wdXNoKCB0aGlzLnBhcnNlUmVmZXJlbmNlKCBlbnRyeSwgcGFyc2VkUmVmZXJlbmNlcyApICk7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gcGFyc2VkUmVmZXJlbmNlcztcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc3RhdGljIHBhcnNlTmFtZUxpc3QoIG5hbWVMaXN0U3RyaW5nOiBzdHJpbmcsIHByZXZpb3VzbHlQYXJzZWRSZWZlcmVuY2VzOiBSZWZlcmVuY2VbXSApOiBBdXRob3JMaXN0IHtcclxuXHJcblxyXG4gICAgICBsZXQgYXV0aG9yTGlzdDogQXV0aG9yTGlzdCA9IHt9IGFzIEF1dGhvckxpc3Q7XHJcbiAgICAgIGF1dGhvckxpc3QuZmlyc3RBdXRob3IgPSB7fSBhcyBBdXRob3I7XHJcbiAgICAgIGF1dGhvckxpc3Quc2Vjb25kQXV0aG9yID0ge30gYXMgQXV0aG9yO1xyXG4gICAgICBhdXRob3JMaXN0LnRocmVlT3JNb3JlQXV0aG9ycyA9IG51bGw7XHJcblxyXG4gICAgICAvLyBSZWdFeHBzXHJcbiAgICAgIGNvbnN0IHRyaXBsZUh5cGhlblJlOiBSZWdFeHAgPSAvXigtLS0pfF4o4oCT4oCT4oCTKXxeKOKAlOKAlOKAlCkvO1xyXG4gICAgICBjb25zdCBldEFsUmU6IFJlZ0V4cCA9IC8gZXQgYWwvO1xyXG4gICAgICBjb25zdCBwcmltYXJ5QXV0aG9yTGFzdE5hbWVSZTogUmVnRXhwID0gL14oLis/KSwvO1xyXG4gICAgICBjb25zdCBzZWNvbmRhcnlBdXRob3JMYXN0TmFtZVJlOiBSZWdFeHAgPSAvYW5kIC4qPyhbQS1aXVxcUys/XFxiKSR8YW5kIC4qPyhbQS1aXVxcUys/KSwgW2Etel0rPyQvO1xyXG4gICAgICBjb25zdCBwcmltYXJ5QXV0aG9yRmlyc3ROYW1lUmU6IFJlZ0V4cCA9IC9eLis/LCAoLis/KSx8Xi4rPywgKC4rPykkLztcclxuXHJcblxyXG4gICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgLy8gcGFyc2UgZmlyc3QgYXV0aG9yJ3MgbmFtZVxyXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgIGNvbnN0IHByaW1hcnlBdXRob3JMYXN0TmFtZTogc3RyaW5nICAgPSBQYXJzZXJVdGlscy5maXJzdE1hdGNoKCBwcmltYXJ5QXV0aG9yTGFzdE5hbWVSZSwgbmFtZUxpc3RTdHJpbmcgKTtcclxuICAgICAgY29uc3QgcHJpbWFyeUF1dGhvckZpcnN0TmFtZTogc3RyaW5nICA9IFBhcnNlclV0aWxzLmZpcnN0TWF0Y2goIHByaW1hcnlBdXRob3JGaXJzdE5hbWVSZSwgbmFtZUxpc3RTdHJpbmcgKTtcclxuXHJcbiAgICAgIGF1dGhvckxpc3QuZmlyc3RBdXRob3IubGFzdG5hbWUgICAgID0gcHJpbWFyeUF1dGhvckxhc3ROYW1lO1xyXG4gICAgICBhdXRob3JMaXN0LmZpcnN0QXV0aG9yLmZpcnN0bmFtZSAgICA9IHByaW1hcnlBdXRob3JGaXJzdE5hbWU7XHJcbiAgICAgIGF1dGhvckxpc3QuZmlyc3RBdXRob3IuZmlyc3RJbml0aWFsID0gUGFyc2VyVXRpbHMuZ2V0SW5pdGlhbENoYXIoIGF1dGhvckxpc3QuZmlyc3RBdXRob3IuZmlyc3RuYW1lICk7XHJcbiAgICAgIC8vIGNoZWNrIHRvIHNlZSBpZiBmaXJzdCBhdXRob3IncyBuYW1lIGhhcyBiZWVuIG9tbWl0dGVkLCBpbmRpY2F0aW5nXHJcbiAgICAgIC8vIHNhbWUgYXV0aG9yIGFzIHByZXZpb3VzIGVudHJ5XHJcbiAgICAgIGNvbnN0IG5hbWVPbWl0dGVkOiBib29sZWFuID0gdHJpcGxlSHlwaGVuUmUudGVzdChuYW1lTGlzdFN0cmluZyk7XHJcbiAgICAgIGlmICggbmFtZU9taXR0ZWQgPT09IHRydWUgKXtcclxuICAgICAgICBjb25zdCBwcmV2aW91c1JlZmVyZW5jZSA9IHByZXZpb3VzbHlQYXJzZWRSZWZlcmVuY2VzW3ByZXZpb3VzbHlQYXJzZWRSZWZlcmVuY2VzLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgIGF1dGhvckxpc3QuZmlyc3RBdXRob3IgPSBwcmV2aW91c1JlZmVyZW5jZS5wYXJzZWROYW1lTGlzdC5maXJzdEF1dGhvcjtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgLy8gcGFyc2Ugc2Vjb25kIGF1dGhvcidzIGxhc3QgbmFtZSwgaWYgZXhpc3RzXHJcbiAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgY29uc3Qgc2Vjb25kYXJ5QXV0aG9yTGFzdE5hbWU6IHN0cmluZyA9IFBhcnNlclV0aWxzLmZpcnN0TWF0Y2goIHNlY29uZGFyeUF1dGhvckxhc3ROYW1lUmUsIG5hbWVMaXN0U3RyaW5nICk7XHJcbiAgICAgIGlmICggc2Vjb25kYXJ5QXV0aG9yTGFzdE5hbWUgPT09IG51bGwgKXtcclxuICAgICAgICBhdXRob3JMaXN0LnNlY29uZEF1dGhvciA9IG51bGw7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYXV0aG9yTGlzdC5zZWNvbmRBdXRob3IubGFzdG5hbWUgPSBzZWNvbmRhcnlBdXRob3JMYXN0TmFtZTtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgLy8gY2hlY2sgZm9yIHRocmVlIG9yIG1vcmUgYXV0aG9yc1xyXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgIGNvbnN0IGNvbnRhaW5zRXRBbDogYm9vbGVhbiA9IGV0QWxSZS50ZXN0KG5hbWVMaXN0U3RyaW5nKTtcclxuICAgICAgaWYgKCBjb250YWluc0V0QWwgPT09IHRydWUgKXtcclxuICAgICAgICBhdXRob3JMaXN0LnRocmVlT3JNb3JlQXV0aG9ycyA9IHRydWU7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYXV0aG9yTGlzdC50aHJlZU9yTW9yZUF1dGhvcnMgPSBmYWxzZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgICByZXR1cm4gYXV0aG9yTGlzdDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc3RhdGljIHBhcnNlUmVmZXJlbmNlKCB1bnBhcnNlZFJlZmVyZW5jZTogc3RyaW5nLCBwcmV2aW91c2x5UGFyc2VkUmVmZXJlbmNlczogUmVmZXJlbmNlW10gKTogUmVmZXJlbmNlIHwgbnVsbCB7XHJcbiAgICAvLyBtYXRjaCBmaXJzdCBibG9jayBvZiB0ZXh0IHVudGlsIGZpcnN0IHBlcmlvZCwgc28gbG9uZyBhcyBcclxuICAgIGNvbnN0IG5hbWVMaXN0T3JUaXRsZVJlID0gL14uKj9ldCBhbFxcLnxeLio/W1xcU117Myx9XFwuL207XHJcbiAgICAvLyBUT0RPOiB3cml0ZSBSRSB0byBleGFtaW5lIGNvcm5lciBjYXNlIHdoZXJlIG5hbWVMaXN0T3JUaXRsZSBpcyBhIE5hbWUgTGlzdFxyXG4gICAgLy8gd2NoaWNoIGVuZGVkIHdpdGggJ0pyLicsICdTci4nLCBvciBhbiBpbml0aWFsLlxyXG4gICAgLy8gU3RyYXQ6IHN0ZXAgYmFjayBieSBvbmUgcGVyaW9kLiBJcyB0aGVyZSBhbiAnYW5kJyB0byB0aGUgbGVmdD9cclxuICAgIC8vIGlmIHNvLCBsb29rIGZvciBKci4gb3IgU3IuIGltbWVkaWF0ZWx5IHRvIGxlZnQuXHJcbiAgICAvLyBpZiBub3QsIGxvb2sgZm9yIHNpbmdsZSBpbml0aWFsIGltbWVkaWF0ZWx5IHRvIGxlZnQuXHJcbiAgICAvLyB0aGUgcmVzdWx0IG9mIHRoaXMgaXMgaW1wb3J0YW50IC0tIGl0J2xsIGRldGVybWluZSB3aGVyZSB3ZSBsb29rIGZvciB0aGUgdGl0bGUuICghISlcclxuICAgIGNvbnN0IG5hbWVMaXN0RW5kQ2hlY2sgPSAvW2ltcGxlbWVudCBtZV0vZztcclxuICAgIC8vIG1hdGNoIGJsb2NrIG9mIHRleHQgYmV0d2VlbiBmaXJzdCBhbmQgc2Vjb25kIHBlcmlvZCxcclxuICAgIC8vICAgYWZ0ZXIgd2hpY2ggc2hvdWxkIG9jY3VyIGEgZGF0ZS5cclxuICAgIGNvbnN0IHRpdGxlUmUgPSAvXi4qP1xcLiA/KC4rPylcXC4uKz8oWzFdWzAtOV1bMC05XVswLTldfFsyXVswXVswLTJdWzAtOV0pL207XHJcbiAgICAvLyBtYXRjaCB2YWxpZCBkYXRlIGFmdGVyIHR3byBwZXJpb2RzLlxyXG4gICAgY29uc3QgcHViWWVhclJlID0gL14uKj9cXC4uKj8oWzFdWzAtOV1bMC05XVswLTldfFsyXVswXVswLTJdWzAtOV0pL207XHJcblxyXG4gICAgLy8gTk9URVM6IHJlZ2V4IHRlc3RpbmcgdXJsc1xyXG4gICAgLy8gbmFtZXMgb25seTpcclxuICAgIC8vIGh0dHBzOi8vcmVnZXgxMDEuY29tL3IvbmhPdHRVLzFcclxuICAgIC8vIGZ1bGwgdGV4dDpcclxuICAgIC8vIGh0dHBzOi8vcmVnZXgxMDEuY29tL3IvWHl2dlJ5LzFcclxuXHJcbiAgICBsZXQgcmVmZXJlbmNlOiBSZWZlcmVuY2UgPSB7IFxyXG4gICAgICB1bnBhcnNlZE5hbWVMaXN0OiB1bmRlZmluZWQsXHJcbiAgICAgIHBhcnNlZE5hbWVMaXN0OiB1bmRlZmluZWQsXHJcbiAgICAgIHRpdGxlOiB1bmRlZmluZWQsXHJcbiAgICAgIHB1YlllYXI6IHVuZGVmaW5lZCxcclxuICAgICAgb3JpZ2luYWw6IHVucGFyc2VkUmVmZXJlbmNlLFxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBuYW1lTGlzdE9yVGl0bGVNYXRjaDogUmVnRXhwRXhlY0FycmF5ID0gbmFtZUxpc3RPclRpdGxlUmUuZXhlYyggdW5wYXJzZWRSZWZlcmVuY2UgKTtcclxuICAgIGNvbnN0IHRpdGxlTWF0Y2g6IFJlZ0V4cEV4ZWNBcnJheSA9IHRpdGxlUmUuZXhlYyggdW5wYXJzZWRSZWZlcmVuY2UgKTtcclxuICAgIGNvbnN0IHB1YlllYXJNYXRjaDogUmVnRXhwRXhlY0FycmF5ID0gcHViWWVhclJlLmV4ZWMoIHVucGFyc2VkUmVmZXJlbmNlICk7XHJcblxyXG5cclxuICAgIGlmICggdGl0bGVNYXRjaCA9PT0gbnVsbCApe1xyXG4gICAgICAvLyBhc3N1bWUgbmFtZUxpc3RPclRpdGxlTWF0Y2ggbWF0Y2hlZCB0aXRsZVxyXG4gICAgICBsZXQgdGl0bGUgPSBuYW1lTGlzdE9yVGl0bGVNYXRjaFsxXTtcclxuICAgICAgcmVmZXJlbmNlLnRpdGxlID0gZml4VGl0bGVRdW90ZXMoIHRpdGxlICk7XHJcbiAgICAgIHJlZmVyZW5jZS51bnBhcnNlZE5hbWVMaXN0ID0gbnVsbDtcclxuICAgICAgcmVmZXJlbmNlLnBhcnNlZE5hbWVMaXN0ID0gbnVsbDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIGFzc3VtZSBuYW1lTGlzdE9yVGl0bGVNYXRjaCBtYXRjaGVkIG5hbWVMaXN0XHJcbiAgICAgIC8vICAgYW5kIHRpdGxlTWF0Y2ggbWF0Y2hlZCB0aXRsZVxyXG4gICAgICByZWZlcmVuY2UudW5wYXJzZWROYW1lTGlzdCA9IG5hbWVMaXN0T3JUaXRsZU1hdGNoWzFdO1xyXG4gICAgICByZWZlcmVuY2UucGFyc2VkTmFtZUxpc3QgPSB0aGlzLnBhcnNlTmFtZUxpc3QoIHJlZmVyZW5jZS51bnBhcnNlZE5hbWVMaXN0LCBwcmV2aW91c2x5UGFyc2VkUmVmZXJlbmNlcyApO1xyXG4gICAgICBsZXQgdGl0bGUgPSB0aXRsZU1hdGNoWzFdO1xyXG4gICAgICByZWZlcmVuY2UudGl0bGUgPSBQYXJzZXJVdGlscy5maXhNaXNzaW5nUXVvdGF0aW9uTWFyayggdGl0bGUgKTtcclxuICAgIH1cclxuICAgIC8vIGVpdGhlciB3YXksIHN0b3JlIHB1YlllYXIgYW5kIGFkZCByZWZlcmVuY2UgdG8gcGFyc2VkUmVmZXJlbmNlc1xyXG4gICAgcmVmZXJlbmNlLnB1YlllYXIgPSBwdWJZZWFyTWF0Y2hbMV07XHJcbiAgICBcclxuICAgIHJldHVybiByZWZlcmVuY2U7XHJcbiAgfVxyXG5cclxuXHJcbn0iXX0=
