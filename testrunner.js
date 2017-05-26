import path from 'path';
import testrunner from 'nodeunit/lib/reporters/default.js';
import { JSDOM } from 'jsdom';

const { window } = new JSDOM();
const { document } = window;
global.document = document;
global.window = window;
global.navigator = global.window.navigator;

testrunner.run(['tests'], {
    "error_prefix": "\u001B[31m",
    "error_suffix": "\u001B[39m",
    "ok_prefix": "\u001B[32m",
    "ok_suffix": "\u001B[39m",
    "bold_prefix": "\u001B[1m",
    "bold_suffix": "\u001B[22m",
    "assertion_prefix": "\u001B[35m",
    "assertion_suffix": "\u001B[39m"
}, function(err) {
    if (err) {
        process.exit(1);
    }
});
