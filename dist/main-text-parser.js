"use strict";
var mainTextParser = (function () {
    function mainTextParser() {
    }
    mainTextParser.APA = function (text) {
        var unparsedReferences = [];
        var parsedReferences = [];
        return { parsedReferences: parsedReferences, unparsedReferences: unparsedReferences };
    };
    mainTextParser.Harvard = function (text) {
        var unparsedReferences = [];
        var parsedReferences = [];
        return { parsedReferences: parsedReferences, unparsedReferences: unparsedReferences };
    };
    mainTextParser.Chicago = function (text) {
        var unparsedReferences = [];
        var parsedReferences = [];
        return { parsedReferences: parsedReferences, unparsedReferences: unparsedReferences };
    };
    mainTextParser.MLA = function (text) {
        var unparsedReferences = [];
        var parsedReferences = [];
        return { parsedReferences: parsedReferences, unparsedReferences: unparsedReferences };
    };
    return mainTextParser;
}());
exports.mainTextParser = mainTextParser;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9hcHAvbWFpbi10ZXh0LXBhcnNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBTUE7SUFBQTtJQTZCRSxDQUFDO0lBM0JRLGtCQUFHLEdBQVYsVUFBWSxJQUFZO1FBQ3RCLElBQUksa0JBQWtCLEdBQXdCLEVBQUUsQ0FBQztRQUNqRCxJQUFJLGdCQUFnQixHQUFnQixFQUFFLENBQUM7UUFFdkMsTUFBTSxDQUFDLEVBQUMsZ0JBQWdCLGtCQUFBLEVBQUUsa0JBQWtCLG9CQUFBLEVBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRU0sc0JBQU8sR0FBZCxVQUFnQixJQUFZO1FBQzFCLElBQUksa0JBQWtCLEdBQXdCLEVBQUUsQ0FBQztRQUNqRCxJQUFJLGdCQUFnQixHQUFnQixFQUFFLENBQUM7UUFFdkMsTUFBTSxDQUFDLEVBQUMsZ0JBQWdCLGtCQUFBLEVBQUUsa0JBQWtCLG9CQUFBLEVBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRU0sc0JBQU8sR0FBZCxVQUFlLElBQVk7UUFDekIsSUFBSSxrQkFBa0IsR0FBd0IsRUFBRSxDQUFDO1FBQ2pELElBQUksZ0JBQWdCLEdBQWdCLEVBQUUsQ0FBQztRQUV2QyxNQUFNLENBQUMsRUFBQyxnQkFBZ0Isa0JBQUEsRUFBRSxrQkFBa0Isb0JBQUEsRUFBQyxDQUFDO0lBQ2hELENBQUM7SUFFTSxrQkFBRyxHQUFWLFVBQVksSUFBWTtRQUN0QixJQUFJLGtCQUFrQixHQUF3QixFQUFFLENBQUM7UUFDakQsSUFBSSxnQkFBZ0IsR0FBZ0IsRUFBRSxDQUFDO1FBRXZDLE1BQU0sQ0FBQyxFQUFDLGdCQUFnQixrQkFBQSxFQUFFLGtCQUFrQixvQkFBQSxFQUFDLENBQUM7SUFDaEQsQ0FBQztJQUNILHFCQUFDO0FBQUQsQ0E3QkYsQUE2QkcsSUFBQTtBQTdCVSx3Q0FBYyIsImZpbGUiOiJtYWluLXRleHQtcGFyc2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBSZWZlcmVuY2UsXHJcbiAgVW5wYXJzZWRSZWZlcmVuY2UsXHJcbiAgUGFyc2VkUmVmZXJlbmNlU2V0LFxyXG59IGZyb20gXCIuL3R5cGVkZWZzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgbWFpblRleHRQYXJzZXIge1xyXG5cclxuICAgIHN0YXRpYyBBUEEoIHRleHQ6IHN0cmluZyApOiBQYXJzZWRSZWZlcmVuY2VTZXQge1xyXG4gICAgICBsZXQgdW5wYXJzZWRSZWZlcmVuY2VzOiBVbnBhcnNlZFJlZmVyZW5jZVtdID0gW107XHJcbiAgICAgIGxldCBwYXJzZWRSZWZlcmVuY2VzOiBSZWZlcmVuY2VbXSA9IFtdO1xyXG5cclxuICAgICAgcmV0dXJuIHtwYXJzZWRSZWZlcmVuY2VzLCB1bnBhcnNlZFJlZmVyZW5jZXN9O1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBIYXJ2YXJkKCB0ZXh0OiBzdHJpbmcgKTogUGFyc2VkUmVmZXJlbmNlU2V0IHtcclxuICAgICAgbGV0IHVucGFyc2VkUmVmZXJlbmNlczogVW5wYXJzZWRSZWZlcmVuY2VbXSA9IFtdO1xyXG4gICAgICBsZXQgcGFyc2VkUmVmZXJlbmNlczogUmVmZXJlbmNlW10gPSBbXTtcclxuXHJcbiAgICAgIHJldHVybiB7cGFyc2VkUmVmZXJlbmNlcywgdW5wYXJzZWRSZWZlcmVuY2VzfTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgQ2hpY2Fnbyh0ZXh0OiBzdHJpbmcgKTogUGFyc2VkUmVmZXJlbmNlU2V0IHtcclxuICAgICAgbGV0IHVucGFyc2VkUmVmZXJlbmNlczogVW5wYXJzZWRSZWZlcmVuY2VbXSA9IFtdO1xyXG4gICAgICBsZXQgcGFyc2VkUmVmZXJlbmNlczogUmVmZXJlbmNlW10gPSBbXTtcclxuXHJcbiAgICAgIHJldHVybiB7cGFyc2VkUmVmZXJlbmNlcywgdW5wYXJzZWRSZWZlcmVuY2VzfTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgTUxBKCB0ZXh0OiBzdHJpbmcgKTogUGFyc2VkUmVmZXJlbmNlU2V0IHtcclxuICAgICAgbGV0IHVucGFyc2VkUmVmZXJlbmNlczogVW5wYXJzZWRSZWZlcmVuY2VbXSA9IFtdO1xyXG4gICAgICBsZXQgcGFyc2VkUmVmZXJlbmNlczogUmVmZXJlbmNlW10gPSBbXTtcclxuXHJcbiAgICAgIHJldHVybiB7cGFyc2VkUmVmZXJlbmNlcywgdW5wYXJzZWRSZWZlcmVuY2VzfTtcclxuICAgIH1cclxuICB9Il19
