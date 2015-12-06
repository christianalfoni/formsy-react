'use strict';

var validations = {
  isDefaultRequiredValue: 'this field is required',
  isExisty: 'does not exist',
  matchRegexp: 'invalid input',
  isUndefined: 'undefined',
  isEmptyString: 'should not be empty',
  isEmail: 'invalid email',
  isUrl: 'invalid url',
  isTrue: 'should be true',
  isFalse: 'should be false',
  isNumeric: 'not a number',
  isAlpha: 'should have characters only',
  isAlphanumeric: 'use only digits and characters',
  isInt: 'not a whole number',
  isFloat: 'not a number',
  isWords: 'should contain words only',
  isSpecialWords: 'should contain words only',
  isLength: 'not the required length',
  equals: 'values do not match',
  equalsField: 'values do not match',
  maxLength: 'invalid number',
  minLength: 'invalid number'
};

module.exports = validations;
