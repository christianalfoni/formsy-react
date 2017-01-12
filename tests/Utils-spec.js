import utils from './../src/utils.js';

export default {

  'should check equality of objects and arrays': function (test) {

    const objA = { foo: 'bar' };
    const objB = { foo: 'bar' };
    const objC = [{ foo: ['bar'] }];
    const objD = [{ foo: ['bar'] }];
    const objE = undefined;
    const objF = undefined;
    const objG = null;
    const objH = null;

    test.equal(utils.isSame(objA, objB), true);
    test.equal(utils.isSame(objC, objD), true);
    test.equal(utils.isSame(objA, objD), false);

    test.equal(utils.isSame(objE, objF), true);
    test.equal(utils.isSame(objA, objF), false);
    test.equal(utils.isSame(objE, objA), false);

    test.equal(utils.isSame(objG, objH), true);
    test.equal(utils.isSame(objA, objH), false);
    test.equal(utils.isSame(objC, objH), false);
    test.equal(utils.isSame(objG, objA), false);

    test.equal(utils.isSame(() => {}, () => {}), true);
    test.equal(utils.isSame(objA, () => {}), false);
    test.equal(utils.isSame(() => {}, objA), false);

    test.done();

  }

};
