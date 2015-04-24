require('node-jsx').install({
  extension: '.jsx'
});

var path = require('path');
var jsdom = require("jsdom").jsdom;
var jasmine = require('jasmine-node');

global.document = jsdom();
global.window = document.defaultView;
global.navigator = global.window.navigator;

var jasmineOptions = {
  specFolders: [path.resolve(__dirname, 'specs')],
  //onComplete: onComplete,
  isVerbose: true,
  showColors: true,
  teamcity: false,
  useRequireJs: false,
  regExpSpec: /spec\.jsx$/,
  junitreport: true,
  includeStackTrace: true,
  //coffee: options.coffee,
  //growl: options.growl
};

jasmine.executeSpecsInFolder(jasmineOptions);
