import PropTypes from 'prop-types';
import React from 'react';
import utils from './utils';

const convertValidationsToObject = (validations) => {
  if (typeof validations === 'string') {
    return validations.split(/,(?![^{[]*[}\]])/g).reduce((validationsAccumulator, validation) => {
      let args = validation.split(':');
      const validateMethod = args.shift();

      args = args.map((arg) => {
        try {
          return JSON.parse(arg);
        } catch (e) {
          return arg; // It is a string if it can not parse it
        }
      });

      if (args.length > 1) {
        throw new Error('Formsy does not support multiple args on string validations. Use object format of validations instead.');
      }

      // Avoid parameter reassignment
      const validationsAccumulatorCopy = Object.assign({}, validationsAccumulator);
      validationsAccumulatorCopy[validateMethod] = args.length ? args[0] : true;
      return validationsAccumulatorCopy;
    }, {});
  }

  return validations || {};
};

const propTypes = {
  innerRef: PropTypes.func,
  name: PropTypes.string.isRequired,
  required: PropTypes.bool,
  validations: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),
  value: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
};

export {
  propTypes,
};

export default (Component) => {
  class WrappedComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        value: props.value,
        isRequired: false,
        isValid: true,
        isPristine: true,
        pristineValue: props.value,
        validationError: [],
        externalError: null,
        formSubmitted: false,
      };
      this.getErrorMessage = this.getErrorMessage.bind(this);
      this.getErrorMessages = this.getErrorMessages.bind(this);
      this.getValue = this.getValue.bind(this);
      this.isFormDisabled = this.isFormDisabled.bind(this);
      this.isPristine = this.isPristine.bind(this);
      this.isRequired = this.isRequired.bind(this);
      this.isValid = this.isValid.bind(this);
      this.resetValue = this.resetValue.bind(this);
      this.setValue = this.setValue.bind(this);
      this.showRequired = this.showRequired.bind(this);
    }

    componentWillMount() {
      const configure = () => {
        this.setValidations(this.props.validations, this.props.required);

        // Pass a function instead?
        this.context.formsy.attachToForm(this);
      };

      if (!this.props.name) {
        throw new Error('Form Input requires a name property when used');
      }

      configure();
    }

    // We have to make sure the validate method is kept when new props are added
    componentWillReceiveProps(nextProps) {
      this.setValidations(nextProps.validations, nextProps.required);
    }

    componentDidUpdate(prevProps) {
      // If the value passed has changed, set it. If value is not passed it will
      // internally update, and this will never run
      if (!utils.isSame(this.props.value, prevProps.value)) {
        this.setValue(this.props.value);
      }

      // If validations or required is changed, run a new validation
      if (!utils.isSame(this.props.validations, prevProps.validations) ||
        !utils.isSame(this.props.required, prevProps.required)) {
        this.context.formsy.validate(this);
      }
    }

    // Detach it when component unmounts
    componentWillUnmount() {
      this.context.formsy.detachFromForm(this);
    }

    getErrorMessage() {
      const messages = this.getErrorMessages();
      return messages.length ? messages[0] : null;
    }

    getErrorMessages() {
      return !this.isValid() || this.showRequired() ?
        (this.state.externalError || this.state.validationError || []) : [];
    }

    getValue() {
      return this.state.value;
    }

    hasValue() {
      return this.state.value !== '';
    }

    isFormDisabled() {
      return this.context.formsy.isFormDisabled();
    }

    isFormSubmitted() {
      return this.state.formSubmitted;
    }

    isPristine() {
      return this.state.isPristine;
    }

    isRequired() {
      return !!this.props.required;
    }

    isValid() {
      return this.state.isValid;
    }

    isValidValue(value) {
      return this.context.formsy.isValidValue.call(null, this, value);
      // return this.props.isValidValue.call(null, this, value);
    }

    resetValue() {
      this.setState({
        value: this.state.pristineValue,
        isPristine: true,
      }, () => {
        this.context.formsy.validate(this);
      });
    }

    setValidations(validations, required) {
      // Add validations to the store itself as the props object can not be modified
      this.validations = convertValidationsToObject(validations) || {};
      this.requiredValidations = required === true ? { isDefaultRequiredValue: true } :
        convertValidationsToObject(required);
    }

    // By default, we validate after the value has been set.
    // A user can override this and pass a second parameter of `false` to skip validation.
    setValue(value, validate = true) {
      if (!validate) {
        this.setState({
          value,
        });
      } else {
        this.setState({
          value,
          isPristine: false,
        }, () => {
          this.context.formsy.validate(this);
        });
      }
    }

    showError() {
      return !this.showRequired() && !this.isValid();
    }

    showRequired() {
      return this.state.isRequired;
    }

    render() {
      const { innerRef } = this.props;
      const propsForElement = {
        getErrorMessage: this.getErrorMessage,
        getErrorMessages: this.getErrorMessages,
        getValue: this.getValue,
        hasValue: this.hasValue,
        isFormDisabled: this.isFormDisabled,
        isValid: this.isValid,
        isPristine: this.isPristine,
        isFormSubmitted: this.isFormSubmitted,
        isRequired: this.isRequired,
        isValidValue: this.isValidValue,
        resetValue: this.resetValue,
        setValidations: this.setValidations,
        setValue: this.setValue,
        showRequired: this.showRequired,
        showError: this.showError,
        ...this.props,
      };

      if (innerRef) {
        propsForElement.ref = innerRef;
      }

      return React.createElement(Component, propsForElement);
    }
  }

  function getDisplayName(component) {
    return (
      component.displayName ||
      component.name ||
      (typeof component === 'string' ? component : 'Component')
    );
  }

  WrappedComponent.displayName = `Formsy(${getDisplayName(Component)})`;

  WrappedComponent.contextTypes = {
    formsy: PropTypes.object, // What about required?
  };

  WrappedComponent.defaultProps = {
    innerRef: () => {},
    required: false,
    validationError: '',
    validationErrors: {},
    validations: null,
    value: Component.defaultValue,
  };

  WrappedComponent.propTypes = propTypes;

  return WrappedComponent;
};
