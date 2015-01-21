(function() {
    "use strict";

    function getJasmineRequireObj() {
        if (typeof module !== "undefined" && module.exports) {
            return exports;
        } else {
            window.jasmineRequire = window.jasmineRequire || {};
            return window.jasmineRequire;
        }
    }

    if (typeof getJasmineRequireObj() == 'undefined') {
        throw new Error("jasmine 2.0 must be loaded before jasmine-junit");
    }

    getJasmineRequireObj().JUnitXmlReporter = function() {


        function JUnitXmlReporter(options) {
            var runStartTime;
            var specStartTime;
            var suiteLevel = -1;
            var suites = []
            var currentSuite;
            var totalNumberOfSpecs;
            var totalNumberOfFailures;

            this.jasmineStarted = function(started) {
                totalNumberOfSpecs = started.totalSpecsDefined;
                runStartTime = new Date();
            };

            this.jasmineDone = function() {
                console.log('Jasmine ran in ', elapsed(runStartTime, new Date()), ' seconds')
                window.done = true
            };

            this.suiteStarted = function(result) {
                suiteLevel++;
                if (suiteLevel == 0) {
                    totalNumberOfSpecs = 0;
                    totalNumberOfFailures = 0;
                    suites.push(result);
                    currentSuite = result;
                    currentSuite.startTime = new Date();
                    currentSuite.noOfSpecs = 0;
                    currentSuite.noOfFails = 0;
                    currentSuite.specs = [];
                }
            };

            this.suiteDone = function(result) {
                if (suiteLevel == 0) {
                    currentSuite.endTime = new Date();
                    writeFile('.', descToFilename(result.description), suiteToJUnitXml(currentSuite))
                }
                suiteLevel--;
            };

            this.specStarted = function(result) {
                specStartTime = new Date();
            };

            this.specDone = function(result) {
                totalNumberOfSpecs++;

                if (isFailed(result)) {
                    currentSuite.noOfFails++;
                }
                result.startTime = specStartTime;
                result.endTime = new Date();
                currentSuite.specs.push(result);
                currentSuite.noOfSpecs++;
            };

            return this;

        }

        return JUnitXmlReporter;
    };

    function isFailed(result) {
        return result.status === 'failed'
    }

    function isSkipped(result) {
        return result.status === 'pending'
    }

    function suiteToJUnitXml(suite) {
        var resultXml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        resultXml += '<testsuites>\n';
        resultXml += '\t<testsuite tests="' + suite.noOfSpecs + '" errors="0" failures="' + suite.noOfFails + '" time="' + elapsed(suite.startTime, suite.endTime) + '" timestamp="' + ISODateString(suite.startTime) + '">\n'
        for (var i = 0; i < suite.specs.length; i++) {
            resultXml += specToJUnitXml(suite.specs[i], suite.id);
        }
        resultXml += '\t</testsuite>\n</testsuites>\n\n'
        return resultXml;
    }

    function specToJUnitXml(spec, suiteId) {
        var xml = '\t\t<testcase classname="' + suiteId +
            '" name="' + escapeInvalidXmlChars(spec.description) + '" time="' + elapsed(spec.startTime, spec.endTime) + '">\n';
        if (isSkipped(spec)) {
            xml += '\t\t\t<skipped />\n';
        }
        if (isFailed(spec)) {
            xml += failedToJUnitXml(spec.failedExpectations)
        }
        xml += '\t\t</testcase>\n'
        return xml;
    }

    function failedToJUnitXml(failedExpectations) {
        var failure;
        var failureXml = ""
        for (var i = 0; i < failedExpectations.length; i++) {
            failure = failedExpectations[i];
            failureXml += '\t\t\t<failure type="' + failure.matcherName + '" message="' + trim(escapeInvalidXmlChars(failure.message)) + '">\n';
            failureXml += escapeInvalidXmlChars(failure.stack || failure.message);
            failureXml += "\t\t\t</failure>\n";
        }

        return failureXml;
    }

    function descToFilename(desc) {
        return 'TEST-' + desc + '.xml';
    }

    function ISODateString(d) {
        function pad(n) {
            return n < 10 ? '0' + n : n;
        }

        return d.getFullYear() + '-' +
            pad(d.getMonth() + 1) + '-' +
            pad(d.getDate()) + 'T' +
            pad(d.getHours()) + ':' +
            pad(d.getMinutes()) + ':' +
            pad(d.getSeconds());
    }

    function elapsed(startTime, endTime) {
        return (endTime - startTime) / 1000;
    }

    function trim(str) {
        return str.replace(/^\s+/, "").replace(/\s+$/, "");
    }

    function escapeInvalidXmlChars(str) {
        return str.replace(/</g, "&lt;")
            .replace(/\>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/\'/g, "&apos;")
            .replace(/\&/g, "&amp;");
    }

    function writeFile(path, filename, text) {
        function getQualifiedFilename(separator) {
            if (path && path.substr(-1) !== separator && filename.substr(0) !== separator) {
                path += separator;
            }
            return path + filename;
        }

        // PhantomJS
        if(typeof(__phantom_writeFile) !== 'undefined') {
            try {
                // turn filename into a qualified path
                filename = getQualifiedFilename(window.fs_path_separator);
                // function injected by jasmine-runner.js
                __phantom_writeFile(filename, text);
                return;
            } catch (error) {
                console.log('Error writing file', error)
            }
        }

        // Node.js
        if(typeof(global) !== 'undefined') {
            try {
                var fs = require("fs");
                var nodejs_path = require("path");
                var fd = fs.openSync(nodejs_path.join(path, filename), "w");
                fs.writeSync(fd, text, 0);
                fs.closeSync(fd);
                return;
            } catch (error) {
                console.log('Error writing file', error)
            }
        }
    }

})()