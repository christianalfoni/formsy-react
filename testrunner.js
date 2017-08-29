import testrunner from 'nodeunit/lib/reporters/default';
import { jsdom } from 'jsdom/lib/old-api';

global.document = jsdom();
global.window = global.document.defaultView;
global.navigator = global.window.navigator;

testrunner.run(['tests'], {
  error_prefix: '\u001B[31m',
  error_suffix: '\u001B[39m',
  ok_prefix: '\u001B[32m',
  ok_suffix: '\u001B[39m',
  bold_prefix: '\u001B[1m',
  bold_suffix: '\u001B[22m',
  assertion_prefix: '\u001B[35m',
  assertion_suffix: '\u001B[39m',
}, (err) => {
  if (err) {
    process.exit(1);
  }
});
