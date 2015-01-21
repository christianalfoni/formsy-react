(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./src/main.js":[function(require,module,exports){
(function (global){
var React = global.React || require('react');
var Formsy = {};
var validationRules = {
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
    return value.match(/^-?[0-9]+$/)
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
  }
};

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
var ajax = {
  post: request.bind(null, 'POST'),
  put: request.bind(null, 'PUT')
};
var options = {};

Formsy.defaults = function (passedOptions) {
  options = passedOptions;
};

Formsy.Mixin = {
  getInitialState: function () {
    return {
      _value: this.props.value ? this.props.value : '',
      _isValid: true,
      _isPristine: true
    };
  },
  componentWillMount: function () {

    if (!this.props.name) {
      throw new Error('Form Input requires a name property when used');
    }

    if (!this.props._attachToForm) {
      throw new Error('Form Mixin requires component to be nested in a Form');
    }

    // Add validations to the store itself as the props object can not be modified
    this._validations = this.props.validations || '';

    if (this.props.required) {
      this._validations = this.props.validations ? this.props.validations + ',' : '';
      this._validations += 'isValue';
    }
    this.props._attachToForm(this);
  },

  // We have to make the validate method is kept when new props are added
  componentWillReceiveProps: function (nextProps) {
    nextProps._attachToForm = this.props._attachToForm;
    nextProps._detachFromForm = this.props._detachFromForm;
    nextProps._validate = this.props._validate;
  },

  // Detach it when component unmounts
  componentWillUnmount: function () {
    this.props._detachFromForm(this);
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

Formsy.addValidationRule = function (name, func) {
  validationRules[name] = func;
};

Formsy.Form = React.createClass({displayName: "Form",
  getInitialState: function () {
    return {
      isValid: true,
      isSubmitting: false
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
      onInvalid: function () {}
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

    var method = this.props.method && ajax[this.props.method.toLowerCase()] ? this.props.method.toLowerCase() : 'post';
    ajax[method](this.props.url, this.mapModel(), this.props.contentType || options.contentType || 'json', headers)
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

      if (child.props && child.props.name) {
        child.props._attachToForm = this.attachToForm;
        child.props._detachFromForm = this.detachFromForm;
        child.props._validate = this.validate;
      }

      if (child.props && child.props.children) {
        this.registerInputs(child.props.children);
      }

    }.bind(this));
  },

  getCurrentValues: function () {
    return Object.keys(this.inputs).reduce(function (data, name) {
      var component = this.inputs[name];
      data[name] = component.state._value;
      return data;
    }.bind(this), {});
  },

  setFormPristine: function(isPristine) {
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

      allIsValid && this.props.onValid();
      !allIsValid && this.props.onInvalid();

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

},{"react":"react"}]},{},["./src/main.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBSZWFjdCA9IGdsb2JhbC5SZWFjdCB8fCByZXF1aXJlKCdyZWFjdCcpO1xudmFyIEZvcm1zeSA9IHt9O1xudmFyIHZhbGlkYXRpb25SdWxlcyA9IHtcbiAgJ2lzVmFsdWUnOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgIT09ICcnO1xuICB9LFxuICAnaXNFbWFpbCc6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZS5tYXRjaCgvXigoKFthLXpdfFxcZHxbISNcXCQlJidcXCpcXCtcXC1cXC89XFw/XFxeX2B7XFx8fX5dfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKSsoXFwuKFthLXpdfFxcZHxbISNcXCQlJidcXCpcXCtcXC1cXC89XFw/XFxeX2B7XFx8fX5dfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKSspKil8KChcXHgyMikoKCgoXFx4MjB8XFx4MDkpKihcXHgwZFxceDBhKSk/KFxceDIwfFxceDA5KSspPygoW1xceDAxLVxceDA4XFx4MGJcXHgwY1xceDBlLVxceDFmXFx4N2ZdfFxceDIxfFtcXHgyMy1cXHg1Yl18W1xceDVkLVxceDdlXXxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSl8KFxcXFwoW1xceDAxLVxceDA5XFx4MGJcXHgwY1xceDBkLVxceDdmXXxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkpKSkqKCgoXFx4MjB8XFx4MDkpKihcXHgwZFxceDBhKSk/KFxceDIwfFxceDA5KSspPyhcXHgyMikpKUAoKChbYS16XXxcXGR8W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pfCgoW2Etel18XFxkfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKShbYS16XXxcXGR8LXxcXC58X3x+fFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKSooW2Etel18XFxkfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKSkpXFwuKSsoKFthLXpdfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKXwoKFthLXpdfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKShbYS16XXxcXGR8LXxcXC58X3x+fFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKSooW2Etel18W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pKSkkL2kpO1xuICB9LFxuICAnaXNUcnVlJzogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSB0cnVlO1xuICB9LFxuICAnaXNOdW1lcmljJzogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlLm1hdGNoKC9eLT9bMC05XSskLylcbiAgfSxcbiAgJ2lzQWxwaGEnOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUubWF0Y2goL15bYS16QS1aXSskLyk7XG4gIH0sXG4gICdpc1dvcmRzJzogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlLm1hdGNoKC9eW2EtekEtWlxcc10rJC8pO1xuICB9LFxuICAnaXNTcGVjaWFsV29yZHMnOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUubWF0Y2goL15bYS16QS1aXFxzXFx1MDBDMC1cXHUwMTdGXSskLyk7XG4gIH0sXG4gIGlzTGVuZ3RoOiBmdW5jdGlvbiAodmFsdWUsIG1pbiwgbWF4KSB7XG4gICAgaWYgKG1heCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdmFsdWUubGVuZ3RoID49IG1pbiAmJiB2YWx1ZS5sZW5ndGggPD0gbWF4O1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWUubGVuZ3RoID49IG1pbjtcbiAgfSxcbiAgZXF1YWxzOiBmdW5jdGlvbiAodmFsdWUsIGVxbCkge1xuICAgIHJldHVybiB2YWx1ZSA9PSBlcWw7XG4gIH1cbn07XG5cbnZhciB0b1VSTEVuY29kZWQgPSBmdW5jdGlvbiAoZWxlbWVudCwga2V5LCBsaXN0KSB7XG4gIHZhciBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgaWYgKHR5cGVvZiAoZWxlbWVudCkgPT0gJ29iamVjdCcpIHtcbiAgICBmb3IgKHZhciBpZHggaW4gZWxlbWVudClcbiAgICAgIHRvVVJMRW5jb2RlZChlbGVtZW50W2lkeF0sIGtleSA/IGtleSArICdbJyArIGlkeCArICddJyA6IGlkeCwgbGlzdCk7XG4gIH0gZWxzZSB7XG4gICAgbGlzdC5wdXNoKGtleSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudChlbGVtZW50KSk7XG4gIH1cbiAgcmV0dXJuIGxpc3Quam9pbignJicpO1xufTtcblxudmFyIHJlcXVlc3QgPSBmdW5jdGlvbiAobWV0aG9kLCB1cmwsIGRhdGEsIGNvbnRlbnRUeXBlLCBoZWFkZXJzKSB7XG5cbiAgdmFyIGNvbnRlbnRUeXBlID0gY29udGVudFR5cGUgPT09ICd1cmxlbmNvZGVkJyA/ICdhcHBsaWNhdGlvbi8nICsgY29udGVudFR5cGUucmVwbGFjZSgndXJsZW5jb2RlZCcsICd4LXd3dy1mb3JtLXVybGVuY29kZWQnKSA6ICdhcHBsaWNhdGlvbi9qc29uJztcbiAgZGF0YSA9IGNvbnRlbnRUeXBlID09PSAnYXBwbGljYXRpb24vanNvbicgPyBKU09OLnN0cmluZ2lmeShkYXRhKSA6IHRvVVJMRW5jb2RlZChkYXRhKTtcblxuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHRyeSB7XG4gICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICB4aHIub3BlbihtZXRob2QsIHVybCwgdHJ1ZSk7XG4gICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQWNjZXB0JywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCBjb250ZW50VHlwZSk7XG5cbiAgICAgIC8vIEFkZCBwYXNzZWQgaGVhZGVyc1xuICAgICAgT2JqZWN0LmtleXMoaGVhZGVycykuZm9yRWFjaChmdW5jdGlvbiAoaGVhZGVyKSB7XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGhlYWRlciwgaGVhZGVyc1toZWFkZXJdKTtcbiAgICAgIH0pO1xuXG4gICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQpIHtcblxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSB4aHIucmVzcG9uc2VUZXh0ID8gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KSA6IG51bGw7XG4gICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDMwMCkge1xuICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJlamVjdChyZXNwb25zZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgeGhyLnNlbmQoZGF0YSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmVqZWN0KGUpO1xuICAgIH1cbiAgfSk7XG5cbn07XG52YXIgYWpheCA9IHtcbiAgcG9zdDogcmVxdWVzdC5iaW5kKG51bGwsICdQT1NUJyksXG4gIHB1dDogcmVxdWVzdC5iaW5kKG51bGwsICdQVVQnKVxufTtcbnZhciBvcHRpb25zID0ge307XG5cbkZvcm1zeS5kZWZhdWx0cyA9IGZ1bmN0aW9uIChwYXNzZWRPcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBwYXNzZWRPcHRpb25zO1xufTtcblxuRm9ybXN5Lk1peGluID0ge1xuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgX3ZhbHVlOiB0aGlzLnByb3BzLnZhbHVlID8gdGhpcy5wcm9wcy52YWx1ZSA6ICcnLFxuICAgICAgX2lzVmFsaWQ6IHRydWUsXG4gICAgICBfaXNQcmlzdGluZTogdHJ1ZVxuICAgIH07XG4gIH0sXG4gIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24gKCkge1xuXG4gICAgaWYgKCF0aGlzLnByb3BzLm5hbWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRm9ybSBJbnB1dCByZXF1aXJlcyBhIG5hbWUgcHJvcGVydHkgd2hlbiB1c2VkJyk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnByb3BzLl9hdHRhY2hUb0Zvcm0pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRm9ybSBNaXhpbiByZXF1aXJlcyBjb21wb25lbnQgdG8gYmUgbmVzdGVkIGluIGEgRm9ybScpO1xuICAgIH1cblxuICAgIC8vIEFkZCB2YWxpZGF0aW9ucyB0byB0aGUgc3RvcmUgaXRzZWxmIGFzIHRoZSBwcm9wcyBvYmplY3QgY2FuIG5vdCBiZSBtb2RpZmllZFxuICAgIHRoaXMuX3ZhbGlkYXRpb25zID0gdGhpcy5wcm9wcy52YWxpZGF0aW9ucyB8fCAnJztcblxuICAgIGlmICh0aGlzLnByb3BzLnJlcXVpcmVkKSB7XG4gICAgICB0aGlzLl92YWxpZGF0aW9ucyA9IHRoaXMucHJvcHMudmFsaWRhdGlvbnMgPyB0aGlzLnByb3BzLnZhbGlkYXRpb25zICsgJywnIDogJyc7XG4gICAgICB0aGlzLl92YWxpZGF0aW9ucyArPSAnaXNWYWx1ZSc7XG4gICAgfVxuICAgIHRoaXMucHJvcHMuX2F0dGFjaFRvRm9ybSh0aGlzKTtcbiAgfSxcblxuICAvLyBXZSBoYXZlIHRvIG1ha2UgdGhlIHZhbGlkYXRlIG1ldGhvZCBpcyBrZXB0IHdoZW4gbmV3IHByb3BzIGFyZSBhZGRlZFxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbiAobmV4dFByb3BzKSB7XG4gICAgbmV4dFByb3BzLl9hdHRhY2hUb0Zvcm0gPSB0aGlzLnByb3BzLl9hdHRhY2hUb0Zvcm07XG4gICAgbmV4dFByb3BzLl9kZXRhY2hGcm9tRm9ybSA9IHRoaXMucHJvcHMuX2RldGFjaEZyb21Gb3JtO1xuICAgIG5leHRQcm9wcy5fdmFsaWRhdGUgPSB0aGlzLnByb3BzLl92YWxpZGF0ZTtcbiAgfSxcblxuICAvLyBEZXRhY2ggaXQgd2hlbiBjb21wb25lbnQgdW5tb3VudHNcbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnByb3BzLl9kZXRhY2hGcm9tRm9ybSh0aGlzKTtcbiAgfSxcblxuICAvLyBXZSB2YWxpZGF0ZSBhZnRlciB0aGUgdmFsdWUgaGFzIGJlZW4gc2V0XG4gIHNldFZhbHVlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIF92YWx1ZTogdmFsdWUsXG4gICAgICBfaXNQcmlzdGluZTogZmFsc2VcbiAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLnByb3BzLl92YWxpZGF0ZSh0aGlzKTtcbiAgICB9LmJpbmQodGhpcykpO1xuICB9LFxuICByZXNldFZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBfdmFsdWU6ICcnLFxuICAgICAgX2lzUHJpc3RpbmU6IHRydWVcbiAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLnByb3BzLl92YWxpZGF0ZSh0aGlzKTtcbiAgICB9KTtcbiAgfSxcbiAgZ2V0VmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5fdmFsdWU7XG4gIH0sXG4gIGhhc1ZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUuX3ZhbHVlICE9PSAnJztcbiAgfSxcbiAgZ2V0RXJyb3JNZXNzYWdlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNWYWxpZCgpIHx8IHRoaXMuc2hvd1JlcXVpcmVkKCkgPyBudWxsIDogdGhpcy5zdGF0ZS5fc2VydmVyRXJyb3IgfHwgdGhpcy5wcm9wcy52YWxpZGF0aW9uRXJyb3I7XG4gIH0sXG4gIGlzVmFsaWQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5faXNWYWxpZDtcbiAgfSxcbiAgaXNQcmlzdGluZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXRlLl9pc1ByaXN0aW5lO1xuICB9LFxuICBpc1JlcXVpcmVkOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICEhdGhpcy5wcm9wcy5yZXF1aXJlZDtcbiAgfSxcbiAgc2hvd1JlcXVpcmVkOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNSZXF1aXJlZCgpICYmIHRoaXMuc3RhdGUuX3ZhbHVlID09PSAnJztcbiAgfSxcbiAgc2hvd0Vycm9yOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICF0aGlzLnNob3dSZXF1aXJlZCgpICYmICF0aGlzLnN0YXRlLl9pc1ZhbGlkO1xuICB9XG59O1xuXG5Gb3Jtc3kuYWRkVmFsaWRhdGlvblJ1bGUgPSBmdW5jdGlvbiAobmFtZSwgZnVuYykge1xuICB2YWxpZGF0aW9uUnVsZXNbbmFtZV0gPSBmdW5jO1xufTtcblxuRm9ybXN5LkZvcm0gPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiRm9ybVwiLFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaXNWYWxpZDogdHJ1ZSxcbiAgICAgIGlzU3VibWl0dGluZzogZmFsc2VcbiAgICB9O1xuICB9LFxuICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaGVhZGVyczoge30sXG4gICAgICBvblN1Y2Nlc3M6IGZ1bmN0aW9uICgpIHt9LFxuICAgICAgb25FcnJvcjogZnVuY3Rpb24gKCkge30sXG4gICAgICBvblN1Ym1pdDogZnVuY3Rpb24gKCkge30sXG4gICAgICBvblN1Ym1pdHRlZDogZnVuY3Rpb24gKCkge30sXG4gICAgICBvblZhbGlkOiBmdW5jdGlvbiAoKSB7fSxcbiAgICAgIG9uSW52YWxpZDogZnVuY3Rpb24gKCkge31cbiAgICB9O1xuICB9LFxuXG4gIC8vIEFkZCBhIG1hcCB0byBzdG9yZSB0aGUgaW5wdXRzIG9mIHRoZSBmb3JtLCBhIG1vZGVsIHRvIHN0b3JlXG4gIC8vIHRoZSB2YWx1ZXMgb2YgdGhlIGZvcm0gYW5kIHJlZ2lzdGVyIGNoaWxkIGlucHV0c1xuICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmlucHV0cyA9IHt9O1xuICAgIHRoaXMubW9kZWwgPSB7fTtcbiAgICB0aGlzLnJlZ2lzdGVySW5wdXRzKHRoaXMucHJvcHMuY2hpbGRyZW4pO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy52YWxpZGF0ZUZvcm0oKTtcbiAgfSxcblxuICAvLyBVcGRhdGUgbW9kZWwsIHN1Ym1pdCB0byB1cmwgcHJvcCBhbmQgc2VuZCB0aGUgbW9kZWxcbiAgc3VibWl0OiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgLy8gVHJpZ2dlciBmb3JtIGFzIG5vdCBwcmlzdGluZS5cbiAgICAvLyBJZiBhbnkgaW5wdXRzIGhhdmUgbm90IGJlZW4gdG91Y2hlZCB5ZXQgdGhpcyB3aWxsIG1ha2UgdGhlbSBkaXJ0eVxuICAgIC8vIHNvIHZhbGlkYXRpb24gYmVjb21lcyB2aXNpYmxlIChpZiBiYXNlZCBvbiBpc1ByaXN0aW5lKVxuICAgIHRoaXMuc2V0Rm9ybVByaXN0aW5lKGZhbHNlKTtcblxuICAgIC8vIFRvIHN1cHBvcnQgdXNlIGNhc2VzIHdoZXJlIG5vIGFzeW5jIG9yIHJlcXVlc3Qgb3BlcmF0aW9uIGlzIG5lZWRlZC5cbiAgICAvLyBUaGUgXCJvblN1Ym1pdFwiIGNhbGxiYWNrIGlzIGNhbGxlZCB3aXRoIHRoZSBtb2RlbCBlLmcuIHtmaWVsZE5hbWU6IFwibXlWYWx1ZVwifSxcbiAgICAvLyBpZiB3YW50aW5nIHRvIHJlc2V0IHRoZSBlbnRpcmUgZm9ybSB0byBvcmlnaW5hbCBzdGF0ZSwgdGhlIHNlY29uZCBwYXJhbSBpcyBhIGNhbGxiYWNrIGZvciB0aGlzLlxuICAgIGlmICghdGhpcy5wcm9wcy51cmwpIHtcbiAgICAgIHRoaXMudXBkYXRlTW9kZWwoKTtcbiAgICAgIHRoaXMucHJvcHMub25TdWJtaXQodGhpcy5tYXBNb2RlbCgpLCB0aGlzLnJlc2V0TW9kZWwsIHRoaXMudXBkYXRlSW5wdXRzV2l0aEVycm9yKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZU1vZGVsKCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpc1N1Ym1pdHRpbmc6IHRydWVcbiAgICB9KTtcblxuICAgIHRoaXMucHJvcHMub25TdWJtaXQodGhpcy5tYXBNb2RlbCgpLCB0aGlzLnJlc2V0TW9kZWwsIHRoaXMudXBkYXRlSW5wdXRzV2l0aEVycm9yKTtcblxuICAgIHZhciBoZWFkZXJzID0gKE9iamVjdC5rZXlzKHRoaXMucHJvcHMuaGVhZGVycykubGVuZ3RoICYmIHRoaXMucHJvcHMuaGVhZGVycykgfHwgb3B0aW9ucy5oZWFkZXJzIHx8IHt9O1xuXG4gICAgdmFyIG1ldGhvZCA9IHRoaXMucHJvcHMubWV0aG9kICYmIGFqYXhbdGhpcy5wcm9wcy5tZXRob2QudG9Mb3dlckNhc2UoKV0gPyB0aGlzLnByb3BzLm1ldGhvZC50b0xvd2VyQ2FzZSgpIDogJ3Bvc3QnO1xuICAgIGFqYXhbbWV0aG9kXSh0aGlzLnByb3BzLnVybCwgdGhpcy5tYXBNb2RlbCgpLCB0aGlzLnByb3BzLmNvbnRlbnRUeXBlIHx8IG9wdGlvbnMuY29udGVudFR5cGUgfHwgJ2pzb24nLCBoZWFkZXJzKVxuICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIHRoaXMucHJvcHMub25TdWNjZXNzKHJlc3BvbnNlKTtcbiAgICAgICAgdGhpcy5wcm9wcy5vblN1Ym1pdHRlZCgpO1xuICAgICAgfS5iaW5kKHRoaXMpKVxuICAgICAgLmNhdGNoKHRoaXMuZmFpbFN1Ym1pdCk7XG4gIH0sXG5cbiAgbWFwTW9kZWw6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5tYXBwaW5nID8gdGhpcy5wcm9wcy5tYXBwaW5nKHRoaXMubW9kZWwpIDogdGhpcy5tb2RlbDtcbiAgfSxcblxuICAvLyBHb2VzIHRocm91Z2ggYWxsIHJlZ2lzdGVyZWQgY29tcG9uZW50cyBhbmRcbiAgLy8gdXBkYXRlcyB0aGUgbW9kZWwgdmFsdWVzXG4gIHVwZGF0ZU1vZGVsOiBmdW5jdGlvbiAoKSB7XG4gICAgT2JqZWN0LmtleXModGhpcy5pbnB1dHMpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgIHZhciBjb21wb25lbnQgPSB0aGlzLmlucHV0c1tuYW1lXTtcbiAgICAgIHRoaXMubW9kZWxbbmFtZV0gPSBjb21wb25lbnQuc3RhdGUuX3ZhbHVlO1xuICAgIH0uYmluZCh0aGlzKSk7XG4gIH0sXG5cbiAgLy8gUmVzZXQgZWFjaCBrZXkgaW4gdGhlIG1vZGVsIHRvIHRoZSBvcmlnaW5hbCAvIGluaXRpYWwgdmFsdWVcbiAgcmVzZXRNb2RlbDogZnVuY3Rpb24gKCkge1xuICAgIE9iamVjdC5rZXlzKHRoaXMuaW5wdXRzKS5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICB0aGlzLmlucHV0c1tuYW1lXS5yZXNldFZhbHVlKCk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLnZhbGlkYXRlRm9ybSgpO1xuICB9LFxuXG4gIC8vIEdvIHRocm91Z2ggZXJyb3JzIGZyb20gc2VydmVyIGFuZCBncmFiIHRoZSBjb21wb25lbnRzXG4gIC8vIHN0b3JlZCBpbiB0aGUgaW5wdXRzIG1hcC4gQ2hhbmdlIHRoZWlyIHN0YXRlIHRvIGludmFsaWRcbiAgLy8gYW5kIHNldCB0aGUgc2VydmVyRXJyb3IgbWVzc2FnZVxuICB1cGRhdGVJbnB1dHNXaXRoRXJyb3I6IGZ1bmN0aW9uIChlcnJvcnMpIHtcbiAgICBPYmplY3Qua2V5cyhlcnJvcnMpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUsIGluZGV4KSB7XG4gICAgICB2YXIgY29tcG9uZW50ID0gdGhpcy5pbnB1dHNbbmFtZV07XG5cbiAgICAgIGlmICghY29tcG9uZW50KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignWW91IGFyZSB0cnlpbmcgdG8gdXBkYXRlIGFuIGlucHV0IHRoYXQgZG9lcyBub3QgZXhpc3RzLiBWZXJpZnkgZXJyb3JzIG9iamVjdCB3aXRoIGlucHV0IG5hbWVzLiAnICsgSlNPTi5zdHJpbmdpZnkoZXJyb3JzKSk7XG4gICAgICB9XG5cbiAgICAgIHZhciBhcmdzID0gW3tcbiAgICAgICAgX2lzVmFsaWQ6IGZhbHNlLFxuICAgICAgICBfc2VydmVyRXJyb3I6IGVycm9yc1tuYW1lXVxuICAgICAgfV07XG4gICAgICBjb21wb25lbnQuc2V0U3RhdGUuYXBwbHkoY29tcG9uZW50LCBhcmdzKTtcbiAgICB9LmJpbmQodGhpcykpO1xuICB9LFxuXG4gIGZhaWxTdWJtaXQ6IGZ1bmN0aW9uIChlcnJvcnMpIHtcbiAgICB0aGlzLnVwZGF0ZUlucHV0c1dpdGhFcnJvcihlcnJvcnMpO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaXNTdWJtaXR0aW5nOiBmYWxzZVxuICAgIH0pO1xuICAgIHRoaXMucHJvcHMub25FcnJvcihlcnJvcnMpO1xuICAgIHRoaXMucHJvcHMub25TdWJtaXR0ZWQoKTtcbiAgfSxcblxuICAvLyBUcmF2ZXJzZSB0aGUgY2hpbGRyZW4gYW5kIGNoaWxkcmVuIG9mIGNoaWxkcmVuIHRvIGZpbmRcbiAgLy8gYWxsIGlucHV0cyBieSBjaGVja2luZyB0aGUgbmFtZSBwcm9wLiBNYXliZSBkbyBhIGJldHRlclxuICAvLyBjaGVjayBoZXJlXG4gIHJlZ2lzdGVySW5wdXRzOiBmdW5jdGlvbiAoY2hpbGRyZW4pIHtcbiAgICBSZWFjdC5DaGlsZHJlbi5mb3JFYWNoKGNoaWxkcmVuLCBmdW5jdGlvbiAoY2hpbGQpIHtcblxuICAgICAgaWYgKGNoaWxkLnByb3BzICYmIGNoaWxkLnByb3BzLm5hbWUpIHtcbiAgICAgICAgY2hpbGQucHJvcHMuX2F0dGFjaFRvRm9ybSA9IHRoaXMuYXR0YWNoVG9Gb3JtO1xuICAgICAgICBjaGlsZC5wcm9wcy5fZGV0YWNoRnJvbUZvcm0gPSB0aGlzLmRldGFjaEZyb21Gb3JtO1xuICAgICAgICBjaGlsZC5wcm9wcy5fdmFsaWRhdGUgPSB0aGlzLnZhbGlkYXRlO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2hpbGQucHJvcHMgJiYgY2hpbGQucHJvcHMuY2hpbGRyZW4pIHtcbiAgICAgICAgdGhpcy5yZWdpc3RlcklucHV0cyhjaGlsZC5wcm9wcy5jaGlsZHJlbik7XG4gICAgICB9XG5cbiAgICB9LmJpbmQodGhpcykpO1xuICB9LFxuXG4gIGdldEN1cnJlbnRWYWx1ZXM6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5pbnB1dHMpLnJlZHVjZShmdW5jdGlvbiAoZGF0YSwgbmFtZSkge1xuICAgICAgdmFyIGNvbXBvbmVudCA9IHRoaXMuaW5wdXRzW25hbWVdO1xuICAgICAgZGF0YVtuYW1lXSA9IGNvbXBvbmVudC5zdGF0ZS5fdmFsdWU7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9LmJpbmQodGhpcyksIHt9KTtcbiAgfSxcblxuICBzZXRGb3JtUHJpc3RpbmU6IGZ1bmN0aW9uKGlzUHJpc3RpbmUpIHtcbiAgICB2YXIgaW5wdXRzID0gdGhpcy5pbnB1dHM7XG4gICAgdmFyIGlucHV0S2V5cyA9IE9iamVjdC5rZXlzKGlucHV0cyk7XG5cbiAgICAvLyBJdGVyYXRlIHRocm91Z2ggZWFjaCBjb21wb25lbnQgYW5kIHNldCBpdCBhcyBwcmlzdGluZVxuICAgIC8vIG9yIFwiZGlydHlcIi5cbiAgICBpbnB1dEtleXMuZm9yRWFjaChmdW5jdGlvbiAobmFtZSwgaW5kZXgpIHtcbiAgICAgIHZhciBjb21wb25lbnQgPSBpbnB1dHNbbmFtZV07XG4gICAgICBjb21wb25lbnQuc2V0U3RhdGUoe1xuICAgICAgICBfaXNQcmlzdGluZTogaXNQcmlzdGluZVxuICAgICAgfSk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgfSxcblxuICAvLyBVc2UgdGhlIGJpbmRlZCB2YWx1ZXMgYW5kIHRoZSBhY3R1YWwgaW5wdXQgdmFsdWUgdG9cbiAgLy8gdmFsaWRhdGUgdGhlIGlucHV0IGFuZCBzZXQgaXRzIHN0YXRlLiBUaGVuIGNoZWNrIHRoZVxuICAvLyBzdGF0ZSBvZiB0aGUgZm9ybSBpdHNlbGZcbiAgdmFsaWRhdGU6IGZ1bmN0aW9uIChjb21wb25lbnQpIHtcblxuICAgIGlmICghY29tcG9uZW50LnByb3BzLnJlcXVpcmVkICYmICFjb21wb25lbnQuX3ZhbGlkYXRpb25zKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gUnVuIHRocm91Z2ggdGhlIHZhbGlkYXRpb25zLCBzcGxpdCB0aGVtIHVwIGFuZCBjYWxsXG4gICAgLy8gdGhlIHZhbGlkYXRvciBJRiB0aGVyZSBpcyBhIHZhbHVlIG9yIGl0IGlzIHJlcXVpcmVkXG4gICAgdmFyIGlzVmFsaWQgPSB0aGlzLnJ1blZhbGlkYXRpb24oY29tcG9uZW50KTtcblxuICAgIGNvbXBvbmVudC5zZXRTdGF0ZSh7XG4gICAgICBfaXNWYWxpZDogaXNWYWxpZCxcbiAgICAgIF9zZXJ2ZXJFcnJvcjogbnVsbFxuICAgIH0sIHRoaXMudmFsaWRhdGVGb3JtKTtcblxuICB9LFxuXG4gIHJ1blZhbGlkYXRpb246IGZ1bmN0aW9uIChjb21wb25lbnQpIHtcbiAgICB2YXIgaXNWYWxpZCA9IHRydWU7XG4gICAgaWYgKGNvbXBvbmVudC5fdmFsaWRhdGlvbnMubGVuZ3RoICYmIChjb21wb25lbnQucHJvcHMucmVxdWlyZWQgfHwgY29tcG9uZW50LnN0YXRlLl92YWx1ZSAhPT0gJycpKSB7XG4gICAgICBjb21wb25lbnQuX3ZhbGlkYXRpb25zLnNwbGl0KCcsJykuZm9yRWFjaChmdW5jdGlvbiAodmFsaWRhdGlvbikge1xuICAgICAgICB2YXIgYXJncyA9IHZhbGlkYXRpb24uc3BsaXQoJzonKTtcbiAgICAgICAgdmFyIHZhbGlkYXRlTWV0aG9kID0gYXJncy5zaGlmdCgpO1xuICAgICAgICBhcmdzID0gYXJncy5tYXAoZnVuY3Rpb24gKGFyZykge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShhcmcpO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHJldHVybiBhcmc7IC8vIEl0IGlzIGEgc3RyaW5nIGlmIGl0IGNhbiBub3QgcGFyc2UgaXRcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBhcmdzID0gW2NvbXBvbmVudC5zdGF0ZS5fdmFsdWVdLmNvbmNhdChhcmdzKTtcbiAgICAgICAgaWYgKCF2YWxpZGF0aW9uUnVsZXNbdmFsaWRhdGVNZXRob2RdKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdGb3Jtc3kgZG9lcyBub3QgaGF2ZSB0aGUgdmFsaWRhdGlvbiBydWxlOiAnICsgdmFsaWRhdGVNZXRob2QpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdmFsaWRhdGlvblJ1bGVzW3ZhbGlkYXRlTWV0aG9kXS5hcHBseSh0aGlzLmdldEN1cnJlbnRWYWx1ZXMoKSwgYXJncykpIHtcbiAgICAgICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgfVxuICAgIHJldHVybiBpc1ZhbGlkO1xuICB9LFxuXG4gIC8vIFZhbGlkYXRlIHRoZSBmb3JtIGJ5IGdvaW5nIHRocm91Z2ggYWxsIGNoaWxkIGlucHV0IGNvbXBvbmVudHNcbiAgLy8gYW5kIGNoZWNrIHRoZWlyIHN0YXRlXG4gIHZhbGlkYXRlRm9ybTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBhbGxJc1ZhbGlkID0gdHJ1ZTtcbiAgICB2YXIgaW5wdXRzID0gdGhpcy5pbnB1dHM7XG4gICAgdmFyIGlucHV0S2V5cyA9IE9iamVjdC5rZXlzKGlucHV0cyk7XG5cbiAgICAvLyBXZSBuZWVkIGEgY2FsbGJhY2sgYXMgd2UgYXJlIHZhbGlkYXRpbmcgYWxsIGlucHV0cyBhZ2Fpbi4gVGhpcyB3aWxsXG4gICAgLy8gcnVuIHdoZW4gdGhlIGxhc3QgY29tcG9uZW50IGhhcyBzZXQgaXRzIHN0YXRlXG4gICAgdmFyIG9uVmFsaWRhdGlvbkNvbXBsZXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgaW5wdXRLZXlzLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgaWYgKCFpbnB1dHNbbmFtZV0uc3RhdGUuX2lzVmFsaWQpIHtcbiAgICAgICAgICBhbGxJc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBpc1ZhbGlkOiBhbGxJc1ZhbGlkXG4gICAgICB9KTtcblxuICAgICAgYWxsSXNWYWxpZCAmJiB0aGlzLnByb3BzLm9uVmFsaWQoKTtcbiAgICAgICFhbGxJc1ZhbGlkICYmIHRoaXMucHJvcHMub25JbnZhbGlkKCk7XG5cbiAgICB9LmJpbmQodGhpcyk7XG5cbiAgICAvLyBSdW4gdmFsaWRhdGlvbiBhZ2FpbiBpbiBjYXNlIGFmZmVjdGVkIGJ5IG90aGVyIGlucHV0cy4gVGhlXG4gICAgLy8gbGFzdCBjb21wb25lbnQgdmFsaWRhdGVkIHdpbGwgcnVuIHRoZSBvblZhbGlkYXRpb25Db21wbGV0ZSBjYWxsYmFja1xuICAgIGlucHV0S2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lLCBpbmRleCkge1xuICAgICAgdmFyIGNvbXBvbmVudCA9IGlucHV0c1tuYW1lXTtcbiAgICAgIHZhciBpc1ZhbGlkID0gdGhpcy5ydW5WYWxpZGF0aW9uKGNvbXBvbmVudCk7XG4gICAgICBjb21wb25lbnQuc2V0U3RhdGUoe1xuICAgICAgICBfaXNWYWxpZDogaXNWYWxpZCxcbiAgICAgICAgX3NlcnZlckVycm9yOiBudWxsXG4gICAgICB9LCBpbmRleCA9PT0gaW5wdXRLZXlzLmxlbmd0aCAtIDEgPyBvblZhbGlkYXRpb25Db21wbGV0ZSA6IG51bGwpO1xuICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgfSxcblxuICAvLyBNZXRob2QgcHV0IG9uIGVhY2ggaW5wdXQgY29tcG9uZW50IHRvIHJlZ2lzdGVyXG4gIC8vIGl0c2VsZiB0byB0aGUgZm9ybVxuICBhdHRhY2hUb0Zvcm06IGZ1bmN0aW9uIChjb21wb25lbnQpIHtcbiAgICB0aGlzLmlucHV0c1tjb21wb25lbnQucHJvcHMubmFtZV0gPSBjb21wb25lbnQ7XG4gICAgdGhpcy5tb2RlbFtjb21wb25lbnQucHJvcHMubmFtZV0gPSBjb21wb25lbnQuc3RhdGUuX3ZhbHVlO1xuICAgIHRoaXMudmFsaWRhdGUoY29tcG9uZW50KTtcbiAgfSxcblxuICAvLyBNZXRob2QgcHV0IG9uIGVhY2ggaW5wdXQgY29tcG9uZW50IHRvIHVucmVnaXN0ZXJcbiAgLy8gaXRzZWxmIGZyb20gdGhlIGZvcm1cbiAgZGV0YWNoRnJvbUZvcm06IGZ1bmN0aW9uIChjb21wb25lbnQpIHtcbiAgICBkZWxldGUgdGhpcy5pbnB1dHNbY29tcG9uZW50LnByb3BzLm5hbWVdO1xuICAgIGRlbGV0ZSB0aGlzLm1vZGVsW2NvbXBvbmVudC5wcm9wcy5uYW1lXTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG5cbiAgICByZXR1cm4gUmVhY3QuRE9NLmZvcm0oe1xuICAgICAgICBvblN1Ym1pdDogdGhpcy5zdWJtaXQsXG4gICAgICAgIGNsYXNzTmFtZTogdGhpcy5wcm9wcy5jbGFzc05hbWVcbiAgICAgIH0sXG4gICAgICB0aGlzLnByb3BzLmNoaWxkcmVuXG4gICAgKTtcblxuICB9XG59KTtcblxuaWYgKCFnbG9iYWwuZXhwb3J0cyAmJiAhZ2xvYmFsLm1vZHVsZSAmJiAoIWdsb2JhbC5kZWZpbmUgfHwgIWdsb2JhbC5kZWZpbmUuYW1kKSkge1xuICBnbG9iYWwuRm9ybXN5ID0gRm9ybXN5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEZvcm1zeTtcbiJdfQ==
