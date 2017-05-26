var React = global.React || require('react');
import createReactClass from 'create-react-class';
var Mixin = require('./Mixin.js');

module.exports = function () {
  return function (Component) {
    return createReactClass({
      mixins: [Mixin],
      render: function () {
        return React.createElement(Component, {
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
          isValidValue: this.isValidValue,
          ...this.props
        });
      }
    });
  };
};
