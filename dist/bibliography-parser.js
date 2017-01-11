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
        // helper functions
        // -------------------
        function parseNameListAPA(nameList, index, bibliographyArray) {
            // triple hyphen indicates same as previous author
            // FIXME: remember that "---, Cohen, and Leonard" is valid.
            // TODO: parse name list
            //   - handle case where  first entry in nameList === "---" || name === "–––" || name === "———"
            // name parsing regex candidate: ^(.+?),|and .*?([A-Z]\S+?\b)$|and .*?([A-Z]\S+?), [a-z]+?$|^(---)$|^(–––)$|^(———)$
        } // https://regex101.com/r/nhOttU/1
        function fixTitleQuotes(title) {
            // if title begins with a quotation mark but doesn't end with a quotation mark... 
            if (title.slice(0) === '"' && title.slice(-1) !== '"') {
                // add a quotation mark to the end.
                title += '"';
            }
            return title;
        }
        // -----------------
        this.bibliographyToArray(text).forEach(function (entry, index, bibliographyArray) {
            var reference = {
                unparsedNameList: undefined,
                parsedNameList: undefined,
                title: undefined,
                pubYear: undefined,
            };
            var nameListOrTitleMatch = nameListOrTitleRe.exec(entry);
            var titleMatch = titleRe.exec(entry);
            var pubYearMatch = pubYearRe.exec(entry);
            if (nameListOrTitleMatch === null || pubYearMatch === null) {
                unparsedReferences.push(entry);
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
                    reference.parsedNameList = parseNameListAPA(reference.unparsedNameList, index, bibliographyArray);
                    reference.title = titleMatch[1];
                }
                // either way, store pubYear and add reference to parsedReferences
                reference.pubYear = pubYearMatch[1];
                parsedReferences.push(reference);
            }
        }, []);
        return { parsedReferences: parsedReferences, unparsedReferences: unparsedReferences };
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9hcHAvYmlibGlvZ3JhcGh5LXBhcnNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBT0E7SUFBQTtJQW1HRSxDQUFDO0lBakdnQixzQ0FBbUIsR0FBbEMsVUFBb0MsSUFBWTtRQUM5QyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUUsVUFBQSxLQUFLO1lBQ25DLEVBQUUsQ0FBQSxDQUFFLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBRSxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDbkMsSUFBSTtnQkFBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ3BCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVNLDJCQUFRLEdBQWYsVUFBaUIsSUFBWTtRQUUzQixJQUFJLGtCQUFrQixHQUF3QixFQUFFLENBQUM7UUFDakQsSUFBSSxnQkFBZ0IsR0FBZ0IsRUFBRSxDQUFDO1FBQ3ZDLCtDQUErQztRQUMvQyxJQUFNLGlCQUFpQixHQUFHLFdBQVcsQ0FBQztRQUN0Qyx1REFBdUQ7UUFDdkQscUNBQXFDO1FBQ3JDLElBQU0sT0FBTyxHQUFHLDBEQUEwRCxDQUFDO1FBQzNFLHNDQUFzQztRQUN0QyxJQUFNLFNBQVMsR0FBRyxpREFBaUQsQ0FBQztRQUVwRSxtQkFBbUI7UUFDbkIsc0JBQXNCO1FBQ3RCLDBCQUEyQixRQUFnQixFQUFFLEtBQWEsRUFBRSxpQkFBMkI7WUFDckYsa0RBQWtEO1lBQ2xELDJEQUEyRDtZQUMzRCx3QkFBd0I7WUFDeEIsK0ZBQStGO1lBQy9GLG1IQUFtSDtRQUNySCxDQUFDLENBQUEsa0NBQWtDO1FBRW5DLHdCQUF5QixLQUFhO1lBQ3BDLGtGQUFrRjtZQUNsRixFQUFFLENBQUEsQ0FBRSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBSSxDQUFDLENBQUEs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dkMsTUFBTSxDQUFDLEVBQUMsZ0JBQWdCLGtCQUFBLEVBQUUsa0JBQWtCLG9CQUFBLEVBQUMsQ0FBQztJQUNoRCxDQUFDO0lBQ0gseUJBQUM7QUFBRCxDQW5HRixBQW1HRyxJQUFBO0FBbkdVLGdEQUFrQiIsImZpbGUiOiJiaWJsaW9ncmFwaHktcGFyc2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBSZWZlcmVuY2UsXHJcbiAgVW5wYXJzZWRSZWZlcmVuY2UsXHJcbiAgUGFyc2VkUmVmZXJlbmNlU2V0LFxyXG4gIEF1dGhvclxyXG59IGZyb20gXCIuL3R5cGVkZWZzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQmlibGlvZ3JhcGh5UGFyc2VyIHtcclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBiaWJsaW9ncmFwaHlUb0FycmF5KCB0ZXh0OiBzdHJpbmcgKSA6IHN0cmluZ1tdIHtcclxuICAgICAgcmV0dXJuIHRleHQuc3BsaXQoJ1xcbicpLmZpbHRlciggZW50cnkgPT4ge1xyXG4gICAgICAgIGlmKCBlbnRyeS5sZW5ndGggPiAxICkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgZWxzZSByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBwYXJzZUFQQSggdGV4dDogc3RyaW5nICk6IFBhcnNlZFJlZmVyZW5jZVNldCB7XHJcblxyXG4gICAgICBsZXQgdW5wYXJzZWRSZWZlcmVuY2VzOiBVbnBhcnNlZFJlZmVyZW5jZVtdID0gW107XHJcbiAgICAgIGxldCBwYXJzZWRSZWZlcmVuY2VzOiBSZWZlcmVuY2VbXSA9IFtdO1xyXG4gICAgICAvLyBtYXRjaCBmaXJzdCBibG9jayBvZiB0ZXh0IHVudGlsIGZpcnN0IHBlcmlvZFxyXG4gICAgICBjb25zdCBuYW1lTGlzdE9yVGl0bGVSZSA9IC9eKC4rPylcXC4vbTtcclxuICAgICAgLy8gbWF0Y2ggYmxvY2sgb2YgdGV4dCBiZXR3ZWVuIGZpcnN0IGFuZCBzZWNvbmQgcGVyaW9kLFxyXG4gICAgICAvLyAgIGFmdGVyIHdoaWNoIHNob3VsZCBvY2N1ciBhIGRhdGUuXHJcbiAgICAgIGNvbnN0IHRpdGxlUmUgPSAvXi4qP1xcLiA/KC4rPylcXC4uKz8oWzFdWzAtOV1bMC05XVswLTldfFsyXVswXVswLTJdWzAtOV0pL207XHJcbiAgICAgIC8vIG1hdGNoIHZhbGlkIGRhdGUgYWZ0ZXIgdHdvIHBlcmlvZHMuXHJcbiAgICAgIGNvbnN0IHB1YlllYXJSZSA9IC9eLio/XFwuLio/KFsxXVswLTldWzAtOV1bMC05XXxbMl1bMF1bMC0yXVswLTldKS9tO1xyXG5cclxuICAgICAgLy8gaGVscGVyIGZ1bmN0aW9uc1xyXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgIGZ1bmN0aW9uIHBhcnNlTmFtZUxpc3RBUEEoIG5hbWVMaXN0OiBzdHJpbmcsIGluZGV4OiBudW1iZXIsIGJpYmxpb2dyYXBoeUFycmF5OiBzdHJpbmdbXSApOiBBdXRob3JbXXxudWxsIHtcclxuICAgICAgICAvLyB0cmlwbGUgaHlwaGVuIGluZGljYXRlcyBzYW1lIGFzIHByZXZpb3VzIGF1dGhvclxyXG4gICAgICAgIC8vIEZJWE1FOiByZW1lbWJlciB0aGF0IFwiLS0tLCBDb2hlbiwgYW5kIExlb25hcmRcIiBpcyB2YWxpZC5cclxuICAgICAgICAvLyBUT0RPOiBwYXJzZSBuYW1lIGxpc3RcclxuICAgICAgICAvLyAgIC0gaGFuZGxlIGNhc2Ugd2hlcmUgIGZpcnN0IGVudHJ5IGluIG5hbWVMaXN0ID09PSBcIi0tLVwiIHx8IG5hbWUgPT09IFwi4oCT4oCT4oCTXCIgfHwgbmFtZSA9PT0gXCLigJTigJTigJRcIlxyXG4gICAgICAgIC8vIG5hbWUgcGFyc2luZyByZWdleCBjYW5kaWRhdGU6IF4oLis/KSx8YW5kIC4qPyhbQS1aXVxcUys/XFxiKSR8YW5kIC4qPyhbQS1aXVxcUys/KSwgW2Etel0rPyR8XigtLS0pJHxeKOKAk+KAk+KAkykkfF4o4oCU4oCU4oCUKSRcclxuICAgICAgfS8vIGh0dHBzOi8vcmVnZXgxMDEuY29tL3IvbmhPdHRVLzFcclxuXHJcbiAgICAgIGZ1bmN0aW9uIGZpeFRpdGxlUXVvdGVzKCB0aXRsZTogc3RyaW5nICk6IHN0cmluZyB7XHJcbiAgICAgICAgLy8gaWYgdGl0bGUgYmVnaW5zIHdpdGggYSBxdW90YXRpb24gbWFyayBidXQgZG9lc24ndCBlbmQgd2l0aCBhIHF1b3RhdGlvbiBtYXJrLi4uIFxyXG4gICAgICAgIGlmKCB0aXRsZS5zbGljZSgwKSA9PT0gJ1wiJyAmJiB0aXRsZS5zbGljZSgtMSkgIT09ICdcIicgKXtcclxuICAgICAgICAgIC8vIGFkZCBhIHF1b3RhdGlvbiBtYXJrIHRvIHRoZSBlbmQuXHJcbiAgICAgICAgICB0aXRsZSArPSAnXCInO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGl0bGU7XHJcbiAgICAgIH1cclxuICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAgIHRoaXMuYmlibGlvZ3JhcGh5VG9BcnJheSggdGV4dCApLmZvckVhY2goIChlbnRyeSwgaW5kZXgsIGJpYmxpb2dyYXBoeUFycmF5KSA9PiB7XHJcblxyXG4gICAgICAgIGxldCByZWZlcmVuY2U6IFJlZmVyZW5jZSA9IHsgXHJcbiAgICAgICAgICB1bnBhcnNlZE5hbWVMaXN0OiB1bmRlZmluZWQsXHJcbiAgICAgICAgICBwYXJzZWROYW1lTGlzdDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgdGl0bGU6IHVuZGVmaW5lZCxcclxuICAgICAgICAgIHB1YlllYXI6IHVuZGVmaW5lZCxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBuYW1lTGlzdE9yVGl0bGVNYXRjaDogUmVnRXhwRXhlY0FycmF5ID0gbmFtZUxpc3RPclRpdGxlUmUuZXhlYyggZW50cnkgKTtcclxuICAgICAgICBjb25zdCB0aXRsZU1hdGNoOiBSZWdFeHBFeGVjQXJyYXkgPSB0aXRsZVJlLmV4ZWMoIGVudHJ5ICk7XHJcbiAgICAgICAgY29uc3QgcHViWWVhck1hdGNoOiBSZWdFeHBFeGVjQXJyYXkgPSBwdWJZZWFyUmUuZXhlYyggZW50cnkgKTtcclxuXHJcbiAgICAgICAgaWYoIG5hbWVMaXN0T3JUaXRsZU1hdGNoID09PSBudWxsIHx8IHB1YlllYXJNYXRjaCA9PT0gbnVsbCApe1xyXG4gICAgICAgICAgdW5wYXJzZWRSZWZlcmVuY2VzLnB1c2goIGVudHJ5ICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmICggdGl0bGVNYXRjaCA9PT0gbnVsbCApe1xyXG4gICAgICAgICAgICAvLyBhc3N1bWUgbmFtZUxpc3RPclRpdGxlTWF0Y2ggbWF0Y2hlZCB0aXRsZVxyXG4gICAgICAgICAgICBsZXQgdGl0bGUgPSBuYW1lTGlzdE9yVGl0bGVNYXRjaFsxXTtcclxuICAgICAgICAgICAgcmVmZXJlbmNlLnRpdGxlID0gZml4VGl0bGVRdW90ZXMoIHRpdGxlICk7XHJcbiAgICAgICAgICAgIHJlZmVyZW5jZS51bnBhcnNlZE5hbWVMaXN0ID0gbnVsbDtcclxuICAgICAgICAgICAgcmVmZXJlbmNlLnBhcnNlZE5hbWVMaXN0ID0gbnVsbDtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIGFzc3VtZSBuYW1lTGlzdE9yVGl0bGVNYXRjaCBtYXRjaGVkIG5hbWVMaXN0XHJcbiAgICAgICAgICAgIC8vICAgYW5kIHRpdGxlTWF0Y2ggbWF0Y2hlZCB0aXRsZVxyXG4gICAgICAgICAgICByZWZlcmVuY2UudW5wYXJzZWROYW1lTGlzdCA9IG5hbWVMaXN0T3JUaXRsZU1hdGNoWzFdO1xyXG4gICAgICAgICAgICByZWZlcmVuY2UucGFyc2VkTmFtZUxpc3QgPSBwYXJzZU5hbWVMaXN0QVBBKCByZWZlcmVuY2UudW5wYXJzZWROYW1lTGlzdCwgaW5kZXgsIGJpYmxpb2dyYXBoeUFycmF5ICk7XHJcbiAgICAgICAgICAgIHJlZmVyZW5jZS50aXRsZSA9IHRpdGxlTWF0Y2hbMV07XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAvLyBlaXRoZXIgd2F5LCBzdG9yZSBwdWJZZWFyIGFuZCBhZGQgcmVmZXJlbmNlIHRvIHBhcnNlZFJlZmVyZW5jZXNcclxuICAgICAgICAgIHJlZmVyZW5jZS5wdWJZZWFyID0gcHViWWVhck1hdGNoWzFdO1xyXG4gICAgICAgICAgcGFyc2VkUmVmZXJlbmNlcy5wdXNoKCByZWZlcmVuY2UgKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sIFtdICk7XHJcblxyXG4gICAgICByZXR1cm4ge3BhcnNlZFJlZmVyZW5jZXMsIHVucGFyc2VkUmVmZXJlbmNlc307XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHBhcnNlSGFydmFyZCggdGV4dDogc3RyaW5nICk6IFBhcnNlZFJlZmVyZW5jZVNldCB7XHJcbiAgICAgIGxldCB1bnBhcnNlZFJlZmVyZW5jZXM6IFVucGFyc2VkUmVmZXJlbmNlW10gPSBbXTtcclxuICAgICAgbGV0IHBhcnNlZFJlZmVyZW5jZXM6IFJlZmVyZW5jZVtdID0gW107XHJcblxyXG4gICAgICByZXR1cm4ge3BhcnNlZFJlZmVyZW5jZXMsIHVucGFyc2VkUmVmZXJlbmNlc307XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHBhcnNlQ2hpY2Fnbyh0ZXh0OiBzdHJpbmcgKTogUGFyc2VkUmVmZXJlbmNlU2V0IHtcclxuICAgICAgbGV0IHVucGFyc2VkUmVmZXJlbmNlczogVW5wYXJzZWRSZWZlcmVuY2VbXSA9IFtdO1xyXG4gICAgICBsZXQgcGFyc2VkUmVmZXJlbmNlczogUmVmZXJlbmNlW10gPSBbXTtcclxuXHJcbiAgICAgIHJldHVybiB7cGFyc2VkUmVmZXJlbmNlcywgdW5wYXJzZWRSZWZlcmVuY2VzfTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgcGFyc2VNTEEoIHRleHQ6IHN0cmluZyApOiBQYXJzZWRSZWZlcmVuY2VTZXQge1xyXG4gICAgICBsZXQgdW5wYXJzZWRSZWZlcmVuY2VzOiBVbnBhcnNlZFJlZmVyZW5jZVtdID0gW107XHJcbiAgICAgIGxldCBwYXJzZWRSZWZlcmVuY2VzOiBSZWZlcmVuY2VbXSA9IFtdO1xyXG5cclxuICAgICAgcmV0dXJuIHtwYXJzZWRSZWZlcmVuY2VzLCB1bnBhcnNlZFJlZmVyZW5jZXN9O1xyXG4gICAgfVxyXG4gIH0iXX0=
