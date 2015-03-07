var React = global.React || require('react');
var Formsy = {};
var validationRules = require('./validationRules.js');
var utils = require('./utils.js');
var Mixin = require('./Mixin.js');
var options = {};

Formsy.Mixin = Mixin;

Formsy.defaults = function (passedOptions) {
  options = passedOptions;
};

Formsy.addValidationRule = function (name, func) {
  validationRules[name] = func;
};

Formsy.Form = React.createClass({
  getInitialState: function () {
    return {
      isValid: true,
      isSubmitting: false,
      canChange: false
    };
  },
  getDefaultProps: function () {
    return {
      headers: {},
      onSuccess: function () {},
      onError: function () {},
      onSubmit: function () {},
      onSubmitted: function () {},
      onValid: function () {},
      onInvalid: function () {},
      onChange: function () {}
    };
  },

  // Add a map to store the inputs of the form, a model to store
  // the values of the form and register child inputs
  componentWillMount: function () {
    this.inputs = {};
    this.model = {};
    this.registerInputs(this.props.children);
  },

  componentDidMount: function () {
    this.validateForm();
  },

  componentWillUpdate: function () {
    var inputKeys = Object.keys(this.inputs);

    // The updated children array is not available here for some reason,
    // we need to wait for next event loop
    setTimeout(function () {

      // The component might have been unmounted on an
      // update
      if (this.isMounted()) {

        this.registerInputs(this.props.children);

        var newInputKeys = Object.keys(this.inputs);
        if (utils.arraysDiffer(inputKeys, newInputKeys)) {
          this.validateForm();
        }

      }

    }.bind(this), 0);
  },

  // Update model, submit to url prop and send the model
  submit: function (event) {
    event.preventDefault();

    // Trigger form as not pristine.
    // If any inputs have not been touched yet this will make them dirty
    // so validation becomes visible (if based on isPristine)
    this.setFormPristine(false);

    // To support use cases where no async or request operation is needed.
    // The "onSubmit" callback is called with the model e.g. {fieldName: "myValue"},
    // if wanting to reset the entire form to original state, the second param is a callback for this.
    if (!this.props.url) {
      this.updateModel();
      this.props.onSubmit(this.mapModel(), this.resetModel, this.updateInputsWithError);
      return;
    }

    this.updateModel();
    this.setState({
      isSubmitting: true
    });

    this.props.onSubmit(this.mapModel(), this.resetModel, this.updateInputsWithError);

    var headers = (Object.keys(this.props.headers).length && this.props.headers) || options.headers || {};

    var method = this.props.method && utils.ajax[this.props.method.toLowerCase()] ? this.props.method.toLowerCase() : 'post';
    utils.ajax[method](this.props.url, this.mapModel(), this.props.contentType || options.contentType || 'json', headers)
      .then(function (response) {
        this.props.onSuccess(response);
        this.props.onSubmitted();
      }.bind(this))
      .catch(this.failSubmit);
  },

  mapModel: function () {
    return this.props.mapping ? this.props.mapping(this.model) : this.model;
  },

  // Goes through all registered components and
  // updates the model values
  updateModel: function () {
    Object.keys(this.inputs).forEach(function (name) {
      var component = this.inputs[name];
      this.model[name] = component.state._value;
    }.bind(this));
  },

  // Reset each key in the model to the original / initial value
  resetModel: function () {
    Object.keys(this.inputs).forEach(function (name) {
      this.inputs[name].resetValue();
    }.bind(this));
    this.validateForm();
  },

  // Go through errors from server and grab the components
  // stored in the inputs map. Change their state to invalid
  // and set the serverError message
  updateInputsWithError: function (errors) {
    Object.keys(errors).forEach(function (name, index) {
      var component = this.inputs[name];

      if (!component) {
        throw new Error('You are trying to update an input that does not exists. Verify errors object with input names. ' + JSON.stringify(errors));
      }

      var args = [{
        _isValid: false,
        _serverError: errors[name]
      }];
      component.setState.apply(component, args);
    }.bind(this));
  },

  failSubmit: function (errors) {
    this.updateInputsWithError(errors);
    this.setState({
      isSubmitting: false
    });
    this.props.onError(errors);
    this.props.onSubmitted();
  },

  // Traverse the children and children of children to find
  // all inputs by checking the name prop. Maybe do a better
  // check here
  registerInputs: function (children) {
    React.Children.forEach(children, function (child) {

      if (child && child.props && child.props.name) {
        child.props._attachToForm = this.attachToForm;
        child.props._detachFromForm = this.detachFromForm;
        child.props._validate = this.validate;
        child.props._isFormDisabled = this.isFormDisabled;
      }

      if (child && child.props && child.props.children) {
        this.registerInputs(child.props.children);
      }

    }.bind(this));
  },

  isFormDisabled: function () {
    return this.props.disabled;
  },

  getCurrentValues: function () {
    return Object.keys(this.inputs).reduce(function (data, name) {
      var component = this.inputs[name];
      data[name] = component.state._value;
      return data;
    }.bind(this), {});
  },

  setFormPristine: function (isPristine) {
    var inputs = this.inputs;
    var inputKeys = Object.keys(inputs);

    // Iterate through each component and set it as pristine
    // or "dirty".
    inputKeys.forEach(function (name, index) {
      var component = inputs[name];
      component.setState({
        _isPristine: isPristine
      });
    }.bind(this));
  },

  // Use the binded values and the actual input value to
  // validate the input and set its state. Then check the
  // state of the form itself
  validate: function (component) {

    // Trigger onChange
    if (this.state.canChange) {
      this.props.onChange(this.getCurrentValues());
    }

    if (!component.props.required && !component._validations) {
      return;
    }

    // Run through the validations, split them up and call
    // the validator IF there is a value or it is required
    var isValid = this.runValidation(component);

    component.setState({
      _isValid: isValid,
      _serverError: null
    }, this.validateForm);

  },

  runValidation: function (component) {
    var isValid = true;
    if (component._validations.length && (component.props.required || component.state._value !== '')) {
      component._validations.split(',').forEach(function (validation) {
        var args = validation.split(':');
        var validateMethod = args.shift();
        args = args.map(function (arg) {
          try {
            return JSON.parse(arg);
          } catch (e) {
            return arg; // It is a string if it can not parse it
          }
        });
        args = [component.state._value].concat(args);
        if (!validationRules[validateMethod]) {
          throw new Error('Formsy does not have the validation rule: ' + validateMethod);
        }
        if (!validationRules[validateMethod].apply(this.getCurrentValues(), args)) {
          isValid = false;
        }
      }.bind(this));
    }
    return isValid;
  },

  // Validate the form by going through all child input components
  // and check their state
  validateForm: function () {
    var allIsValid = true;
    var inputs = this.inputs;
    var inputKeys = Object.keys(inputs);

    // We need a callback as we are validating all inputs again. This will
    // run when the last component has set its state
    var onValidationComplete = function () {
      inputKeys.forEach(function (name) {
        if (!inputs[name].state._isValid) {
          allIsValid = false;
        }
      }.bind(this));

      this.setState({
        isValid: allIsValid
      });

      if (allIsValid) {
        this.props.onValid();
      } else {
        this.props.onInvalid();
      }

      // Tell the form that it can start to trigger change events
      this.setState({
        canChange: true
      });

    }.bind(this);

    // Run validation again in case affected by other inputs. The
    // last component validated will run the onValidationComplete callback
    inputKeys.forEach(function (name, index) {
      var component = inputs[name];
      var isValid = this.runValidation(component);
      component.setState({
        _isValid: isValid,
        _serverError: null
      }, index === inputKeys.length - 1 ? onValidationComplete : null);
    }.bind(this));

    // If there are no inputs, set state where form is ready to trigger
    // change event. New inputs might be added later
    if (!inputKeys.length && this.isMounted()) {
      this.setState({
        canChange: true
      });
    }
  },

  // Method put on each input component to register
  // itself to the form
  attachToForm: function (component) {
    this.inputs[component.props.name] = component;
    this.model[component.props.name] = component.state._value;
    this.validate(component);
  },

  // Method put on each input component to unregister
  // itself from the form
  detachFromForm: function (component) {
    delete this.inputs[component.props.name];
    delete this.model[component.props.name];
  },
  render: function () {

    return React.DOM.form({
        onSubmit: this.submit,
        className: this.props.className
      },
      this.props.children
    );

  }
});

if (!global.exports && !global.module && (!global.define || !global.define.amd)) {
  global.Formsy = Formsy;
}

module.exports = Formsy;
