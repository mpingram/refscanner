"use strict";
var ParserUtils = (function () {
    function ParserUtils() {
    }
    ParserUtils.bibliographyToArray = function (text) {
        return text.split('\n').filter(function (entry) {
            if (entry.length > 1)
                return true;
            else
                return false;
        });
    };
    ParserUtils.firstMatch = function (regex, text) {
        // helper routine to get first match from regex, regardless
        // of capturing group order
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
    ParserUtils.getInitialChar = function (name) {
        if (name === null)
            return null;
        return name.slice(0, 1);
    };
    ParserUtils.fixMissingQuotationMark = function (title) {
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
    };
    ParserUtils.cleanTextInput = function (text) {
        var cleanText = this._standardizeQuotationMarks(text);
        return cleanText;
    };
    ParserUtils.standardizeQuotationMarks = function (text) {
        return text.replace(/“|”/g, "\"");
    };
    return ParserUtils;
}());
exports.ParserUtils = ParserUtils;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9jb21waWxlZC9hcHAvcGFyc2Vycy9wYXJzZXItdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0lBQUE7SUFxREEsQ0FBQztJQW5EUSwrQkFBbUIsR0FBMUIsVUFBNEIsSUFBWTtRQUN0QyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUUsVUFBQSxLQUFLO1lBQ25DLEVBQUUsQ0FBQSxDQUFFLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBRSxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDbkMsSUFBSTtnQkFBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ3BCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVNLHNCQUFVLEdBQWpCLFVBQW1CLEtBQWEsRUFBRSxJQUFZO1FBQzVDLDJEQUEyRDtRQUMzRCwyQkFBMkI7UUFDM0IsSUFBTSxLQUFLLEdBQW9CLEtBQUssQ0FBQyxJQUFJLENBQUUsSUFBSSxDQUFFLENBQUM7UUFDbEQsRUFBRSxDQUFDLENBQUUsS0FBSyxLQUFLLElBQUssQ0FBQyxDQUFBLENBQUM7WUFDcEIsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNkLENBQUM7UUFDRCxHQUFHLENBQUMsQ0FBRSxJQUFJLFdBQVcsR0FBRyxDQUFDLEVBQUUsV0FBVyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsV0FBVyxFQUFFLEVBQUUsQ0FBQztZQUNyRSxJQUFJLGNBQWMsR0FBRyxLQUFLLENBQUUsV0FBVyxDQUFFLENBQUM7WUFDMUMsRUFBRSxDQUFDLENBQUUsY0FBYyxLQUFLLFNBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLG9CQUFvQjtnQkFDcEIsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUMvQixDQUFDO1FBQ0gsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU0sMEJBQWMsR0FBckIsVUFBdUIsSUFBbUI7UUFDeEMsRUFBRSxDQUFDLENBQUUsSUFBSSxLQUFLLElBQUssQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDakMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3pCLENBQUM7SUFFTSxtQ0FBdUIsR0FBOUIsVUFBZ0MsS0FBYTtRQUMzQyxrRkFBa0Y7UUFDbEYsK0ZBQStGO1FBQy9GLEVBQUUsQ0FBQSxDQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBSSxDQUFDLENBQUEsQ0FBQztZQUN4RCxtQ0FBbUM7WUFDbkMsS0FBSyxJQUFJLEdBQUcsQ0FBQztRQUNmLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQSxDQUFDO1lBQy9ELEtBQUssSUFBSSxHQUFHLENBQUM7UUFDZixDQUFDO1FBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFTSwwQkFBYyxHQUFyQixVQUF1QixJQUFZO1FBQ2pDLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQywwQkFBMEIsQ0FBRSxJQUFJLENBQUUsQ0FBQztRQUN4RCxNQUFNLENBQUMsU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFFYyxxQ0FBeUIsR0FBeEMsVUFBMEMsSUFBWTtRQUNwRCxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUdILGtCQUFDO0FBQUQsQ0FyREEsQUFxREMsSUFBQTtBQXJEWSxrQ0FBVyIsImZpbGUiOiJwYXJzZXJzL3BhcnNlci11dGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBQYXJzZXJVdGlscyB7XHJcblxyXG4gIHN0YXRpYyBiaWJsaW9ncmFwaHlUb0FycmF5KCB0ZXh0OiBzdHJpbmcgKSA6IHN0cmluZ1tdIHtcclxuICAgIHJldHVybiB0ZXh0LnNwbGl0KCdcXG4nKS5maWx0ZXIoIGVudHJ5ID0+IHtcclxuICAgICAgaWYoIGVudHJ5Lmxlbmd0aCA+IDEgKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgZWxzZSByZXR1cm4gZmFsc2U7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBmaXJzdE1hdGNoKCByZWdleDogUmVnRXhwLCB0ZXh0OiBzdHJpbmcgKTogc3RyaW5nIHwgbnVsbCB7XHJcbiAgICAvLyBoZWxwZXIgcm91dGluZSB0byBnZXQgZmlyc3QgbWF0Y2ggZnJvbSByZWdleCwgcmVnYXJkbGVzc1xyXG4gICAgLy8gb2YgY2FwdHVyaW5nIGdyb3VwIG9yZGVyXHJcbiAgICBjb25zdCBtYXRjaDogUmVnRXhwRXhlY0FycmF5ID0gcmVnZXguZXhlYyggdGV4dCApO1xyXG4gICAgaWYgKCBtYXRjaCA9PT0gbnVsbCApe1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIGZvciAoIGxldCBncm91cE51bWJlciA9IDE7IGdyb3VwTnVtYmVyIDwgbWF0Y2gubGVuZ3RoOyBncm91cE51bWJlcisrICl7XHJcbiAgICAgIGxldCBjYXB0dXJpbmdHcm91cCA9IG1hdGNoWyBncm91cE51bWJlciBdO1xyXG4gICAgICBpZiAoIGNhcHR1cmluZ0dyb3VwICE9PSB1bmRlZmluZWQgKSB7XHJcbiAgICAgICAgLy8gdHJpbSBqdXN0IGluIGNhc2VcclxuICAgICAgICByZXR1cm4gY2FwdHVyaW5nR3JvdXAudHJpbSgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBnZXRJbml0aWFsQ2hhciggbmFtZTogc3RyaW5nIHwgbnVsbCApOiBzdHJpbmcgfCBudWxsIHtcclxuICAgIGlmICggbmFtZSA9PT0gbnVsbCApIHJldHVybiBudWxsO1xyXG4gICAgcmV0dXJuIG5hbWUuc2xpY2UoMCwxKTsgICBcclxuICB9XHJcblxyXG4gIHN0YXRpYyBmaXhNaXNzaW5nUXVvdGF0aW9uTWFyayggdGl0bGU6IHN0cmluZyApOiBzdHJpbmcge1xyXG4gICAgLy8gaWYgdGl0bGUgYmVnaW5zIHdpdGggYSBxdW90YXRpb24gbWFyayBidXQgZG9lc24ndCBlbmQgd2l0aCBhIHF1b3RhdGlvbiBtYXJrLi4uIFxyXG4gICAgLy8gRklYTUU6IGFjY291bnQgZm9yIGlubmVyIHF1b3RhdGlvbnMgKOKAnCDigJ0pLiBXb3csIG5vdCBzdXJlIGhvdyB0byBkZWFsIHdpdGggdGhhdCBpbmNvbnNpc3RlbmN5XHJcbiAgICBpZiggdGl0bGUuc2xpY2UoMCwxKSA9PT0gJ1wiJyAmJiB0aXRsZS5zbGljZSgtMSkgIT09ICdcIicgKXtcclxuICAgICAgLy8gYWRkIGEgcXVvdGF0aW9uIG1hcmsgdG8gdGhlIGVuZC5cclxuICAgICAgdGl0bGUgKz0gJ1wiJztcclxuICAgIH0gZWxzZSBpZiAoIHRpdGxlLnNsaWNlKDAsMSkgPT09ICfigJwnICYmIHRpdGxlLnNsaWNlKC0xKSAhPT0gJ+KAnScpe1xyXG4gICAgICB0aXRsZSArPSAn4oCdJztcclxuICAgIH1cclxuICAgIHJldHVybiB0aXRsZTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBjbGVhblRleHRJbnB1dCggdGV4dDogc3RyaW5nICk6IHN0cmluZyB7XHJcbiAgICBsZXQgY2xlYW5UZXh0ID0gdGhpcy5fc3RhbmRhcmRpemVRdW90YXRpb25NYXJrcyggdGV4dCApO1xyXG4gICAgcmV0dXJuIGNsZWFuVGV4dDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc3RhdGljIHN0YW5kYXJkaXplUXVvdGF0aW9uTWFya3MoIHRleHQ6IHN0cmluZyApOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRleHQucmVwbGFjZSggL+KAnHzigJ0vZywgXCJcXFwiXCIpO1xyXG4gIH1cclxuXHJcblxyXG59Il19
