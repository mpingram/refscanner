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
        for (var groupNumber = 1; groupNumber < match.length; groupNumber++) {
            var capturingGroup = match[groupNumber];
            if (capturingGroup !== undefined) {
                // trim just in case
                return capturingGroup.trim();
            }
        }
        return null;
    };
    BibliographyParser.parseAPA = function (text) {
        var unparsedReferences = [];
        var parsedReferences = [];
        // match first block of text until first period
        var nameListOrTitleRe = /^(.+?)\./m;
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
            var authorList;
            var firstAuthor;
            var secondAuthor;
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
            var primaryAuthorFirstName = BibliographyParsercls.getFirstMatch(primaryAuthorFirstNameRe, nameListString);
            firstAuthor.lastname = primaryAuthorLastName;
            firstAuthor.firstname = primaryAuthorFirstName;
            firstAuthor.firstInitial = firstAuthor.firstname.slice(0);
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
            if (title.slice(0) === '"' && title.slice(-1) !== '"') {
                // add a quotation mark to the end.
                title += '"';
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
                    reference.title = titleMatch[1];
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9hcHAvYmlibGlvZ3JhcGh5LXBhcnNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBUUE7SUFBQTtJQXNLRSxDQUFDO0lBcEtnQixzQ0FBbUIsR0FBbEMsVUFBb0MsSUFBWTtRQUM5QyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUUsVUFBQSxLQUFLO1lBQ25DLEVBQUUsQ0FBQSxDQUFFLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBRSxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDbkMsSUFBSTtnQkFBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ3BCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELDJEQUEyRDtJQUMzRCwyQkFBMkI7SUFDWixnQ0FBYSxHQUE1QixVQUE4QixLQUFhLEVBQUUsSUFBWTtRQUN2RCxJQUFNLEtBQUssR0FBb0IsS0FBSyxDQUFDLElBQUksQ0FBRSxJQUFJLENBQUUsQ0FBQztRQUNsRCxHQUFHLENBQUMsQ0FBRSxJQUFJLFdBQVcsR0FBRyxDQUFDLEVBQUUsV0FBVyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsV0FBVyxFQUFFLEVBQUUsQ0FBQztZQUNyRSxJQUFJLGNBQWMsR0FBRyxLQUFLLENBQUUsV0FBVyxDQUFFLENBQUM7WUFDMUMsRUFBRSxDQUFDLENBQUUsY0FBYyxLQUFLLFNBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLG9CQUFvQjtnQkFDcEIsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUMvQixDQUFDO1FBQ0gsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU0sMkJBQVEsR0FBZixVQUFpQixJQUFZO1FBRTNCLElBQUksa0JBQWtCLEdBQXdCLEVBQUUsQ0FBQztRQUNqRCxJQUFJLGdCQUFnQixHQUFnQixFQUFFLENBQUM7UUFDdkMsK0NBQStDO1FBQy9DLElBQU0saUJBQWlCLEdB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LG9CQUFBLEVBQUMsQ0FBQztJQUNoRCxDQUFDO0lBQ0gseUJBQUM7QUFBRCxDQXRLRixBQXNLRyxJQUFBO0FBdEtVLGdEQUFrQiIsImZpbGUiOiJiaWJsaW9ncmFwaHktcGFyc2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBSZWZlcmVuY2UsXHJcbiAgVW5wYXJzZWRSZWZlcmVuY2UsXHJcbiAgUGFyc2VkUmVmZXJlbmNlU2V0LFxyXG4gIEF1dGhvcixcclxuICBBdXRob3JMaXN0XHJcbn0gZnJvbSBcIi4vdHlwZWRlZnNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBCaWJsaW9ncmFwaHlQYXJzZXIge1xyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGJpYmxpb2dyYXBoeVRvQXJyYXkoIHRleHQ6IHN0cmluZyApIDogc3RyaW5nW10ge1xyXG4gICAgICByZXR1cm4gdGV4dC5zcGxpdCgnXFxuJykuZmlsdGVyKCBlbnRyeSA9PiB7XHJcbiAgICAgICAgaWYoIGVudHJ5Lmxlbmd0aCA+IDEgKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICBlbHNlIHJldHVybiBmYWxzZTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gaGVscGVyIHJvdXRpbmUgdG8gZ2V0IGZpcnN0IG1hdGNoIGZyb20gcmVnZXgsIHJlZ2FyZGxlc3NcclxuICAgIC8vIG9mIGNhcHR1cmluZyBncm91cCBvcmRlclxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0Rmlyc3RNYXRjaCggcmVnZXg6IFJlZ0V4cCwgdGV4dDogc3RyaW5nICk6IHN0cmluZyB8IG51bGwge1xyXG4gICAgICBjb25zdCBtYXRjaDogUmVnRXhwRXhlY0FycmF5ID0gcmVnZXguZXhlYyggdGV4dCApO1xyXG4gICAgICBmb3IgKCBsZXQgZ3JvdXBOdW1iZXIgPSAxOyBncm91cE51bWJlciA8IG1hdGNoLmxlbmd0aDsgZ3JvdXBOdW1iZXIrKyApe1xyXG4gICAgICAgIGxldCBjYXB0dXJpbmdHcm91cCA9IG1hdGNoWyBncm91cE51bWJlciBdO1xyXG4gICAgICAgIGlmICggY2FwdHVyaW5nR3JvdXAgIT09IHVuZGVmaW5lZCApIHtcclxuICAgICAgICAgIC8vIHRyaW0ganVzdCBpbiBjYXNlXHJcbiAgICAgICAgICByZXR1cm4gY2FwdHVyaW5nR3JvdXAudHJpbSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgcGFyc2VBUEEoIHRleHQ6IHN0cmluZyApOiBQYXJzZWRSZWZlcmVuY2VTZXQge1xyXG5cclxuICAgICAgbGV0IHVucGFyc2VkUmVmZXJlbmNlczogVW5wYXJzZWRSZWZlcmVuY2VbXSA9IFtdO1xyXG4gICAgICBsZXQgcGFyc2VkUmVmZXJlbmNlczogUmVmZXJlbmNlW10gPSBbXTtcclxuICAgICAgLy8gbWF0Y2ggZmlyc3QgYmxvY2sgb2YgdGV4dCB1bnRpbCBmaXJzdCBwZXJpb2RcclxuICAgICAgY29uc3QgbmFtZUxpc3RPclRpdGxlUmUgPSAvXiguKz8pXFwuL207XHJcbiAgICAgIC8vIG1hdGNoIGJsb2NrIG9mIHRleHQgYmV0d2VlbiBmaXJzdCBhbmQgc2Vjb25kIHBlcmlvZCxcclxuICAgICAgLy8gICBhZnRlciB3aGljaCBzaG91bGQgb2NjdXIgYSBkYXRlLlxyXG4gICAgICBjb25zdCB0aXRsZVJlID0gL14uKj9cXC4gPyguKz8pXFwuLis/KFsxXVswLTldWzAtOV1bMC05XXxbMl1bMF1bMC0yXVswLTldKS9tO1xyXG4gICAgICAvLyBtYXRjaCB2YWxpZCBkYXRlIGFmdGVyIHR3byBwZXJpb2RzLlxyXG4gICAgICBjb25zdCBwdWJZZWFyUmUgPSAvXi4qP1xcLi4qPyhbMV1bMC05XVswLTldWzAtOV18WzJdWzBdWzAtMl1bMC05XSkvbTtcclxuXHJcbiAgICAgIC8vIE5PVEVTOiByZWdleCB0ZXN0aW5nIHVybHNcclxuICAgICAgLy8gbmFtZXMgb25seTpcclxuICAgICAgLy8gaHR0cHM6Ly9yZWdleDEwMS5jb20vci9uaE90dFUvMVxyXG4gICAgICAvLyBmdWxsIHRleHQ6XHJcbiAgICAgIC8vIGh0dHBzOi8vcmVnZXgxMDEuY29tL3IvWHl2dlJ5LzFcclxuXHJcbiAgICAgIC8vIGhlbHBlciBmdW5jdGlvbnNcclxuICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAgICAgZnVuY3Rpb24gcGFyc2VOYW1lTGlzdEFQQSggbmFtZUxpc3RTdHJpbmc6IHN0cmluZywgcHJldmlvdXNseVBhcnNlZFJlZmVyZW5jZXM6IFJlZmVyZW5jZVtdICk6IEF1dGhvckxpc3Qge1xyXG5cclxuICAgICAgICAvLyBpbml0aWFsaXplIG91dHB1dFxyXG4gICAgICAgIGxldCBhdXRob3JMaXN0OiBBdXRob3JMaXN0O1xyXG4gICAgICAgIGxldCBmaXJzdEF1dGhvcjogQXV0aG9yO1xyXG4gICAgICAgIGxldCBzZWNvbmRBdXRob3I6IEF1dGhvcjtcclxuICAgICAgICBsZXQgdGhyZWVPck1vcmVBdXRob3JzOiBib29sZWFuO1xyXG5cclxuICAgICAgICAvLyBSZWdFeHBzXHJcbiAgICAgICAgLy8gLS0tLS0tLVxyXG4gICAgICAgIGNvbnN0IHRyaXBsZUh5cGhlblJlOiBSZWdFeHAgPSAvXigtLS0pfF4o4oCT4oCT4oCTKXxeKOKAlOKAlOKAlCkvO1xyXG4gICAgICAgIGNvbnN0IGV0QWxSZTogUmVnRXhwID0gL2V0IGFsLztcclxuICAgICAgICBjb25zdCBwcmltYXJ5QXV0aG9yTGFzdE5hbWVSZTogUmVnRXhwID0gL14oLis/KSwvO1xyXG4gICAgICAgIGNvbnN0IHNlY29uZGFyeUF1dGhvckxhc3ROYW1lUmU6IFJlZ0V4cCA9IC9hbmQgLio/KFtBLVpdXFxTKz9cXGIpJHxhbmQgLio/KFtBLVpdXFxTKz8pLCBbYS16XSs/JC87XHJcbiAgICAgICAgY29uc3QgcHJpbWFyeUF1dGhvckZpcnN0TmFtZVJlOiBSZWdFeHAgPSAvXi4rPywgKC4rPyksfF4uKz8sICguKz8pJC87XHJcbiAgICAgICAgLy8gLS0tLS0tLVxyXG5cclxuICAgICAgICAvLyBwYXJzZSBuYW1lIGxpc3RcclxuICAgICAgICAvLyA9PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgY29uc3QgcHJpbWFyeUF1dGhvckxhc3ROYW1lOiBzdHJpbmcgPSBCaWJsaW9ncmFwaHlQYXJzZXIuZ2V0Rmlyc3RNYXRjaCggcHJpbWFyeUF1dGhvckxhc3ROYW1lUmUsIG5hbWVMaXN0U3RyaW5nICk7XHJcbiAgICAgICAgY29uc3Qgc2Vjb25kYXJ5QXV0aG9yTGFzdE5hbWU6IHN0cmluZyA9IEJpYmxpb2dyYXBoeVBhcnNlci5nZXRGaXJzdE1hdGNoKCBzZWNvbmRhcnlBdXRob3JMYXN0TmFtZVJlLCBuYW1lTGlzdFN0cmluZyApO1xyXG4gICAgICAgIGNvbnN0IHByaW1hcnlBdXRob3JGaXJzdE5hbWU6IHN0cmluZyA9IEJpYmxpb2dyYXBoeVBhcnNlcmNscy5nZXRGaXJzdE1hdGNoKCBwcmltYXJ5QXV0aG9yRmlyc3ROYW1lUmUsIG5hbWVMaXN0U3RyaW5nICk7XHJcblxyXG4gICAgICAgIGZpcnN0QXV0aG9yLmxhc3RuYW1lID0gcHJpbWFyeUF1dGhvckxhc3ROYW1lXHJcbiAgICAgICAgZmlyc3RBdXRob3IuZmlyc3RuYW1lID0gcHJpbWFyeUF1dGhvckZpcnN0TmFtZVxyXG4gICAgICAgIGZpcnN0QXV0aG9yLmZpcnN0SW5pdGlhbCA9IGZpcnN0QXV0aG9yLmZpcnN0bmFtZS5zbGljZSgwKTtcclxuICAgICAgICAvLyBpZiB3ZSBkaWRuJ3QgbWF0Y2ggYSBzZWNvbmQgYXV0aG9yLCBudWxsIHRoZSBzZWNvbmQgYXV0aG9yIGluIG91ciBvdXRwdXQgQXV0aG9yTGlzdFxyXG4gICAgICAgIGlmICggc2Vjb25kYXJ5QXV0aG9yTGFzdE5hbWUgPT09IG51bGwgKXtcclxuICAgICAgICAgIHNlY29uZEF1dGhvciA9IG51bGw7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHNlY29uZEF1dGhvci5sYXN0bmFtZSA9IHNlY29uZGFyeUF1dGhvckxhc3ROYW1lO1xyXG4gICAgICAgIH1cclxuICAgICAgIFxyXG5cclxuICAgICAgICBjb25zdCBuYW1lT21pdHRlZDogYm9vbGVhbiA9IHRyaXBsZUh5cGhlblJlLnRlc3QobmFtZUxpc3RTdHJpbmcpO1xyXG4gICAgICAgIGNvbnN0IGNvbnRhaW5zRXRBbDogYm9vbGVhbiA9IGV0QWxSZS50ZXN0KG5hbWVMaXN0U3RyaW5nKTtcclxuICAgICAgICBpZiAoIG5hbWVPbWl0dGVkID09PSB0cnVlICl7XHJcbiAgICAgICAgICBjb25zdCBwcmV2aW91c1JlZmVyZW5jZSA9IHByZXZpb3VzbHlQYXJzZWRSZWZlcmVuY2VzW3ByZXZpb3VzbHlQYXJzZWRSZWZlcmVuY2VzLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgICAgZmlyc3RBdXRob3IgPSBwcmV2aW91c1JlZmVyZW5jZS5wYXJzZWROYW1lTGlzdC5maXJzdEF1dGhvcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCBjb250YWluc0V0QWwgPT09IHRydWUgKXtcclxuICAgICAgICAgIHRocmVlT3JNb3JlQXV0aG9ycyA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBhdXRob3JMaXN0LmZpcnN0QXV0aG9yID0gZmlyc3RBdXRob3I7XHJcbiAgICAgICAgYXV0aG9yTGlzdC5zZWNvbmRBdXRob3IgPSBzZWNvbmRBdXRob3I7XHJcbiAgICAgICAgYXV0aG9yTGlzdC50aHJlZU9yTW9yZUF1dGhvcnMgPSB0aHJlZU9yTW9yZUF1dGhvcnM7XHJcbiAgICAgICAgcmV0dXJuIGF1dGhvckxpc3Q7XHJcbiAgICAgIH1cclxuXHJcblxyXG4gICAgICBmdW5jdGlvbiBmaXhUaXRsZVF1b3RlcyggdGl0bGU6IHN0cmluZyApOiBzdHJpbmcge1xyXG4gICAgICAgIC8vIGlmIHRpdGxlIGJlZ2lucyB3aXRoIGEgcXVvdGF0aW9uIG1hcmsgYnV0IGRvZXNuJ3QgZW5kIHdpdGggYSBxdW90YXRpb24gbWFyay4uLiBcclxuICAgICAgICBpZiggdGl0bGUuc2xpY2UoMCkgPT09ICdcIicgJiYgdGl0bGUuc2xpY2UoLTEpICE9PSAnXCInICl7XHJcbiAgICAgICAgICAvLyBhZGQgYSBxdW90YXRpb24gbWFyayB0byB0aGUgZW5kLlxyXG4gICAgICAgICAgdGl0bGUgKz0gJ1wiJztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRpdGxlO1xyXG4gICAgICB9XHJcbiAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG5cclxuICAgICAgdGhpcy5iaWJsaW9ncmFwaHlUb0FycmF5KCB0ZXh0ICkuZm9yRWFjaCggKGVudHJ5LCBpbmRleCwgYmlibGlvZ3JhcGh5QXJyYXkpID0+IHtcclxuXHJcbiAgICAgICAgbGV0IHJlZmVyZW5jZTogUmVmZXJlbmNlID0geyBcclxuICAgICAgICAgIHVucGFyc2VkTmFtZUxpc3Q6IHVuZGVmaW5lZCxcclxuICAgICAgICAgIHBhcnNlZE5hbWVMaXN0OiB1bmRlZmluZWQsXHJcbiAgICAgICAgICB0aXRsZTogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgcHViWWVhcjogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgb3JpZ2luYWw6IGVudHJ5LFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IG5hbWVMaXN0T3JUaXRsZU1hdGNoOiBSZWdFeHBFeGVjQXJyYXkgPSBuYW1lTGlzdE9yVGl0bGVSZS5leGVjKCBlbnRyeSApO1xyXG4gICAgICAgIGNvbnN0IHRpdGxlTWF0Y2g6IFJlZ0V4cEV4ZWNBcnJheSA9IHRpdGxlUmUuZXhlYyggZW50cnkgKTtcclxuICAgICAgICBjb25zdCBwdWJZZWFyTWF0Y2g6IFJlZ0V4cEV4ZWNBcnJheSA9IHB1YlllYXJSZS5leGVjKCBlbnRyeSApO1xyXG5cclxuICAgICAgICBpZiggbmFtZUxpc3RPclRpdGxlTWF0Y2ggPT09IG51bGwgfHwgcHViWWVhck1hdGNoID09PSBudWxsICl7XHJcbiAgICAgICAgICAvLyBnaXZlIHVwOyB3ZSdsbCBsZXQgdGhlIHVzZXIgZmlndXJlIHRoaXMgb25lIG91dC5cclxuICAgICAgICAgIHBhcnNlZFJlZmVyZW5jZXMucHVzaCggcmVmZXJlbmNlICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmICggdGl0bGVNYXRjaCA9PT0gbnVsbCApe1xyXG4gICAgICAgICAgICAvLyBhc3N1bWUgbmFtZUxpc3RPclRpdGxlTWF0Y2ggbWF0Y2hlZCB0aXRsZVxyXG4gICAgICAgICAgICBsZXQgdGl0bGUgPSBuYW1lTGlzdE9yVGl0bGVNYXRjaFsxXTtcclxuICAgICAgICAgICAgcmVmZXJlbmNlLnRpdGxlID0gZml4VGl0bGVRdW90ZXMoIHRpdGxlICk7XHJcbiAgICAgICAgICAgIHJlZmVyZW5jZS51bnBhcnNlZE5hbWVMaXN0ID0gbnVsbDtcclxuICAgICAgICAgICAgcmVmZXJlbmNlLnBhcnNlZE5hbWVMaXN0ID0gbnVsbDtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIGFzc3VtZSBuYW1lTGlzdE9yVGl0bGVNYXRjaCBtYXRjaGVkIG5hbWVMaXN0XHJcbiAgICAgICAgICAgIC8vICAgYW5kIHRpdGxlTWF0Y2ggbWF0Y2hlZCB0aXRsZVxyXG4gICAgICAgICAgICByZWZlcmVuY2UudW5wYXJzZWROYW1lTGlzdCA9IG5hbWVMaXN0T3JUaXRsZU1hdGNoWzFdO1xyXG4gICAgICAgICAgICByZWZlcmVuY2UucGFyc2VkTmFtZUxpc3QgPSBwYXJzZU5hbWVMaXN0QVBBKCByZWZlcmVuY2UudW5wYXJzZWROYW1lTGlzdCwgcGFyc2VkUmVmZXJlbmNlcyApO1xyXG4gICAgICAgICAgICByZWZlcmVuY2UudGl0bGUgPSB0aXRsZU1hdGNoWzFdO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLy8gZWl0aGVyIHdheSwgc3RvcmUgcHViWWVhciBhbmQgYWRkIHJlZmVyZW5jZSB0byBwYXJzZWRSZWZlcmVuY2VzXHJcbiAgICAgICAgICByZWZlcmVuY2UucHViWWVhciA9IHB1YlllYXJNYXRjaFsxXTtcclxuICAgICAgICAgIHBhcnNlZFJlZmVyZW5jZXMucHVzaCggcmVmZXJlbmNlICk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHJldHVybiBwYXJzZWRSZWZlcmVuY2VzO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBwYXJzZUhhcnZhcmQoIHRleHQ6IHN0cmluZyApOiBQYXJzZWRSZWZlcmVuY2VTZXQge1xyXG4gICAgICBsZXQgdW5wYXJzZWRSZWZlcmVuY2VzOiBVbnBhcnNlZFJlZmVyZW5jZVtdID0gW107XHJcbiAgICAgIGxldCBwYXJzZWRSZWZlcmVuY2VzOiBSZWZlcmVuY2VbXSA9IFtdO1xyXG5cclxuICAgICAgcmV0dXJuIHtwYXJzZWRSZWZlcmVuY2VzLCB1bnBhcnNlZFJlZmVyZW5jZXN9O1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBwYXJzZUNoaWNhZ28odGV4dDogc3RyaW5nICk6IFBhcnNlZFJlZmVyZW5jZVNldCB7XHJcbiAgICAgIGxldCB1bnBhcnNlZFJlZmVyZW5jZXM6IFVucGFyc2VkUmVmZXJlbmNlW10gPSBbXTtcclxuICAgICAgbGV0IHBhcnNlZFJlZmVyZW5jZXM6IFJlZmVyZW5jZVtdID0gW107XHJcblxyXG4gICAgICByZXR1cm4ge3BhcnNlZFJlZmVyZW5jZXMsIHVucGFyc2VkUmVmZXJlbmNlc307XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHBhcnNlTUxBKCB0ZXh0OiBzdHJpbmcgKTogUGFyc2VkUmVmZXJlbmNlU2V0IHtcclxuICAgICAgbGV0IHVucGFyc2VkUmVmZXJlbmNlczogVW5wYXJzZWRSZWZlcmVuY2VbXSA9IFtdO1xyXG4gICAgICBsZXQgcGFyc2VkUmVmZXJlbmNlczogUmVmZXJlbmNlW10gPSBbXTtcclxuXHJcbiAgICAgIHJldHVybiB7cGFyc2VkUmVmZXJlbmNlcywgdW5wYXJzZWRSZWZlcmVuY2VzfTtcclxuICAgIH1cclxuICB9Il19
