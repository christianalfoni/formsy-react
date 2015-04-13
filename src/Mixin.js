var convertValidationsToObject = function (validations) {

  if (typeof validations === 'string') {

    return validations.split(/\,(?![^{\[]*[}\]])/g).reduce(function (validations, validation) {
      var args = validation.split(':');
      var validateMethod = args.shift();
      args = args.map(function (arg) {
        try {
          return JSON.parse(arg);
        } catch (e) {
          return arg; // It is a string if it can not parse it
        }
      });
      
      if (args.length > 1) {
        throw new Error('Formsy does not support multiple args on string validations. Use object format of validations instead.');
      }
      validations[validateMethod] = args[0] || true;
      return validations;
    }, {});

  }

  return validations || {};

};
module.exports = {
  getInitialState: function () {
    return {
      _value: this.props.value,
      _isRequired: false,
      _isValid: true,
      _isPristine: true,
      _pristineValue: this.props.value,
      _validationError: ''
    };
  },
  getDefaultProps: function () {
    return {
      validationError: '',
      validationErrors: {}
    };
  },
  componentWillMount: function () {

    var configure = function () {
      this.setValidations(this.props.validations, this.props.required);
      this.props._attachToForm(this);
    }.bind(this);

    if (!this.props.name) {
      throw new Error('Form Input requires a name property when used');
    }

    if (!this.props._attachToForm) {
      return setTimeout(function () {
        if (!this.isMounted()) return;
        if (!this.props._attachToForm) {
          throw new Error('Form Mixin requires component to be nested in a Form');
        }
        configure();
      }.bind(this), 0);
    }
    configure();

  },

  // We have to make the validate method is kept when new props are added
  componentWillReceiveProps: function (nextProps) {
    nextProps._attachToForm = this.props._attachToForm;
    nextProps._detachFromForm = this.props._detachFromForm;
    nextProps._validate = this.props._validate;
    nextProps._isValidValue = this.props._isValidValue;
    nextProps._isFormDisabled = this.props._isFormDisabled;
    this.setValidations(nextProps.validations, nextProps.required);
  },

  componentDidUpdate: function (prevProps, prevState) {

    var isValueChanged = function () {
      
      return this.props.value !== prevProps.value && this.state._value === prevProps.value;

    }.bind(this);


    // If validations has changed or something outside changes 
    // the value, set the value again running a validation
    if (prevProps.validations !== this.props.validations || isValueChanged()) {
      this.setValue(this.props.value);
    }
  },

  // Detach it when component unmounts
  componentWillUnmount: function () {
    this.props._detachFromForm(this);
  },

  setValidations: function (validations, required) {

    // Add validations to the store itself as the props object can not be modified
    this._validations = convertValidationsToObject(validations) || {};
    this._requiredValidations = required === true ? {isDefaultRequiredValue: true} : convertValidationsToObject(required);

  },

  // We validate after the value has been set
  setValue: function (value) {
    this.setState({
      _value: value,
      _isPristine: false
    }, function () {
      this.props._validate(this);
    }.bind(this));
  },
  resetValue: function () {
    this.setState({
      _value: this.state._pristineValue,
      _isPristine: true
    }, function () {
      this.props._validate(this);
    });
  },
  getValue: function () {
    return this.state._value;
  },
  hasValue: function () {
    return this.state._value !== '';
  },
  getErrorMessage: function () {
    return !this.isValid() || this.showRequired() ? this.state._validationError : null;
  },
  isFormDisabled: function () {
    return this.props._isFormDisabled();
  },
  isValid: function () {
    return this.state._isValid;
  },
  isPristine: function () {
    return this.state._isPristine;
  },
  isRequired: function () {
    return !!this.props.required;
  },
  showRequired: function () {
    return this.state._isRequired;
  },
  showError: function () {
    return !this.showRequired() && !this.isValid();
  },
  isValidValue: function (value) {
    return this.props._isValidValue.call(null, this, value);
  }
};
