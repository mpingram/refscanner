"use strict";
var bibliography_parser_1 = require("../bibliography-parser");
var mock_input_bibliography_apa_1 = require("./mock-input-bibliography-apa");
describe("Bibliography Parser", function () {
    describe("APA", function () {
        var mockInput = mock_input_bibliography_apa_1.mockInputBibliographyAPA;
        var input;
        var expectedOutput;
        xit("should accurately parse a single input", function () {
            input = mock_input_bibliography_apa_1.mockInputBibliographyAPA.smallValidSingle;
            expectedOutput = mockInput.solution[0];
            var output = bibliography_parser_1.BibliographyParser.parseAPA(input);
            expect(output).toEqual(expectedOutput);
        });
        it("This is just to see what it does", function () {
            input = mock_input_bibliography_apa_1.mockInputBibliographyAPA.smallValid;
            var output = bibliography_parser_1.BibliographyParser.parseAPA(input);
            console.log(JSON.stringify(output, undefined, 4));
            expect("your ass").toBe("amazed or sad, maybe both");
        });
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9jb21waWxlZC9hcHAvc3BlYy9iaWJsaW9ncmFwaHktcGFyc2VyLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhEQUE0RDtBQUU1RCw2RUFBeUU7QUFJekUsUUFBUSxDQUFFLHFCQUFxQixFQUFFO0lBRS9CLFFBQVEsQ0FBRSxLQUFLLEVBQUU7UUFFZixJQUFNLFNBQVMsR0FBRyxzREFBd0IsQ0FBQztRQUUzQyxJQUFJLEtBQWEsQ0FBQztRQUNsQixJQUFJLGNBQWtDLENBQUM7UUFFdkMsR0FBRyxDQUFFLHdDQUF3QyxFQUFFO1lBRTdDLEtBQUssR0FBRyxzREFBd0IsQ0FBQyxnQkFBZ0IsQ0FBQztZQUVsRCxjQUFjLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUd2QyxJQUFJLE1BQU0sR0FBRyx3Q0FBa0IsQ0FBQyxRQUFRLENBQUUsS0FBSyxDQUFFLENBQUM7WUFDbEQsTUFBTSxDQUFFLE1BQU0sQ0FBRSxDQUFDLE9BQU8sQ0FBRSxjQUFjLENBQUUsQ0FBQztRQUU3QyxDQUFDLENBQUMsQ0FBQztRQUdILEVBQUUsQ0FBRSxrQ0FBa0MsRUFBRTtZQUd0QyxLQUFLLEdBQUcsc0RBQXdCLENBQUMsVUFBVSxDQUFDO1lBQzVDLElBQUksTUFBTSxHQUFHLHdDQUFrQixDQUFDLFFBQVEsQ0FBRSxLQUFLLENBQUUsQ0FBQztZQUNsRCxPQUFPLENBQUMsR0FBRyxDQUFFLElBQUksQ0FBQyxTQUFTLENBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUUsQ0FBRSxDQUFDO1lBQ3RELE1BQU0sQ0FBRSxVQUFVLENBQUUsQ0FBQyxJQUFJLENBQUUsMkJBQTJCLENBQUUsQ0FBQztRQUMzRCxDQUFDLENBQUMsQ0FBQTtJQU1KLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoic3BlYy9iaWJsaW9ncmFwaHktcGFyc2VyLnNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBCaWJsaW9ncmFwaHlQYXJzZXIgfSBmcm9tIFwiLi4vYmlibGlvZ3JhcGh5LXBhcnNlclwiO1xyXG5cclxuaW1wb3J0IHsgbW9ja0lucHV0QmlibGlvZ3JhcGh5QVBBIH0gZnJvbSBcIi4vbW9jay1pbnB1dC1iaWJsaW9ncmFwaHktYXBhXCI7XHJcblxyXG5pbXBvcnQgeyBQYXJzZWRSZWZlcmVuY2VTZXQgfSBmcm9tIFwiLi4vdHlwZWRlZnNcIjtcclxuXHJcbmRlc2NyaWJlKCBcIkJpYmxpb2dyYXBoeSBQYXJzZXJcIiwgKCkgPT4ge1xyXG5cclxuICBkZXNjcmliZSggXCJBUEFcIiwgKCkgPT4ge1xyXG5cclxuICAgIGNvbnN0IG1vY2tJbnB1dCA9IG1vY2tJbnB1dEJpYmxpb2dyYXBoeUFQQTtcclxuXHJcbiAgICBsZXQgaW5wdXQ6IHN0cmluZztcclxuICAgIGxldCBleHBlY3RlZE91dHB1dDogUGFyc2VkUmVmZXJlbmNlU2V0O1xyXG5cclxuICAgIHhpdCggXCJzaG91bGQgYWNjdXJhdGVseSBwYXJzZSBhIHNpbmdsZSBpbnB1dFwiLCAoKSA9PiB7XHJcbiAgICAgIFxyXG4gICAgICBpbnB1dCA9IG1vY2tJbnB1dEJpYmxpb2dyYXBoeUFQQS5zbWFsbFZhbGlkU2luZ2xlO1xyXG4gICAgICBcclxuICAgICAgZXhwZWN0ZWRPdXRwdXQgPSBtb2NrSW5wdXQuc29sdXRpb25bMF07XHJcbiAgICAgIFxyXG5cclxuICAgICAgbGV0IG91dHB1dCA9IEJpYmxpb2dyYXBoeVBhcnNlci5wYXJzZUFQQSggaW5wdXQgKTtcclxuICAgICAgZXhwZWN0KCBvdXRwdXQgKS50b0VxdWFsKCBleHBlY3RlZE91dHB1dCApO1xyXG5cclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICBpdCggXCJUaGlzIGlzIGp1c3QgdG8gc2VlIHdoYXQgaXQgZG9lc1wiLCAoKSA9PiB7XHJcblxyXG5cclxuICAgICAgaW5wdXQgPSBtb2NrSW5wdXRCaWJsaW9ncmFwaHlBUEEuc21hbGxWYWxpZDtcclxuICAgICAgbGV0IG91dHB1dCA9IEJpYmxpb2dyYXBoeVBhcnNlci5wYXJzZUFQQSggaW5wdXQgKTtcclxuICAgICAgY29uc29sZS5sb2coIEpTT04uc3RyaW5naWZ5KCBvdXRwdXQsIHVuZGVmaW5lZCwgNCApICk7XHJcbiAgICAgIGV4cGVjdCggXCJ5b3VyIGFzc1wiICkudG9CZSggXCJhbWF6ZWQgb3Igc2FkLCBtYXliZSBib3RoXCIgKTtcclxuICAgIH0pXHJcblxyXG5cclxuXHJcblxyXG5cclxuICB9KTtcclxufSk7Il19
