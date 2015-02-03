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
    if (typeof value === 'number') {
      return true;
    } else {
      return value.match(/^-?[0-9]+$/);
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

var arraysDiffer = function (arrayA, arrayB) {
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

    var configure = function () {
      // Add validations to the store itself as the props object can not be modified
      this._validations = this.props.validations || '';

      if (this.props.required) {
        this._validations = this.props.validations ? this.props.validations + ',' : '';
        this._validations += 'isValue';
      }
      this.props._attachToForm(this);
    }.bind(this);

    if (!this.props.name) {
      throw new Error('Form Input requires a name property when used');
    }

    if (!this.props._attachToForm) {
      return setTimeout(function () {
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
      this.registerInputs(this.props.children);

      var newInputKeys = Object.keys(this.inputs);
      if (arraysDiffer(inputKeys, newInputKeys)) {
        this.validateForm();
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
    this.state.canChange && this.props.onChange && this.props.onChange(this.getCurrentValues());

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

      // Tell the form that it can start to trigger change events
      this.setState({canChange: true});

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

    // If there are no inputs, it is ready to trigger change events
    if (!inputKeys.length) {
      this.setState({canChange: true});
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

},{"react":"react"}]},{},["./src/main.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgUmVhY3QgPSBnbG9iYWwuUmVhY3QgfHwgcmVxdWlyZSgncmVhY3QnKTtcbnZhciBGb3Jtc3kgPSB7fTtcbnZhciB2YWxpZGF0aW9uUnVsZXMgPSB7XG4gICdpc1ZhbHVlJzogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlICE9PSAnJztcbiAgfSxcbiAgJ2lzRW1haWwnOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUubWF0Y2goL14oKChbYS16XXxcXGR8WyEjXFwkJSYnXFwqXFwrXFwtXFwvPVxcP1xcXl9ge1xcfH1+XXxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkrKFxcLihbYS16XXxcXGR8WyEjXFwkJSYnXFwqXFwrXFwtXFwvPVxcP1xcXl9ge1xcfH1+XXxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkrKSopfCgoXFx4MjIpKCgoKFxceDIwfFxceDA5KSooXFx4MGRcXHgwYSkpPyhcXHgyMHxcXHgwOSkrKT8oKFtcXHgwMS1cXHgwOFxceDBiXFx4MGNcXHgwZS1cXHgxZlxceDdmXXxcXHgyMXxbXFx4MjMtXFx4NWJdfFtcXHg1ZC1cXHg3ZV18W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pfChcXFxcKFtcXHgwMS1cXHgwOVxceDBiXFx4MGNcXHgwZC1cXHg3Zl18W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pKSkpKigoKFxceDIwfFxceDA5KSooXFx4MGRcXHgwYSkpPyhcXHgyMHxcXHgwOSkrKT8oXFx4MjIpKSlAKCgoW2Etel18XFxkfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKXwoKFthLXpdfFxcZHxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkoW2Etel18XFxkfC18XFwufF98fnxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkqKFthLXpdfFxcZHxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkpKVxcLikrKChbYS16XXxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSl8KChbYS16XXxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkoW2Etel18XFxkfC18XFwufF98fnxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkqKFthLXpdfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKSkpJC9pKTtcbiAgfSxcbiAgJ2lzVHJ1ZSc6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gdHJ1ZTtcbiAgfSxcbiAgJ2lzTnVtZXJpYyc6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHZhbHVlLm1hdGNoKC9eLT9bMC05XSskLyk7XG4gICAgfVxuICB9LFxuICAnaXNBbHBoYSc6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZS5tYXRjaCgvXlthLXpBLVpdKyQvKTtcbiAgfSxcbiAgJ2lzV29yZHMnOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUubWF0Y2goL15bYS16QS1aXFxzXSskLyk7XG4gIH0sXG4gICdpc1NwZWNpYWxXb3Jkcyc6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZS5tYXRjaCgvXlthLXpBLVpcXHNcXHUwMEMwLVxcdTAxN0ZdKyQvKTtcbiAgfSxcbiAgaXNMZW5ndGg6IGZ1bmN0aW9uICh2YWx1ZSwgbWluLCBtYXgpIHtcbiAgICBpZiAobWF4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB2YWx1ZS5sZW5ndGggPj0gbWluICYmIHZhbHVlLmxlbmd0aCA8PSBtYXg7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZS5sZW5ndGggPj0gbWluO1xuICB9LFxuICBlcXVhbHM6IGZ1bmN0aW9uICh2YWx1ZSwgZXFsKSB7XG4gICAgcmV0dXJuIHZhbHVlID09IGVxbDtcbiAgfSxcbiAgZXF1YWxzRmllbGQ6IGZ1bmN0aW9uICh2YWx1ZSwgZmllbGQpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IHRoaXNbZmllbGRdO1xuICB9XG59O1xuXG52YXIgdG9VUkxFbmNvZGVkID0gZnVuY3Rpb24gKGVsZW1lbnQsIGtleSwgbGlzdCkge1xuICB2YXIgbGlzdCA9IGxpc3QgfHwgW107XG4gIGlmICh0eXBlb2YgKGVsZW1lbnQpID09ICdvYmplY3QnKSB7XG4gICAgZm9yICh2YXIgaWR4IGluIGVsZW1lbnQpXG4gICAgICB0b1VSTEVuY29kZWQoZWxlbWVudFtpZHhdLCBrZXkgPyBrZXkgKyAnWycgKyBpZHggKyAnXScgOiBpZHgsIGxpc3QpO1xuICB9IGVsc2Uge1xuICAgIGxpc3QucHVzaChrZXkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQoZWxlbWVudCkpO1xuICB9XG4gIHJldHVybiBsaXN0LmpvaW4oJyYnKTtcbn07XG5cbnZhciByZXF1ZXN0ID0gZnVuY3Rpb24gKG1ldGhvZCwgdXJsLCBkYXRhLCBjb250ZW50VHlwZSwgaGVhZGVycykge1xuXG4gIHZhciBjb250ZW50VHlwZSA9IGNvbnRlbnRUeXBlID09PSAndXJsZW5jb2RlZCcgPyAnYXBwbGljYXRpb24vJyArIGNvbnRlbnRUeXBlLnJlcGxhY2UoJ3VybGVuY29kZWQnLCAneC13d3ctZm9ybS11cmxlbmNvZGVkJykgOiAnYXBwbGljYXRpb24vanNvbic7XG4gIGRhdGEgPSBjb250ZW50VHlwZSA9PT0gJ2FwcGxpY2F0aW9uL2pzb24nID8gSlNPTi5zdHJpbmdpZnkoZGF0YSkgOiB0b1VSTEVuY29kZWQoZGF0YSk7XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICB0cnkge1xuICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgeGhyLm9wZW4obWV0aG9kLCB1cmwsIHRydWUpO1xuICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0FjY2VwdCcsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgY29udGVudFR5cGUpO1xuXG4gICAgICAvLyBBZGQgcGFzc2VkIGhlYWRlcnNcbiAgICAgIE9iamVjdC5rZXlzKGhlYWRlcnMpLmZvckVhY2goZnVuY3Rpb24gKGhlYWRlcikge1xuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihoZWFkZXIsIGhlYWRlcnNbaGVhZGVyXSk7XG4gICAgICB9KTtcblxuICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0geGhyLnJlc3BvbnNlVGV4dCA/IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCkgOiBudWxsO1xuICAgICAgICAgICAgaWYgKHhoci5zdGF0dXMgPj0gMjAwICYmIHhoci5zdGF0dXMgPCAzMDApIHtcbiAgICAgICAgICAgICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZWplY3QocmVzcG9uc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHJlamVjdChlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHhoci5zZW5kKGRhdGEpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJlamVjdChlKTtcbiAgICB9XG4gIH0pO1xuXG59O1xuXG52YXIgYXJyYXlzRGlmZmVyID0gZnVuY3Rpb24gKGFycmF5QSwgYXJyYXlCKSB7XG4gIHZhciBpc0RpZmZlcmVudCA9IGZhbHNlO1xuICBpZiAoYXJyYXlBLmxlbmd0aCAhPT0gYXJyYXlCLmxlbmd0aCkge1xuICAgIGlzRGlmZmVyZW50ID0gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICBhcnJheUEuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaW5kZXgpIHtcbiAgICAgIGlmIChpdGVtICE9PSBhcnJheUJbaW5kZXhdKSB7XG4gICAgICAgIGlzRGlmZmVyZW50ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICByZXR1cm4gaXNEaWZmZXJlbnQ7XG59O1xuXG52YXIgYWpheCA9IHtcbiAgcG9zdDogcmVxdWVzdC5iaW5kKG51bGwsICdQT1NUJyksXG4gIHB1dDogcmVxdWVzdC5iaW5kKG51bGwsICdQVVQnKVxufTtcbnZhciBvcHRpb25zID0ge307XG5cbkZvcm1zeS5kZWZhdWx0cyA9IGZ1bmN0aW9uIChwYXNzZWRPcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBwYXNzZWRPcHRpb25zO1xufTtcblxuRm9ybXN5Lk1peGluID0ge1xuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgX3ZhbHVlOiB0aGlzLnByb3BzLnZhbHVlID8gdGhpcy5wcm9wcy52YWx1ZSA6ICcnLFxuICAgICAgX2lzVmFsaWQ6IHRydWUsXG4gICAgICBfaXNQcmlzdGluZTogdHJ1ZVxuICAgIH07XG4gIH0sXG4gIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIGNvbmZpZ3VyZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIEFkZCB2YWxpZGF0aW9ucyB0byB0aGUgc3RvcmUgaXRzZWxmIGFzIHRoZSBwcm9wcyBvYmplY3QgY2FuIG5vdCBiZSBtb2RpZmllZFxuICAgICAgdGhpcy5fdmFsaWRhdGlvbnMgPSB0aGlzLnByb3BzLnZhbGlkYXRpb25zIHx8ICcnO1xuXG4gICAgICBpZiAodGhpcy5wcm9wcy5yZXF1aXJlZCkge1xuICAgICAgICB0aGlzLl92YWxpZGF0aW9ucyA9IHRoaXMucHJvcHMudmFsaWRhdGlvbnMgPyB0aGlzLnByb3BzLnZhbGlkYXRpb25zICsgJywnIDogJyc7XG4gICAgICAgIHRoaXMuX3ZhbGlkYXRpb25zICs9ICdpc1ZhbHVlJztcbiAgICAgIH1cbiAgICAgIHRoaXMucHJvcHMuX2F0dGFjaFRvRm9ybSh0aGlzKTtcbiAgICB9LmJpbmQodGhpcyk7XG5cbiAgICBpZiAoIXRoaXMucHJvcHMubmFtZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdGb3JtIElucHV0IHJlcXVpcmVzIGEgbmFtZSBwcm9wZXJ0eSB3aGVuIHVzZWQnKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMucHJvcHMuX2F0dGFjaFRvRm9ybSkge1xuICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMucHJvcHMuX2F0dGFjaFRvRm9ybSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRm9ybSBNaXhpbiByZXF1aXJlcyBjb21wb25lbnQgdG8gYmUgbmVzdGVkIGluIGEgRm9ybScpO1xuICAgICAgICB9XG4gICAgICAgIGNvbmZpZ3VyZSgpO1xuICAgICAgfS5iaW5kKHRoaXMpLCAwKTtcbiAgICB9XG4gICAgY29uZmlndXJlKCk7XG5cbiAgfSxcblxuICAvLyBXZSBoYXZlIHRvIG1ha2UgdGhlIHZhbGlkYXRlIG1ldGhvZCBpcyBrZXB0IHdoZW4gbmV3IHByb3BzIGFyZSBhZGRlZFxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbiAobmV4dFByb3BzKSB7XG4gICAgbmV4dFByb3BzLl9hdHRhY2hUb0Zvcm0gPSB0aGlzLnByb3BzLl9hdHRhY2hUb0Zvcm07XG4gICAgbmV4dFByb3BzLl9kZXRhY2hGcm9tRm9ybSA9IHRoaXMucHJvcHMuX2RldGFjaEZyb21Gb3JtO1xuICAgIG5leHRQcm9wcy5fdmFsaWRhdGUgPSB0aGlzLnByb3BzLl92YWxpZGF0ZTtcbiAgfSxcblxuICAvLyBEZXRhY2ggaXQgd2hlbiBjb21wb25lbnQgdW5tb3VudHNcbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnByb3BzLl9kZXRhY2hGcm9tRm9ybSh0aGlzKTtcbiAgfSxcblxuICAvLyBXZSB2YWxpZGF0ZSBhZnRlciB0aGUgdmFsdWUgaGFzIGJlZW4gc2V0XG4gIHNldFZhbHVlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIF92YWx1ZTogdmFsdWUsXG4gICAgICBfaXNQcmlzdGluZTogZmFsc2VcbiAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLnByb3BzLl92YWxpZGF0ZSh0aGlzKTtcbiAgICB9LmJpbmQodGhpcykpO1xuICB9LFxuICByZXNldFZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBfdmFsdWU6ICcnLFxuICAgICAgX2lzUHJpc3RpbmU6IHRydWVcbiAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLnByb3BzLl92YWxpZGF0ZSh0aGlzKTtcbiAgICB9KTtcbiAgfSxcbiAgZ2V0VmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5fdmFsdWU7XG4gIH0sXG4gIGhhc1ZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUuX3ZhbHVlICE9PSAnJztcbiAgfSxcbiAgZ2V0RXJyb3JNZXNzYWdlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNWYWxpZCgpIHx8IHRoaXMuc2hvd1JlcXVpcmVkKCkgPyBudWxsIDogdGhpcy5zdGF0ZS5fc2VydmVyRXJyb3IgfHwgdGhpcy5wcm9wcy52YWxpZGF0aW9uRXJyb3I7XG4gIH0sXG4gIGlzVmFsaWQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5faXNWYWxpZDtcbiAgfSxcbiAgaXNQcmlzdGluZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXRlLl9pc1ByaXN0aW5lO1xuICB9LFxuICBpc1JlcXVpcmVkOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICEhdGhpcy5wcm9wcy5yZXF1aXJlZDtcbiAgfSxcbiAgc2hvd1JlcXVpcmVkOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNSZXF1aXJlZCgpICYmIHRoaXMuc3RhdGUuX3ZhbHVlID09PSAnJztcbiAgfSxcbiAgc2hvd0Vycm9yOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICF0aGlzLnNob3dSZXF1aXJlZCgpICYmICF0aGlzLnN0YXRlLl9pc1ZhbGlkO1xuICB9XG59O1xuXG5Gb3Jtc3kuYWRkVmFsaWRhdGlvblJ1bGUgPSBmdW5jdGlvbiAobmFtZSwgZnVuYykge1xuICB2YWxpZGF0aW9uUnVsZXNbbmFtZV0gPSBmdW5jO1xufTtcblxuRm9ybXN5LkZvcm0gPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiRm9ybVwiLFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaXNWYWxpZDogdHJ1ZSxcbiAgICAgIGlzU3VibWl0dGluZzogZmFsc2UsXG4gICAgICBjYW5DaGFuZ2U6IGZhbHNlXG4gICAgfTtcbiAgfSxcbiAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGhlYWRlcnM6IHt9LFxuICAgICAgb25TdWNjZXNzOiBmdW5jdGlvbiAoKSB7fSxcbiAgICAgIG9uRXJyb3I6IGZ1bmN0aW9uICgpIHt9LFxuICAgICAgb25TdWJtaXQ6IGZ1bmN0aW9uICgpIHt9LFxuICAgICAgb25TdWJtaXR0ZWQ6IGZ1bmN0aW9uICgpIHt9LFxuICAgICAgb25WYWxpZDogZnVuY3Rpb24gKCkge30sXG4gICAgICBvbkludmFsaWQ6IGZ1bmN0aW9uICgpIHt9LFxuICAgICAgb25DaGFuZ2U6IGZ1bmN0aW9uICgpIHt9XG4gICAgfTtcbiAgfSxcblxuICAvLyBBZGQgYSBtYXAgdG8gc3RvcmUgdGhlIGlucHV0cyBvZiB0aGUgZm9ybSwgYSBtb2RlbCB0byBzdG9yZVxuICAvLyB0aGUgdmFsdWVzIG9mIHRoZSBmb3JtIGFuZCByZWdpc3RlciBjaGlsZCBpbnB1dHNcbiAgY29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5pbnB1dHMgPSB7fTtcbiAgICB0aGlzLm1vZGVsID0ge307XG4gICAgdGhpcy5yZWdpc3RlcklucHV0cyh0aGlzLnByb3BzLmNoaWxkcmVuKTtcbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMudmFsaWRhdGVGb3JtKCk7XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBpbnB1dEtleXMgPSBPYmplY3Qua2V5cyh0aGlzLmlucHV0cyk7XG5cbiAgICAvLyBUaGUgdXBkYXRlZCBjaGlsZHJlbiBhcnJheSBpcyBub3QgYXZhaWxhYmxlIGhlcmUgZm9yIHNvbWUgcmVhc29uLFxuICAgIC8vIHdlIG5lZWQgdG8gd2FpdCBmb3IgbmV4dCBldmVudCBsb29wXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLnJlZ2lzdGVySW5wdXRzKHRoaXMucHJvcHMuY2hpbGRyZW4pO1xuXG4gICAgICB2YXIgbmV3SW5wdXRLZXlzID0gT2JqZWN0LmtleXModGhpcy5pbnB1dHMpO1xuICAgICAgaWYgKGFycmF5c0RpZmZlcihpbnB1dEtleXMsIG5ld0lucHV0S2V5cykpIHtcbiAgICAgICAgdGhpcy52YWxpZGF0ZUZvcm0oKTtcbiAgICAgIH1cbiAgICB9LmJpbmQodGhpcyksIDApO1xuICB9LFxuXG4gIC8vIFVwZGF0ZSBtb2RlbCwgc3VibWl0IHRvIHVybCBwcm9wIGFuZCBzZW5kIHRoZSBtb2RlbFxuICBzdWJtaXQ6IGZ1bmN0aW9uIChldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAvLyBUcmlnZ2VyIGZvcm0gYXMgbm90IHByaXN0aW5lLlxuICAgIC8vIElmIGFueSBpbnB1dHMgaGF2ZSBub3QgYmVlbiB0b3VjaGVkIHlldCB0aGlzIHdpbGwgbWFrZSB0aGVtIGRpcnR5XG4gICAgLy8gc28gdmFsaWRhdGlvbiBiZWNvbWVzIHZpc2libGUgKGlmIGJhc2VkIG9uIGlzUHJpc3RpbmUpXG4gICAgdGhpcy5zZXRGb3JtUHJpc3RpbmUoZmFsc2UpO1xuXG4gICAgLy8gVG8gc3VwcG9ydCB1c2UgY2FzZXMgd2hlcmUgbm8gYXN5bmMgb3IgcmVxdWVzdCBvcGVyYXRpb24gaXMgbmVlZGVkLlxuICAgIC8vIFRoZSBcIm9uU3VibWl0XCIgY2FsbGJhY2sgaXMgY2FsbGVkIHdpdGggdGhlIG1vZGVsIGUuZy4ge2ZpZWxkTmFtZTogXCJteVZhbHVlXCJ9LFxuICAgIC8vIGlmIHdhbnRpbmcgdG8gcmVzZXQgdGhlIGVudGlyZSBmb3JtIHRvIG9yaWdpbmFsIHN0YXRlLCB0aGUgc2Vjb25kIHBhcmFtIGlzIGEgY2FsbGJhY2sgZm9yIHRoaXMuXG4gICAgaWYgKCF0aGlzLnByb3BzLnVybCkge1xuICAgICAgdGhpcy51cGRhdGVNb2RlbCgpO1xuICAgICAgdGhpcy5wcm9wcy5vblN1Ym1pdCh0aGlzLm1hcE1vZGVsKCksIHRoaXMucmVzZXRNb2RlbCwgdGhpcy51cGRhdGVJbnB1dHNXaXRoRXJyb3IpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMudXBkYXRlTW9kZWwoKTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGlzU3VibWl0dGluZzogdHJ1ZVxuICAgIH0pO1xuXG4gICAgdGhpcy5wcm9wcy5vblN1Ym1pdCh0aGlzLm1hcE1vZGVsKCksIHRoaXMucmVzZXRNb2RlbCwgdGhpcy51cGRhdGVJbnB1dHNXaXRoRXJyb3IpO1xuXG4gICAgdmFyIGhlYWRlcnMgPSAoT2JqZWN0LmtleXModGhpcy5wcm9wcy5oZWFkZXJzKS5sZW5ndGggJiYgdGhpcy5wcm9wcy5oZWFkZXJzKSB8fCBvcHRpb25zLmhlYWRlcnMgfHwge307XG5cbiAgICB2YXIgbWV0aG9kID0gdGhpcy5wcm9wcy5tZXRob2QgJiYgYWpheFt0aGlzLnByb3BzLm1ldGhvZC50b0xvd2VyQ2FzZSgpXSA/IHRoaXMucHJvcHMubWV0aG9kLnRvTG93ZXJDYXNlKCkgOiAncG9zdCc7XG4gICAgYWpheFttZXRob2RdKHRoaXMucHJvcHMudXJsLCB0aGlzLm1hcE1vZGVsKCksIHRoaXMucHJvcHMuY29udGVudFR5cGUgfHwgb3B0aW9ucy5jb250ZW50VHlwZSB8fCAnanNvbicsIGhlYWRlcnMpXG4gICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5vblN1Y2Nlc3MocmVzcG9uc2UpO1xuICAgICAgICB0aGlzLnByb3BzLm9uU3VibWl0dGVkKCk7XG4gICAgICB9LmJpbmQodGhpcykpXG4gICAgICAuY2F0Y2godGhpcy5mYWlsU3VibWl0KTtcbiAgfSxcblxuICBtYXBNb2RlbDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLm1hcHBpbmcgPyB0aGlzLnByb3BzLm1hcHBpbmcodGhpcy5tb2RlbCkgOiB0aGlzLm1vZGVsO1xuICB9LFxuXG4gIC8vIEdvZXMgdGhyb3VnaCBhbGwgcmVnaXN0ZXJlZCBjb21wb25lbnRzIGFuZFxuICAvLyB1cGRhdGVzIHRoZSBtb2RlbCB2YWx1ZXNcbiAgdXBkYXRlTW9kZWw6IGZ1bmN0aW9uICgpIHtcbiAgICBPYmplY3Qua2V5cyh0aGlzLmlucHV0cykuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgdmFyIGNvbXBvbmVudCA9IHRoaXMuaW5wdXRzW25hbWVdO1xuICAgICAgdGhpcy5tb2RlbFtuYW1lXSA9IGNvbXBvbmVudC5zdGF0ZS5fdmFsdWU7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgfSxcblxuICAvLyBSZXNldCBlYWNoIGtleSBpbiB0aGUgbW9kZWwgdG8gdGhlIG9yaWdpbmFsIC8gaW5pdGlhbCB2YWx1ZVxuICByZXNldE1vZGVsOiBmdW5jdGlvbiAoKSB7XG4gICAgT2JqZWN0LmtleXModGhpcy5pbnB1dHMpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgIHRoaXMuaW5wdXRzW25hbWVdLnJlc2V0VmFsdWUoKTtcbiAgICB9LmJpbmQodGhpcykpO1xuICAgIHRoaXMudmFsaWRhdGVGb3JtKCk7XG4gIH0sXG5cbiAgLy8gR28gdGhyb3VnaCBlcnJvcnMgZnJvbSBzZXJ2ZXIgYW5kIGdyYWIgdGhlIGNvbXBvbmVudHNcbiAgLy8gc3RvcmVkIGluIHRoZSBpbnB1dHMgbWFwLiBDaGFuZ2UgdGhlaXIgc3RhdGUgdG8gaW52YWxpZFxuICAvLyBhbmQgc2V0IHRoZSBzZXJ2ZXJFcnJvciBtZXNzYWdlXG4gIHVwZGF0ZUlucHV0c1dpdGhFcnJvcjogZnVuY3Rpb24gKGVycm9ycykge1xuICAgIE9iamVjdC5rZXlzKGVycm9ycykuZm9yRWFjaChmdW5jdGlvbiAobmFtZSwgaW5kZXgpIHtcbiAgICAgIHZhciBjb21wb25lbnQgPSB0aGlzLmlucHV0c1tuYW1lXTtcblxuICAgICAgaWYgKCFjb21wb25lbnQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgYXJlIHRyeWluZyB0byB1cGRhdGUgYW4gaW5wdXQgdGhhdCBkb2VzIG5vdCBleGlzdHMuIFZlcmlmeSBlcnJvcnMgb2JqZWN0IHdpdGggaW5wdXQgbmFtZXMuICcgKyBKU09OLnN0cmluZ2lmeShlcnJvcnMpKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGFyZ3MgPSBbe1xuICAgICAgICBfaXNWYWxpZDogZmFsc2UsXG4gICAgICAgIF9zZXJ2ZXJFcnJvcjogZXJyb3JzW25hbWVdXG4gICAgICB9XTtcbiAgICAgIGNvbXBvbmVudC5zZXRTdGF0ZS5hcHBseShjb21wb25lbnQsIGFyZ3MpO1xuICAgIH0uYmluZCh0aGlzKSk7XG4gIH0sXG5cbiAgZmFpbFN1Ym1pdDogZnVuY3Rpb24gKGVycm9ycykge1xuICAgIHRoaXMudXBkYXRlSW5wdXRzV2l0aEVycm9yKGVycm9ycyk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpc1N1Ym1pdHRpbmc6IGZhbHNlXG4gICAgfSk7XG4gICAgdGhpcy5wcm9wcy5vbkVycm9yKGVycm9ycyk7XG4gICAgdGhpcy5wcm9wcy5vblN1Ym1pdHRlZCgpO1xuICB9LFxuXG4gIC8vIFRyYXZlcnNlIHRoZSBjaGlsZHJlbiBhbmQgY2hpbGRyZW4gb2YgY2hpbGRyZW4gdG8gZmluZFxuICAvLyBhbGwgaW5wdXRzIGJ5IGNoZWNraW5nIHRoZSBuYW1lIHByb3AuIE1heWJlIGRvIGEgYmV0dGVyXG4gIC8vIGNoZWNrIGhlcmVcbiAgcmVnaXN0ZXJJbnB1dHM6IGZ1bmN0aW9uIChjaGlsZHJlbikge1xuICAgIFJlYWN0LkNoaWxkcmVuLmZvckVhY2goY2hpbGRyZW4sIGZ1bmN0aW9uIChjaGlsZCkge1xuXG4gICAgICBpZiAoY2hpbGQucHJvcHMgJiYgY2hpbGQucHJvcHMubmFtZSkge1xuICAgICAgICBjaGlsZC5wcm9wcy5fYXR0YWNoVG9Gb3JtID0gdGhpcy5hdHRhY2hUb0Zvcm07XG4gICAgICAgIGNoaWxkLnByb3BzLl9kZXRhY2hGcm9tRm9ybSA9IHRoaXMuZGV0YWNoRnJvbUZvcm07XG4gICAgICAgIGNoaWxkLnByb3BzLl92YWxpZGF0ZSA9IHRoaXMudmFsaWRhdGU7XG4gICAgICB9XG5cbiAgICAgIGlmIChjaGlsZC5wcm9wcyAmJiBjaGlsZC5wcm9wcy5jaGlsZHJlbikge1xuICAgICAgICB0aGlzLnJlZ2lzdGVySW5wdXRzKGNoaWxkLnByb3BzLmNoaWxkcmVuKTtcbiAgICAgIH1cblxuICAgIH0uYmluZCh0aGlzKSk7XG4gIH0sXG5cbiAgZ2V0Q3VycmVudFZhbHVlczogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLmlucHV0cykucmVkdWNlKGZ1bmN0aW9uIChkYXRhLCBuYW1lKSB7XG4gICAgICB2YXIgY29tcG9uZW50ID0gdGhpcy5pbnB1dHNbbmFtZV07XG4gICAgICBkYXRhW25hbWVdID0gY29tcG9uZW50LnN0YXRlLl92YWx1ZTtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH0uYmluZCh0aGlzKSwge30pO1xuICB9LFxuXG4gIHNldEZvcm1QcmlzdGluZTogZnVuY3Rpb24gKGlzUHJpc3RpbmUpIHtcbiAgICB2YXIgaW5wdXRzID0gdGhpcy5pbnB1dHM7XG4gICAgdmFyIGlucHV0S2V5cyA9IE9iamVjdC5rZXlzKGlucHV0cyk7XG5cbiAgICAvLyBJdGVyYXRlIHRocm91Z2ggZWFjaCBjb21wb25lbnQgYW5kIHNldCBpdCBhcyBwcmlzdGluZVxuICAgIC8vIG9yIFwiZGlydHlcIi5cbiAgICBpbnB1dEtleXMuZm9yRWFjaChmdW5jdGlvbiAobmFtZSwgaW5kZXgpIHtcbiAgICAgIHZhciBjb21wb25lbnQgPSBpbnB1dHNbbmFtZV07XG4gICAgICBjb21wb25lbnQuc2V0U3RhdGUoe1xuICAgICAgICBfaXNQcmlzdGluZTogaXNQcmlzdGluZVxuICAgICAgfSk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgfSxcblxuICAvLyBVc2UgdGhlIGJpbmRlZCB2YWx1ZXMgYW5kIHRoZSBhY3R1YWwgaW5wdXQgdmFsdWUgdG9cbiAgLy8gdmFsaWRhdGUgdGhlIGlucHV0IGFuZCBzZXQgaXRzIHN0YXRlLiBUaGVuIGNoZWNrIHRoZVxuICAvLyBzdGF0ZSBvZiB0aGUgZm9ybSBpdHNlbGZcbiAgdmFsaWRhdGU6IGZ1bmN0aW9uIChjb21wb25lbnQpIHtcblxuICAgIC8vIFRyaWdnZXIgb25DaGFuZ2VcbiAgICB0aGlzLnN0YXRlLmNhbkNoYW5nZSAmJiB0aGlzLnByb3BzLm9uQ2hhbmdlICYmIHRoaXMucHJvcHMub25DaGFuZ2UodGhpcy5nZXRDdXJyZW50VmFsdWVzKCkpO1xuXG4gICAgaWYgKCFjb21wb25lbnQucHJvcHMucmVxdWlyZWQgJiYgIWNvbXBvbmVudC5fdmFsaWRhdGlvbnMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBSdW4gdGhyb3VnaCB0aGUgdmFsaWRhdGlvbnMsIHNwbGl0IHRoZW0gdXAgYW5kIGNhbGxcbiAgICAvLyB0aGUgdmFsaWRhdG9yIElGIHRoZXJlIGlzIGEgdmFsdWUgb3IgaXQgaXMgcmVxdWlyZWRcbiAgICB2YXIgaXNWYWxpZCA9IHRoaXMucnVuVmFsaWRhdGlvbihjb21wb25lbnQpO1xuXG4gICAgY29tcG9uZW50LnNldFN0YXRlKHtcbiAgICAgIF9pc1ZhbGlkOiBpc1ZhbGlkLFxuICAgICAgX3NlcnZlckVycm9yOiBudWxsXG4gICAgfSwgdGhpcy52YWxpZGF0ZUZvcm0pO1xuXG4gIH0sXG5cbiAgcnVuVmFsaWRhdGlvbjogZnVuY3Rpb24gKGNvbXBvbmVudCkge1xuICAgIHZhciBpc1ZhbGlkID0gdHJ1ZTtcbiAgICBpZiAoY29tcG9uZW50Ll92YWxpZGF0aW9ucy5sZW5ndGggJiYgKGNvbXBvbmVudC5wcm9wcy5yZXF1aXJlZCB8fCBjb21wb25lbnQuc3RhdGUuX3ZhbHVlICE9PSAnJykpIHtcbiAgICAgIGNvbXBvbmVudC5fdmFsaWRhdGlvbnMuc3BsaXQoJywnKS5mb3JFYWNoKGZ1bmN0aW9uICh2YWxpZGF0aW9uKSB7XG4gICAgICAgIHZhciBhcmdzID0gdmFsaWRhdGlvbi5zcGxpdCgnOicpO1xuICAgICAgICB2YXIgdmFsaWRhdGVNZXRob2QgPSBhcmdzLnNoaWZ0KCk7XG4gICAgICAgIGFyZ3MgPSBhcmdzLm1hcChmdW5jdGlvbiAoYXJnKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKGFyZyk7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgcmV0dXJuIGFyZzsgLy8gSXQgaXMgYSBzdHJpbmcgaWYgaXQgY2FuIG5vdCBwYXJzZSBpdFxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGFyZ3MgPSBbY29tcG9uZW50LnN0YXRlLl92YWx1ZV0uY29uY2F0KGFyZ3MpO1xuICAgICAgICBpZiAoIXZhbGlkYXRpb25SdWxlc1t2YWxpZGF0ZU1ldGhvZF0pIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Zvcm1zeSBkb2VzIG5vdCBoYXZlIHRoZSB2YWxpZGF0aW9uIHJ1bGU6ICcgKyB2YWxpZGF0ZU1ldGhvZCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF2YWxpZGF0aW9uUnVsZXNbdmFsaWRhdGVNZXRob2RdLmFwcGx5KHRoaXMuZ2V0Q3VycmVudFZhbHVlcygpLCBhcmdzKSkge1xuICAgICAgICAgIGlzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9XG4gICAgcmV0dXJuIGlzVmFsaWQ7XG4gIH0sXG5cbiAgLy8gVmFsaWRhdGUgdGhlIGZvcm0gYnkgZ29pbmcgdGhyb3VnaCBhbGwgY2hpbGQgaW5wdXQgY29tcG9uZW50c1xuICAvLyBhbmQgY2hlY2sgdGhlaXIgc3RhdGVcbiAgdmFsaWRhdGVGb3JtOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGFsbElzVmFsaWQgPSB0cnVlO1xuICAgIHZhciBpbnB1dHMgPSB0aGlzLmlucHV0cztcbiAgICB2YXIgaW5wdXRLZXlzID0gT2JqZWN0LmtleXMoaW5wdXRzKTtcblxuICAgIC8vIFdlIG5lZWQgYSBjYWxsYmFjayBhcyB3ZSBhcmUgdmFsaWRhdGluZyBhbGwgaW5wdXRzIGFnYWluLiBUaGlzIHdpbGxcbiAgICAvLyBydW4gd2hlbiB0aGUgbGFzdCBjb21wb25lbnQgaGFzIHNldCBpdHMgc3RhdGVcbiAgICB2YXIgb25WYWxpZGF0aW9uQ29tcGxldGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpbnB1dEtleXMuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICBpZiAoIWlucHV0c1tuYW1lXS5zdGF0ZS5faXNWYWxpZCkge1xuICAgICAgICAgIGFsbElzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfS5iaW5kKHRoaXMpKTtcblxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGlzVmFsaWQ6IGFsbElzVmFsaWRcbiAgICAgIH0pO1xuXG4gICAgICBhbGxJc1ZhbGlkICYmIHRoaXMucHJvcHMub25WYWxpZCgpO1xuICAgICAgIWFsbElzVmFsaWQgJiYgdGhpcy5wcm9wcy5vbkludmFsaWQoKTtcblxuICAgICAgLy8gVGVsbCB0aGUgZm9ybSB0aGF0IGl0IGNhbiBzdGFydCB0byB0cmlnZ2VyIGNoYW5nZSBldmVudHNcbiAgICAgIHRoaXMuc2V0U3RhdGUoe2NhbkNoYW5nZTogdHJ1ZX0pO1xuXG4gICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgLy8gUnVuIHZhbGlkYXRpb24gYWdhaW4gaW4gY2FzZSBhZmZlY3RlZCBieSBvdGhlciBpbnB1dHMuIFRoZVxuICAgIC8vIGxhc3QgY29tcG9uZW50IHZhbGlkYXRlZCB3aWxsIHJ1biB0aGUgb25WYWxpZGF0aW9uQ29tcGxldGUgY2FsbGJhY2tcbiAgICBpbnB1dEtleXMuZm9yRWFjaChmdW5jdGlvbiAobmFtZSwgaW5kZXgpIHtcbiAgICAgIHZhciBjb21wb25lbnQgPSBpbnB1dHNbbmFtZV07XG4gICAgICB2YXIgaXNWYWxpZCA9IHRoaXMucnVuVmFsaWRhdGlvbihjb21wb25lbnQpO1xuICAgICAgY29tcG9uZW50LnNldFN0YXRlKHtcbiAgICAgICAgX2lzVmFsaWQ6IGlzVmFsaWQsXG4gICAgICAgIF9zZXJ2ZXJFcnJvcjogbnVsbFxuICAgICAgfSwgaW5kZXggPT09IGlucHV0S2V5cy5sZW5ndGggLSAxID8gb25WYWxpZGF0aW9uQ29tcGxldGUgOiBudWxsKTtcbiAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgLy8gSWYgdGhlcmUgYXJlIG5vIGlucHV0cywgaXQgaXMgcmVhZHkgdG8gdHJpZ2dlciBjaGFuZ2UgZXZlbnRzXG4gICAgaWYgKCFpbnB1dEtleXMubGVuZ3RoKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtjYW5DaGFuZ2U6IHRydWV9KTtcbiAgICB9XG5cbiAgfSxcblxuICAvLyBNZXRob2QgcHV0IG9uIGVhY2ggaW5wdXQgY29tcG9uZW50IHRvIHJlZ2lzdGVyXG4gIC8vIGl0c2VsZiB0byB0aGUgZm9ybVxuICBhdHRhY2hUb0Zvcm06IGZ1bmN0aW9uIChjb21wb25lbnQpIHtcbiAgICB0aGlzLmlucHV0c1tjb21wb25lbnQucHJvcHMubmFtZV0gPSBjb21wb25lbnQ7XG4gICAgdGhpcy5tb2RlbFtjb21wb25lbnQucHJvcHMubmFtZV0gPSBjb21wb25lbnQuc3RhdGUuX3ZhbHVlO1xuICAgIHRoaXMudmFsaWRhdGUoY29tcG9uZW50KTtcbiAgfSxcblxuICAvLyBNZXRob2QgcHV0IG9uIGVhY2ggaW5wdXQgY29tcG9uZW50IHRvIHVucmVnaXN0ZXJcbiAgLy8gaXRzZWxmIGZyb20gdGhlIGZvcm1cbiAgZGV0YWNoRnJvbUZvcm06IGZ1bmN0aW9uIChjb21wb25lbnQpIHtcbiAgICBkZWxldGUgdGhpcy5pbnB1dHNbY29tcG9uZW50LnByb3BzLm5hbWVdO1xuICAgIGRlbGV0ZSB0aGlzLm1vZGVsW2NvbXBvbmVudC5wcm9wcy5uYW1lXTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG5cbiAgICByZXR1cm4gUmVhY3QuRE9NLmZvcm0oe1xuICAgICAgICBvblN1Ym1pdDogdGhpcy5zdWJtaXQsXG4gICAgICAgIGNsYXNzTmFtZTogdGhpcy5wcm9wcy5jbGFzc05hbWVcbiAgICAgIH0sXG4gICAgICB0aGlzLnByb3BzLmNoaWxkcmVuXG4gICAgKTtcblxuICB9XG59KTtcblxuaWYgKCFnbG9iYWwuZXhwb3J0cyAmJiAhZ2xvYmFsLm1vZHVsZSAmJiAoIWdsb2JhbC5kZWZpbmUgfHwgIWdsb2JhbC5kZWZpbmUuYW1kKSkge1xuICBnbG9iYWwuRm9ybXN5ID0gRm9ybXN5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEZvcm1zeTtcbiJdfQ==
