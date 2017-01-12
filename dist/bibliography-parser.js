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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9hcHAvYmlibGlvZ3JhcGh5LXBhcnNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBUUE7SUFBQTtJQWtMRSxDQUFDO0lBaExnQixzQ0FBbUIsR0FBbEMsVUFBb0MsSUFBWTtRQUM5QyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUUsVUFBQSxLQUFLO1lBQ25DLEVBQUUsQ0FBQSxDQUFFLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBRSxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDbkMsSUFBSTtnQkFBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ3BCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELDJEQUEyRDtJQUMzRCwyQkFBMkI7SUFDWixnQ0FBYSxHQUE1QixVQUE4QixLQUFhLEVBQUUsSUFBWTtRQUN2RCxJQUFNLEtBQUssR0FBb0IsS0FBSyxDQUFDLElBQUksQ0FBRSxJQUFJLENBQUUsQ0FBQztRQUNsRCxFQUFFLENBQUMsQ0FBRSxLQUFLLEtBQUssSUFBSyxDQUFDLENBQUEsQ0FBQztZQUNwQixNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUNELEdBQUcsQ0FBQyxDQUFFLElBQUksV0FBVyxHQUFHLENBQUMsRUFBRSxXQUFXLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxXQUFXLEVBQUUsRUFBRSxDQUFDO1lBQ3JFLElBQUksY0FBYyxHQUFHLEtBQUssQ0FBRSxXQUFXLENBQUUsQ0FBQztZQUMxQyxFQUFFLENBQUMsQ0FBRSxjQUFjLEtBQUssU0FBVSxDQUFDLENBQUMsQ0FBQztnQkFDbkMsb0JBQW9CO2dCQUNwQixNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQy9CLENBQUM7UUFDSCxDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFFYyw2QkFBVSxHQUF6QixVQUEyQixJQUFtQjtRQUM1QyxFQUFFLENB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QUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLGdCQUFnQixDQUFDO0lBQzFCLENBQUM7SUFFTSwrQkFBWSxHQUFuQixVQUFxQixJQUFZO1FBQy9CLElBQUksa0JBQWtCLEdBQXdCLEVBQUUsQ0FBQztRQUNqRCxJQUFJLGdCQUFnQixHQUFnQixFQUFFLENBQUM7UUFFdkMsTUFBTSxDQUFDLEVBQUMsZ0JBQWdCLGtCQUFBLEVBQUUsa0JBQWtCLG9CQUFBLEVBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRU0sK0JBQVksR0FBbkIsVUFBb0IsSUFBWTtRQUM5QixJQUFJLGtCQUFrQixHQUF3QixFQUFFLENBQUM7UUFDakQsSUFBSSxnQkFBZ0IsR0FBZ0IsRUFBRSxDQUFDO1FBRXZDLE1BQU0sQ0FBQyxFQUFDLGdCQUFnQixrQkFBQSxFQUFFLGtCQUFrQixvQkFBQSxFQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVNLDJCQUFRLEdBQWYsVUFBaUIsSUFBWTtRQUMzQixJQUFJLGtCQUFrQixHQUF3QixFQUFFLENBQUM7UUFDakQsSUFBSSxnQkFBZ0IsR0FBZ0IsRUFBRSxDQUFDO1FBRXZDLE1BQU0sQ0FBQyxFQUFDLGdCQUFnQixrQkFBQSxFQUFFLGtCQUFrQixvQkFBQSxFQUFDLENBQUM7SUFDaEQsQ0FBQztJQUNILHlCQUFDO0FBQUQsQ0FsTEYsQUFrTEcsSUFBQTtBQWxMVSxnREFBa0IiLCJmaWxlIjoiYmlibGlvZ3JhcGh5LXBhcnNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcbiAgUmVmZXJlbmNlLFxyXG4gIFVucGFyc2VkUmVmZXJlbmNlLFxyXG4gIFBhcnNlZFJlZmVyZW5jZVNldCxcclxuICBBdXRob3IsXHJcbiAgQXV0aG9yTGlzdFxyXG59IGZyb20gXCIuL3R5cGVkZWZzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQmlibGlvZ3JhcGh5UGFyc2VyIHtcclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBiaWJsaW9ncmFwaHlUb0FycmF5KCB0ZXh0OiBzdHJpbmcgKSA6IHN0cmluZ1tdIHtcclxuICAgICAgcmV0dXJuIHRleHQuc3BsaXQoJ1xcbicpLmZpbHRlciggZW50cnkgPT4ge1xyXG4gICAgICAgIGlmKCBlbnRyeS5sZW5ndGggPiAxICkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgZWxzZSByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGhlbHBlciByb3V0aW5lIHRvIGdldCBmaXJzdCBtYXRjaCBmcm9tIHJlZ2V4LCByZWdhcmRsZXNzXHJcbiAgICAvLyBvZiBjYXB0dXJpbmcgZ3JvdXAgb3JkZXJcclxuICAgIHByaXZhdGUgc3RhdGljIGdldEZpcnN0TWF0Y2goIHJlZ2V4OiBSZWdFeHAsIHRleHQ6IHN0cmluZyApOiBzdHJpbmcgfCBudWxsIHtcclxuICAgICAgY29uc3QgbWF0Y2g6IFJlZ0V4cEV4ZWNBcnJheSA9IHJlZ2V4LmV4ZWMoIHRleHQgKTtcclxuICAgICAgaWYgKCBtYXRjaCA9PT0gbnVsbCApe1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9XHJcbiAgICAgIGZvciAoIGxldCBncm91cE51bWJlciA9IDE7IGdyb3VwTnVtYmVyIDwgbWF0Y2gubGVuZ3RoOyBncm91cE51bWJlcisrICl7XHJcbiAgICAgICAgbGV0IGNhcHR1cmluZ0dyb3VwID0gbWF0Y2hbIGdyb3VwTnVtYmVyIF07XHJcbiAgICAgICAgaWYgKCBjYXB0dXJpbmdHcm91cCAhPT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgICAgLy8gdHJpbSBqdXN0IGluIGNhc2VcclxuICAgICAgICAgIHJldHVybiBjYXB0dXJpbmdHcm91cC50cmltKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGdldEluaXRpYWwoIG5hbWU6IHN0cmluZyB8IG51bGwgKTogc3RyaW5nIHwgbnVsbCB7XHJcbiAgICAgIGlmICggbmFtZSA9PT0gbnVsbCApIHJldHVybiBudWxsO1xyXG4gICAgICByZXR1cm4gbmFtZS5zbGljZSgwLDEpOyAgIFxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBwYXJzZUFQQSggdGV4dDogc3RyaW5nICk6IFBhcnNlZFJlZmVyZW5jZVNldCB7XHJcblxyXG4gICAgICBsZXQgdW5wYXJzZWRSZWZlcmVuY2VzOiBVbnBhcnNlZFJlZmVyZW5jZVtdID0gW107XHJcbiAgICAgIGxldCBwYXJzZWRSZWZlcmVuY2VzOiBSZWZlcmVuY2VbXSA9IFtdO1xyXG4gICAgICAvLyBtYXRjaCBmaXJzdCBibG9jayBvZiB0ZXh0IHVudGlsIGZpcnN0IHBlcmlvZFxyXG4gICAgICBjb25zdCBuYW1lTGlzdE9yVGl0bGVSZSA9IC9eKC4rPylcXC4vbTtcclxuICAgICAgLy8gbWF0Y2ggYmxvY2sgb2YgdGV4dCBiZXR3ZWVuIGZpcnN0IGFuZCBzZWNvbmQgcGVyaW9kLFxyXG4gICAgICAvLyAgIGFmdGVyIHdoaWNoIHNob3VsZCBvY2N1ciBhIGRhdGUuXHJcbiAgICAgIGNvbnN0IHRpdGxlUmUgPSAvXi4qP1xcLiA/KC4rPylcXC4uKz8oWzFdWzAtOV1bMC05XVswLTldfFsyXVswXVswLTJdWzAtOV0pL207XHJcbiAgICAgIC8vIG1hdGNoIHZhbGlkIGRhdGUgYWZ0ZXIgdHdvIHBlcmlvZHMuXHJcbiAgICAgIGNvbnN0IHB1YlllYXJSZSA9IC9eLio/XFwuLio/KFsxXVswLTldWzAtOV1bMC05XXxbMl1bMF1bMC0yXVswLTldKS9tO1xyXG5cclxuICAgICAgLy8gTk9URVM6IHJlZ2V4IHRlc3RpbmcgdXJsc1xyXG4gICAgICAvLyBuYW1lcyBvbmx5OlxyXG4gICAgICAvLyBodHRwczovL3JlZ2V4MTAxLmNvbS9yL25oT3R0VS8xXHJcbiAgICAgIC8vIGZ1bGwgdGV4dDpcclxuICAgICAgLy8gaHR0cHM6Ly9yZWdleDEwMS5jb20vci9YeXZ2UnkvMVxyXG5cclxuICAgICAgLy8gaGVscGVyIGZ1bmN0aW9uc1xyXG4gICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gICAgICBmdW5jdGlvbiBwYXJzZU5hbWVMaXN0QVBBKCBuYW1lTGlzdFN0cmluZzogc3RyaW5nLCBwcmV2aW91c2x5UGFyc2VkUmVmZXJlbmNlczogUmVmZXJlbmNlW10gKTogQXV0aG9yTGlzdCB7XHJcblxyXG4gICAgICAgIC8vIGluaXRpYWxpemUgb3V0cHV0XHJcbiAgICAgICAgbGV0IGF1dGhvckxpc3Q6IEF1dGhvckxpc3QgPSB7fSBhcyBBdXRob3JMaXN0O1xyXG4gICAgICAgIGxldCBmaXJzdEF1dGhvcjogQXV0aG9yID0ge30gYXMgQXV0aG9yO1xyXG4gICAgICAgIGxldCBzZWNvbmRBdXRob3I6IEF1dGhvciA9IHt9IGFzIEF1dGhvcjtcclxuICAgICAgICBsZXQgdGhyZWVPck1vcmVBdXRob3JzOiBib29sZWFuO1xyXG5cclxuICAgICAgICAvLyBSZWdFeHBzXHJcbiAgICAgICAgLy8gLS0tLS0tLVxyXG4gICAgICAgIGNvbnN0IHRyaXBsZUh5cGhlblJlOiBSZWdFeHAgPSAvXigtLS0pfF4o4oCT4oCT4oCTKXxeKOKAlOKAlOKAlCkvO1xyXG4gICAgICAgIGNvbnN0IGV0QWxSZTogUmVnRXhwID0gL2V0IGFsLztcclxuICAgICAgICBjb25zdCBwcmltYXJ5QXV0aG9yTGFzdE5hbWVSZTogUmVnRXhwID0gL14oLis/KSwvO1xyXG4gICAgICAgIGNvbnN0IHNlY29uZGFyeUF1dGhvckxhc3ROYW1lUmU6IFJlZ0V4cCA9IC9hbmQgLio/KFtBLVpdXFxTKz9cXGIpJHxhbmQgLio/KFtBLVpdXFxTKz8pLCBbYS16XSs/JC87XHJcbiAgICAgICAgY29uc3QgcHJpbWFyeUF1dGhvckZpcnN0TmFtZVJlOiBSZWdFeHAgPSAvXi4rPywgKC4rPyksfF4uKz8sICguKz8pJC87XHJcbiAgICAgICAgLy8gLS0tLS0tLVxyXG5cclxuICAgICAgICAvLyBwYXJzZSBuYW1lIGxpc3RcclxuICAgICAgICAvLyA9PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgY29uc3QgcHJpbWFyeUF1dGhvckxhc3ROYW1lOiBzdHJpbmcgPSBCaWJsaW9ncmFwaHlQYXJzZXIuZ2V0Rmlyc3RNYXRjaCggcHJpbWFyeUF1dGhvckxhc3ROYW1lUmUsIG5hbWVMaXN0U3RyaW5nICk7XHJcbiAgICAgICAgY29uc3Qgc2Vjb25kYXJ5QXV0aG9yTGFzdE5hbWU6IHN0cmluZyA9IEJpYmxpb2dyYXBoeVBhcnNlci5nZXRGaXJzdE1hdGNoKCBzZWNvbmRhcnlBdXRob3JMYXN0TmFtZVJlLCBuYW1lTGlzdFN0cmluZyApO1xyXG4gICAgICAgIGNvbnN0IHByaW1hcnlBdXRob3JGaXJzdE5hbWU6IHN0cmluZyA9IEJpYmxpb2dyYXBoeVBhcnNlci5nZXRGaXJzdE1hdGNoKCBwcmltYXJ5QXV0aG9yRmlyc3ROYW1lUmUsIG5hbWVMaXN0U3RyaW5nICk7XHJcblxyXG4gICAgICAgIGZpcnN0QXV0aG9yLmxhc3RuYW1lID0gcHJpbWFyeUF1dGhvckxhc3ROYW1lXHJcbiAgICAgICAgZmlyc3RBdXRob3IuZmlyc3RuYW1lID0gcHJpbWFyeUF1dGhvckZpcnN0TmFtZVxyXG4gICAgICAgIGZpcnN0QXV0aG9yLmZpcnN0SW5pdGlhbCA9IEJpYmxpb2dyYXBoeVBhcnNlci5nZXRJbml0aWFsKCBmaXJzdEF1dGhvci5maXJzdG5hbWUgKTtcclxuICAgICAgICAvLyBpZiB3ZSBkaWRuJ3QgbWF0Y2ggYSBzZWNvbmQgYXV0aG9yLCBudWxsIHRoZSBzZWNvbmQgYXV0aG9yIGluIG91ciBvdXRwdXQgQXV0aG9yTGlzdFxyXG4gICAgICAgIGlmICggc2Vjb25kYXJ5QXV0aG9yTGFzdE5hbWUgPT09IG51bGwgKXtcclxuICAgICAgICAgIHNlY29uZEF1dGhvciA9IG51bGw7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHNlY29uZEF1dGhvci5sYXN0bmFtZSA9IHNlY29uZGFyeUF1dGhvckxhc3ROYW1lO1xyXG4gICAgICAgIH1cclxuICAgICAgIFxyXG5cclxuICAgICAgICBjb25zdCBuYW1lT21pdHRlZDogYm9vbGVhbiA9IHRyaXBsZUh5cGhlblJlLnRlc3QobmFtZUxpc3RTdHJpbmcpO1xyXG4gICAgICAgIGNvbnN0IGNvbnRhaW5zRXRBbDogYm9vbGVhbiA9IGV0QWxSZS50ZXN0KG5hbWVMaXN0U3RyaW5nKTtcclxuICAgICAgICBpZiAoIG5hbWVPbWl0dGVkID09PSB0cnVlICl7XHJcbiAgICAgICAgICBjb25zdCBwcmV2aW91c1JlZmVyZW5jZSA9IHByZXZpb3VzbHlQYXJzZWRSZWZlcmVuY2VzW3ByZXZpb3VzbHlQYXJzZWRSZWZlcmVuY2VzLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgICAgZmlyc3RBdXRob3IgPSBwcmV2aW91c1JlZmVyZW5jZS5wYXJzZWROYW1lTGlzdC5maXJzdEF1dGhvcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCBjb250YWluc0V0QWwgPT09IHRydWUgKXtcclxuICAgICAgICAgIHRocmVlT3JNb3JlQXV0aG9ycyA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBhdXRob3JMaXN0LmZpcnN0QXV0aG9yID0gZmlyc3RBdXRob3I7XHJcbiAgICAgICAgYXV0aG9yTGlzdC5zZWNvbmRBdXRob3IgPSBzZWNvbmRBdXRob3I7XHJcbiAgICAgICAgYXV0aG9yTGlzdC50aHJlZU9yTW9yZUF1dGhvcnMgPSB0aHJlZU9yTW9yZUF1dGhvcnM7XHJcbiAgICAgICAgcmV0dXJuIGF1dGhvckxpc3Q7XHJcbiAgICAgIH1cclxuXHJcblxyXG4gICAgICBmdW5jdGlvbiBmaXhUaXRsZVF1b3RlcyggdGl0bGU6IHN0cmluZyApOiBzdHJpbmcge1xyXG4gICAgICAgIC8vIGlmIHRpdGxlIGJlZ2lucyB3aXRoIGEgcXVvdGF0aW9uIG1hcmsgYnV0IGRvZXNuJ3QgZW5kIHdpdGggYSBxdW90YXRpb24gbWFyay4uLiBcclxuICAgICAgICAvLyBGSVhNRTogYWNjb3VudCBmb3IgaW5uZXIgcXVvdGF0aW9ucyAo4oCcIOKAnSkuIFdvdywgbm90IHN1cmUgaG93IHRvIGRlYWwgd2l0aCB0aGF0IGluY29uc2lzdGVuY3lcclxuICAgICAgICBpZiggdGl0bGUuc2xpY2UoMCwxKSA9PT0gJ1wiJyAmJiB0aXRsZS5zbGljZSgtMSkgIT09ICdcIicgKXtcclxuICAgICAgICAgIC8vIGFkZCBhIHF1b3RhdGlvbiBtYXJrIHRvIHRoZSBlbmQuXHJcbiAgICAgICAgICB0aXRsZSArPSAnXCInO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoIHRpdGxlLnNsaWNlKDAsMSkgPT09ICfigJwnICYmIHRpdGxlLnNsaWNlKC0xKSAhPT0gJ+KAnScpe1xyXG4gICAgICAgICAgdGl0bGUgKz0gJ+KAnSc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aXRsZTtcclxuICAgICAgfVxyXG4gICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuXHJcbiAgICAgIHRoaXMuYmlibGlvZ3JhcGh5VG9BcnJheSggdGV4dCApLmZvckVhY2goIChlbnRyeSwgaW5kZXgsIGJpYmxpb2dyYXBoeUFycmF5KSA9PiB7XHJcblxyXG4gICAgICAgIGxldCByZWZlcmVuY2U6IFJlZmVyZW5jZSA9IHsgXHJcbiAgICAgICAgICB1bnBhcnNlZE5hbWVMaXN0OiB1bmRlZmluZWQsXHJcbiAgICAgICAgICBwYXJzZWROYW1lTGlzdDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgdGl0bGU6IHVuZGVmaW5lZCxcclxuICAgICAgICAgIHB1YlllYXI6IHVuZGVmaW5lZCxcclxuICAgICAgICAgIG9yaWdpbmFsOiBlbnRyeSxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBuYW1lTGlzdE9yVGl0bGVNYXRjaDogUmVnRXhwRXhlY0FycmF5ID0gbmFtZUxpc3RPclRpdGxlUmUuZXhlYyggZW50cnkgKTtcclxuICAgICAgICBjb25zdCB0aXRsZU1hdGNoOiBSZWdFeHBFeGVjQXJyYXkgPSB0aXRsZVJlLmV4ZWMoIGVudHJ5ICk7XHJcbiAgICAgICAgY29uc3QgcHViWWVhck1hdGNoOiBSZWdFeHBFeGVjQXJyYXkgPSBwdWJZZWFyUmUuZXhlYyggZW50cnkgKTtcclxuXHJcbiAgICAgICAgaWYoIG5hbWVMaXN0T3JUaXRsZU1hdGNoID09PSBudWxsIHx8IHB1YlllYXJNYXRjaCA9PT0gbnVsbCApe1xyXG4gICAgICAgICAgLy8gZ2l2ZSB1cDsgd2UnbGwgbGV0IHRoZSB1c2VyIGZpZ3VyZSB0aGlzIG9uZSBvdXQuXHJcbiAgICAgICAgICBwYXJzZWRSZWZlcmVuY2VzLnB1c2goIHJlZmVyZW5jZSApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpZiAoIHRpdGxlTWF0Y2ggPT09IG51bGwgKXtcclxuICAgICAgICAgICAgLy8gYXNzdW1lIG5hbWVMaXN0T3JUaXRsZU1hdGNoIG1hdGNoZWQgdGl0bGVcclxuICAgICAgICAgICAgbGV0IHRpdGxlID0gbmFtZUxpc3RPclRpdGxlTWF0Y2hbMV07XHJcbiAgICAgICAgICAgIHJlZmVyZW5jZS50aXRsZSA9IGZpeFRpdGxlUXVvdGVzKCB0aXRsZSApO1xyXG4gICAgICAgICAgICByZWZlcmVuY2UudW5wYXJzZWROYW1lTGlzdCA9IG51bGw7XHJcbiAgICAgICAgICAgIHJlZmVyZW5jZS5wYXJzZWROYW1lTGlzdCA9IG51bGw7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBhc3N1bWUgbmFtZUxpc3RPclRpdGxlTWF0Y2ggbWF0Y2hlZCBuYW1lTGlzdFxyXG4gICAgICAgICAgICAvLyAgIGFuZCB0aXRsZU1hdGNoIG1hdGNoZWQgdGl0bGVcclxuICAgICAgICAgICAgcmVmZXJlbmNlLnVucGFyc2VkTmFtZUxpc3QgPSBuYW1lTGlzdE9yVGl0bGVNYXRjaFsxXTtcclxuICAgICAgICAgICAgcmVmZXJlbmNlLnBhcnNlZE5hbWVMaXN0ID0gcGFyc2VOYW1lTGlzdEFQQSggcmVmZXJlbmNlLnVucGFyc2VkTmFtZUxpc3QsIHBhcnNlZFJlZmVyZW5jZXMgKTtcclxuICAgICAgICAgICAgbGV0IHRpdGxlID0gdGl0bGVNYXRjaFsxXTtcclxuICAgICAgICAgICAgcmVmZXJlbmNlLnRpdGxlID0gZml4VGl0bGVRdW90ZXMoIHRpdGxlICk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAvLyBlaXRoZXIgd2F5LCBzdG9yZSBwdWJZZWFyIGFuZCBhZGQgcmVmZXJlbmNlIHRvIHBhcnNlZFJlZmVyZW5jZXNcclxuICAgICAgICAgIHJlZmVyZW5jZS5wdWJZZWFyID0gcHViWWVhck1hdGNoWzFdO1xyXG4gICAgICAgICAgcGFyc2VkUmVmZXJlbmNlcy5wdXNoKCByZWZlcmVuY2UgKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgcmV0dXJuIHBhcnNlZFJlZmVyZW5jZXM7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHBhcnNlSGFydmFyZCggdGV4dDogc3RyaW5nICk6IFBhcnNlZFJlZmVyZW5jZVNldCB7XHJcbiAgICAgIGxldCB1bnBhcnNlZFJlZmVyZW5jZXM6IFVucGFyc2VkUmVmZXJlbmNlW10gPSBbXTtcclxuICAgICAgbGV0IHBhcnNlZFJlZmVyZW5jZXM6IFJlZmVyZW5jZVtdID0gW107XHJcblxyXG4gICAgICByZXR1cm4ge3BhcnNlZFJlZmVyZW5jZXMsIHVucGFyc2VkUmVmZXJlbmNlc307XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHBhcnNlQ2hpY2Fnbyh0ZXh0OiBzdHJpbmcgKTogUGFyc2VkUmVmZXJlbmNlU2V0IHtcclxuICAgICAgbGV0IHVucGFyc2VkUmVmZXJlbmNlczogVW5wYXJzZWRSZWZlcmVuY2VbXSA9IFtdO1xyXG4gICAgICBsZXQgcGFyc2VkUmVmZXJlbmNlczogUmVmZXJlbmNlW10gPSBbXTtcclxuXHJcbiAgICAgIHJldHVybiB7cGFyc2VkUmVmZXJlbmNlcywgdW5wYXJzZWRSZWZlcmVuY2VzfTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgcGFyc2VNTEEoIHRleHQ6IHN0cmluZyApOiBQYXJzZWRSZWZlcmVuY2VTZXQge1xyXG4gICAgICBsZXQgdW5wYXJzZWRSZWZlcmVuY2VzOiBVbnBhcnNlZFJlZmVyZW5jZVtdID0gW107XHJcbiAgICAgIGxldCBwYXJzZWRSZWZlcmVuY2VzOiBSZWZlcmVuY2VbXSA9IFtdO1xyXG5cclxuICAgICAgcmV0dXJuIHtwYXJzZWRSZWZlcmVuY2VzLCB1bnBhcnNlZFJlZmVyZW5jZXN9O1xyXG4gICAgfVxyXG4gIH0iXX0=
