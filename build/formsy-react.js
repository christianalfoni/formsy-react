(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./src/main.js":[function(require,module,exports){
(function (global){
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

Formsy.Form = React.createClass({displayName: "Form",
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./Mixin.js":"/Users/christianalfoni/Documents/dev/formsy-react/src/Mixin.js","./utils.js":"/Users/christianalfoni/Documents/dev/formsy-react/src/utils.js","./validationRules.js":"/Users/christianalfoni/Documents/dev/formsy-react/src/validationRules.js","react":"react"}],"/Users/christianalfoni/Documents/dev/formsy-react/src/Mixin.js":[function(require,module,exports){
module.exports = {
  getInitialState: function () {
    return {
      _value: this.props.value ? this.props.value : '',
      _isValid: true,
      _isPristine: true
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
    this.setValidations(nextProps.validations, nextProps.required);
  },

  componentDidUpdate: function (prevProps, prevState) {

    var isValueChanged = function () {
      
      return (
        this.props.value !== prevProps.value && (
          this.state._value === prevProps.value ||

          // Since undefined is converted to empty string we have to
          // check that specifically
          (this.state._value === '' && prevProps.value === undefined)
        )
      );

    }.bind(this);


    // If validations has changed or something outside changes 
    // the value, set the value again running a validation

    if (prevProps.validations !== this.props.validations || isValueChanged()) {
      this.setValue(this.props.value || '');
    }
  },

  // Detach it when component unmounts
  componentWillUnmount: function () {
    this.props._detachFromForm(this);
  },

  setValidations: function (validations, required) {

    // Add validations to the store itself as the props object can not be modified
    this._validations = validations || '';

    if (required) {
      this._validations = validations ? validations + ',' : '';
      this._validations += 'isValue';
    }

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
      _value: '',
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
    return this.isValid() || this.showRequired() ? null : this.state._serverError || this.props.validationError;
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
    return this.isRequired() && this.state._value === '';
  },
  showError: function () {
    return !this.showRequired() && !this.state._isValid;
  }
};

},{}],"/Users/christianalfoni/Documents/dev/formsy-react/src/utils.js":[function(require,module,exports){
var csrfTokenSelector = document.querySelector('meta[name="csrf-token"]');

var toURLEncoded = function (element, key, list) {
  var list = list || [];
  if (typeof (element) == 'object') {
    for (var idx in element)
      toURLEncoded(element[idx], key ? key + '[' + idx + ']' : idx, list);
  } else {
    list.push(key + '=' + encodeURIComponent(element));
  }
  return list.join('&');
};

var request = function (method, url, data, contentType, headers) {

  var contentType = contentType === 'urlencoded' ? 'application/' + contentType.replace('urlencoded', 'x-www-form-urlencoded') : 'application/json';
  data = contentType === 'application/json' ? JSON.stringify(data) : toURLEncoded(data);

  return new Promise(function (resolve, reject) {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open(method, url, true);
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.setRequestHeader('Content-Type', contentType);

      if (!!csrfTokenSelector && !!csrfTokenSelector.content) {
        xhr.setRequestHeader('X-CSRF-Token', csrfTokenSelector.content);
      }

      // Add passed headers
      Object.keys(headers).forEach(function (header) {
        xhr.setRequestHeader(header, headers[header]);
      });

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {

          try {
            var response = xhr.responseText ? JSON.parse(xhr.responseText) : null;
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(response);
            } else {
              reject(response);
            }
          } catch (e) {
            reject(e);
          }

        }
      };
      xhr.send(data);
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  arraysDiffer: function (arrayA, arrayB) {
    var isDifferent = false;
    if (arrayA.length !== arrayB.length) {
      isDifferent = true;
    } else {
      arrayA.forEach(function (item, index) {
        if (item !== arrayB[index]) {
          isDifferent = true;
        }
      });
    }
    return isDifferent;
  },
  ajax: {
    post: request.bind(null, 'POST'),
    put: request.bind(null, 'PUT')
  }
};

},{}],"/Users/christianalfoni/Documents/dev/formsy-react/src/validationRules.js":[function(require,module,exports){
module.exports = {
  'isValue': function (value) {
    return value !== '';
  },
  'isEmail': function (value) {
    return value.match(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i);
  },
  'isTrue': function (value) {
    return value === true;
  },
  'isNumeric': function (value) {
    if (typeof value === 'number') {
      return true;
    } else {
      matchResults = value.match(/[-+]?(\d*[.])?\d+/);
      if (!! matchResults) {
        return matchResults[0] == value;
      } else {
        return false;
      }
    }
  },
  'isAlpha': function (value) {
    return value.match(/^[a-zA-Z]+$/);
  },
  'isWords': function (value) {
    return value.match(/^[a-zA-Z\s]+$/);
  },
  'isSpecialWords': function (value) {
    return value.match(/^[a-zA-Z\s\u00C0-\u017F]+$/);
  },
  isLength: function (value, min, max) {
    if (max !== undefined) {
      return value.length >= min && value.length <= max;
    }
    return value.length >= min;
  },
  equals: function (value, eql) {
    return value == eql;
  },
  equalsField: function (value, field) {
    return value === this[field];
  }
};

},{}]},{},["./src/main.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbWFpbi5qcyIsInNyYy9NaXhpbi5qcyIsInNyYy91dGlscy5qcyIsInNyYy92YWxpZGF0aW9uUnVsZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDbFZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgUmVhY3QgPSBnbG9iYWwuUmVhY3QgfHwgcmVxdWlyZSgncmVhY3QnKTtcbnZhciBGb3Jtc3kgPSB7fTtcbnZhciB2YWxpZGF0aW9uUnVsZXMgPSByZXF1aXJlKCcuL3ZhbGlkYXRpb25SdWxlcy5qcycpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscy5qcycpO1xudmFyIE1peGluID0gcmVxdWlyZSgnLi9NaXhpbi5qcycpO1xudmFyIG9wdGlvbnMgPSB7fTtcblxuRm9ybXN5Lk1peGluID0gTWl4aW47XG5cbkZvcm1zeS5kZWZhdWx0cyA9IGZ1bmN0aW9uIChwYXNzZWRPcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBwYXNzZWRPcHRpb25zO1xufTtcblxuRm9ybXN5LmFkZFZhbGlkYXRpb25SdWxlID0gZnVuY3Rpb24gKG5hbWUsIGZ1bmMpIHtcbiAgdmFsaWRhdGlvblJ1bGVzW25hbWVdID0gZnVuYztcbn07XG5cbkZvcm1zeS5Gb3JtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkZvcm1cIixcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlzVmFsaWQ6IHRydWUsXG4gICAgICBpc1N1Ym1pdHRpbmc6IGZhbHNlLFxuICAgICAgY2FuQ2hhbmdlOiBmYWxzZVxuICAgIH07XG4gIH0sXG4gIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICBoZWFkZXJzOiB7fSxcbiAgICAgIG9uU3VjY2VzczogZnVuY3Rpb24gKCkge30sXG4gICAgICBvbkVycm9yOiBmdW5jdGlvbiAoKSB7fSxcbiAgICAgIG9uU3VibWl0OiBmdW5jdGlvbiAoKSB7fSxcbiAgICAgIG9uU3VibWl0dGVkOiBmdW5jdGlvbiAoKSB7fSxcbiAgICAgIG9uVmFsaWQ6IGZ1bmN0aW9uICgpIHt9LFxuICAgICAgb25JbnZhbGlkOiBmdW5jdGlvbiAoKSB7fSxcbiAgICAgIG9uQ2hhbmdlOiBmdW5jdGlvbiAoKSB7fVxuICAgIH07XG4gIH0sXG5cbiAgLy8gQWRkIGEgbWFwIHRvIHN0b3JlIHRoZSBpbnB1dHMgb2YgdGhlIGZvcm0sIGEgbW9kZWwgdG8gc3RvcmVcbiAgLy8gdGhlIHZhbHVlcyBvZiB0aGUgZm9ybSBhbmQgcmVnaXN0ZXIgY2hpbGQgaW5wdXRzXG4gIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuaW5wdXRzID0ge307XG4gICAgdGhpcy5tb2RlbCA9IHt9O1xuICAgIHRoaXMucmVnaXN0ZXJJbnB1dHModGhpcy5wcm9wcy5jaGlsZHJlbik7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnZhbGlkYXRlRm9ybSgpO1xuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxVcGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaW5wdXRLZXlzID0gT2JqZWN0LmtleXModGhpcy5pbnB1dHMpO1xuXG4gICAgLy8gVGhlIHVwZGF0ZWQgY2hpbGRyZW4gYXJyYXkgaXMgbm90IGF2YWlsYWJsZSBoZXJlIGZvciBzb21lIHJlYXNvbixcbiAgICAvLyB3ZSBuZWVkIHRvIHdhaXQgZm9yIG5leHQgZXZlbnQgbG9vcFxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXG4gICAgICAvLyBUaGUgY29tcG9uZW50IG1pZ2h0IGhhdmUgYmVlbiB1bm1vdW50ZWQgb24gYW5cbiAgICAgIC8vIHVwZGF0ZVxuICAgICAgaWYgKHRoaXMuaXNNb3VudGVkKCkpIHtcblxuICAgICAgICB0aGlzLnJlZ2lzdGVySW5wdXRzKHRoaXMucHJvcHMuY2hpbGRyZW4pO1xuXG4gICAgICAgIHZhciBuZXdJbnB1dEtleXMgPSBPYmplY3Qua2V5cyh0aGlzLmlucHV0cyk7XG4gICAgICAgIGlmICh1dGlscy5hcnJheXNEaWZmZXIoaW5wdXRLZXlzLCBuZXdJbnB1dEtleXMpKSB7XG4gICAgICAgICAgdGhpcy52YWxpZGF0ZUZvcm0oKTtcbiAgICAgICAgfVxuXG4gICAgICB9XG5cbiAgICB9LmJpbmQodGhpcyksIDApO1xuICB9LFxuXG4gIC8vIFVwZGF0ZSBtb2RlbCwgc3VibWl0IHRvIHVybCBwcm9wIGFuZCBzZW5kIHRoZSBtb2RlbFxuICBzdWJtaXQ6IGZ1bmN0aW9uIChldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAvLyBUcmlnZ2VyIGZvcm0gYXMgbm90IHByaXN0aW5lLlxuICAgIC8vIElmIGFueSBpbnB1dHMgaGF2ZSBub3QgYmVlbiB0b3VjaGVkIHlldCB0aGlzIHdpbGwgbWFrZSB0aGVtIGRpcnR5XG4gICAgLy8gc28gdmFsaWRhdGlvbiBiZWNvbWVzIHZpc2libGUgKGlmIGJhc2VkIG9uIGlzUHJpc3RpbmUpXG4gICAgdGhpcy5zZXRGb3JtUHJpc3RpbmUoZmFsc2UpO1xuXG4gICAgLy8gVG8gc3VwcG9ydCB1c2UgY2FzZXMgd2hlcmUgbm8gYXN5bmMgb3IgcmVxdWVzdCBvcGVyYXRpb24gaXMgbmVlZGVkLlxuICAgIC8vIFRoZSBcIm9uU3VibWl0XCIgY2FsbGJhY2sgaXMgY2FsbGVkIHdpdGggdGhlIG1vZGVsIGUuZy4ge2ZpZWxkTmFtZTogXCJteVZhbHVlXCJ9LFxuICAgIC8vIGlmIHdhbnRpbmcgdG8gcmVzZXQgdGhlIGVudGlyZSBmb3JtIHRvIG9yaWdpbmFsIHN0YXRlLCB0aGUgc2Vjb25kIHBhcmFtIGlzIGEgY2FsbGJhY2sgZm9yIHRoaXMuXG4gICAgaWYgKCF0aGlzLnByb3BzLnVybCkge1xuICAgICAgdGhpcy51cGRhdGVNb2RlbCgpO1xuICAgICAgdGhpcy5wcm9wcy5vblN1Ym1pdCh0aGlzLm1hcE1vZGVsKCksIHRoaXMucmVzZXRNb2RlbCwgdGhpcy51cGRhdGVJbnB1dHNXaXRoRXJyb3IpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMudXBkYXRlTW9kZWwoKTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGlzU3VibWl0dGluZzogdHJ1ZVxuICAgIH0pO1xuXG4gICAgdGhpcy5wcm9wcy5vblN1Ym1pdCh0aGlzLm1hcE1vZGVsKCksIHRoaXMucmVzZXRNb2RlbCwgdGhpcy51cGRhdGVJbnB1dHNXaXRoRXJyb3IpO1xuXG4gICAgdmFyIGhlYWRlcnMgPSAoT2JqZWN0LmtleXModGhpcy5wcm9wcy5oZWFkZXJzKS5sZW5ndGggJiYgdGhpcy5wcm9wcy5oZWFkZXJzKSB8fCBvcHRpb25zLmhlYWRlcnMgfHwge307XG5cbiAgICB2YXIgbWV0aG9kID0gdGhpcy5wcm9wcy5tZXRob2QgJiYgdXRpbHMuYWpheFt0aGlzLnByb3BzLm1ldGhvZC50b0xvd2VyQ2FzZSgpXSA/IHRoaXMucHJvcHMubWV0aG9kLnRvTG93ZXJDYXNlKCkgOiAncG9zdCc7XG4gICAgdXRpbHMuYWpheFttZXRob2RdKHRoaXMucHJvcHMudXJsLCB0aGlzLm1hcE1vZGVsKCksIHRoaXMucHJvcHMuY29udGVudFR5cGUgfHwgb3B0aW9ucy5jb250ZW50VHlwZSB8fCAnanNvbicsIGhlYWRlcnMpXG4gICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5vblN1Y2Nlc3MocmVzcG9uc2UpO1xuICAgICAgICB0aGlzLnByb3BzLm9uU3VibWl0dGVkKCk7XG4gICAgICB9LmJpbmQodGhpcykpXG4gICAgICAuY2F0Y2godGhpcy5mYWlsU3VibWl0KTtcbiAgfSxcblxuICBtYXBNb2RlbDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLm1hcHBpbmcgPyB0aGlzLnByb3BzLm1hcHBpbmcodGhpcy5tb2RlbCkgOiB0aGlzLm1vZGVsO1xuICB9LFxuXG4gIC8vIEdvZXMgdGhyb3VnaCBhbGwgcmVnaXN0ZXJlZCBjb21wb25lbnRzIGFuZFxuICAvLyB1cGRhdGVzIHRoZSBtb2RlbCB2YWx1ZXNcbiAgdXBkYXRlTW9kZWw6IGZ1bmN0aW9uICgpIHtcbiAgICBPYmplY3Qua2V5cyh0aGlzLmlucHV0cykuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgdmFyIGNvbXBvbmVudCA9IHRoaXMuaW5wdXRzW25hbWVdO1xuICAgICAgdGhpcy5tb2RlbFtuYW1lXSA9IGNvbXBvbmVudC5zdGF0ZS5fdmFsdWU7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgfSxcblxuICAvLyBSZXNldCBlYWNoIGtleSBpbiB0aGUgbW9kZWwgdG8gdGhlIG9yaWdpbmFsIC8gaW5pdGlhbCB2YWx1ZVxuICByZXNldE1vZGVsOiBmdW5jdGlvbiAoKSB7XG4gICAgT2JqZWN0LmtleXModGhpcy5pbnB1dHMpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgIHRoaXMuaW5wdXRzW25hbWVdLnJlc2V0VmFsdWUoKTtcbiAgICB9LmJpbmQodGhpcykpO1xuICAgIHRoaXMudmFsaWRhdGVGb3JtKCk7XG4gIH0sXG5cbiAgLy8gR28gdGhyb3VnaCBlcnJvcnMgZnJvbSBzZXJ2ZXIgYW5kIGdyYWIgdGhlIGNvbXBvbmVudHNcbiAgLy8gc3RvcmVkIGluIHRoZSBpbnB1dHMgbWFwLiBDaGFuZ2UgdGhlaXIgc3RhdGUgdG8gaW52YWxpZFxuICAvLyBhbmQgc2V0IHRoZSBzZXJ2ZXJFcnJvciBtZXNzYWdlXG4gIHVwZGF0ZUlucHV0c1dpdGhFcnJvcjogZnVuY3Rpb24gKGVycm9ycykge1xuICAgIE9iamVjdC5rZXlzKGVycm9ycykuZm9yRWFjaChmdW5jdGlvbiAobmFtZSwgaW5kZXgpIHtcbiAgICAgIHZhciBjb21wb25lbnQgPSB0aGlzLmlucHV0c1tuYW1lXTtcblxuICAgICAgaWYgKCFjb21wb25lbnQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgYXJlIHRyeWluZyB0byB1cGRhdGUgYW4gaW5wdXQgdGhhdCBkb2VzIG5vdCBleGlzdHMuIFZlcmlmeSBlcnJvcnMgb2JqZWN0IHdpdGggaW5wdXQgbmFtZXMuICcgKyBKU09OLnN0cmluZ2lmeShlcnJvcnMpKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGFyZ3MgPSBbe1xuICAgICAgICBfaXNWYWxpZDogZmFsc2UsXG4gICAgICAgIF9zZXJ2ZXJFcnJvcjogZXJyb3JzW25hbWVdXG4gICAgICB9XTtcbiAgICAgIGNvbXBvbmVudC5zZXRTdGF0ZS5hcHBseShjb21wb25lbnQsIGFyZ3MpO1xuICAgIH0uYmluZCh0aGlzKSk7XG4gIH0sXG5cbiAgZmFpbFN1Ym1pdDogZnVuY3Rpb24gKGVycm9ycykge1xuICAgIHRoaXMudXBkYXRlSW5wdXRzV2l0aEVycm9yKGVycm9ycyk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpc1N1Ym1pdHRpbmc6IGZhbHNlXG4gICAgfSk7XG4gICAgdGhpcy5wcm9wcy5vbkVycm9yKGVycm9ycyk7XG4gICAgdGhpcy5wcm9wcy5vblN1Ym1pdHRlZCgpO1xuICB9LFxuXG4gIC8vIFRyYXZlcnNlIHRoZSBjaGlsZHJlbiBhbmQgY2hpbGRyZW4gb2YgY2hpbGRyZW4gdG8gZmluZFxuICAvLyBhbGwgaW5wdXRzIGJ5IGNoZWNraW5nIHRoZSBuYW1lIHByb3AuIE1heWJlIGRvIGEgYmV0dGVyXG4gIC8vIGNoZWNrIGhlcmVcbiAgcmVnaXN0ZXJJbnB1dHM6IGZ1bmN0aW9uIChjaGlsZHJlbikge1xuICAgIFJlYWN0LkNoaWxkcmVuLmZvckVhY2goY2hpbGRyZW4sIGZ1bmN0aW9uIChjaGlsZCkge1xuXG4gICAgICBpZiAoY2hpbGQgJiYgY2hpbGQucHJvcHMgJiYgY2hpbGQucHJvcHMubmFtZSkge1xuICAgICAgICBjaGlsZC5wcm9wcy5fYXR0YWNoVG9Gb3JtID0gdGhpcy5hdHRhY2hUb0Zvcm07XG4gICAgICAgIGNoaWxkLnByb3BzLl9kZXRhY2hGcm9tRm9ybSA9IHRoaXMuZGV0YWNoRnJvbUZvcm07XG4gICAgICAgIGNoaWxkLnByb3BzLl92YWxpZGF0ZSA9IHRoaXMudmFsaWRhdGU7XG4gICAgICAgIGNoaWxkLnByb3BzLl9pc0Zvcm1EaXNhYmxlZCA9IHRoaXMuaXNGb3JtRGlzYWJsZWQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChjaGlsZCAmJiBjaGlsZC5wcm9wcyAmJiBjaGlsZC5wcm9wcy5jaGlsZHJlbikge1xuICAgICAgICB0aGlzLnJlZ2lzdGVySW5wdXRzKGNoaWxkLnByb3BzLmNoaWxkcmVuKTtcbiAgICAgIH1cblxuICAgIH0uYmluZCh0aGlzKSk7XG4gIH0sXG5cbiAgaXNGb3JtRGlzYWJsZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5kaXNhYmxlZDtcbiAgfSxcblxuICBnZXRDdXJyZW50VmFsdWVzOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuaW5wdXRzKS5yZWR1Y2UoZnVuY3Rpb24gKGRhdGEsIG5hbWUpIHtcbiAgICAgIHZhciBjb21wb25lbnQgPSB0aGlzLmlucHV0c1tuYW1lXTtcbiAgICAgIGRhdGFbbmFtZV0gPSBjb21wb25lbnQuc3RhdGUuX3ZhbHVlO1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfS5iaW5kKHRoaXMpLCB7fSk7XG4gIH0sXG5cbiAgc2V0Rm9ybVByaXN0aW5lOiBmdW5jdGlvbiAoaXNQcmlzdGluZSkge1xuICAgIHZhciBpbnB1dHMgPSB0aGlzLmlucHV0cztcbiAgICB2YXIgaW5wdXRLZXlzID0gT2JqZWN0LmtleXMoaW5wdXRzKTtcblxuICAgIC8vIEl0ZXJhdGUgdGhyb3VnaCBlYWNoIGNvbXBvbmVudCBhbmQgc2V0IGl0IGFzIHByaXN0aW5lXG4gICAgLy8gb3IgXCJkaXJ0eVwiLlxuICAgIGlucHV0S2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lLCBpbmRleCkge1xuICAgICAgdmFyIGNvbXBvbmVudCA9IGlucHV0c1tuYW1lXTtcbiAgICAgIGNvbXBvbmVudC5zZXRTdGF0ZSh7XG4gICAgICAgIF9pc1ByaXN0aW5lOiBpc1ByaXN0aW5lXG4gICAgICB9KTtcbiAgICB9LmJpbmQodGhpcykpO1xuICB9LFxuXG4gIC8vIFVzZSB0aGUgYmluZGVkIHZhbHVlcyBhbmQgdGhlIGFjdHVhbCBpbnB1dCB2YWx1ZSB0b1xuICAvLyB2YWxpZGF0ZSB0aGUgaW5wdXQgYW5kIHNldCBpdHMgc3RhdGUuIFRoZW4gY2hlY2sgdGhlXG4gIC8vIHN0YXRlIG9mIHRoZSBmb3JtIGl0c2VsZlxuICB2YWxpZGF0ZTogZnVuY3Rpb24gKGNvbXBvbmVudCkge1xuXG4gICAgLy8gVHJpZ2dlciBvbkNoYW5nZVxuICAgIGlmICh0aGlzLnN0YXRlLmNhbkNoYW5nZSkge1xuICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZSh0aGlzLmdldEN1cnJlbnRWYWx1ZXMoKSk7XG4gICAgfVxuXG4gICAgaWYgKCFjb21wb25lbnQucHJvcHMucmVxdWlyZWQgJiYgIWNvbXBvbmVudC5fdmFsaWRhdGlvbnMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBSdW4gdGhyb3VnaCB0aGUgdmFsaWRhdGlvbnMsIHNwbGl0IHRoZW0gdXAgYW5kIGNhbGxcbiAgICAvLyB0aGUgdmFsaWRhdG9yIElGIHRoZXJlIGlzIGEgdmFsdWUgb3IgaXQgaXMgcmVxdWlyZWRcbiAgICB2YXIgaXNWYWxpZCA9IHRoaXMucnVuVmFsaWRhdGlvbihjb21wb25lbnQpO1xuXG4gICAgY29tcG9uZW50LnNldFN0YXRlKHtcbiAgICAgIF9pc1ZhbGlkOiBpc1ZhbGlkLFxuICAgICAgX3NlcnZlckVycm9yOiBudWxsXG4gICAgfSwgdGhpcy52YWxpZGF0ZUZvcm0pO1xuXG4gIH0sXG5cbiAgcnVuVmFsaWRhdGlvbjogZnVuY3Rpb24gKGNvbXBvbmVudCkge1xuICAgIHZhciBpc1ZhbGlkID0gdHJ1ZTtcbiAgICBpZiAoY29tcG9uZW50Ll92YWxpZGF0aW9ucy5sZW5ndGggJiYgKGNvbXBvbmVudC5wcm9wcy5yZXF1aXJlZCB8fCBjb21wb25lbnQuc3RhdGUuX3ZhbHVlICE9PSAnJykpIHtcbiAgICAgIGNvbXBvbmVudC5fdmFsaWRhdGlvbnMuc3BsaXQoJywnKS5mb3JFYWNoKGZ1bmN0aW9uICh2YWxpZGF0aW9uKSB7XG4gICAgICAgIHZhciBhcmdzID0gdmFsaWRhdGlvbi5zcGxpdCgnOicpO1xuICAgICAgICB2YXIgdmFsaWRhdGVNZXRob2QgPSBhcmdzLnNoaWZ0KCk7XG4gICAgICAgIGFyZ3MgPSBhcmdzLm1hcChmdW5jdGlvbiAoYXJnKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKGFyZyk7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgcmV0dXJuIGFyZzsgLy8gSXQgaXMgYSBzdHJpbmcgaWYgaXQgY2FuIG5vdCBwYXJzZSBpdFxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGFyZ3MgPSBbY29tcG9uZW50LnN0YXRlLl92YWx1ZV0uY29uY2F0KGFyZ3MpO1xuICAgICAgICBpZiAoIXZhbGlkYXRpb25SdWxlc1t2YWxpZGF0ZU1ldGhvZF0pIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Zvcm1zeSBkb2VzIG5vdCBoYXZlIHRoZSB2YWxpZGF0aW9uIHJ1bGU6ICcgKyB2YWxpZGF0ZU1ldGhvZCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF2YWxpZGF0aW9uUnVsZXNbdmFsaWRhdGVNZXRob2RdLmFwcGx5KHRoaXMuZ2V0Q3VycmVudFZhbHVlcygpLCBhcmdzKSkge1xuICAgICAgICAgIGlzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9XG4gICAgcmV0dXJuIGlzVmFsaWQ7XG4gIH0sXG5cbiAgLy8gVmFsaWRhdGUgdGhlIGZvcm0gYnkgZ29pbmcgdGhyb3VnaCBhbGwgY2hpbGQgaW5wdXQgY29tcG9uZW50c1xuICAvLyBhbmQgY2hlY2sgdGhlaXIgc3RhdGVcbiAgdmFsaWRhdGVGb3JtOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGFsbElzVmFsaWQgPSB0cnVlO1xuICAgIHZhciBpbnB1dHMgPSB0aGlzLmlucHV0cztcbiAgICB2YXIgaW5wdXRLZXlzID0gT2JqZWN0LmtleXMoaW5wdXRzKTtcblxuICAgIC8vIFdlIG5lZWQgYSBjYWxsYmFjayBhcyB3ZSBhcmUgdmFsaWRhdGluZyBhbGwgaW5wdXRzIGFnYWluLiBUaGlzIHdpbGxcbiAgICAvLyBydW4gd2hlbiB0aGUgbGFzdCBjb21wb25lbnQgaGFzIHNldCBpdHMgc3RhdGVcbiAgICB2YXIgb25WYWxpZGF0aW9uQ29tcGxldGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpbnB1dEtleXMuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICBpZiAoIWlucHV0c1tuYW1lXS5zdGF0ZS5faXNWYWxpZCkge1xuICAgICAgICAgIGFsbElzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfS5iaW5kKHRoaXMpKTtcblxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGlzVmFsaWQ6IGFsbElzVmFsaWRcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoYWxsSXNWYWxpZCkge1xuICAgICAgICB0aGlzLnByb3BzLm9uVmFsaWQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucHJvcHMub25JbnZhbGlkKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIFRlbGwgdGhlIGZvcm0gdGhhdCBpdCBjYW4gc3RhcnQgdG8gdHJpZ2dlciBjaGFuZ2UgZXZlbnRzXG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgY2FuQ2hhbmdlOiB0cnVlXG4gICAgICB9KTtcblxuICAgIH0uYmluZCh0aGlzKTtcblxuICAgIC8vIFJ1biB2YWxpZGF0aW9uIGFnYWluIGluIGNhc2UgYWZmZWN0ZWQgYnkgb3RoZXIgaW5wdXRzLiBUaGVcbiAgICAvLyBsYXN0IGNvbXBvbmVudCB2YWxpZGF0ZWQgd2lsbCBydW4gdGhlIG9uVmFsaWRhdGlvbkNvbXBsZXRlIGNhbGxiYWNrXG4gICAgaW5wdXRLZXlzLmZvckVhY2goZnVuY3Rpb24gKG5hbWUsIGluZGV4KSB7XG4gICAgICB2YXIgY29tcG9uZW50ID0gaW5wdXRzW25hbWVdO1xuICAgICAgdmFyIGlzVmFsaWQgPSB0aGlzLnJ1blZhbGlkYXRpb24oY29tcG9uZW50KTtcbiAgICAgIGNvbXBvbmVudC5zZXRTdGF0ZSh7XG4gICAgICAgIF9pc1ZhbGlkOiBpc1ZhbGlkLFxuICAgICAgICBfc2VydmVyRXJyb3I6IG51bGxcbiAgICAgIH0sIGluZGV4ID09PSBpbnB1dEtleXMubGVuZ3RoIC0gMSA/IG9uVmFsaWRhdGlvbkNvbXBsZXRlIDogbnVsbCk7XG4gICAgfS5iaW5kKHRoaXMpKTtcblxuICAgIC8vIElmIHRoZXJlIGFyZSBubyBpbnB1dHMsIHNldCBzdGF0ZSB3aGVyZSBmb3JtIGlzIHJlYWR5IHRvIHRyaWdnZXJcbiAgICAvLyBjaGFuZ2UgZXZlbnQuIE5ldyBpbnB1dHMgbWlnaHQgYmUgYWRkZWQgbGF0ZXJcbiAgICBpZiAoIWlucHV0S2V5cy5sZW5ndGggJiYgdGhpcy5pc01vdW50ZWQoKSkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGNhbkNoYW5nZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfVxuICB9LFxuXG4gIC8vIE1ldGhvZCBwdXQgb24gZWFjaCBpbnB1dCBjb21wb25lbnQgdG8gcmVnaXN0ZXJcbiAgLy8gaXRzZWxmIHRvIHRoZSBmb3JtXG4gIGF0dGFjaFRvRm9ybTogZnVuY3Rpb24gKGNvbXBvbmVudCkge1xuICAgIHRoaXMuaW5wdXRzW2NvbXBvbmVudC5wcm9wcy5uYW1lXSA9IGNvbXBvbmVudDtcbiAgICB0aGlzLm1vZGVsW2NvbXBvbmVudC5wcm9wcy5uYW1lXSA9IGNvbXBvbmVudC5zdGF0ZS5fdmFsdWU7XG4gICAgdGhpcy52YWxpZGF0ZShjb21wb25lbnQpO1xuICB9LFxuXG4gIC8vIE1ldGhvZCBwdXQgb24gZWFjaCBpbnB1dCBjb21wb25lbnQgdG8gdW5yZWdpc3RlclxuICAvLyBpdHNlbGYgZnJvbSB0aGUgZm9ybVxuICBkZXRhY2hGcm9tRm9ybTogZnVuY3Rpb24gKGNvbXBvbmVudCkge1xuICAgIGRlbGV0ZSB0aGlzLmlucHV0c1tjb21wb25lbnQucHJvcHMubmFtZV07XG4gICAgZGVsZXRlIHRoaXMubW9kZWxbY29tcG9uZW50LnByb3BzLm5hbWVdO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcblxuICAgIHJldHVybiBSZWFjdC5ET00uZm9ybSh7XG4gICAgICAgIG9uU3VibWl0OiB0aGlzLnN1Ym1pdCxcbiAgICAgICAgY2xhc3NOYW1lOiB0aGlzLnByb3BzLmNsYXNzTmFtZVxuICAgICAgfSxcbiAgICAgIHRoaXMucHJvcHMuY2hpbGRyZW5cbiAgICApO1xuXG4gIH1cbn0pO1xuXG5pZiAoIWdsb2JhbC5leHBvcnRzICYmICFnbG9iYWwubW9kdWxlICYmICghZ2xvYmFsLmRlZmluZSB8fCAhZ2xvYmFsLmRlZmluZS5hbWQpKSB7XG4gIGdsb2JhbC5Gb3Jtc3kgPSBGb3Jtc3k7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRm9ybXN5O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICBfdmFsdWU6IHRoaXMucHJvcHMudmFsdWUgPyB0aGlzLnByb3BzLnZhbHVlIDogJycsXG4gICAgICBfaXNWYWxpZDogdHJ1ZSxcbiAgICAgIF9pc1ByaXN0aW5lOiB0cnVlXG4gICAgfTtcbiAgfSxcbiAgY29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbiAoKSB7XG5cbiAgICB2YXIgY29uZmlndXJlID0gZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5zZXRWYWxpZGF0aW9ucyh0aGlzLnByb3BzLnZhbGlkYXRpb25zLCB0aGlzLnByb3BzLnJlcXVpcmVkKTtcbiAgICAgIHRoaXMucHJvcHMuX2F0dGFjaFRvRm9ybSh0aGlzKTtcbiAgICB9LmJpbmQodGhpcyk7XG5cbiAgICBpZiAoIXRoaXMucHJvcHMubmFtZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdGb3JtIElucHV0IHJlcXVpcmVzIGEgbmFtZSBwcm9wZXJ0eSB3aGVuIHVzZWQnKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMucHJvcHMuX2F0dGFjaFRvRm9ybSkge1xuICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNNb3VudGVkKCkpIHJldHVybjtcbiAgICAgICAgaWYgKCF0aGlzLnByb3BzLl9hdHRhY2hUb0Zvcm0pIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Zvcm0gTWl4aW4gcmVxdWlyZXMgY29tcG9uZW50IHRvIGJlIG5lc3RlZCBpbiBhIEZvcm0nKTtcbiAgICAgICAgfVxuICAgICAgICBjb25maWd1cmUoKTtcbiAgICAgIH0uYmluZCh0aGlzKSwgMCk7XG4gICAgfVxuICAgIGNvbmZpZ3VyZSgpO1xuXG4gIH0sXG5cbiAgLy8gV2UgaGF2ZSB0byBtYWtlIHRoZSB2YWxpZGF0ZSBtZXRob2QgaXMga2VwdCB3aGVuIG5ldyBwcm9wcyBhcmUgYWRkZWRcbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24gKG5leHRQcm9wcykge1xuICAgIG5leHRQcm9wcy5fYXR0YWNoVG9Gb3JtID0gdGhpcy5wcm9wcy5fYXR0YWNoVG9Gb3JtO1xuICAgIG5leHRQcm9wcy5fZGV0YWNoRnJvbUZvcm0gPSB0aGlzLnByb3BzLl9kZXRhY2hGcm9tRm9ybTtcbiAgICBuZXh0UHJvcHMuX3ZhbGlkYXRlID0gdGhpcy5wcm9wcy5fdmFsaWRhdGU7XG4gICAgdGhpcy5zZXRWYWxpZGF0aW9ucyhuZXh0UHJvcHMudmFsaWRhdGlvbnMsIG5leHRQcm9wcy5yZXF1aXJlZCk7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkVXBkYXRlOiBmdW5jdGlvbiAocHJldlByb3BzLCBwcmV2U3RhdGUpIHtcblxuICAgIHZhciBpc1ZhbHVlQ2hhbmdlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIFxuICAgICAgcmV0dXJuIChcbiAgICAgICAgdGhpcy5wcm9wcy52YWx1ZSAhPT0gcHJldlByb3BzLnZhbHVlICYmIChcbiAgICAgICAgICB0aGlzLnN0YXRlLl92YWx1ZSA9PT0gcHJldlByb3BzLnZhbHVlIHx8XG5cbiAgICAgICAgICAvLyBTaW5jZSB1bmRlZmluZWQgaXMgY29udmVydGVkIHRvIGVtcHR5IHN0cmluZyB3ZSBoYXZlIHRvXG4gICAgICAgICAgLy8gY2hlY2sgdGhhdCBzcGVjaWZpY2FsbHlcbiAgICAgICAgICAodGhpcy5zdGF0ZS5fdmFsdWUgPT09ICcnICYmIHByZXZQcm9wcy52YWx1ZSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICApXG4gICAgICApO1xuXG4gICAgfS5iaW5kKHRoaXMpO1xuXG5cbiAgICAvLyBJZiB2YWxpZGF0aW9ucyBoYXMgY2hhbmdlZCBvciBzb21ldGhpbmcgb3V0c2lkZSBjaGFuZ2VzIFxuICAgIC8vIHRoZSB2YWx1ZSwgc2V0IHRoZSB2YWx1ZSBhZ2FpbiBydW5uaW5nIGEgdmFsaWRhdGlvblxuXG4gICAgaWYgKHByZXZQcm9wcy52YWxpZGF0aW9ucyAhPT0gdGhpcy5wcm9wcy52YWxpZGF0aW9ucyB8fCBpc1ZhbHVlQ2hhbmdlZCgpKSB7XG4gICAgICB0aGlzLnNldFZhbHVlKHRoaXMucHJvcHMudmFsdWUgfHwgJycpO1xuICAgIH1cbiAgfSxcblxuICAvLyBEZXRhY2ggaXQgd2hlbiBjb21wb25lbnQgdW5tb3VudHNcbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnByb3BzLl9kZXRhY2hGcm9tRm9ybSh0aGlzKTtcbiAgfSxcblxuICBzZXRWYWxpZGF0aW9uczogZnVuY3Rpb24gKHZhbGlkYXRpb25zLCByZXF1aXJlZCkge1xuXG4gICAgLy8gQWRkIHZhbGlkYXRpb25zIHRvIHRoZSBzdG9yZSBpdHNlbGYgYXMgdGhlIHByb3BzIG9iamVjdCBjYW4gbm90IGJlIG1vZGlmaWVkXG4gICAgdGhpcy5fdmFsaWRhdGlvbnMgPSB2YWxpZGF0aW9ucyB8fCAnJztcblxuICAgIGlmIChyZXF1aXJlZCkge1xuICAgICAgdGhpcy5fdmFsaWRhdGlvbnMgPSB2YWxpZGF0aW9ucyA/IHZhbGlkYXRpb25zICsgJywnIDogJyc7XG4gICAgICB0aGlzLl92YWxpZGF0aW9ucyArPSAnaXNWYWx1ZSc7XG4gICAgfVxuXG4gIH0sXG5cbiAgLy8gV2UgdmFsaWRhdGUgYWZ0ZXIgdGhlIHZhbHVlIGhhcyBiZWVuIHNldFxuICBzZXRWYWx1ZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBfdmFsdWU6IHZhbHVlLFxuICAgICAgX2lzUHJpc3RpbmU6IGZhbHNlXG4gICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5wcm9wcy5fdmFsaWRhdGUodGhpcyk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgfSxcbiAgcmVzZXRWYWx1ZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgX3ZhbHVlOiAnJyxcbiAgICAgIF9pc1ByaXN0aW5lOiB0cnVlXG4gICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5wcm9wcy5fdmFsaWRhdGUodGhpcyk7XG4gICAgfSk7XG4gIH0sXG4gIGdldFZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUuX3ZhbHVlO1xuICB9LFxuICBoYXNWYWx1ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXRlLl92YWx1ZSAhPT0gJyc7XG4gIH0sXG4gIGdldEVycm9yTWVzc2FnZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmlzVmFsaWQoKSB8fCB0aGlzLnNob3dSZXF1aXJlZCgpID8gbnVsbCA6IHRoaXMuc3RhdGUuX3NlcnZlckVycm9yIHx8IHRoaXMucHJvcHMudmFsaWRhdGlvbkVycm9yO1xuICB9LFxuICBpc0Zvcm1EaXNhYmxlZDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLl9pc0Zvcm1EaXNhYmxlZCgpO1xuICB9LFxuICBpc1ZhbGlkOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUuX2lzVmFsaWQ7XG4gIH0sXG4gIGlzUHJpc3RpbmU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5faXNQcmlzdGluZTtcbiAgfSxcbiAgaXNSZXF1aXJlZDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAhIXRoaXMucHJvcHMucmVxdWlyZWQ7XG4gIH0sXG4gIHNob3dSZXF1aXJlZDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmlzUmVxdWlyZWQoKSAmJiB0aGlzLnN0YXRlLl92YWx1ZSA9PT0gJyc7XG4gIH0sXG4gIHNob3dFcnJvcjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAhdGhpcy5zaG93UmVxdWlyZWQoKSAmJiAhdGhpcy5zdGF0ZS5faXNWYWxpZDtcbiAgfVxufTtcbiIsInZhciBjc3JmVG9rZW5TZWxlY3RvciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ21ldGFbbmFtZT1cImNzcmYtdG9rZW5cIl0nKTtcblxudmFyIHRvVVJMRW5jb2RlZCA9IGZ1bmN0aW9uIChlbGVtZW50LCBrZXksIGxpc3QpIHtcbiAgdmFyIGxpc3QgPSBsaXN0IHx8IFtdO1xuICBpZiAodHlwZW9mIChlbGVtZW50KSA9PSAnb2JqZWN0Jykge1xuICAgIGZvciAodmFyIGlkeCBpbiBlbGVtZW50KVxuICAgICAgdG9VUkxFbmNvZGVkKGVsZW1lbnRbaWR4XSwga2V5ID8ga2V5ICsgJ1snICsgaWR4ICsgJ10nIDogaWR4LCBsaXN0KTtcbiAgfSBlbHNlIHtcbiAgICBsaXN0LnB1c2goa2V5ICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KGVsZW1lbnQpKTtcbiAgfVxuICByZXR1cm4gbGlzdC5qb2luKCcmJyk7XG59O1xuXG52YXIgcmVxdWVzdCA9IGZ1bmN0aW9uIChtZXRob2QsIHVybCwgZGF0YSwgY29udGVudFR5cGUsIGhlYWRlcnMpIHtcblxuICB2YXIgY29udGVudFR5cGUgPSBjb250ZW50VHlwZSA9PT0gJ3VybGVuY29kZWQnID8gJ2FwcGxpY2F0aW9uLycgKyBjb250ZW50VHlwZS5yZXBsYWNlKCd1cmxlbmNvZGVkJywgJ3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpIDogJ2FwcGxpY2F0aW9uL2pzb24nO1xuICBkYXRhID0gY29udGVudFR5cGUgPT09ICdhcHBsaWNhdGlvbi9qc29uJyA/IEpTT04uc3RyaW5naWZ5KGRhdGEpIDogdG9VUkxFbmNvZGVkKGRhdGEpO1xuXG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdHJ5IHtcbiAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgIHhoci5vcGVuKG1ldGhvZCwgdXJsLCB0cnVlKTtcbiAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdBY2NlcHQnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsIGNvbnRlbnRUeXBlKTtcblxuICAgICAgaWYgKCEhY3NyZlRva2VuU2VsZWN0b3IgJiYgISFjc3JmVG9rZW5TZWxlY3Rvci5jb250ZW50KSB7XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdYLUNTUkYtVG9rZW4nLCBjc3JmVG9rZW5TZWxlY3Rvci5jb250ZW50KTtcbiAgICAgIH1cblxuICAgICAgLy8gQWRkIHBhc3NlZCBoZWFkZXJzXG4gICAgICBPYmplY3Qua2V5cyhoZWFkZXJzKS5mb3JFYWNoKGZ1bmN0aW9uIChoZWFkZXIpIHtcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoaGVhZGVyLCBoZWFkZXJzW2hlYWRlcl0pO1xuICAgICAgfSk7XG5cbiAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCkge1xuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhciByZXNwb25zZSA9IHhoci5yZXNwb25zZVRleHQgPyBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpIDogbnVsbDtcbiAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgMzAwKSB7XG4gICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmVqZWN0KHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICB4aHIuc2VuZChkYXRhKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZWplY3QoZSk7XG4gICAgfVxuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhcnJheXNEaWZmZXI6IGZ1bmN0aW9uIChhcnJheUEsIGFycmF5Qikge1xuICAgIHZhciBpc0RpZmZlcmVudCA9IGZhbHNlO1xuICAgIGlmIChhcnJheUEubGVuZ3RoICE9PSBhcnJheUIubGVuZ3RoKSB7XG4gICAgICBpc0RpZmZlcmVudCA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFycmF5QS5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtLCBpbmRleCkge1xuICAgICAgICBpZiAoaXRlbSAhPT0gYXJyYXlCW2luZGV4XSkge1xuICAgICAgICAgIGlzRGlmZmVyZW50ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBpc0RpZmZlcmVudDtcbiAgfSxcbiAgYWpheDoge1xuICAgIHBvc3Q6IHJlcXVlc3QuYmluZChudWxsLCAnUE9TVCcpLFxuICAgIHB1dDogcmVxdWVzdC5iaW5kKG51bGwsICdQVVQnKVxuICB9XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICdpc1ZhbHVlJzogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlICE9PSAnJztcbiAgfSxcbiAgJ2lzRW1haWwnOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUubWF0Y2goL14oKChbYS16XXxcXGR8WyEjXFwkJSYnXFwqXFwrXFwtXFwvPVxcP1xcXl9ge1xcfH1+XXxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkrKFxcLihbYS16XXxcXGR8WyEjXFwkJSYnXFwqXFwrXFwtXFwvPVxcP1xcXl9ge1xcfH1+XXxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkrKSopfCgoXFx4MjIpKCgoKFxceDIwfFxceDA5KSooXFx4MGRcXHgwYSkpPyhcXHgyMHxcXHgwOSkrKT8oKFtcXHgwMS1cXHgwOFxceDBiXFx4MGNcXHgwZS1cXHgxZlxceDdmXXxcXHgyMXxbXFx4MjMtXFx4NWJdfFtcXHg1ZC1cXHg3ZV18W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pfChcXFxcKFtcXHgwMS1cXHgwOVxceDBiXFx4MGNcXHgwZC1cXHg3Zl18W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pKSkpKigoKFxceDIwfFxceDA5KSooXFx4MGRcXHgwYSkpPyhcXHgyMHxcXHgwOSkrKT8oXFx4MjIpKSlAKCgoW2Etel18XFxkfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKXwoKFthLXpdfFxcZHxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkoW2Etel18XFxkfC18XFwufF98fnxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkqKFthLXpdfFxcZHxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkpKVxcLikrKChbYS16XXxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSl8KChbYS16XXxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkoW2Etel18XFxkfC18XFwufF98fnxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkqKFthLXpdfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKSkpJC9pKTtcbiAgfSxcbiAgJ2lzVHJ1ZSc6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gdHJ1ZTtcbiAgfSxcbiAgJ2lzTnVtZXJpYyc6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgbWF0Y2hSZXN1bHRzID0gdmFsdWUubWF0Y2goL1stK10/KFxcZCpbLl0pP1xcZCsvKTtcbiAgICAgIGlmICghISBtYXRjaFJlc3VsdHMpIHtcbiAgICAgICAgcmV0dXJuIG1hdGNoUmVzdWx0c1swXSA9PSB2YWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gICdpc0FscGhhJzogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlLm1hdGNoKC9eW2EtekEtWl0rJC8pO1xuICB9LFxuICAnaXNXb3Jkcyc6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZS5tYXRjaCgvXlthLXpBLVpcXHNdKyQvKTtcbiAgfSxcbiAgJ2lzU3BlY2lhbFdvcmRzJzogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlLm1hdGNoKC9eW2EtekEtWlxcc1xcdTAwQzAtXFx1MDE3Rl0rJC8pO1xuICB9LFxuICBpc0xlbmd0aDogZnVuY3Rpb24gKHZhbHVlLCBtaW4sIG1heCkge1xuICAgIGlmIChtYXggIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHZhbHVlLmxlbmd0aCA+PSBtaW4gJiYgdmFsdWUubGVuZ3RoIDw9IG1heDtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlLmxlbmd0aCA+PSBtaW47XG4gIH0sXG4gIGVxdWFsczogZnVuY3Rpb24gKHZhbHVlLCBlcWwpIHtcbiAgICByZXR1cm4gdmFsdWUgPT0gZXFsO1xuICB9LFxuICBlcXVhbHNGaWVsZDogZnVuY3Rpb24gKHZhbHVlLCBmaWVsZCkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gdGhpc1tmaWVsZF07XG4gIH1cbn07XG4iXX0=
