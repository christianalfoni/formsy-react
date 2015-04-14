module.exports = {
  'isDefaultRequiredValue': function (values, value) {
    return value === undefined || value === '';
  },
  'hasValue': function (values, value) {
    return value !== undefined;
  },
  'matchRegexp': function (values, value, regexp) {
    return value !== undefined && !!value.match(regexp);
  },
  'isUndefined': function (values, value) {
    return value === undefined;
  },
  'isEmptyString': function (values, value) {
    return value === '';
  },
  'isEmail': function (values, value) {
    return !value || value.match(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i);
  },
  'isTrue': function (values, value) {
    return value === true;
  },
  'isFalse': function (values, value) {
    return value === false;
  },
  'isNumeric': function (values, value) {
    if (typeof value === 'number') {
      return true;
    } else {
      var matchResults = value !== undefined && value.match(/[-+]?(\d*[.])?\d+/);
      if (!!matchResults) {
        return matchResults[0] == value;
      } else {
        return false;
      }
    }
  },
  'isAlpha': function (values, value) {
    return !value || value.match(/^[a-zA-Z]+$/);
  },
  'isWords': function (values, value) {
    return !value || value.match(/^[a-zA-Z\s]+$/);
  },
  'isSpecialWords': function (values, value) {
    return !value || value.match(/^[a-zA-Z\s\u00C0-\u017F]+$/);
  },
  isLength: function (values, value, length) {
    return value !== undefined && value.length === length;
  },
  equals: function (values, value, eql) {
    return value == eql;
  },
  equalsField: function (values, value, field) {
    return value == values[field];
  },
  maxLength: function (values, value, length) {
    return value !== undefined && value.length <= length;
  },
  minLength: function (values, value, length) {
    return value !== undefined && value.length >= length;
  }
};
