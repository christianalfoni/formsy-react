var React = global.React || require('react');
var Mixin = require('./Mixin.js');
module.exports = function (Component) {
  return React.createClass({
    displayName: 'Formsy(' + getDisplayName(Component) + ')',
    mixins: [Mixin],

    getWrappedInstance: function() {
      return this.refs.wrappedInstance
    },

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
        ref: 'wrappedInstance',
        ...this.props
      });
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
