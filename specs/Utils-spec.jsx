var utils = require('./../src/utils.js');

describe('Utils', function() {

  it('should check equality of objects and arrays', function () {
    var objA = { foo: 'bar' };
    var objB = { foo: 'bar' };
    var objC = [{ foo: ['bar'] }];
    var objD = [{ foo: ['bar'] }];
    var objE, objF;
    var objG = null;
    var objH = null;

    expect(utils.isSame(objA, objB)).toBe(true);
    expect(utils.isSame(objC, objD)).toBe(true);
    expect(utils.isSame(objA, objD)).toBe(false);

    expect(utils.isSame(objE, objF)).toBe(true);
    expect(utils.isSame(objA, objF)).toBe(false);
    expect(utils.isSame(objE, objA)).toBe(false);

    expect(utils.isSame(objG, objH)).toBe(true);
    expect(utils.isSame(objA, objH)).toBe(false);
    expect(utils.isSame(objG, objA)).toBe(false);
  });


});
