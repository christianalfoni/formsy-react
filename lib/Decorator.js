'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = global.React || require('react');
var Mixin = require('./Mixin.js');
module.exports = function () {
  return function (Component) {
    return React.createClass({
      mixins: [Mixin],
      render: function render() {
        return React.createElement(Component, _extends({
          setValidations: this.setValidations,
          setValue: this.setValue,
          resetValue: this.resetValue,
          getValue: this.getValue,
          hasValue: this.hasValue,
          getErrorMessage: this.getErrorMessage,
          getErrorMessages: this.getErrorMessages,
          isFormDisabled: this.isFormDisabled,
          isValid: this.isValid,
          isPristine: this.isPristine,
          isFormSubmitted: this.isFormSubmitted,
          isRequired: this.isRequired,
          showRequired: this.showRequired,
          showError: this.showError,
          isValidValue: this.isValidValue
        }, this.props));
      }
    });
  };
};