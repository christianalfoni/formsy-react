var React = global.React || require('react');
var Mixin = require('./Mixin.js');
import createReactClass from 'create-react-class';

module.exports = function (Component) {
  return createReactClass({
    displayName: 'Formsy(' + getDisplayName(Component) + ')',
    mixins: [Mixin],

    render: function () {
      const { innerRef } = this.props;
      const propsForElement = {
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
      };

      if (innerRef) {
        propsForElement.ref = innerRef;
      }
      return React.createElement(Component, propsForElement);
    }
  });
};

function getDisplayName(Component) {
  return (
    Component.displayName ||
    Component.name ||
    (typeof Component === 'string' ? Component : 'Component')
  );
}
