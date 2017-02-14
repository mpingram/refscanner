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
        var nameListEndCheck = / /g;
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9jb21waWxlZC9hcHAvcGFyc2Vycy9iaWJsaW9ncmFwaHktcGFyc2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFRQTtJQUFBO0lBeUxFLENBQUM7SUF2TGdCLHNDQUFtQixHQUFsQyxVQUFvQyxJQUFZO1FBQzlDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBRSxVQUFBLEtBQUs7WUFDbkMsRUFBRSxDQUFBLENBQUUsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFFLENBQUM7Z0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNuQyxJQUFJO2dCQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDcEIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsMkRBQTJEO0lBQzNELDJCQUEyQjtJQUNaLGdDQUFhLEdBQTVCLFVBQThCLEtBQWEsRUFBRSxJQUFZO1FBQ3ZELElBQU0sS0FBSyxHQUFvQixLQUFLLENBQUMsSUFBSSxDQUFFLElBQUksQ0FBRSxDQUFDO1FBQ2xELEVBQUUsQ0FBQyxDQUFFLEtBQUssS0FBSyxJQUFLLENBQUMsQ0FBQSxDQUFDO1lBQ3BCLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBQ0QsR0FBRyxDQUFDLENBQUUsSUFBSSxXQUFXLEdBQUcsQ0FBQyxFQUFFLFdBQVcsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLFdBQVcsRUFBRSxFQUFFLENBQUM7WUFDckUsSUFBSSxjQUFjLEdBQUcsS0FBSyxDQUFFLFdBQVcsQ0FBRSxDQUFDO1lBQzFDLEVBQUUsQ0FBQyxDQUFFLGNBQWMsS0FBSyxTQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUNuQyxvQkFBb0I7Z0JBQ3BCLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDL0IsQ0FBQztRQUNILENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVjLDZCQUFVLEdBQXpCLFVBQTJCLElB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QzVDLENBQUM7Z0JBQ0Qsa0VBQWtFO2dCQUNsRSxTQUFTLENBQUMsT0FBTyxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEMsZ0JBQWdCLENBQUMsSUFBSSxDQUFFLFNBQVMsQ0FBRSxDQUFDO1lBQ3JDLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztJQUMxQixDQUFDO0lBRU0sK0JBQVksR0FBbkIsVUFBcUIsSUFBWTtRQUMvQixJQUFJLGtCQUFrQixHQUF3QixFQUFFLENBQUM7UUFDakQsSUFBSSxnQkFBZ0IsR0FBZ0IsRUFBRSxDQUFDO1FBRXZDLE1BQU0sQ0FBQyxFQUFDLGdCQUFnQixrQkFBQSxFQUFFLGtCQUFrQixvQkFBQSxFQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVNLCtCQUFZLEdBQW5CLFVBQW9CLElBQVk7UUFDOUIsSUFBSSxrQkFBa0IsR0FBd0IsRUFBRSxDQUFDO1FBQ2pELElBQUksZ0JBQWdCLEdBQWdCLEVBQUUsQ0FBQztRQUV2QyxNQUFNLENBQUMsRUFBQyxnQkFBZ0Isa0JBQUEsRUFBRSxrQkFBa0Isb0JBQUEsRUFBQyxDQUFDO0lBQ2hELENBQUM7SUFFTSwyQkFBUSxHQUFmLFVBQWlCLElBQVk7UUFDM0IsSUFBSSxrQkFBa0IsR0FBd0IsRUFBRSxDQUFDO1FBQ2pELElBQUksZ0JBQWdCLEdBQWdCLEVBQUUsQ0FBQztRQUV2QyxNQUFNLENBQUMsRUFBQyxnQkFBZ0Isa0JBQUEsRUFBRSxrQkFBa0Isb0JBQUEsRUFBQyxDQUFDO0lBQ2hELENBQUM7SUFDSCx5QkFBQztBQUFELENBekxGLEFBeUxHLElBQUE7QUF6TFUsZ0RBQWtCIiwiZmlsZSI6InBhcnNlcnMvYmlibGlvZ3JhcGh5LXBhcnNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcbiAgUmVmZXJlbmNlLFxyXG4gIFVucGFyc2VkUmVmZXJlbmNlLFxyXG4gIFBhcnNlZFJlZmVyZW5jZVNldCxcclxuICBBdXRob3IsXHJcbiAgQXV0aG9yTGlzdFxyXG59IGZyb20gXCIuL3R5cGVkZWZzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQmlibGlvZ3JhcGh5UGFyc2VyIHtcclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBiaWJsaW9ncmFwaHlUb0FycmF5KCB0ZXh0OiBzdHJpbmcgKSA6IHN0cmluZ1tdIHtcclxuICAgICAgcmV0dXJuIHRleHQuc3BsaXQoJ1xcbicpLmZpbHRlciggZW50cnkgPT4ge1xyXG4gICAgICAgIGlmKCBlbnRyeS5sZW5ndGggPiAxICkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgZWxzZSByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGhlbHBlciByb3V0aW5lIHRvIGdldCBmaXJzdCBtYXRjaCBmcm9tIHJlZ2V4LCByZWdhcmRsZXNzXHJcbiAgICAvLyBvZiBjYXB0dXJpbmcgZ3JvdXAgb3JkZXJcclxuICAgIHByaXZhdGUgc3RhdGljIGdldEZpcnN0TWF0Y2goIHJlZ2V4OiBSZWdFeHAsIHRleHQ6IHN0cmluZyApOiBzdHJpbmcgfCBudWxsIHtcclxuICAgICAgY29uc3QgbWF0Y2g6IFJlZ0V4cEV4ZWNBcnJheSA9IHJlZ2V4LmV4ZWMoIHRleHQgKTtcclxuICAgICAgaWYgKCBtYXRjaCA9PT0gbnVsbCApe1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9XHJcbiAgICAgIGZvciAoIGxldCBncm91cE51bWJlciA9IDE7IGdyb3VwTnVtYmVyIDwgbWF0Y2gubGVuZ3RoOyBncm91cE51bWJlcisrICl7XHJcbiAgICAgICAgbGV0IGNhcHR1cmluZ0dyb3VwID0gbWF0Y2hbIGdyb3VwTnVtYmVyIF07XHJcbiAgICAgICAgaWYgKCBjYXB0dXJpbmdHcm91cCAhPT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgICAgLy8gdHJpbSBqdXN0IGluIGNhc2VcclxuICAgICAgICAgIHJldHVybiBjYXB0dXJpbmdHcm91cC50cmltKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGdldEluaXRpYWwoIG5hbWU6IHN0cmluZyB8IG51bGwgKTogc3RyaW5nIHwgbnVsbCB7XHJcbiAgICAgIGlmICggbmFtZSA9PT0gbnVsbCApIHJldHVybiBudWxsO1xyXG4gICAgICByZXR1cm4gbmFtZS5zbGljZSgwLDEpOyAgIFxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBwYXJzZUFQQSggdGV4dDogc3RyaW5nICk6IFBhcnNlZFJlZmVyZW5jZVNldCB7XHJcblxyXG4gICAgICBsZXQgdW5wYXJzZWRSZWZlcmVuY2VzOiBVbnBhcnNlZFJlZmVyZW5jZVtdID0gW107XHJcbiAgICAgIGxldCBwYXJzZWRSZWZlcmVuY2VzOiBSZWZlcmVuY2VbXSA9IFtdO1xyXG4gICAgICAvLyBtYXRjaCBmaXJzdCBibG9jayBvZiB0ZXh0IHVudGlsIGZpcnN0IHBlcmlvZCwgc28gbG9uZyBhcyBcclxuICAgICAgY29uc3QgbmFtZUxpc3RPclRpdGxlUmUgPSAvXi4qP2V0IGFsXFwufF4uKj9bXFxTXXszLH1cXC4vbTtcclxuICAgICAgLy8gVE9ETzogd3JpdGUgUkUgdG8gZXhhbWluZSBjb3JuZXIgY2FzZSB3aGVyZSBuYW1lTGlzdE9yVGl0bGUgaXMgYSBOYW1lIExpc3RcclxuICAgICAgLy8gd2NoaWNoIGVuZGVkIHdpdGggJ0pyLicsICdTci4nLCBvciBhbiBpbml0aWFsLlxyXG4gICAgICAvLyBTdHJhdDogc3RlcCBiYWNrIGJ5IG9uZSBwZXJpb2QuIElzIHRoZXJlIGFuICdhbmQnIHRvIHRoZSBsZWZ0P1xyXG4gICAgICAvLyBpZiBzbywgbG9vayBmb3IgSnIuIG9yIFNyLiBpbW1lZGlhdGVseSB0byBsZWZ0LlxyXG4gICAgICAvLyBpZiBub3QsIGxvb2sgZm9yIHNpbmdsZSBpbml0aWFsIGltbWVkaWF0ZWx5IHRvIGxlZnQuXHJcbiAgICAgIC8vIHRoZSByZXN1bHQgb2YgdGhpcyBpcyBpbXBvcnRhbnQgLS0gaXQnbGwgZGV0ZXJtaW5lIHdoZXJlIHdlIGxvb2sgZm9yIHRoZSB0aXRsZS4gKCEhKVxyXG4gICAgICBjb25zdCBuYW1lTGlzdEVuZENoZWNrID0gL1xyXG4gICAgICAvLyBtYXRjaCBibG9jayBvZiB0ZXh0IGJldHdlZW4gZmlyc3QgYW5kIHNlY29uZCBwZXJpb2QsXHJcbiAgICAgIC8vICAgYWZ0ZXIgd2hpY2ggc2hvdWxkIG9jY3VyIGEgZGF0ZS5cclxuICAgICAgY29uc3QgdGl0bGVSZSA9IC9eLio/XFwuID8oLis/KVxcLi4rPyhbMV1bMC05XVswLTldWzAtOV18WzJdWzBdWzAtMl1bMC05XSkvbTtcclxuICAgICAgLy8gbWF0Y2ggdmFsaWQgZGF0ZSBhZnRlciB0d28gcGVyaW9kcy5cclxuICAgICAgY29uc3QgcHViWWVhclJlID0gL14uKj9cXC4uKj8oWzFdWzAtOV1bMC05XVswLTldfFsyXVswXVswLTJdWzAtOV0pL207XHJcblxyXG4gICAgICAvLyBOT1RFUzogcmVnZXggdGVzdGluZyB1cmxzXHJcbiAgICAgIC8vIG5hbWVzIG9ubHk6XHJcbiAgICAgIC8vIGh0dHBzOi8vcmVnZXgxMDEuY29tL3IvbmhPdHRVLzFcclxuICAgICAgLy8gZnVsbCB0ZXh0OlxyXG4gICAgICAvLyBodHRwczovL3JlZ2V4MTAxLmNvbS9yL1h5dnZSeS8xXHJcblxyXG4gICAgICAvLyBoZWxwZXIgZnVuY3Rpb25zXHJcbiAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgICAgIGZ1bmN0aW9uIHBhcnNlTmFtZUxpc3RBUEEoIG5hbWVMaXN0U3RyaW5nOiBzdHJpbmcsIHByZXZpb3VzbHlQYXJzZWRSZWZlcmVuY2VzOiBSZWZlcmVuY2VbXSApOiBBdXRob3JMaXN0IHtcclxuXHJcbiAgICAgICAgLy8gaW5pdGlhbGl6ZSBvdXRwdXRcclxuICAgICAgICBsZXQgYXV0aG9yTGlzdDogQXV0aG9yTGlzdCA9IHt9IGFzIEF1dGhvckxpc3Q7XHJcbiAgICAgICAgbGV0IGZpcnN0QXV0aG9yOiBBdXRob3IgPSB7fSBhcyBBdXRob3I7XHJcbiAgICAgICAgbGV0IHNlY29uZEF1dGhvcjogQXV0aG9yID0ge30gYXMgQXV0aG9yO1xyXG4gICAgICAgIGxldCB0aHJlZU9yTW9yZUF1dGhvcnM6IGJvb2xlYW47XHJcblxyXG4gICAgICAgIC8vIFJlZ0V4cHNcclxuICAgICAgICAvLyAtLS0tLS0tXHJcbiAgICAgICAgY29uc3QgdHJpcGxlSHlwaGVuUmU6IFJlZ0V4cCA9IC9eKC0tLSl8XijigJPigJPigJMpfF4o4oCU4oCU4oCUKS87XHJcbiAgICAgICAgY29uc3QgZXRBbFJlOiBSZWdFeHAgPSAvZXQgYWwvO1xyXG4gICAgICAgIGNvbnN0IHByaW1hcnlBdXRob3JMYXN0TmFtZVJlOiBSZWdFeHAgPSAvXiguKz8pLC87XHJcbiAgICAgICAgY29uc3Qgc2Vjb25kYXJ5QXV0aG9yTGFzdE5hbWVSZTogUmVnRXhwID0gL2FuZCAuKj8oW0EtWl1cXFMrP1xcYikkfGFuZCAuKj8oW0EtWl1cXFMrPyksIFthLXpdKz8kLztcclxuICAgICAgICBjb25zdCBwcmltYXJ5QXV0aG9yRmlyc3ROYW1lUmU6IFJlZ0V4cCA9IC9eLis/LCAoLis/KSx8Xi4rPywgKC4rPykkLztcclxuICAgICAgICAvLyAtLS0tLS0tXHJcblxyXG4gICAgICAgIC8vIHBhcnNlIG5hbWUgbGlzdFxyXG4gICAgICAgIC8vID09PT09PT09PT09PVxyXG5cclxuICAgICAgICBjb25zdCBwcmltYXJ5QXV0aG9yTGFzdE5hbWU6IHN0cmluZyA9IEJpYmxpb2dyYXBoeVBhcnNlci5nZXRGaXJzdE1hdGNoKCBwcmltYXJ5QXV0aG9yTGFzdE5hbWVSZSwgbmFtZUxpc3RTdHJpbmcgKTtcclxuICAgICAgICBjb25zdCBzZWNvbmRhcnlBdXRob3JMYXN0TmFtZTogc3RyaW5nID0gQmlibGlvZ3JhcGh5UGFyc2VyLmdldEZpcnN0TWF0Y2goIHNlY29uZGFyeUF1dGhvckxhc3ROYW1lUmUsIG5hbWVMaXN0U3RyaW5nICk7XHJcbiAgICAgICAgY29uc3QgcHJpbWFyeUF1dGhvckZpcnN0TmFtZTogc3RyaW5nID0gQmlibGlvZ3JhcGh5UGFyc2VyLmdldEZpcnN0TWF0Y2goIHByaW1hcnlBdXRob3JGaXJzdE5hbWVSZSwgbmFtZUxpc3RTdHJpbmcgKTtcclxuXHJcbiAgICAgICAgZmlyc3RBdXRob3IubGFzdG5hbWUgPSBwcmltYXJ5QXV0aG9yTGFzdE5hbWVcclxuICAgICAgICBmaXJzdEF1dGhvci5maXJzdG5hbWUgPSBwcmltYXJ5QXV0aG9yRmlyc3ROYW1lXHJcbiAgICAgICAgZmlyc3RBdXRob3IuZmlyc3RJbml0aWFsID0gQmlibGlvZ3JhcGh5UGFyc2VyLmdldEluaXRpYWwoIGZpcnN0QXV0aG9yLmZpcnN0bmFtZSApO1xyXG4gICAgICAgIC8vIGlmIHdlIGRpZG4ndCBtYXRjaCBhIHNlY29uZCBhdXRob3IsIG51bGwgdGhlIHNlY29uZCBhdXRob3IgaW4gb3VyIG91dHB1dCBBdXRob3JMaXN0XHJcbiAgICAgICAgaWYgKCBzZWNvbmRhcnlBdXRob3JMYXN0TmFtZSA9PT0gbnVsbCApe1xyXG4gICAgICAgICAgc2Vjb25kQXV0aG9yID0gbnVsbDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgc2Vjb25kQXV0aG9yLmxhc3RuYW1lID0gc2Vjb25kYXJ5QXV0aG9yTGFzdE5hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgXHJcblxyXG4gICAgICAgIGNvbnN0IG5hbWVPbWl0dGVkOiBib29sZWFuID0gdHJpcGxlSHlwaGVuUmUudGVzdChuYW1lTGlzdFN0cmluZyk7XHJcbiAgICAgICAgY29uc3QgY29udGFpbnNFdEFsOiBib29sZWFuID0gZXRBbFJlLnRlc3QobmFtZUxpc3RTdHJpbmcpO1xyXG4gICAgICAgIGlmICggbmFtZU9taXR0ZWQgPT09IHRydWUgKXtcclxuICAgICAgICAgIGNvbnN0IHByZXZpb3VzUmVmZXJlbmNlID0gcHJldmlvdXNseVBhcnNlZFJlZmVyZW5jZXNbcHJldmlvdXNseVBhcnNlZFJlZmVyZW5jZXMubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgICBmaXJzdEF1dGhvciA9IHByZXZpb3VzUmVmZXJlbmNlLnBhcnNlZE5hbWVMaXN0LmZpcnN0QXV0aG9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIGNvbnRhaW5zRXRBbCA9PT0gdHJ1ZSApe1xyXG4gICAgICAgICAgdGhyZWVPck1vcmVBdXRob3JzID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGF1dGhvckxpc3QuZmlyc3RBdXRob3IgPSBmaXJzdEF1dGhvcjtcclxuICAgICAgICBhdXRob3JMaXN0LnNlY29uZEF1dGhvciA9IHNlY29uZEF1dGhvcjtcclxuICAgICAgICBhdXRob3JMaXN0LnRocmVlT3JNb3JlQXV0aG9ycyA9IHRocmVlT3JNb3JlQXV0aG9ycztcclxuICAgICAgICByZXR1cm4gYXV0aG9yTGlzdDtcclxuICAgICAgfVxyXG5cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGZpeFRpdGxlUXVvdGVzKCB0aXRsZTogc3RyaW5nICk6IHN0cmluZyB7XHJcbiAgICAgICAgLy8gaWYgdGl0bGUgYmVnaW5zIHdpdGggYSBxdW90YXRpb24gbWFyayBidXQgZG9lc24ndCBlbmQgd2l0aCBhIHF1b3RhdGlvbiBtYXJrLi4uIFxyXG4gICAgICAgIC8vIEZJWE1FOiBhY2NvdW50IGZvciBpbm5lciBxdW90YXRpb25zICjigJwg4oCdKS4gV293LCBub3Qgc3VyZSBob3cgdG8gZGVhbCB3aXRoIHRoYXQgaW5jb25zaXN0ZW5jeVxyXG4gICAgICAgIGlmKCB0aXRsZS5zbGljZSgwLDEpID09PSAnXCInICYmIHRpdGxlLnNsaWNlKC0xKSAhPT0gJ1wiJyApe1xyXG4gICAgICAgICAgLy8gYWRkIGEgcXVvdGF0aW9uIG1hcmsgdG8gdGhlIGVuZC5cclxuICAgICAgICAgIHRpdGxlICs9ICdcIic7XHJcbiAgICAgICAgfSBlbHNlIGlmICggdGl0bGUuc2xpY2UoMCwxKSA9PT0gJ+KAnCcgJiYgdGl0bGUuc2xpY2UoLTEpICE9PSAn4oCdJyl7XHJcbiAgICAgICAgICB0aXRsZSArPSAn4oCdJztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRpdGxlO1xyXG4gICAgICB9XHJcbiAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG5cclxuICAgICAgdGhpcy5iaWJsaW9ncmFwaHlUb0FycmF5KCB0ZXh0ICkuZm9yRWFjaCggKGVudHJ5LCBpbmRleCwgYmlibGlvZ3JhcGh5QXJyYXkpID0+IHtcclxuXHJcbiAgICAgICAgbGV0IHJlZmVyZW5jZTogUmVmZXJlbmNlID0geyBcclxuICAgICAgICAgIHVucGFyc2VkTmFtZUxpc3Q6IHVuZGVmaW5lZCxcclxuICAgICAgICAgIHBhcnNlZE5hbWVMaXN0OiB1bmRlZmluZWQsXHJcbiAgICAgICAgICB0aXRsZTogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgcHViWWVhcjogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgb3JpZ2luYWw6IGVudHJ5LFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IG5hbWVMaXN0T3JUaXRsZU1hdGNoOiBSZWdFeHBFeGVjQXJyYXkgPSBuYW1lTGlzdE9yVGl0bGVSZS5leGVjKCBlbnRyeSApO1xyXG4gICAgICAgIGNvbnN0IHRpdGxlTWF0Y2g6IFJlZ0V4cEV4ZWNBcnJheSA9IHRpdGxlUmUuZXhlYyggZW50cnkgKTtcclxuICAgICAgICBjb25zdCBwdWJZZWFyTWF0Y2g6IFJlZ0V4cEV4ZWNBcnJheSA9IHB1YlllYXJSZS5leGVjKCBlbnRyeSApO1xyXG5cclxuICAgICAgICBpZiggbmFtZUxpc3RPclRpdGxlTWF0Y2ggPT09IG51bGwgfHwgcHViWWVhck1hdGNoID09PSBudWxsICl7XHJcbiAgICAgICAgICAvLyBnaXZlIHVwOyB3ZSdsbCBsZXQgdGhlIHVzZXIgZmlndXJlIHRoaXMgb25lIG91dC5cclxuICAgICAgICAgIHBhcnNlZFJlZmVyZW5jZXMucHVzaCggcmVmZXJlbmNlICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmICggdGl0bGVNYXRjaCA9PT0gbnVsbCApe1xyXG4gICAgICAgICAgICAvLyBhc3N1bWUgbmFtZUxpc3RPclRpdGxlTWF0Y2ggbWF0Y2hlZCB0aXRsZVxyXG4gICAgICAgICAgICBsZXQgdGl0bGUgPSBuYW1lTGlzdE9yVGl0bGVNYXRjaFsxXTtcclxuICAgICAgICAgICAgcmVmZXJlbmNlLnRpdGxlID0gZml4VGl0bGVRdW90ZXMoIHRpdGxlICk7XHJcbiAgICAgICAgICAgIHJlZmVyZW5jZS51bnBhcnNlZE5hbWVMaXN0ID0gbnVsbDtcclxuICAgICAgICAgICAgcmVmZXJlbmNlLnBhcnNlZE5hbWVMaXN0ID0gbnVsbDtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIGFzc3VtZSBuYW1lTGlzdE9yVGl0bGVNYXRjaCBtYXRjaGVkIG5hbWVMaXN0XHJcbiAgICAgICAgICAgIC8vICAgYW5kIHRpdGxlTWF0Y2ggbWF0Y2hlZCB0aXRsZVxyXG4gICAgICAgICAgICByZWZlcmVuY2UudW5wYXJzZWROYW1lTGlzdCA9IG5hbWVMaXN0T3JUaXRsZU1hdGNoWzFdO1xyXG4gICAgICAgICAgICByZWZlcmVuY2UucGFyc2VkTmFtZUxpc3QgPSBwYXJzZU5hbWVMaXN0QVBBKCByZWZlcmVuY2UudW5wYXJzZWROYW1lTGlzdCwgcGFyc2VkUmVmZXJlbmNlcyApO1xyXG4gICAgICAgICAgICBsZXQgdGl0bGUgPSB0aXRsZU1hdGNoWzFdO1xyXG4gICAgICAgICAgICByZWZlcmVuY2UudGl0bGUgPSBmaXhUaXRsZVF1b3RlcyggdGl0bGUgKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIC8vIGVpdGhlciB3YXksIHN0b3JlIHB1YlllYXIgYW5kIGFkZCByZWZlcmVuY2UgdG8gcGFyc2VkUmVmZXJlbmNlc1xyXG4gICAgICAgICAgcmVmZXJlbmNlLnB1YlllYXIgPSBwdWJZZWFyTWF0Y2hbMV07XHJcbiAgICAgICAgICBwYXJzZWRSZWZlcmVuY2VzLnB1c2goIHJlZmVyZW5jZSApO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICByZXR1cm4gcGFyc2VkUmVmZXJlbmNlcztcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgcGFyc2VIYXJ2YXJkKCB0ZXh0OiBzdHJpbmcgKTogUGFyc2VkUmVmZXJlbmNlU2V0IHtcclxuICAgICAgbGV0IHVucGFyc2VkUmVmZXJlbmNlczogVW5wYXJzZWRSZWZlcmVuY2VbXSA9IFtdO1xyXG4gICAgICBsZXQgcGFyc2VkUmVmZXJlbmNlczogUmVmZXJlbmNlW10gPSBbXTtcclxuXHJcbiAgICAgIHJldHVybiB7cGFyc2VkUmVmZXJlbmNlcywgdW5wYXJzZWRSZWZlcmVuY2VzfTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgcGFyc2VDaGljYWdvKHRleHQ6IHN0cmluZyApOiBQYXJzZWRSZWZlcmVuY2VTZXQge1xyXG4gICAgICBsZXQgdW5wYXJzZWRSZWZlcmVuY2VzOiBVbnBhcnNlZFJlZmVyZW5jZVtdID0gW107XHJcbiAgICAgIGxldCBwYXJzZWRSZWZlcmVuY2VzOiBSZWZlcmVuY2VbXSA9IFtdO1xyXG5cclxuICAgICAgcmV0dXJuIHtwYXJzZWRSZWZlcmVuY2VzLCB1bnBhcnNlZFJlZmVyZW5jZXN9O1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBwYXJzZU1MQSggdGV4dDogc3RyaW5nICk6IFBhcnNlZFJlZmVyZW5jZVNldCB7XHJcbiAgICAgIGxldCB1bnBhcnNlZFJlZmVyZW5jZXM6IFVucGFyc2VkUmVmZXJlbmNlW10gPSBbXTtcclxuICAgICAgbGV0IHBhcnNlZFJlZmVyZW5jZXM6IFJlZmVyZW5jZVtdID0gW107XHJcblxyXG4gICAgICByZXR1cm4ge3BhcnNlZFJlZmVyZW5jZXMsIHVucGFyc2VkUmVmZXJlbmNlc307XHJcbiAgICB9XHJcbiAgfSJdfQ==
