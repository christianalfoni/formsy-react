var utils = require('./../src/utils.js');

describe('Utils', function() {

  it('should check equality of objects and arrays', function () {
    var objA = {foo: 'bar'};
    var objB = {foo: 'bar'};
    var objC = [{
      foo: ['bar']
    }];
    var objD = [{
      foo: ['bar']
    }];
    expect(utils.isSame(objA, objB)).toBe(true);
    expect(utils.isSame(objC, objD)).toBe(true);
    expect(utils.isSame(objA, objD)).toBe(false);
  });


});
