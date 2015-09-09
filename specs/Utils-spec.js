import utils from './../src/utils.js';

describe('Utils', function () {

  it('should check equality of objects and arrays', () => {
    const objA = { foo: 'bar' };
    const objB = { foo: 'bar' };
    const objC = [{ foo: ['bar'] }];
    const objD = [{ foo: ['bar'] }];
    const objE = undefined;
    const objF = undefined;
    const objG = null;
    const objH = null;

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
