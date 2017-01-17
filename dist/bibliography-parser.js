"use strict";
var BibliographyParser = (function () {
    function BibliographyParser() {
    }
    BibliographyParser.bibliographyToArray = function (text) {
        return text.split('\n').filter(function (entry) {
            if (entry.length > 1)
                return true;
            else
                return false;
        });
    };
    // helper routine to get first match from regex, regardless
    // of capturing group order
    BibliographyParser.getFirstMatch = function (regex, text) {
        var match = regex.exec(text);
        if (match === null) {
            return null;
        }
        for (var groupNumber = 1; groupNumber < match.length; groupNumber++) {
            var capturingGroup = match[groupNumber];
            if (capturingGroup !== undefined) {
                // trim just in case
                return capturingGroup.trim();
            }
        }
        return null;
    };
    BibliographyParser.getInitial = function (name) {
        if (name === null)
            return null;
        return name.slice(0, 1);
    };
    BibliographyParser.parseAPA = function (text) {
        var unparsedReferences = [];
        var parsedReferences = [];
        // match first block of text until first period, so long as 
        var nameListOrTitleRe = /^.*?et al\.|^.*?[\S]{3,}\./m;
        // TODO: write RE to examine corner case where nameListOrTitle is a Name List
        // wchich ended with 'Jr.', 'Sr.', or an initial.
        // Strat: step back by one period. Is there an 'and' to the left?
        // if so, look for Jr. or Sr. immediately to left.
        // if not, look for single initial immediately to left.
        // the result of this is important -- it'll determine where we look for the title. (!!)
        var nameListEndCheck = /;
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
        // helper functions
        // ==========================
        function parseNameListAPA(nameListString, previouslyParsedReferences) {
            // initialize output
            var authorList = {};
            var firstAuthor = {};
            var secondAuthor = {};
            var threeOrMoreAuthors;
            // RegExps
            // -------
            var tripleHyphenRe = /^(---)|^(–––)|^(———)/;
            var etAlRe = /et al/;
            var primaryAuthorLastNameRe = /^(.+?),/;
            var secondaryAuthorLastNameRe = /and .*?([A-Z]\S+?\b)$|and .*?([A-Z]\S+?), [a-z]+?$/;
            var primaryAuthorFirstNameRe = /^.+?, (.+?),|^.+?, (.+?)$/;
            // -------
            // parse name list
            // ============
            var primaryAuthorLastName = BibliographyParser.getFirstMatch(primaryAuthorLastNameRe, nameListString);
            var secondaryAuthorLastName = BibliographyParser.getFirstMatch(secondaryAuthorLastNameRe, nameListString);
            var primaryAuthorFirstName = BibliographyParser.getFirstMatch(primaryAuthorFirstNameRe, nameListString);
            firstAuthor.lastname = primaryAuthorLastName;
            firstAuthor.firstname = primaryAuthorFirstName;
            firstAuthor.firstInitial = BibliographyParser.getInitial(firstAuthor.firstname);
            // if we didn't match a second author, null the second author in our output AuthorList
            if (secondaryAuthorLastName === null) {
                secondAuthor = null;
            }
            else {
                secondAuthor.lastname = secondaryAuthorLastName;
            }
            var nameOmitted = tripleHyphenRe.test(nameListString);
            var containsEtAl = etAlRe.test(nameListString);
            if (nameOmitted === true) {
                var previousReference = previouslyParsedReferences[previouslyParsedReferences.length - 1];
                firstAuthor = previousReference.parsedNameList.firstAuthor;
            }
            if (containsEtAl === true) {
                threeOrMoreAuthors = true;
            }
            authorList.firstAuthor = firstAuthor;
            authorList.secondAuthor = secondAuthor;
            authorList.threeOrMoreAuthors = threeOrMoreAuthors;
            return authorList;
        }
        function fixTitleQuotes(title) {
            // if title begins with a quotation mark but doesn't end with a quotation mark... 
            // FIXME: account for inner quotations (“ ”). Wow, not sure how to deal with that inconsistency
            if (title.slice(0, 1) === '"' && title.slice(-1) !== '"') {
                // add a quotation mark to the end.
                title += '"';
            }
            else if (title.slice(0, 1) === '“' && title.slice(-1) !== '”') {
                title += '”';
            }
            return title;
        }
        // ==========================
        this.bibliographyToArray(text).forEach(function (entry, index, bibliographyArray) {
            var reference = {
                unparsedNameList: undefined,
                parsedNameList: undefined,
                title: undefined,
                pubYear: undefined,
                original: entry,
            };
            var nameListOrTitleMatch = nameListOrTitleRe.exec(entry);
            var titleMatch = titleRe.exec(entry);
            var pubYearMatch = pubYearRe.exec(entry);
            if (nameListOrTitleMatch === null || pubYearMatch === null) {
                // give up; we'll let the user figure this one out.
                parsedReferences.push(reference);
            }
            else {
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
                    reference.parsedNameList = parseNameListAPA(reference.unparsedNameList, parsedReferences);
                    var title = titleMatch[1];
                    reference.title = fixTitleQuotes(title);
                }
                // either way, store pubYear and add reference to parsedReferences
                reference.pubYear = pubYearMatch[1];
                parsedReferences.push(reference);
            }
        });
        return parsedReferences;
    };
    BibliographyParser.parseHarvard = function (text) {
        var unparsedReferences = [];
        var parsedReferences = [];
        return { parsedReferences: parsedReferences, unparsedReferences: unparsedReferences };
    };
    BibliographyParser.parseChicago = function (text) {
        var unparsedReferences = [];
        var parsedReferences = [];
        return { parsedReferences: parsedReferences, unparsedReferences: unparsedReferences };
    };
    BibliographyParser.parseMLA = function (text) {
        var unparsedReferences = [];
        var parsedReferences = [];
        return { parsedReferences: parsedReferences, unparsedReferences: unparsedReferences };
    };
    return BibliographyParser;
}());
exports.BibliographyParser = BibliographyParser;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9hcHAvYmlibGlvZ3JhcGh5LXBhcnNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBUUE7SUFBQTtJQXlMRSxDQUFDO0lBdkxnQixzQ0FBbUIsR0FBbEMsVUFBb0MsSUFBWTtRQUM5QyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUUsVUFBQSxLQUFLO1lBQ25DLEVBQUUsQ0FBQSxDQUFFLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBRSxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDbkMsSUFBSTtnQkFBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ3BCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELDJEQUEyRDtJQUMzRCwyQkFBMkI7SUFDWixnQ0FBYSxHQUE1QixVQUE4QixLQUFhLEVBQUUsSUFBWTtRQUN2RCxJQUFNLEtBQUssR0FBb0IsS0FBSyxDQUFDLElBQUksQ0FBRSxJQUFJLENBQUUsQ0FBQztRQUNsRCxFQUFFLENBQUMsQ0FBRSxLQUFLLEtBQUssSUFBSyxDQUFDLENBQUEsQ0FBQztZQUNwQixNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUNELEdBQUcsQ0FBQyxDQUFFLElBQUksV0FBVyxHQUFHLENBQUMsRUFBRSxXQUFXLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxXQUFXLEVBQUUsRUFBRSxDQUFDO1lBQ3JFLElBQUksY0FBYyxHQUFHLEtBQUssQ0FBRSxXQUFXLENBQUUsQ0FBQztZQUMxQyxFQUFFLENBQUMsQ0FBRSxjQUFjLEtBQUssU0FBVSxDQUFDLENBQUMsQ0FBQztnQkFDbkMsb0JBQW9CO2dCQUNwQixNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQy9CLENBQUM7UUFDSCxDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFFYyw2QkFBVSxHQUF6QixVQUEyQixJQUFtQjtRQUM1QyxFQUFFLENB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QUFrRTtnQkFDbEUsU0FBUyxDQUFDLE9BQU8sR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BDLGdCQUFnQixDQUFDLElBQUksQ0FBRSxTQUFTLENBQUUsQ0FBQztZQUNyQyxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsZ0JBQWdCLENBQUM7SUFDMUIsQ0FBQztJQUVNLCtCQUFZLEdBQW5CLFVBQXFCLElBQVk7UUFDL0IsSUFBSSxrQkFBa0IsR0FBd0IsRUFBRSxDQUFDO1FBQ2pELElBQUksZ0JBQWdCLEdBQWdCLEVBQUUsQ0FBQztRQUV2QyxNQUFNLENBQUMsRUFBQyxnQkFBZ0Isa0JBQUEsRUFBRSxrQkFBa0Isb0JBQUEsRUFBQyxDQUFDO0lBQ2hELENBQUM7SUFFTSwrQkFBWSxHQUFuQixVQUFvQixJQUFZO1FBQzlCLElBQUksa0JBQWtCLEdBQXdCLEVBQUUsQ0FBQztRQUNqRCxJQUFJLGdCQUFnQixHQUFnQixFQUFFLENBQUM7UUFFdkMsTUFBTSxDQUFDLEVBQUMsZ0JBQWdCLGtCQUFBLEVBQUUsa0JBQWtCLG9CQUFBLEVBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRU0sMkJBQVEsR0FBZixVQUFpQixJQUFZO1FBQzNCLElBQUksa0JBQWtCLEdBQXdCLEVBQUUsQ0FBQztRQUNqRCxJQUFJLGdCQUFnQixHQUFnQixFQUFFLENBQUM7UUFFdkMsTUFBTSxDQUFDLEVBQUMsZ0JBQWdCLGtCQUFBLEVBQUUsa0JBQWtCLG9CQUFBLEVBQUMsQ0FBQztJQUNoRCxDQUFDO0lBQ0gseUJBQUM7QUFBRCxDQXpMRixBQXlMRyxJQUFBO0FBekxVLGdEQUFrQiIsImZpbGUiOiJiaWJsaW9ncmFwaHktcGFyc2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBSZWZlcmVuY2UsXHJcbiAgVW5wYXJzZWRSZWZlcmVuY2UsXHJcbiAgUGFyc2VkUmVmZXJlbmNlU2V0LFxyXG4gIEF1dGhvcixcclxuICBBdXRob3JMaXN0XHJcbn0gZnJvbSBcIi4vdHlwZWRlZnNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBCaWJsaW9ncmFwaHlQYXJzZXIge1xyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGJpYmxpb2dyYXBoeVRvQXJyYXkoIHRleHQ6IHN0cmluZyApIDogc3RyaW5nW10ge1xyXG4gICAgICByZXR1cm4gdGV4dC5zcGxpdCgnXFxuJykuZmlsdGVyKCBlbnRyeSA9PiB7XHJcbiAgICAgICAgaWYoIGVudHJ5Lmxlbmd0aCA+IDEgKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICBlbHNlIHJldHVybiBmYWxzZTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gaGVscGVyIHJvdXRpbmUgdG8gZ2V0IGZpcnN0IG1hdGNoIGZyb20gcmVnZXgsIHJlZ2FyZGxlc3NcclxuICAgIC8vIG9mIGNhcHR1cmluZyBncm91cCBvcmRlclxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0Rmlyc3RNYXRjaCggcmVnZXg6IFJlZ0V4cCwgdGV4dDogc3RyaW5nICk6IHN0cmluZyB8IG51bGwge1xyXG4gICAgICBjb25zdCBtYXRjaDogUmVnRXhwRXhlY0FycmF5ID0gcmVnZXguZXhlYyggdGV4dCApO1xyXG4gICAgICBpZiAoIG1hdGNoID09PSBudWxsICl7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuICAgICAgZm9yICggbGV0IGdyb3VwTnVtYmVyID0gMTsgZ3JvdXBOdW1iZXIgPCBtYXRjaC5sZW5ndGg7IGdyb3VwTnVtYmVyKysgKXtcclxuICAgICAgICBsZXQgY2FwdHVyaW5nR3JvdXAgPSBtYXRjaFsgZ3JvdXBOdW1iZXIgXTtcclxuICAgICAgICBpZiAoIGNhcHR1cmluZ0dyb3VwICE9PSB1bmRlZmluZWQgKSB7XHJcbiAgICAgICAgICAvLyB0cmltIGp1c3QgaW4gY2FzZVxyXG4gICAgICAgICAgcmV0dXJuIGNhcHR1cmluZ0dyb3VwLnRyaW0oKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0SW5pdGlhbCggbmFtZTogc3RyaW5nIHwgbnVsbCApOiBzdHJpbmcgfCBudWxsIHtcclxuICAgICAgaWYgKCBuYW1lID09PSBudWxsICkgcmV0dXJuIG51bGw7XHJcbiAgICAgIHJldHVybiBuYW1lLnNsaWNlKDAsMSk7ICAgXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHBhcnNlQVBBKCB0ZXh0OiBzdHJpbmcgKTogUGFyc2VkUmVmZXJlbmNlU2V0IHtcclxuXHJcbiAgICAgIGxldCB1bnBhcnNlZFJlZmVyZW5jZXM6IFVucGFyc2VkUmVmZXJlbmNlW10gPSBbXTtcclxuICAgICAgbGV0IHBhcnNlZFJlZmVyZW5jZXM6IFJlZmVyZW5jZVtdID0gW107XHJcbiAgICAgIC8vIG1hdGNoIGZpcnN0IGJsb2NrIG9mIHRleHQgdW50aWwgZmlyc3QgcGVyaW9kLCBzbyBsb25nIGFzIFxyXG4gICAgICBjb25zdCBuYW1lTGlzdE9yVGl0bGVSZSA9IC9eLio/ZXQgYWxcXC58Xi4qP1tcXFNdezMsfVxcLi9tO1xyXG4gICAgICAvLyBUT0RPOiB3cml0ZSBSRSB0byBleGFtaW5lIGNvcm5lciBjYXNlIHdoZXJlIG5hbWVMaXN0T3JUaXRsZSBpcyBhIE5hbWUgTGlzdFxyXG4gICAgICAvLyB3Y2hpY2ggZW5kZWQgd2l0aCAnSnIuJywgJ1NyLicsIG9yIGFuIGluaXRpYWwuXHJcbiAgICAgIC8vIFN0cmF0OiBzdGVwIGJhY2sgYnkgb25lIHBlcmlvZC4gSXMgdGhlcmUgYW4gJ2FuZCcgdG8gdGhlIGxlZnQ/XHJcbiAgICAgIC8vIGlmIHNvLCBsb29rIGZvciBKci4gb3IgU3IuIGltbWVkaWF0ZWx5IHRvIGxlZnQuXHJcbiAgICAgIC8vIGlmIG5vdCwgbG9vayBmb3Igc2luZ2xlIGluaXRpYWwgaW1tZWRpYXRlbHkgdG8gbGVmdC5cclxuICAgICAgLy8gdGhlIHJlc3VsdCBvZiB0aGlzIGlzIGltcG9ydGFudCAtLSBpdCdsbCBkZXRlcm1pbmUgd2hlcmUgd2UgbG9vayBmb3IgdGhlIHRpdGxlLiAoISEpXHJcbiAgICAgIGNvbnN0IG5hbWVMaXN0RW5kQ2hlY2sgPSAvXHJcbiAgICAgIC8vIG1hdGNoIGJsb2NrIG9mIHRleHQgYmV0d2VlbiBmaXJzdCBhbmQgc2Vjb25kIHBlcmlvZCxcclxuICAgICAgLy8gICBhZnRlciB3aGljaCBzaG91bGQgb2NjdXIgYSBkYXRlLlxyXG4gICAgICBjb25zdCB0aXRsZVJlID0gL14uKj9cXC4gPyguKz8pXFwuLis/KFsxXVswLTldWzAtOV1bMC05XXxbMl1bMF1bMC0yXVswLTldKS9tO1xyXG4gICAgICAvLyBtYXRjaCB2YWxpZCBkYXRlIGFmdGVyIHR3byBwZXJpb2RzLlxyXG4gICAgICBjb25zdCBwdWJZZWFyUmUgPSAvXi4qP1xcLi4qPyhbMV1bMC05XVswLTldWzAtOV18WzJdWzBdWzAtMl1bMC05XSkvbTtcclxuXHJcbiAgICAgIC8vIE5PVEVTOiByZWdleCB0ZXN0aW5nIHVybHNcclxuICAgICAgLy8gbmFtZXMgb25seTpcclxuICAgICAgLy8gaHR0cHM6Ly9yZWdleDEwMS5jb20vci9uaE90dFUvMVxyXG4gICAgICAvLyBmdWxsIHRleHQ6XHJcbiAgICAgIC8vIGh0dHBzOi8vcmVnZXgxMDEuY29tL3IvWHl2dlJ5LzFcclxuXHJcbiAgICAgIC8vIGhlbHBlciBmdW5jdGlvbnNcclxuICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAgICAgZnVuY3Rpb24gcGFyc2VOYW1lTGlzdEFQQSggbmFtZUxpc3RTdHJpbmc6IHN0cmluZywgcHJldmlvdXNseVBhcnNlZFJlZmVyZW5jZXM6IFJlZmVyZW5jZVtdICk6IEF1dGhvckxpc3Qge1xyXG5cclxuICAgICAgICAvLyBpbml0aWFsaXplIG91dHB1dFxyXG4gICAgICAgIGxldCBhdXRob3JMaXN0OiBBdXRob3JMaXN0ID0ge30gYXMgQXV0aG9yTGlzdDtcclxuICAgICAgICBsZXQgZmlyc3RBdXRob3I6IEF1dGhvciA9IHt9IGFzIEF1dGhvcjtcclxuICAgICAgICBsZXQgc2Vjb25kQXV0aG9yOiBBdXRob3IgPSB7fSBhcyBBdXRob3I7XHJcbiAgICAgICAgbGV0IHRocmVlT3JNb3JlQXV0aG9yczogYm9vbGVhbjtcclxuXHJcbiAgICAgICAgLy8gUmVnRXhwc1xyXG4gICAgICAgIC8vIC0tLS0tLS1cclxuICAgICAgICBjb25zdCB0cmlwbGVIeXBoZW5SZTogUmVnRXhwID0gL14oLS0tKXxeKOKAk+KAk+KAkyl8XijigJTigJTigJQpLztcclxuICAgICAgICBjb25zdCBldEFsUmU6IFJlZ0V4cCA9IC9ldCBhbC87XHJcbiAgICAgICAgY29uc3QgcHJpbWFyeUF1dGhvckxhc3ROYW1lUmU6IFJlZ0V4cCA9IC9eKC4rPyksLztcclxuICAgICAgICBjb25zdCBzZWNvbmRhcnlBdXRob3JMYXN0TmFtZVJlOiBSZWdFeHAgPSAvYW5kIC4qPyhbQS1aXVxcUys/XFxiKSR8YW5kIC4qPyhbQS1aXVxcUys/KSwgW2Etel0rPyQvO1xyXG4gICAgICAgIGNvbnN0IHByaW1hcnlBdXRob3JGaXJzdE5hbWVSZTogUmVnRXhwID0gL14uKz8sICguKz8pLHxeLis/LCAoLis/KSQvO1xyXG4gICAgICAgIC8vIC0tLS0tLS1cclxuXHJcbiAgICAgICAgLy8gcGFyc2UgbmFtZSBsaXN0XHJcbiAgICAgICAgLy8gPT09PT09PT09PT09XHJcblxyXG4gICAgICAgIGNvbnN0IHByaW1hcnlBdXRob3JMYXN0TmFtZTogc3RyaW5nID0gQmlibGlvZ3JhcGh5UGFyc2VyLmdldEZpcnN0TWF0Y2goIHByaW1hcnlBdXRob3JMYXN0TmFtZVJlLCBuYW1lTGlzdFN0cmluZyApO1xyXG4gICAgICAgIGNvbnN0IHNlY29uZGFyeUF1dGhvckxhc3ROYW1lOiBzdHJpbmcgPSBCaWJsaW9ncmFwaHlQYXJzZXIuZ2V0Rmlyc3RNYXRjaCggc2Vjb25kYXJ5QXV0aG9yTGFzdE5hbWVSZSwgbmFtZUxpc3RTdHJpbmcgKTtcclxuICAgICAgICBjb25zdCBwcmltYXJ5QXV0aG9yRmlyc3ROYW1lOiBzdHJpbmcgPSBCaWJsaW9ncmFwaHlQYXJzZXIuZ2V0Rmlyc3RNYXRjaCggcHJpbWFyeUF1dGhvckZpcnN0TmFtZVJlLCBuYW1lTGlzdFN0cmluZyApO1xyXG5cclxuICAgICAgICBmaXJzdEF1dGhvci5sYXN0bmFtZSA9IHByaW1hcnlBdXRob3JMYXN0TmFtZVxyXG4gICAgICAgIGZpcnN0QXV0aG9yLmZpcnN0bmFtZSA9IHByaW1hcnlBdXRob3JGaXJzdE5hbWVcclxuICAgICAgICBmaXJzdEF1dGhvci5maXJzdEluaXRpYWwgPSBCaWJsaW9ncmFwaHlQYXJzZXIuZ2V0SW5pdGlhbCggZmlyc3RBdXRob3IuZmlyc3RuYW1lICk7XHJcbiAgICAgICAgLy8gaWYgd2UgZGlkbid0IG1hdGNoIGEgc2Vjb25kIGF1dGhvciwgbnVsbCB0aGUgc2Vjb25kIGF1dGhvciBpbiBvdXIgb3V0cHV0IEF1dGhvckxpc3RcclxuICAgICAgICBpZiAoIHNlY29uZGFyeUF1dGhvckxhc3ROYW1lID09PSBudWxsICl7XHJcbiAgICAgICAgICBzZWNvbmRBdXRob3IgPSBudWxsO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzZWNvbmRBdXRob3IubGFzdG5hbWUgPSBzZWNvbmRhcnlBdXRob3JMYXN0TmFtZTtcclxuICAgICAgICB9XHJcbiAgICAgICBcclxuXHJcbiAgICAgICAgY29uc3QgbmFtZU9taXR0ZWQ6IGJvb2xlYW4gPSB0cmlwbGVIeXBoZW5SZS50ZXN0KG5hbWVMaXN0U3RyaW5nKTtcclxuICAgICAgICBjb25zdCBjb250YWluc0V0QWw6IGJvb2xlYW4gPSBldEFsUmUudGVzdChuYW1lTGlzdFN0cmluZyk7XHJcbiAgICAgICAgaWYgKCBuYW1lT21pdHRlZCA9PT0gdHJ1ZSApe1xyXG4gICAgICAgICAgY29uc3QgcHJldmlvdXNSZWZlcmVuY2UgPSBwcmV2aW91c2x5UGFyc2VkUmVmZXJlbmNlc1twcmV2aW91c2x5UGFyc2VkUmVmZXJlbmNlcy5sZW5ndGggLSAxXTtcclxuICAgICAgICAgIGZpcnN0QXV0aG9yID0gcHJldmlvdXNSZWZlcmVuY2UucGFyc2VkTmFtZUxpc3QuZmlyc3RBdXRob3I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggY29udGFpbnNFdEFsID09PSB0cnVlICl7XHJcbiAgICAgICAgICB0aHJlZU9yTW9yZUF1dGhvcnMgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYXV0aG9yTGlzdC5maXJzdEF1dGhvciA9IGZpcnN0QXV0aG9yO1xyXG4gICAgICAgIGF1dGhvckxpc3Quc2Vjb25kQXV0aG9yID0gc2Vjb25kQXV0aG9yO1xyXG4gICAgICAgIGF1dGhvckxpc3QudGhyZWVPck1vcmVBdXRob3JzID0gdGhyZWVPck1vcmVBdXRob3JzO1xyXG4gICAgICAgIHJldHVybiBhdXRob3JMaXN0O1xyXG4gICAgICB9XHJcblxyXG5cclxuICAgICAgZnVuY3Rpb24gZml4VGl0bGVRdW90ZXMoIHRpdGxlOiBzdHJpbmcgKTogc3RyaW5nIHtcclxuICAgICAgICAvLyBpZiB0aXRsZSBiZWdpbnMgd2l0aCBhIHF1b3RhdGlvbiBtYXJrIGJ1dCBkb2Vzbid0IGVuZCB3aXRoIGEgcXVvdGF0aW9uIG1hcmsuLi4gXHJcbiAgICAgICAgLy8gRklYTUU6IGFjY291bnQgZm9yIGlubmVyIHF1b3RhdGlvbnMgKOKAnCDigJ0pLiBXb3csIG5vdCBzdXJlIGhvdyB0byBkZWFsIHdpdGggdGhhdCBpbmNvbnNpc3RlbmN5XHJcbiAgICAgICAgaWYoIHRpdGxlLnNsaWNlKDAsMSkgPT09ICdcIicgJiYgdGl0bGUuc2xpY2UoLTEpICE9PSAnXCInICl7XHJcbiAgICAgICAgICAvLyBhZGQgYSBxdW90YXRpb24gbWFyayB0byB0aGUgZW5kLlxyXG4gICAgICAgICAgdGl0bGUgKz0gJ1wiJztcclxuICAgICAgICB9IGVsc2UgaWYgKCB0aXRsZS5zbGljZSgwLDEpID09PSAn4oCcJyAmJiB0aXRsZS5zbGljZSgtMSkgIT09ICfigJ0nKXtcclxuICAgICAgICAgIHRpdGxlICs9ICfigJ0nO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGl0bGU7XHJcbiAgICAgIH1cclxuICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcblxyXG4gICAgICB0aGlzLmJpYmxpb2dyYXBoeVRvQXJyYXkoIHRleHQgKS5mb3JFYWNoKCAoZW50cnksIGluZGV4LCBiaWJsaW9ncmFwaHlBcnJheSkgPT4ge1xyXG5cclxuICAgICAgICBsZXQgcmVmZXJlbmNlOiBSZWZlcmVuY2UgPSB7IFxyXG4gICAgICAgICAgdW5wYXJzZWROYW1lTGlzdDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgcGFyc2VkTmFtZUxpc3Q6IHVuZGVmaW5lZCxcclxuICAgICAgICAgIHRpdGxlOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICBwdWJZZWFyOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICBvcmlnaW5hbDogZW50cnksXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3QgbmFtZUxpc3RPclRpdGxlTWF0Y2g6IFJlZ0V4cEV4ZWNBcnJheSA9IG5hbWVMaXN0T3JUaXRsZVJlLmV4ZWMoIGVudHJ5ICk7XHJcbiAgICAgICAgY29uc3QgdGl0bGVNYXRjaDogUmVnRXhwRXhlY0FycmF5ID0gdGl0bGVSZS5leGVjKCBlbnRyeSApO1xyXG4gICAgICAgIGNvbnN0IHB1YlllYXJNYXRjaDogUmVnRXhwRXhlY0FycmF5ID0gcHViWWVhclJlLmV4ZWMoIGVudHJ5ICk7XHJcblxyXG4gICAgICAgIGlmKCBuYW1lTGlzdE9yVGl0bGVNYXRjaCA9PT0gbnVsbCB8fCBwdWJZZWFyTWF0Y2ggPT09IG51bGwgKXtcclxuICAgICAgICAgIC8vIGdpdmUgdXA7IHdlJ2xsIGxldCB0aGUgdXNlciBmaWd1cmUgdGhpcyBvbmUgb3V0LlxyXG4gICAgICAgICAgcGFyc2VkUmVmZXJlbmNlcy5wdXNoKCByZWZlcmVuY2UgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKCB0aXRsZU1hdGNoID09PSBudWxsICl7XHJcbiAgICAgICAgICAgIC8vIGFzc3VtZSBuYW1lTGlzdE9yVGl0bGVNYXRjaCBtYXRjaGVkIHRpdGxlXHJcbiAgICAgICAgICAgIGxldCB0aXRsZSA9IG5hbWVMaXN0T3JUaXRsZU1hdGNoWzFdO1xyXG4gICAgICAgICAgICByZWZlcmVuY2UudGl0bGUgPSBmaXhUaXRsZVF1b3RlcyggdGl0bGUgKTtcclxuICAgICAgICAgICAgcmVmZXJlbmNlLnVucGFyc2VkTmFtZUxpc3QgPSBudWxsO1xyXG4gICAgICAgICAgICByZWZlcmVuY2UucGFyc2VkTmFtZUxpc3QgPSBudWxsO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gYXNzdW1lIG5hbWVMaXN0T3JUaXRsZU1hdGNoIG1hdGNoZWQgbmFtZUxpc3RcclxuICAgICAgICAgICAgLy8gICBhbmQgdGl0bGVNYXRjaCBtYXRjaGVkIHRpdGxlXHJcbiAgICAgICAgICAgIHJlZmVyZW5jZS51bnBhcnNlZE5hbWVMaXN0ID0gbmFtZUxpc3RPclRpdGxlTWF0Y2hbMV07XHJcbiAgICAgICAgICAgIHJlZmVyZW5jZS5wYXJzZWROYW1lTGlzdCA9IHBhcnNlTmFtZUxpc3RBUEEoIHJlZmVyZW5jZS51bnBhcnNlZE5hbWVMaXN0LCBwYXJzZWRSZWZlcmVuY2VzICk7XHJcbiAgICAgICAgICAgIGxldCB0aXRsZSA9IHRpdGxlTWF0Y2hbMV07XHJcbiAgICAgICAgICAgIHJlZmVyZW5jZS50aXRsZSA9IGZpeFRpdGxlUXVvdGVzKCB0aXRsZSApO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLy8gZWl0aGVyIHdheSwgc3RvcmUgcHViWWVhciBhbmQgYWRkIHJlZmVyZW5jZSB0byBwYXJzZWRSZWZlcmVuY2VzXHJcbiAgICAgICAgICByZWZlcmVuY2UucHViWWVhciA9IHB1YlllYXJNYXRjaFsxXTtcclxuICAgICAgICAgIHBhcnNlZFJlZmVyZW5jZXMucHVzaCggcmVmZXJlbmNlICk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHJldHVybiBwYXJzZWRSZWZlcmVuY2VzO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBwYXJzZUhhcnZhcmQoIHRleHQ6IHN0cmluZyApOiBQYXJzZWRSZWZlcmVuY2VTZXQge1xyXG4gICAgICBsZXQgdW5wYXJzZWRSZWZlcmVuY2VzOiBVbnBhcnNlZFJlZmVyZW5jZVtdID0gW107XHJcbiAgICAgIGxldCBwYXJzZWRSZWZlcmVuY2VzOiBSZWZlcmVuY2VbXSA9IFtdO1xyXG5cclxuICAgICAgcmV0dXJuIHtwYXJzZWRSZWZlcmVuY2VzLCB1bnBhcnNlZFJlZmVyZW5jZXN9O1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBwYXJzZUNoaWNhZ28odGV4dDogc3RyaW5nICk6IFBhcnNlZFJlZmVyZW5jZVNldCB7XHJcbiAgICAgIGxldCB1bnBhcnNlZFJlZmVyZW5jZXM6IFVucGFyc2VkUmVmZXJlbmNlW10gPSBbXTtcclxuICAgICAgbGV0IHBhcnNlZFJlZmVyZW5jZXM6IFJlZmVyZW5jZVtdID0gW107XHJcblxyXG4gICAgICByZXR1cm4ge3BhcnNlZFJlZmVyZW5jZXMsIHVucGFyc2VkUmVmZXJlbmNlc307XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHBhcnNlTUxBKCB0ZXh0OiBzdHJpbmcgKTogUGFyc2VkUmVmZXJlbmNlU2V0IHtcclxuICAgICAgbGV0IHVucGFyc2VkUmVmZXJlbmNlczogVW5wYXJzZWRSZWZlcmVuY2VbXSA9IFtdO1xyXG4gICAgICBsZXQgcGFyc2VkUmVmZXJlbmNlczogUmVmZXJlbmNlW10gPSBbXTtcclxuXHJcbiAgICAgIHJldHVybiB7cGFyc2VkUmVmZXJlbmNlcywgdW5wYXJzZWRSZWZlcmVuY2VzfTtcclxuICAgIH1cclxuICB9Il19
