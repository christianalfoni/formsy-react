import React from 'react';

import validationRules from './validationRules.js';
import utils from './utils.js';
import Mixin from './Mixin.js';

const Formsy = {};

Formsy.Mixin = Mixin;

Formsy.addValidationRule = function (name, func) {
  validationRules[name] = func;
};

Formsy.Form = React.createClass({
  getInitialState() {
    return {
      isValid: true,
      isSubmitting: false,
      canChange: false
    };
  },

  getDefaultProps() {
    return {
      onSuccess() {},
      onError() {},
      onSubmit() {},
      onValidSubmit() {},
      onInvalidSubmit() {},
      onSubmitted() {},
      onValid() {},
      onInvalid() {},
      onChange() {},
      validationErrors: null,
      preventExternalInvalidation: false
    };
  },

  // Add a map to store the inputs of the form, a model to store
  // the values of the form and register child inputs
  componentWillMount() {
    this.inputs = {};
    this.model = {};
  },

  componentDidMount() {
    this.validateForm();
  },

  componentWillUpdate() {

    // Keep a reference to input keys before form updates,
    // to check if inputs has changed after render
    this.prevInputKeys = Object.keys(this.inputs);

  },

  componentDidUpdate() {

    if (this.props.validationErrors) {
      this.setInputValidationErrors(this.props.validationErrors);
    }

    const newInputKeys = Object.keys(this.inputs);
    if (utils.arraysDiffer(this.prevInputKeys, newInputKeys)) {
      this.validateForm();
    }

  },

  // Allow resetting to specified data
  reset(data) {
    this.setFormPristine(true);
    this.resetModel(data);
  },

  // Update model, submit to url prop and send the model
  submit(event) {

    event && event.preventDefault();

    // Trigger form as not pristine.
    // If any inputs have not been touched yet this will make them dirty
    // so validation becomes visible (if based on isPristine)
    this.setFormPristine(false);
    this.updateModel();
    const model = this.mapModel();
    this.props.onSubmit(model, this.resetModel, this.updateInputsWithError);
    this.state.isValid ?
      this.props.onValidSubmit(model, this.resetModel, this.updateInputsWithError) :
      this.props.onInvalidSubmit(model, this.resetModel, this.updateInputsWithError);

  },

  mapModel() {
    if (this.props.mapping) {
      return this.props.mapping(this.model);
    } else {
      return Object.keys(this.model).reduce((mappedModel, key) => {
        const keyArray = key.split('.');
        let base = mappedModel;
        while (keyArray.length) {
          const currentKey = keyArray.shift();
          base = (base[currentKey] = keyArray.length ? base[currentKey] || {} : this.model[key]);
        }

        return mappedModel;
      }, {});
    }
  },

  // Goes through all registered components and
  // updates the model values
  updateModel() {
    Object.keys(this.inputs).forEach((name) => {
      const component = this.inputs[name];
      this.model[name] = component.state._value;
    });
  },

  // Reset each key in the model to the original / initial / specified value
  resetModel(data) {
    Object.keys(this.inputs).forEach((name) => {
      if (data && data[name]) {
        this.inputs[name].setValue(data[name]);
      } else {
        this.inputs[name].resetValue();
      }
    });
    this.validateForm();
  },

  setInputValidationErrors(errors) {
    Object.keys(this.inputs).forEach((name) => {
      const component = this.inputs[name];
      const args = [{
        _isValid: !(name in errors),
        _validationError: errors[name]
      }];
      component.setState.apply(component, args);
    });
  },

  // Checks if the values have changed from their initial value
  isChanged() {
    return !utils.isSame(this.getPristineValues(), this.getCurrentValues());
  },

   getPristineValues() {
    const inputs = this.inputs;
    return Object.keys(inputs).reduce((data, name) => {
      const component = inputs[name];
      data[name] = component.props.value;
      return data;
    }, {});
  },

  // Go through errors from server and grab the components
  // stored in the inputs map. Change their state to invalid
  // and set the serverError message
  updateInputsWithError(errors) {
    Object.keys(errors).forEach((name) => {
      const component = this.inputs[name];

      if (!component) {
        throw new Error('You are trying to update an input that does not exist. Verify errors object with input names. ' + JSON.stringify(errors));
      }

      const args = [{
        _isValid: this.props.preventExternalInvalidation || false,
        _externalError: errors[name]
      }];
      component.setState.apply(component, args);
    });
  },

  // Traverse the children and children of children to find
  // all inputs by checking the name prop. Maybe do a better
  // check here
  traverseChildrenAndRegisterInputs(children) {

    if (typeof children !== 'object' || children === null) {
      return children;
    }
    return React.Children.map(children, (child) => {

      if (typeof child !== 'object' || child === null) {
        return child;
      }

      if (child.props && child.props.name) {

        return React.cloneElement(child, {
          _attachToForm: this.attachToForm,
          _detachFromForm: this.detachFromForm,
          _validate: this.validate,
          _isFormDisabled: this.isFormDisabled,
          _isValidValue: (component, value) => this.runValidation(component, value).isValid
        }, child.props && child.props.children);
      } else {
        return React.cloneElement(child, {}, this.traverseChildrenAndRegisterInputs(child.props && child.props.children));
      }

    }, this);

  },

  isFormDisabled() {
    return this.props.disabled;
  },

  getCurrentValues() {
    return Object.keys(this.inputs).reduce((data, name) => {
      const component = this.inputs[name];
      data[name] = component.state._value;
      return data;
    }, {});
  },

  setFormPristine(isPristine) {
    const inputs = this.inputs;
    const inputKeys = Object.keys(inputs);

    this.setState({
      _formSubmitted: !isPristine
    });

    // Iterate through each component and set it as pristine
    // or "dirty".
    inputKeys.forEach((name) => {
      const component = inputs[name];
      component.setState({
        _formSubmitted: !isPristine,
        _isPristine: isPristine
      });
    });
  },

  // Use the binded values and the actual input value to
  // validate the input and set its state. Then check the
  // state of the form itself
  validate(component) {

    // Trigger onChange
    if (this.state.canChange) {
      this.props.onChange(this.getCurrentValues(), this.isChanged());
    }

    const validation = this.runValidation(component);
    // Run through the validations, split them up and call
    // the validator IF there is a value or it is required
    component.setState({
      _isValid: validation.isValid,
      _isRequired: validation.isRequired,
      _validationError: validation.error,
      _externalError: null
    }, this.validateForm);

  },

  // Checks validation on current value or a passed value
  runValidation(component, value) {
    const currentValues = this.getCurrentValues();
    const validationErrors = component.props.validationErrors;
    const validationError = component.props.validationError;
    value = arguments.length === 2 ? value : component.state._value;

    const validationResults = this.runRules(value, currentValues, component._validations);
    const requiredResults = this.runRules(value, currentValues, component._requiredValidations);

    // the component defines an explicit validate function
    if (typeof component.validate === 'function') {
      validationResults.failed = component.validate() ? [] : ['failed'];
    }

    const isRequired = Object.keys(component._requiredValidations).length ? !!requiredResults.success.length : false;
    const isValid = !validationResults.failed.length && !(this.props.validationErrors && this.props.validationErrors[component.props.name]);

    return {
      isRequired,
      isValid: isRequired ? false : isValid,
      error: (function () {

        if (isValid && !isRequired) {
          return '';
        }

        if (validationResults.errors.length) {
          return validationResults.errors[0];
        }

        if (this.props.validationErrors && this.props.validationErrors[component.props.name]) {
          return this.props.validationErrors[component.props.name];
        }

        if (isRequired) {
          return validationErrors[requiredResults.success[0]] || null;
        }

        if (!isValid) {
          return validationErrors[validationResults.failed[0]] || validationError;
        }

      }.call(this))
    };

  },

  runRules(value, currentValues, validations) {
    const results = {
      errors: [],
      failed: [],
      success: []
    };

    Object.keys(validations).forEach((validationMethod) => {
      if (typeof validations[validationMethod] === 'function') {
        if (validationRules[validationMethod]) {
          throw new Error('Formsy does not allow you to override default validations: ' + validationMethod);
        }

        const validation = validations[validationMethod](currentValues, value);
        if (typeof validation === 'string') {
          results.errors.push(validation);
          results.failed.push(validationMethod);
        } else if (!validation) {
          results.failed.push(validationMethod);
        }

        return;
      }

      if (typeof validations[validationMethod] !== 'function') {
        if (!validationRules[validationMethod]) {
          throw new Error('Formsy does not have the validation rule: ' + validationMethod);
        }

        const validation = validationRules[validationMethod](currentValues, value, validations[validationMethod]);
        if (typeof validation === 'string') {
          results.errors.push(validation);
          results.failed.push(validationMethod);
        } else if (!validation) {
          results.failed.push(validationMethod);
        } else {
          results.success.push(validationMethod);
        }

        return;
      }

      results.success.push(validationMethod);
      return;
    });

    return results;
  },

  // Validate the form by going through all child input components
  // and check their state
  validateForm() {
    let allIsValid = true;
    const inputs = this.inputs;
    const inputKeys = Object.keys(inputs);

    // We need a callback as we are validating all inputs again. This will
    // run when the last component has set its state
    const onValidationComplete = () => {
      allIsValid = inputKeys.every((name) => inputs[name].state._isValid);

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
    };

    // Run validation again in case affected by other inputs. The
    // last component validated will run the onValidationComplete callback
    inputKeys.forEach((name, index) => {
      const component = inputs[name];
      const validation = this.runValidation(component);
      if (validation.isValid && component.state._externalError) {
        validation.isValid = false;
      }
      component.setState({
        _isValid: validation.isValid,
        _isRequired: validation.isRequired,
        _validationError: validation.error,
        _externalError: !validation.isValid && component.state._externalError ? component.state._externalError : null
      }, index === inputKeys.length - 1 ? onValidationComplete : null);
    });

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
  attachToForm(component) {
    this.inputs[component.props.name] = component;
    this.model[component.props.name] = component.state._value;
    this.validate(component);
  },

  // Method put on each input component to unregister
  // itself from the form
  detachFromForm(component) {
    delete this.inputs[component.props.name];
    delete this.model[component.props.name];
  },

  render() {
    return (
      <form {...this.props} onSubmit={this.submit}>
        {this.traverseChildrenAndRegisterInputs(this.props.children)}
      </form>
    );
  }

});

export default Formsy;
