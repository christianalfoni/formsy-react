require('babel/register');

var path = require('path');
var jsdom = require('jsdom').jsdom;
var jasmine = require('jasmine-node');

global.document = jsdom();
global.window = document.defaultView;
global.navigator = global.window.navigator;

var jasmineOptions = {
  specFolders: [path.resolve(__dirname, 'specs')],
  isVerbose: true,
  showColors: true,
  teamcity: false,
  useRequireJs: false,
  regExpSpec: /spec\.js$/,
  junitreport: true,
  includeStackTrace: true
};

jasmine.executeSpecsInFolder(jasmineOptions);
