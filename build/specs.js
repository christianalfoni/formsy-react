(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./specs/Element-spec.js":[function(require,module,exports){
var Formsy = require('./../src/main.js');

describe('Element', function() {

  it('should return passed and setValue() value when using getValue()', function () {
    
    var TestInput = React.createClass({displayName: "TestInput",
      mixins: [Formsy.Mixin],
      updateValue: function (event) {
        this.setValue(event.target.value);
      },
      render: function () {
        return React.createElement("input", {value: this.getValue(), onChange: this.updateValue})
      }
    });
    var form = TestUtils.renderIntoDocument(
      React.createElement(Formsy.Form, null, 
        React.createElement(TestInput, {name: "foo", value: "foo"})
      )
    );

    var input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    expect(input.getDOMNode().value).toBe('foo');
    TestUtils.Simulate.change(input, {target: {value: 'foobar'}});
    expect(input.getDOMNode().value).toBe('foobar');

  });

  it('should return true or false when calling hasValue() depending on value existance', function () {
    
    var reset = null;
    var TestInput = React.createClass({displayName: "TestInput",
      mixins: [Formsy.Mixin],
      componentDidMount: function () {
        reset = this.resetValue;
      },
      updateValue: function (event) {
        this.setValue(event.target.value);
      },
      render: function () {
        return React.createElement("input", {value: this.getValue(), onChange: this.updateValue})
      }
    });
    var form = TestUtils.renderIntoDocument(
      React.createElement(Formsy.Form, null, 
        React.createElement(TestInput, {name: "foo", value: "foo"})
      )
    );

    var input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    reset();
    expect(input.getDOMNode().value).toBe('');

  });

  it('should return error message passed when calling getErrorMessage()', function () {
    
    var getErrorMessage = null;
    var TestInput = React.createClass({displayName: "TestInput",
      mixins: [Formsy.Mixin],
      componentDidMount: function () {
        getErrorMessage = this.getErrorMessage;
      },
      updateValue: function (event) {
        this.setValue(event.target.value);
      },
      render: function () {
        return React.createElement("input", {value: this.getValue(), onChange: this.updateValue})
      }
    });
    var form = TestUtils.renderIntoDocument(
      React.createElement(Formsy.Form, null, 
        React.createElement(TestInput, {name: "foo", value: "foo", validations: "isEmail", validationError: "Has to be email"})
      )
    );

    expect(getErrorMessage()).toBe('Has to be email');

  });

  it('should return server error message when calling getErrorMessage()', function (done) {
    
    jasmine.Ajax.install();

    var getErrorMessage = null;
    var TestInput = React.createClass({displayName: "TestInput",
      mixins: [Formsy.Mixin],
      componentDidMount: function () {
        getErrorMessage = this.getErrorMessage;
      },
      updateValue: function (event) {
        this.setValue(event.target.value);
      },
      render: function () {
        return React.createElement("input", {value: this.getValue(), onChange: this.updateValue})
      }
    });
    var form = TestUtils.renderIntoDocument(
      React.createElement(Formsy.Form, {url: "/users"}, 
        React.createElement(TestInput, {name: "foo", value: "foo", validations: "isEmail", validationError: "Has to be email"})
      )
    );

    var form = TestUtils.Simulate.submit(form.getDOMNode());

    jasmine.Ajax.requests.mostRecent().respondWith({
      status: 500,
      contentType: 'application/json',
      responseText: '{"foo": "bar"}'
    })

    setTimeout(function () {
      expect(getErrorMessage()).toBe('bar');
      jasmine.Ajax.uninstall();
      done();
    }, 0);

  });

  it('should return true or false when calling isValid() depending on valid state', function () {
    
    var isValid = null;
    var TestInput = React.createClass({displayName: "TestInput",
      mixins: [Formsy.Mixin],
      componentDidMount: function () {
        isValid = this.isValid;
      },
      updateValue: function (event) {
        console.log('event.target.value', event.target.value);
        this.setValue(event.target.value);
        setTimeout(function () {
          console.log('this.getValue()', this.getValue());
        }.bind(this), 100);
      },
      render: function () {
        return React.createElement("input", {value: this.getValue(), onChange: this.updateValue})
      }
    });
    var form = TestUtils.renderIntoDocument(
      React.createElement(Formsy.Form, {url: "/users"}, 
        React.createElement(TestInput, {name: "foo", value: "foo", validations: "isEmail"})
      )
    );

    expect(isValid()).toBe(false);
    var input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    TestUtils.Simulate.change(input, {target: {value: 'foo@foo.com'}});
    expect(isValid()).toBe(true);

  });

  it('should return true or false when calling isRequired() depending on passed required attribute', function () {
    
    var isRequireds = [];
    var TestInput = React.createClass({displayName: "TestInput",
      mixins: [Formsy.Mixin],
      componentDidMount: function () {
        isRequireds.push(this.isRequired);
      },
      updateValue: function (event) {
        this.setValue(event.target.value);
      },
      render: function () {
        return React.createElement("input", {value: this.getValue(), onChange: this.updateValue})
      }
    });
    var form = TestUtils.renderIntoDocument(
      React.createElement(Formsy.Form, {url: "/users"}, 
        React.createElement(TestInput, {name: "foo", value: "foo"}), 
        React.createElement(TestInput, {name: "foo", value: "foo", required: true})
      )
    );

    expect(isRequireds[0]()).toBe(false);
    expect(isRequireds[1]()).toBe(true);

  });

  it('should return true or false when calling showRequired() depending on input being empty and required is passed, or not', function () {
    
    var showRequireds = [];
    var TestInput = React.createClass({displayName: "TestInput",
      mixins: [Formsy.Mixin],
      componentDidMount: function () {
        showRequireds.push(this.showRequired);
      },
      updateValue: function (event) {
        this.setValue(event.target.value);
      },
      render: function () {
        return React.createElement("input", {value: this.getValue(), onChange: this.updateValue})
      }
    });
    var form = TestUtils.renderIntoDocument(
      React.createElement(Formsy.Form, {url: "/users"}, 
        React.createElement(TestInput, {name: "A", value: "foo"}), 
        React.createElement(TestInput, {name: "B", value: "", required: true}), 
        React.createElement(TestInput, {name: "C", value: ""})
      )
    );

    expect(showRequireds[0]()).toBe(false);
    expect(showRequireds[1]()).toBe(true);
    expect(showRequireds[2]()).toBe(false);

  });

  it('should return true or false when calling showError() depending on value is invalid or a server error has arrived, or not', function (done) {

    var showError = null;
    var TestInput = React.createClass({displayName: "TestInput",
      mixins: [Formsy.Mixin],
      componentDidMount: function () {
        showError = this.showError;
      },
      updateValue: function (event) {
        this.setValue(event.target.value);
      },
      render: function () {
        return React.createElement("input", {value: this.getValue(), onChange: this.updateValue})
      }
    });
    var form = TestUtils.renderIntoDocument(
      React.createElement(Formsy.Form, {url: "/users"}, 
        React.createElement(TestInput, {name: "foo", value: "foo", validations: "isEmail", validationError: "This is not an email"})
      )
    );

    expect(showError()).toBe(true);

    var input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    TestUtils.Simulate.change(input, {target: {value: 'foo@foo.com'}});
    expect(showError()).toBe(false);

    jasmine.Ajax.install();
    TestUtils.Simulate.submit(form.getDOMNode());    
    jasmine.Ajax.requests.mostRecent().respondWith({
      status: 500,
      responseType: 'application/json',
      responseText: '{"foo": "Email already exists"}'
    });
    setTimeout(function () {
      expect(showError()).toBe(true);
      jasmine.Ajax.uninstall();
      done();
    }, 0);
  });

  it('should return true or false when calling isPrestine() depending on input has been "touched" or not', function () {
    
    var isPristine = null;
    var TestInput = React.createClass({displayName: "TestInput",
      mixins: [Formsy.Mixin],
      componentDidMount: function () {
        isPristine = this.isPristine;
      },
      updateValue: function (event) {
        this.setValue(event.target.value);
      },
      render: function () {
        return React.createElement("input", {value: this.getValue(), onChange: this.updateValue})
      }
    });
    var form = TestUtils.renderIntoDocument(
      React.createElement(Formsy.Form, {url: "/users"}, 
        React.createElement(TestInput, {name: "A", value: "foo"})
      )
    );

    expect(isPristine()).toBe(true);
    var input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    TestUtils.Simulate.change(input, {target: {value: 'foo'}});
    expect(isPristine()).toBe(false);
    
  });

});

},{"./../src/main.js":"/Users/christianalfoni/Documents/dev/formsy-react/src/main.js"}],"./specs/Formsy-spec.js":[function(require,module,exports){
var Formsy = require('./../src/main.js');

describe('Formsy', function() {

  describe('Setting up a form', function () {
    
    it('should render a form into the document', function() {
      var form = TestUtils.renderIntoDocument(
        React.createElement(Formsy.Form, null)
      );
      expect(form.getDOMNode().tagName).toEqual('FORM');
    });

    it('should set a class name if passed', function () {
      var form = TestUtils.renderIntoDocument(
        React.createElement(Formsy.Form, {className: "foo"})
      );
      expect(form.getDOMNode().className).toEqual('foo');
    });

  });

});

},{"./../src/main.js":"/Users/christianalfoni/Documents/dev/formsy-react/src/main.js"}],"./specs/Submit-spec.js":[function(require,module,exports){
var Formsy = require('./../src/main.js');

describe('Ajax', function() {

  beforeEach(function () {
    jasmine.Ajax.install();
  });

  afterEach(function () {
    jasmine.Ajax.uninstall();
  });

  it('should post to a given url if passed', function () {

    var form = TestUtils.renderIntoDocument(
      React.createElement(Formsy.Form, {url: "/users"}
      )
    );
    
    TestUtils.Simulate.submit(form.getDOMNode());
    expect(jasmine.Ajax.requests.mostRecent().url).toBe('/users');
    expect(jasmine.Ajax.requests.mostRecent().method).toBe('POST');

  });

  it('should put to a given url if passed a method attribute', function () {

    var form = TestUtils.renderIntoDocument(
      React.createElement(Formsy.Form, {url: "/users", method: "PUT"}
      )
    );
    
    TestUtils.Simulate.submit(form.getDOMNode());
    expect(jasmine.Ajax.requests.mostRecent().url).toBe('/users');
    expect(jasmine.Ajax.requests.mostRecent().method).toBe('PUT');

  });

  it('should pass x-www-form-urlencoded as contentType when urlencoded is set as contentType', function () {

    var form = TestUtils.renderIntoDocument(
      React.createElement(Formsy.Form, {url: "/users", contentType: "urlencoded"}
      )
    );
    
    TestUtils.Simulate.submit(form.getDOMNode());
    expect(jasmine.Ajax.requests.mostRecent().contentType()).toBe('application/x-www-form-urlencoded');

  });

  it('should run an onSuccess handler, if passed and ajax is successfull. First argument is data from server', function (done) {
 
    var onSuccess = jasmine.createSpy("success");
    var form = TestUtils.renderIntoDocument(
      React.createElement(Formsy.Form, {url: "/users", onSuccess: onSuccess}
      )
    );
    
    jasmine.Ajax.stubRequest('/users').andReturn({
      status: 200,
      contentType: 'application/json',
      responseText: '{}'
    });

    TestUtils.Simulate.submit(form.getDOMNode());

    // Since ajax is returned as a promise (async), move assertion
    // to end of event loop
    setTimeout(function () {
      expect(onSuccess).toHaveBeenCalledWith({});
      done();
    }, 0);

  });

  it('should not do ajax request if onSubmit handler is passed, but pass the model as first argument to onSubmit handler', function () {
    
    var TestInput = React.createClass({displayName: "TestInput",
      mixins: [Formsy.Mixin],
      render: function () {
        return React.createElement("input", {value: this.getValue()})
      }
    });
    var form = TestUtils.renderIntoDocument(
      React.createElement(Formsy.Form, {onSubmit: onSubmit}, 
        React.createElement(TestInput, {name: "foo", value: "bar"})
      )
    );

    TestUtils.Simulate.submit(form.getDOMNode());

    expect(jasmine.Ajax.requests.count()).toBe(0);

    function onSubmit (data) {
      expect(data).toEqual({
        foo: 'bar'
      });
    }

  });

  it('should trigger an onSubmitted handler, if passed and the submit has responded with SUCCESS', function (done) {
    
    var onSubmitted = jasmine.createSpy("submitted");
    var form = TestUtils.renderIntoDocument(
      React.createElement(Formsy.Form, {url: "/users", onSubmitted: onSubmitted}
      )
    );
    
    jasmine.Ajax.stubRequest('/users').andReturn({
      status: 200,
      contentType: 'application/json',
      responseText: '{}'
    });

    TestUtils.Simulate.submit(form.getDOMNode());

    // Since ajax is returned as a promise (async), move assertion
    // to end of event loop
    setTimeout(function () {
      expect(onSubmitted).toHaveBeenCalled();
      done();
    }, 0);

  });

  it('should trigger an onSubmitted handler, if passed and the submit has responded with ERROR', function (done) {
    
    var onSubmitted = jasmine.createSpy("submitted");
    var form = TestUtils.renderIntoDocument(
      React.createElement(Formsy.Form, {url: "/users", onSubmitted: onSubmitted}
      )
    );
    
    jasmine.Ajax.stubRequest('/users').andReturn({
      status: 500,
      contentType: 'application/json',
      responseText: '{}'
    });

    TestUtils.Simulate.submit(form.getDOMNode());

    // Since ajax is returned as a promise (async), move assertion
    // to end of event loop
    setTimeout(function () {
      expect(onSubmitted).toHaveBeenCalled();
      done();
    }, 0);

  });

  it('should trigger an onError handler, if passed and the submit has responded with ERROR', function (done) {
    
    var onError = jasmine.createSpy("error");
    var form = TestUtils.renderIntoDocument(
      React.createElement(Formsy.Form, {url: "/users", onError: onError}
      )
    );
    
    // Do not return any error because there are no inputs
    jasmine.Ajax.stubRequest('/users').andReturn({
      status: 500,
      contentType: 'application/json',
      responseText: '{}'
    });

    TestUtils.Simulate.submit(form.getDOMNode());

    // Since ajax is returned as a promise (async), move assertion
    // to end of event loop
    setTimeout(function () {
      expect(onError).toHaveBeenCalledWith({});
      done();
    }, 0);

  });

});

},{"./../src/main.js":"/Users/christianalfoni/Documents/dev/formsy-react/src/main.js"}],"./specs/Validation-spec.js":[function(require,module,exports){
var Formsy = require('./../src/main.js');

describe('Validation', function() {

  it('should trigger an onValid handler, if passed, when form is valid', function () {
    
    var onValid = jasmine.createSpy('valid');
    var TestInput = React.createClass({displayName: "TestInput",
      mixins: [Formsy.Mixin],
      updateValue: function (event) {
        this.setValue(event.target.value);
      },
      render: function () {
        return React.createElement("input", {value: this.getValue(), onChange: this.updateValue})
      }
    });
    var form = TestUtils.renderIntoDocument(
      React.createElement(Formsy.Form, {onValid: onValid}, 
        React.createElement(TestInput, {name: "foo", required: true})
      )
    );

    var input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    TestUtils.Simulate.change(input, {target: {value: 'foo'}});
    expect(onValid).toHaveBeenCalled();

  });

  it('should trigger an onInvalid handler, if passed, when form is invalid', function () {
    
    var onInvalid = jasmine.createSpy('invalid');
    var TestInput = React.createClass({displayName: "TestInput",
      mixins: [Formsy.Mixin],
      updateValue: function (event) {
        this.setValue(event.target.value);
      },
      render: function () {
        return React.createElement("input", {value: this.getValue(), onChange: this.updateValue})
      }
    });
    var form = TestUtils.renderIntoDocument(
      React.createElement(Formsy.Form, {onValid: onInvalid}, 
        React.createElement(TestInput, {name: "foo", value: "foo"})
      )
    );

    var input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    TestUtils.Simulate.change(input, {target: {value: ''}});
    expect(onInvalid).toHaveBeenCalled();

  });

  it('RULE: isEmail', function () {
    
    var isValid = jasmine.createSpy('valid');
    var TestInput = React.createClass({displayName: "TestInput",
      mixins: [Formsy.Mixin],
      updateValue: function (event) {
        this.setValue(event.target.value);
      },
      render: function () {
        if (this.isValid()) {
          isValid();
        }
        return React.createElement("input", {value: this.getValue(), onChange: this.updateValue})
      }
    });
    var form = TestUtils.renderIntoDocument(
      React.createElement(Formsy.Form, null, 
        React.createElement(TestInput, {name: "foo", value: "foo", validations: "isEmail"})
      )
    );

    var input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    expect(isValid).not.toHaveBeenCalled();
    TestUtils.Simulate.change(input, {target: {value: 'foo@foo.com'}});
    expect(isValid).toHaveBeenCalled();

  });

});

},{"./../src/main.js":"/Users/christianalfoni/Documents/dev/formsy-react/src/main.js"}],"/Users/christianalfoni/Documents/dev/formsy-react/src/main.js":[function(require,module,exports){
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

},{"react":"react"}]},{},["./specs/Element-spec.js","./specs/Formsy-spec.js","./specs/Submit-spec.js","./specs/Validation-spec.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcGVjcy9FbGVtZW50LXNwZWMuanMiLCJzcGVjcy9Gb3Jtc3ktc3BlYy5qcyIsInNwZWNzL1N1Ym1pdC1zcGVjLmpzIiwic3BlY3MvVmFsaWRhdGlvbi1zcGVjLmpzIiwic3JjL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgRm9ybXN5ID0gcmVxdWlyZSgnLi8uLi9zcmMvbWFpbi5qcycpO1xuXG5kZXNjcmliZSgnRWxlbWVudCcsIGZ1bmN0aW9uKCkge1xuXG4gIGl0KCdzaG91bGQgcmV0dXJuIHBhc3NlZCBhbmQgc2V0VmFsdWUoKSB2YWx1ZSB3aGVuIHVzaW5nIGdldFZhbHVlKCknLCBmdW5jdGlvbiAoKSB7XG4gICAgXG4gICAgdmFyIFRlc3RJbnB1dCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJUZXN0SW5wdXRcIixcbiAgICAgIG1peGluczogW0Zvcm1zeS5NaXhpbl0sXG4gICAgICB1cGRhdGVWYWx1ZTogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuc2V0VmFsdWUoZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICAgIH0sXG4gICAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7dmFsdWU6IHRoaXMuZ2V0VmFsdWUoKSwgb25DaGFuZ2U6IHRoaXMudXBkYXRlVmFsdWV9KVxuICAgICAgfVxuICAgIH0pO1xuICAgIHZhciBmb3JtID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybXN5LkZvcm0sIG51bGwsIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRlc3RJbnB1dCwge25hbWU6IFwiZm9vXCIsIHZhbHVlOiBcImZvb1wifSlcbiAgICAgIClcbiAgICApO1xuXG4gICAgdmFyIGlucHV0ID0gVGVzdFV0aWxzLmZpbmRSZW5kZXJlZERPTUNvbXBvbmVudFdpdGhUYWcoZm9ybSwgJ0lOUFVUJyk7XG4gICAgZXhwZWN0KGlucHV0LmdldERPTU5vZGUoKS52YWx1ZSkudG9CZSgnZm9vJyk7XG4gICAgVGVzdFV0aWxzLlNpbXVsYXRlLmNoYW5nZShpbnB1dCwge3RhcmdldDoge3ZhbHVlOiAnZm9vYmFyJ319KTtcbiAgICBleHBlY3QoaW5wdXQuZ2V0RE9NTm9kZSgpLnZhbHVlKS50b0JlKCdmb29iYXInKTtcblxuICB9KTtcblxuICBpdCgnc2hvdWxkIHJldHVybiB0cnVlIG9yIGZhbHNlIHdoZW4gY2FsbGluZyBoYXNWYWx1ZSgpIGRlcGVuZGluZyBvbiB2YWx1ZSBleGlzdGFuY2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgXG4gICAgdmFyIHJlc2V0ID0gbnVsbDtcbiAgICB2YXIgVGVzdElucHV0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlRlc3RJbnB1dFwiLFxuICAgICAgbWl4aW5zOiBbRm9ybXN5Lk1peGluXSxcbiAgICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJlc2V0ID0gdGhpcy5yZXNldFZhbHVlO1xuICAgICAgfSxcbiAgICAgIHVwZGF0ZVZhbHVlOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5zZXRWYWx1ZShldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgfSxcbiAgICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHt2YWx1ZTogdGhpcy5nZXRWYWx1ZSgpLCBvbkNoYW5nZTogdGhpcy51cGRhdGVWYWx1ZX0pXG4gICAgICB9XG4gICAgfSk7XG4gICAgdmFyIGZvcm0gPSBUZXN0VXRpbHMucmVuZGVySW50b0RvY3VtZW50KFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3Jtc3kuRm9ybSwgbnVsbCwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGVzdElucHV0LCB7bmFtZTogXCJmb29cIiwgdmFsdWU6IFwiZm9vXCJ9KVxuICAgICAgKVxuICAgICk7XG5cbiAgICB2YXIgaW5wdXQgPSBUZXN0VXRpbHMuZmluZFJlbmRlcmVkRE9NQ29tcG9uZW50V2l0aFRhZyhmb3JtLCAnSU5QVVQnKTtcbiAgICByZXNldCgpO1xuICAgIGV4cGVjdChpbnB1dC5nZXRET01Ob2RlKCkudmFsdWUpLnRvQmUoJycpO1xuXG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgcmV0dXJuIGVycm9yIG1lc3NhZ2UgcGFzc2VkIHdoZW4gY2FsbGluZyBnZXRFcnJvck1lc3NhZ2UoKScsIGZ1bmN0aW9uICgpIHtcbiAgICBcbiAgICB2YXIgZ2V0RXJyb3JNZXNzYWdlID0gbnVsbDtcbiAgICB2YXIgVGVzdElucHV0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlRlc3RJbnB1dFwiLFxuICAgICAgbWl4aW5zOiBbRm9ybXN5Lk1peGluXSxcbiAgICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGdldEVycm9yTWVzc2FnZSA9IHRoaXMuZ2V0RXJyb3JNZXNzYWdlO1xuICAgICAgfSxcbiAgICAgIHVwZGF0ZVZhbHVlOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5zZXRWYWx1ZShldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgfSxcbiAgICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHt2YWx1ZTogdGhpcy5nZXRWYWx1ZSgpLCBvbkNoYW5nZTogdGhpcy51cGRhdGVWYWx1ZX0pXG4gICAgICB9XG4gICAgfSk7XG4gICAgdmFyIGZvcm0gPSBUZXN0VXRpbHMucmVuZGVySW50b0RvY3VtZW50KFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3Jtc3kuRm9ybSwgbnVsbCwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGVzdElucHV0LCB7bmFtZTogXCJmb29cIiwgdmFsdWU6IFwiZm9vXCIsIHZhbGlkYXRpb25zOiBcImlzRW1haWxcIiwgdmFsaWRhdGlvbkVycm9yOiBcIkhhcyB0byBiZSBlbWFpbFwifSlcbiAgICAgIClcbiAgICApO1xuXG4gICAgZXhwZWN0KGdldEVycm9yTWVzc2FnZSgpKS50b0JlKCdIYXMgdG8gYmUgZW1haWwnKTtcblxuICB9KTtcblxuICBpdCgnc2hvdWxkIHJldHVybiBzZXJ2ZXIgZXJyb3IgbWVzc2FnZSB3aGVuIGNhbGxpbmcgZ2V0RXJyb3JNZXNzYWdlKCknLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIFxuICAgIGphc21pbmUuQWpheC5pbnN0YWxsKCk7XG5cbiAgICB2YXIgZ2V0RXJyb3JNZXNzYWdlID0gbnVsbDtcbiAgICB2YXIgVGVzdElucHV0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlRlc3RJbnB1dFwiLFxuICAgICAgbWl4aW5zOiBbRm9ybXN5Lk1peGluXSxcbiAgICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGdldEVycm9yTWVzc2FnZSA9IHRoaXMuZ2V0RXJyb3JNZXNzYWdlO1xuICAgICAgfSxcbiAgICAgIHVwZGF0ZVZhbHVlOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5zZXRWYWx1ZShldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgfSxcbiAgICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHt2YWx1ZTogdGhpcy5nZXRWYWx1ZSgpLCBvbkNoYW5nZTogdGhpcy51cGRhdGVWYWx1ZX0pXG4gICAgICB9XG4gICAgfSk7XG4gICAgdmFyIGZvcm0gPSBUZXN0VXRpbHMucmVuZGVySW50b0RvY3VtZW50KFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3Jtc3kuRm9ybSwge3VybDogXCIvdXNlcnNcIn0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRlc3RJbnB1dCwge25hbWU6IFwiZm9vXCIsIHZhbHVlOiBcImZvb1wiLCB2YWxpZGF0aW9uczogXCJpc0VtYWlsXCIsIHZhbGlkYXRpb25FcnJvcjogXCJIYXMgdG8gYmUgZW1haWxcIn0pXG4gICAgICApXG4gICAgKTtcblxuICAgIHZhciBmb3JtID0gVGVzdFV0aWxzLlNpbXVsYXRlLnN1Ym1pdChmb3JtLmdldERPTU5vZGUoKSk7XG5cbiAgICBqYXNtaW5lLkFqYXgucmVxdWVzdHMubW9zdFJlY2VudCgpLnJlc3BvbmRXaXRoKHtcbiAgICAgIHN0YXR1czogNTAwLFxuICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgIHJlc3BvbnNlVGV4dDogJ3tcImZvb1wiOiBcImJhclwifSdcbiAgICB9KVxuXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBleHBlY3QoZ2V0RXJyb3JNZXNzYWdlKCkpLnRvQmUoJ2JhcicpO1xuICAgICAgamFzbWluZS5BamF4LnVuaW5zdGFsbCgpO1xuICAgICAgZG9uZSgpO1xuICAgIH0sIDApO1xuXG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgcmV0dXJuIHRydWUgb3IgZmFsc2Ugd2hlbiBjYWxsaW5nIGlzVmFsaWQoKSBkZXBlbmRpbmcgb24gdmFsaWQgc3RhdGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgXG4gICAgdmFyIGlzVmFsaWQgPSBudWxsO1xuICAgIHZhciBUZXN0SW5wdXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiVGVzdElucHV0XCIsXG4gICAgICBtaXhpbnM6IFtGb3Jtc3kuTWl4aW5dLFxuICAgICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaXNWYWxpZCA9IHRoaXMuaXNWYWxpZDtcbiAgICAgIH0sXG4gICAgICB1cGRhdGVWYWx1ZTogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdldmVudC50YXJnZXQudmFsdWUnLCBldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgICB0aGlzLnNldFZhbHVlKGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCd0aGlzLmdldFZhbHVlKCknLCB0aGlzLmdldFZhbHVlKCkpO1xuICAgICAgICB9LmJpbmQodGhpcyksIDEwMCk7XG4gICAgICB9LFxuICAgICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge3ZhbHVlOiB0aGlzLmdldFZhbHVlKCksIG9uQ2hhbmdlOiB0aGlzLnVwZGF0ZVZhbHVlfSlcbiAgICAgIH1cbiAgICB9KTtcbiAgICB2YXIgZm9ybSA9IFRlc3RVdGlscy5yZW5kZXJJbnRvRG9jdW1lbnQoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1zeS5Gb3JtLCB7dXJsOiBcIi91c2Vyc1wifSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGVzdElucHV0LCB7bmFtZTogXCJmb29cIiwgdmFsdWU6IFwiZm9vXCIsIHZhbGlkYXRpb25zOiBcImlzRW1haWxcIn0pXG4gICAgICApXG4gICAgKTtcblxuICAgIGV4cGVjdChpc1ZhbGlkKCkpLnRvQmUoZmFsc2UpO1xuICAgIHZhciBpbnB1dCA9IFRlc3RVdGlscy5maW5kUmVuZGVyZWRET01Db21wb25lbnRXaXRoVGFnKGZvcm0sICdJTlBVVCcpO1xuICAgIFRlc3RVdGlscy5TaW11bGF0ZS5jaGFuZ2UoaW5wdXQsIHt0YXJnZXQ6IHt2YWx1ZTogJ2Zvb0Bmb28uY29tJ319KTtcbiAgICBleHBlY3QoaXNWYWxpZCgpKS50b0JlKHRydWUpO1xuXG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgcmV0dXJuIHRydWUgb3IgZmFsc2Ugd2hlbiBjYWxsaW5nIGlzUmVxdWlyZWQoKSBkZXBlbmRpbmcgb24gcGFzc2VkIHJlcXVpcmVkIGF0dHJpYnV0ZScsIGZ1bmN0aW9uICgpIHtcbiAgICBcbiAgICB2YXIgaXNSZXF1aXJlZHMgPSBbXTtcbiAgICB2YXIgVGVzdElucHV0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlRlc3RJbnB1dFwiLFxuICAgICAgbWl4aW5zOiBbRm9ybXN5Lk1peGluXSxcbiAgICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlzUmVxdWlyZWRzLnB1c2godGhpcy5pc1JlcXVpcmVkKTtcbiAgICAgIH0sXG4gICAgICB1cGRhdGVWYWx1ZTogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuc2V0VmFsdWUoZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICAgIH0sXG4gICAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7dmFsdWU6IHRoaXMuZ2V0VmFsdWUoKSwgb25DaGFuZ2U6IHRoaXMudXBkYXRlVmFsdWV9KVxuICAgICAgfVxuICAgIH0pO1xuICAgIHZhciBmb3JtID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybXN5LkZvcm0sIHt1cmw6IFwiL3VzZXJzXCJ9LCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUZXN0SW5wdXQsIHtuYW1lOiBcImZvb1wiLCB2YWx1ZTogXCJmb29cIn0pLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUZXN0SW5wdXQsIHtuYW1lOiBcImZvb1wiLCB2YWx1ZTogXCJmb29cIiwgcmVxdWlyZWQ6IHRydWV9KVxuICAgICAgKVxuICAgICk7XG5cbiAgICBleHBlY3QoaXNSZXF1aXJlZHNbMF0oKSkudG9CZShmYWxzZSk7XG4gICAgZXhwZWN0KGlzUmVxdWlyZWRzWzFdKCkpLnRvQmUodHJ1ZSk7XG5cbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCByZXR1cm4gdHJ1ZSBvciBmYWxzZSB3aGVuIGNhbGxpbmcgc2hvd1JlcXVpcmVkKCkgZGVwZW5kaW5nIG9uIGlucHV0IGJlaW5nIGVtcHR5IGFuZCByZXF1aXJlZCBpcyBwYXNzZWQsIG9yIG5vdCcsIGZ1bmN0aW9uICgpIHtcbiAgICBcbiAgICB2YXIgc2hvd1JlcXVpcmVkcyA9IFtdO1xuICAgIHZhciBUZXN0SW5wdXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiVGVzdElucHV0XCIsXG4gICAgICBtaXhpbnM6IFtGb3Jtc3kuTWl4aW5dLFxuICAgICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2hvd1JlcXVpcmVkcy5wdXNoKHRoaXMuc2hvd1JlcXVpcmVkKTtcbiAgICAgIH0sXG4gICAgICB1cGRhdGVWYWx1ZTogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuc2V0VmFsdWUoZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICAgIH0sXG4gICAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7dmFsdWU6IHRoaXMuZ2V0VmFsdWUoKSwgb25DaGFuZ2U6IHRoaXMudXBkYXRlVmFsdWV9KVxuICAgICAgfVxuICAgIH0pO1xuICAgIHZhciBmb3JtID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybXN5LkZvcm0sIHt1cmw6IFwiL3VzZXJzXCJ9LCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUZXN0SW5wdXQsIHtuYW1lOiBcIkFcIiwgdmFsdWU6IFwiZm9vXCJ9KSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGVzdElucHV0LCB7bmFtZTogXCJCXCIsIHZhbHVlOiBcIlwiLCByZXF1aXJlZDogdHJ1ZX0pLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUZXN0SW5wdXQsIHtuYW1lOiBcIkNcIiwgdmFsdWU6IFwiXCJ9KVxuICAgICAgKVxuICAgICk7XG5cbiAgICBleHBlY3Qoc2hvd1JlcXVpcmVkc1swXSgpKS50b0JlKGZhbHNlKTtcbiAgICBleHBlY3Qoc2hvd1JlcXVpcmVkc1sxXSgpKS50b0JlKHRydWUpO1xuICAgIGV4cGVjdChzaG93UmVxdWlyZWRzWzJdKCkpLnRvQmUoZmFsc2UpO1xuXG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgcmV0dXJuIHRydWUgb3IgZmFsc2Ugd2hlbiBjYWxsaW5nIHNob3dFcnJvcigpIGRlcGVuZGluZyBvbiB2YWx1ZSBpcyBpbnZhbGlkIG9yIGEgc2VydmVyIGVycm9yIGhhcyBhcnJpdmVkLCBvciBub3QnLCBmdW5jdGlvbiAoZG9uZSkge1xuXG4gICAgdmFyIHNob3dFcnJvciA9IG51bGw7XG4gICAgdmFyIFRlc3RJbnB1dCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJUZXN0SW5wdXRcIixcbiAgICAgIG1peGluczogW0Zvcm1zeS5NaXhpbl0sXG4gICAgICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gKCkge1xuICAgICAgICBzaG93RXJyb3IgPSB0aGlzLnNob3dFcnJvcjtcbiAgICAgIH0sXG4gICAgICB1cGRhdGVWYWx1ZTogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuc2V0VmFsdWUoZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICAgIH0sXG4gICAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7dmFsdWU6IHRoaXMuZ2V0VmFsdWUoKSwgb25DaGFuZ2U6IHRoaXMudXBkYXRlVmFsdWV9KVxuICAgICAgfVxuICAgIH0pO1xuICAgIHZhciBmb3JtID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybXN5LkZvcm0sIHt1cmw6IFwiL3VzZXJzXCJ9LCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUZXN0SW5wdXQsIHtuYW1lOiBcImZvb1wiLCB2YWx1ZTogXCJmb29cIiwgdmFsaWRhdGlvbnM6IFwiaXNFbWFpbFwiLCB2YWxpZGF0aW9uRXJyb3I6IFwiVGhpcyBpcyBub3QgYW4gZW1haWxcIn0pXG4gICAgICApXG4gICAgKTtcblxuICAgIGV4cGVjdChzaG93RXJyb3IoKSkudG9CZSh0cnVlKTtcblxuICAgIHZhciBpbnB1dCA9IFRlc3RVdGlscy5maW5kUmVuZGVyZWRET01Db21wb25lbnRXaXRoVGFnKGZvcm0sICdJTlBVVCcpO1xuICAgIFRlc3RVdGlscy5TaW11bGF0ZS5jaGFuZ2UoaW5wdXQsIHt0YXJnZXQ6IHt2YWx1ZTogJ2Zvb0Bmb28uY29tJ319KTtcbiAgICBleHBlY3Qoc2hvd0Vycm9yKCkpLnRvQmUoZmFsc2UpO1xuXG4gICAgamFzbWluZS5BamF4Lmluc3RhbGwoKTtcbiAgICBUZXN0VXRpbHMuU2ltdWxhdGUuc3VibWl0KGZvcm0uZ2V0RE9NTm9kZSgpKTsgICAgXG4gICAgamFzbWluZS5BamF4LnJlcXVlc3RzLm1vc3RSZWNlbnQoKS5yZXNwb25kV2l0aCh7XG4gICAgICBzdGF0dXM6IDUwMCxcbiAgICAgIHJlc3BvbnNlVHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgcmVzcG9uc2VUZXh0OiAne1wiZm9vXCI6IFwiRW1haWwgYWxyZWFkeSBleGlzdHNcIn0nXG4gICAgfSk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBleHBlY3Qoc2hvd0Vycm9yKCkpLnRvQmUodHJ1ZSk7XG4gICAgICBqYXNtaW5lLkFqYXgudW5pbnN0YWxsKCk7XG4gICAgICBkb25lKCk7XG4gICAgfSwgMCk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgcmV0dXJuIHRydWUgb3IgZmFsc2Ugd2hlbiBjYWxsaW5nIGlzUHJlc3RpbmUoKSBkZXBlbmRpbmcgb24gaW5wdXQgaGFzIGJlZW4gXCJ0b3VjaGVkXCIgb3Igbm90JywgZnVuY3Rpb24gKCkge1xuICAgIFxuICAgIHZhciBpc1ByaXN0aW5lID0gbnVsbDtcbiAgICB2YXIgVGVzdElucHV0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlRlc3RJbnB1dFwiLFxuICAgICAgbWl4aW5zOiBbRm9ybXN5Lk1peGluXSxcbiAgICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlzUHJpc3RpbmUgPSB0aGlzLmlzUHJpc3RpbmU7XG4gICAgICB9LFxuICAgICAgdXBkYXRlVmFsdWU6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICB0aGlzLnNldFZhbHVlKGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gICAgICB9LFxuICAgICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge3ZhbHVlOiB0aGlzLmdldFZhbHVlKCksIG9uQ2hhbmdlOiB0aGlzLnVwZGF0ZVZhbHVlfSlcbiAgICAgIH1cbiAgICB9KTtcbiAgICB2YXIgZm9ybSA9IFRlc3RVdGlscy5yZW5kZXJJbnRvRG9jdW1lbnQoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1zeS5Gb3JtLCB7dXJsOiBcIi91c2Vyc1wifSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGVzdElucHV0LCB7bmFtZTogXCJBXCIsIHZhbHVlOiBcImZvb1wifSlcbiAgICAgIClcbiAgICApO1xuXG4gICAgZXhwZWN0KGlzUHJpc3RpbmUoKSkudG9CZSh0cnVlKTtcbiAgICB2YXIgaW5wdXQgPSBUZXN0VXRpbHMuZmluZFJlbmRlcmVkRE9NQ29tcG9uZW50V2l0aFRhZyhmb3JtLCAnSU5QVVQnKTtcbiAgICBUZXN0VXRpbHMuU2ltdWxhdGUuY2hhbmdlKGlucHV0LCB7dGFyZ2V0OiB7dmFsdWU6ICdmb28nfX0pO1xuICAgIGV4cGVjdChpc1ByaXN0aW5lKCkpLnRvQmUoZmFsc2UpO1xuICAgIFxuICB9KTtcblxufSk7XG4iLCJ2YXIgRm9ybXN5ID0gcmVxdWlyZSgnLi8uLi9zcmMvbWFpbi5qcycpO1xuXG5kZXNjcmliZSgnRm9ybXN5JywgZnVuY3Rpb24oKSB7XG5cbiAgZGVzY3JpYmUoJ1NldHRpbmcgdXAgYSBmb3JtJywgZnVuY3Rpb24gKCkge1xuICAgIFxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGEgZm9ybSBpbnRvIHRoZSBkb2N1bWVudCcsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGZvcm0gPSBUZXN0VXRpbHMucmVuZGVySW50b0RvY3VtZW50KFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1zeS5Gb3JtLCBudWxsKVxuICAgICAgKTtcbiAgICAgIGV4cGVjdChmb3JtLmdldERPTU5vZGUoKS50YWdOYW1lKS50b0VxdWFsKCdGT1JNJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHNldCBhIGNsYXNzIG5hbWUgaWYgcGFzc2VkJywgZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGZvcm0gPSBUZXN0VXRpbHMucmVuZGVySW50b0RvY3VtZW50KFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1zeS5Gb3JtLCB7Y2xhc3NOYW1lOiBcImZvb1wifSlcbiAgICAgICk7XG4gICAgICBleHBlY3QoZm9ybS5nZXRET01Ob2RlKCkuY2xhc3NOYW1lKS50b0VxdWFsKCdmb28nKTtcbiAgICB9KTtcblxuICB9KTtcblxufSk7XG4iLCJ2YXIgRm9ybXN5ID0gcmVxdWlyZSgnLi8uLi9zcmMvbWFpbi5qcycpO1xuXG5kZXNjcmliZSgnQWpheCcsIGZ1bmN0aW9uKCkge1xuXG4gIGJlZm9yZUVhY2goZnVuY3Rpb24gKCkge1xuICAgIGphc21pbmUuQWpheC5pbnN0YWxsKCk7XG4gIH0pO1xuXG4gIGFmdGVyRWFjaChmdW5jdGlvbiAoKSB7XG4gICAgamFzbWluZS5BamF4LnVuaW5zdGFsbCgpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHBvc3QgdG8gYSBnaXZlbiB1cmwgaWYgcGFzc2VkJywgZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIGZvcm0gPSBUZXN0VXRpbHMucmVuZGVySW50b0RvY3VtZW50KFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3Jtc3kuRm9ybSwge3VybDogXCIvdXNlcnNcIn1cbiAgICAgIClcbiAgICApO1xuICAgIFxuICAgIFRlc3RVdGlscy5TaW11bGF0ZS5zdWJtaXQoZm9ybS5nZXRET01Ob2RlKCkpO1xuICAgIGV4cGVjdChqYXNtaW5lLkFqYXgucmVxdWVzdHMubW9zdFJlY2VudCgpLnVybCkudG9CZSgnL3VzZXJzJyk7XG4gICAgZXhwZWN0KGphc21pbmUuQWpheC5yZXF1ZXN0cy5tb3N0UmVjZW50KCkubWV0aG9kKS50b0JlKCdQT1NUJyk7XG5cbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBwdXQgdG8gYSBnaXZlbiB1cmwgaWYgcGFzc2VkIGEgbWV0aG9kIGF0dHJpYnV0ZScsIGZ1bmN0aW9uICgpIHtcblxuICAgIHZhciBmb3JtID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybXN5LkZvcm0sIHt1cmw6IFwiL3VzZXJzXCIsIG1ldGhvZDogXCJQVVRcIn1cbiAgICAgIClcbiAgICApO1xuICAgIFxuICAgIFRlc3RVdGlscy5TaW11bGF0ZS5zdWJtaXQoZm9ybS5nZXRET01Ob2RlKCkpO1xuICAgIGV4cGVjdChqYXNtaW5lLkFqYXgucmVxdWVzdHMubW9zdFJlY2VudCgpLnVybCkudG9CZSgnL3VzZXJzJyk7XG4gICAgZXhwZWN0KGphc21pbmUuQWpheC5yZXF1ZXN0cy5tb3N0UmVjZW50KCkubWV0aG9kKS50b0JlKCdQVVQnKTtcblxuICB9KTtcblxuICBpdCgnc2hvdWxkIHBhc3MgeC13d3ctZm9ybS11cmxlbmNvZGVkIGFzIGNvbnRlbnRUeXBlIHdoZW4gdXJsZW5jb2RlZCBpcyBzZXQgYXMgY29udGVudFR5cGUnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICB2YXIgZm9ybSA9IFRlc3RVdGlscy5yZW5kZXJJbnRvRG9jdW1lbnQoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1zeS5Gb3JtLCB7dXJsOiBcIi91c2Vyc1wiLCBjb250ZW50VHlwZTogXCJ1cmxlbmNvZGVkXCJ9XG4gICAgICApXG4gICAgKTtcbiAgICBcbiAgICBUZXN0VXRpbHMuU2ltdWxhdGUuc3VibWl0KGZvcm0uZ2V0RE9NTm9kZSgpKTtcbiAgICBleHBlY3QoamFzbWluZS5BamF4LnJlcXVlc3RzLm1vc3RSZWNlbnQoKS5jb250ZW50VHlwZSgpKS50b0JlKCdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKTtcblxuICB9KTtcblxuICBpdCgnc2hvdWxkIHJ1biBhbiBvblN1Y2Nlc3MgaGFuZGxlciwgaWYgcGFzc2VkIGFuZCBhamF4IGlzIHN1Y2Nlc3NmdWxsLiBGaXJzdCBhcmd1bWVudCBpcyBkYXRhIGZyb20gc2VydmVyJywgZnVuY3Rpb24gKGRvbmUpIHtcbiBcbiAgICB2YXIgb25TdWNjZXNzID0gamFzbWluZS5jcmVhdGVTcHkoXCJzdWNjZXNzXCIpO1xuICAgIHZhciBmb3JtID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybXN5LkZvcm0sIHt1cmw6IFwiL3VzZXJzXCIsIG9uU3VjY2Vzczogb25TdWNjZXNzfVxuICAgICAgKVxuICAgICk7XG4gICAgXG4gICAgamFzbWluZS5BamF4LnN0dWJSZXF1ZXN0KCcvdXNlcnMnKS5hbmRSZXR1cm4oe1xuICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgcmVzcG9uc2VUZXh0OiAne30nXG4gICAgfSk7XG5cbiAgICBUZXN0VXRpbHMuU2ltdWxhdGUuc3VibWl0KGZvcm0uZ2V0RE9NTm9kZSgpKTtcblxuICAgIC8vIFNpbmNlIGFqYXggaXMgcmV0dXJuZWQgYXMgYSBwcm9taXNlIChhc3luYyksIG1vdmUgYXNzZXJ0aW9uXG4gICAgLy8gdG8gZW5kIG9mIGV2ZW50IGxvb3BcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGV4cGVjdChvblN1Y2Nlc3MpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHt9KTtcbiAgICAgIGRvbmUoKTtcbiAgICB9LCAwKTtcblxuICB9KTtcblxuICBpdCgnc2hvdWxkIG5vdCBkbyBhamF4IHJlcXVlc3QgaWYgb25TdWJtaXQgaGFuZGxlciBpcyBwYXNzZWQsIGJ1dCBwYXNzIHRoZSBtb2RlbCBhcyBmaXJzdCBhcmd1bWVudCB0byBvblN1Ym1pdCBoYW5kbGVyJywgZnVuY3Rpb24gKCkge1xuICAgIFxuICAgIHZhciBUZXN0SW5wdXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiVGVzdElucHV0XCIsXG4gICAgICBtaXhpbnM6IFtGb3Jtc3kuTWl4aW5dLFxuICAgICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge3ZhbHVlOiB0aGlzLmdldFZhbHVlKCl9KVxuICAgICAgfVxuICAgIH0pO1xuICAgIHZhciBmb3JtID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybXN5LkZvcm0sIHtvblN1Ym1pdDogb25TdWJtaXR9LCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUZXN0SW5wdXQsIHtuYW1lOiBcImZvb1wiLCB2YWx1ZTogXCJiYXJcIn0pXG4gICAgICApXG4gICAgKTtcblxuICAgIFRlc3RVdGlscy5TaW11bGF0ZS5zdWJtaXQoZm9ybS5nZXRET01Ob2RlKCkpO1xuXG4gICAgZXhwZWN0KGphc21pbmUuQWpheC5yZXF1ZXN0cy5jb3VudCgpKS50b0JlKDApO1xuXG4gICAgZnVuY3Rpb24gb25TdWJtaXQgKGRhdGEpIHtcbiAgICAgIGV4cGVjdChkYXRhKS50b0VxdWFsKHtcbiAgICAgICAgZm9vOiAnYmFyJ1xuICAgICAgfSk7XG4gICAgfVxuXG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgdHJpZ2dlciBhbiBvblN1Ym1pdHRlZCBoYW5kbGVyLCBpZiBwYXNzZWQgYW5kIHRoZSBzdWJtaXQgaGFzIHJlc3BvbmRlZCB3aXRoIFNVQ0NFU1MnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIFxuICAgIHZhciBvblN1Ym1pdHRlZCA9IGphc21pbmUuY3JlYXRlU3B5KFwic3VibWl0dGVkXCIpO1xuICAgIHZhciBmb3JtID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybXN5LkZvcm0sIHt1cmw6IFwiL3VzZXJzXCIsIG9uU3VibWl0dGVkOiBvblN1Ym1pdHRlZH1cbiAgICAgIClcbiAgICApO1xuICAgIFxuICAgIGphc21pbmUuQWpheC5zdHViUmVxdWVzdCgnL3VzZXJzJykuYW5kUmV0dXJuKHtcbiAgICAgIHN0YXR1czogMjAwLFxuICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgIHJlc3BvbnNlVGV4dDogJ3t9J1xuICAgIH0pO1xuXG4gICAgVGVzdFV0aWxzLlNpbXVsYXRlLnN1Ym1pdChmb3JtLmdldERPTU5vZGUoKSk7XG5cbiAgICAvLyBTaW5jZSBhamF4IGlzIHJldHVybmVkIGFzIGEgcHJvbWlzZSAoYXN5bmMpLCBtb3ZlIGFzc2VydGlvblxuICAgIC8vIHRvIGVuZCBvZiBldmVudCBsb29wXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBleHBlY3Qob25TdWJtaXR0ZWQpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgIGRvbmUoKTtcbiAgICB9LCAwKTtcblxuICB9KTtcblxuICBpdCgnc2hvdWxkIHRyaWdnZXIgYW4gb25TdWJtaXR0ZWQgaGFuZGxlciwgaWYgcGFzc2VkIGFuZCB0aGUgc3VibWl0IGhhcyByZXNwb25kZWQgd2l0aCBFUlJPUicsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgXG4gICAgdmFyIG9uU3VibWl0dGVkID0gamFzbWluZS5jcmVhdGVTcHkoXCJzdWJtaXR0ZWRcIik7XG4gICAgdmFyIGZvcm0gPSBUZXN0VXRpbHMucmVuZGVySW50b0RvY3VtZW50KFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3Jtc3kuRm9ybSwge3VybDogXCIvdXNlcnNcIiwgb25TdWJtaXR0ZWQ6IG9uU3VibWl0dGVkfVxuICAgICAgKVxuICAgICk7XG4gICAgXG4gICAgamFzbWluZS5BamF4LnN0dWJSZXF1ZXN0KCcvdXNlcnMnKS5hbmRSZXR1cm4oe1xuICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgcmVzcG9uc2VUZXh0OiAne30nXG4gICAgfSk7XG5cbiAgICBUZXN0VXRpbHMuU2ltdWxhdGUuc3VibWl0KGZvcm0uZ2V0RE9NTm9kZSgpKTtcblxuICAgIC8vIFNpbmNlIGFqYXggaXMgcmV0dXJuZWQgYXMgYSBwcm9taXNlIChhc3luYyksIG1vdmUgYXNzZXJ0aW9uXG4gICAgLy8gdG8gZW5kIG9mIGV2ZW50IGxvb3BcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGV4cGVjdChvblN1Ym1pdHRlZCkudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgZG9uZSgpO1xuICAgIH0sIDApO1xuXG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgdHJpZ2dlciBhbiBvbkVycm9yIGhhbmRsZXIsIGlmIHBhc3NlZCBhbmQgdGhlIHN1Ym1pdCBoYXMgcmVzcG9uZGVkIHdpdGggRVJST1InLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIFxuICAgIHZhciBvbkVycm9yID0gamFzbWluZS5jcmVhdGVTcHkoXCJlcnJvclwiKTtcbiAgICB2YXIgZm9ybSA9IFRlc3RVdGlscy5yZW5kZXJJbnRvRG9jdW1lbnQoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1zeS5Gb3JtLCB7dXJsOiBcIi91c2Vyc1wiLCBvbkVycm9yOiBvbkVycm9yfVxuICAgICAgKVxuICAgICk7XG4gICAgXG4gICAgLy8gRG8gbm90IHJldHVybiBhbnkgZXJyb3IgYmVjYXVzZSB0aGVyZSBhcmUgbm8gaW5wdXRzXG4gICAgamFzbWluZS5BamF4LnN0dWJSZXF1ZXN0KCcvdXNlcnMnKS5hbmRSZXR1cm4oe1xuICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgcmVzcG9uc2VUZXh0OiAne30nXG4gICAgfSk7XG5cbiAgICBUZXN0VXRpbHMuU2ltdWxhdGUuc3VibWl0KGZvcm0uZ2V0RE9NTm9kZSgpKTtcblxuICAgIC8vIFNpbmNlIGFqYXggaXMgcmV0dXJuZWQgYXMgYSBwcm9taXNlIChhc3luYyksIG1vdmUgYXNzZXJ0aW9uXG4gICAgLy8gdG8gZW5kIG9mIGV2ZW50IGxvb3BcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGV4cGVjdChvbkVycm9yKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7fSk7XG4gICAgICBkb25lKCk7XG4gICAgfSwgMCk7XG5cbiAgfSk7XG5cbn0pO1xuIiwidmFyIEZvcm1zeSA9IHJlcXVpcmUoJy4vLi4vc3JjL21haW4uanMnKTtcblxuZGVzY3JpYmUoJ1ZhbGlkYXRpb24nLCBmdW5jdGlvbigpIHtcblxuICBpdCgnc2hvdWxkIHRyaWdnZXIgYW4gb25WYWxpZCBoYW5kbGVyLCBpZiBwYXNzZWQsIHdoZW4gZm9ybSBpcyB2YWxpZCcsIGZ1bmN0aW9uICgpIHtcbiAgICBcbiAgICB2YXIgb25WYWxpZCA9IGphc21pbmUuY3JlYXRlU3B5KCd2YWxpZCcpO1xuICAgIHZhciBUZXN0SW5wdXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiVGVzdElucHV0XCIsXG4gICAgICBtaXhpbnM6IFtGb3Jtc3kuTWl4aW5dLFxuICAgICAgdXBkYXRlVmFsdWU6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICB0aGlzLnNldFZhbHVlKGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gICAgICB9LFxuICAgICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge3ZhbHVlOiB0aGlzLmdldFZhbHVlKCksIG9uQ2hhbmdlOiB0aGlzLnVwZGF0ZVZhbHVlfSlcbiAgICAgIH1cbiAgICB9KTtcbiAgICB2YXIgZm9ybSA9IFRlc3RVdGlscy5yZW5kZXJJbnRvRG9jdW1lbnQoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1zeS5Gb3JtLCB7b25WYWxpZDogb25WYWxpZH0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRlc3RJbnB1dCwge25hbWU6IFwiZm9vXCIsIHJlcXVpcmVkOiB0cnVlfSlcbiAgICAgIClcbiAgICApO1xuXG4gICAgdmFyIGlucHV0ID0gVGVzdFV0aWxzLmZpbmRSZW5kZXJlZERPTUNvbXBvbmVudFdpdGhUYWcoZm9ybSwgJ0lOUFVUJyk7XG4gICAgVGVzdFV0aWxzLlNpbXVsYXRlLmNoYW5nZShpbnB1dCwge3RhcmdldDoge3ZhbHVlOiAnZm9vJ319KTtcbiAgICBleHBlY3Qob25WYWxpZCkudG9IYXZlQmVlbkNhbGxlZCgpO1xuXG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgdHJpZ2dlciBhbiBvbkludmFsaWQgaGFuZGxlciwgaWYgcGFzc2VkLCB3aGVuIGZvcm0gaXMgaW52YWxpZCcsIGZ1bmN0aW9uICgpIHtcbiAgICBcbiAgICB2YXIgb25JbnZhbGlkID0gamFzbWluZS5jcmVhdGVTcHkoJ2ludmFsaWQnKTtcbiAgICB2YXIgVGVzdElucHV0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlRlc3RJbnB1dFwiLFxuICAgICAgbWl4aW5zOiBbRm9ybXN5Lk1peGluXSxcbiAgICAgIHVwZGF0ZVZhbHVlOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5zZXRWYWx1ZShldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgfSxcbiAgICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHt2YWx1ZTogdGhpcy5nZXRWYWx1ZSgpLCBvbkNoYW5nZTogdGhpcy51cGRhdGVWYWx1ZX0pXG4gICAgICB9XG4gICAgfSk7XG4gICAgdmFyIGZvcm0gPSBUZXN0VXRpbHMucmVuZGVySW50b0RvY3VtZW50KFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3Jtc3kuRm9ybSwge29uVmFsaWQ6IG9uSW52YWxpZH0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRlc3RJbnB1dCwge25hbWU6IFwiZm9vXCIsIHZhbHVlOiBcImZvb1wifSlcbiAgICAgIClcbiAgICApO1xuXG4gICAgdmFyIGlucHV0ID0gVGVzdFV0aWxzLmZpbmRSZW5kZXJlZERPTUNvbXBvbmVudFdpdGhUYWcoZm9ybSwgJ0lOUFVUJyk7XG4gICAgVGVzdFV0aWxzLlNpbXVsYXRlLmNoYW5nZShpbnB1dCwge3RhcmdldDoge3ZhbHVlOiAnJ319KTtcbiAgICBleHBlY3Qob25JbnZhbGlkKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG5cbiAgfSk7XG5cbiAgaXQoJ1JVTEU6IGlzRW1haWwnLCBmdW5jdGlvbiAoKSB7XG4gICAgXG4gICAgdmFyIGlzVmFsaWQgPSBqYXNtaW5lLmNyZWF0ZVNweSgndmFsaWQnKTtcbiAgICB2YXIgVGVzdElucHV0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlRlc3RJbnB1dFwiLFxuICAgICAgbWl4aW5zOiBbRm9ybXN5Lk1peGluXSxcbiAgICAgIHVwZGF0ZVZhbHVlOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5zZXRWYWx1ZShldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgfSxcbiAgICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICBpc1ZhbGlkKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7dmFsdWU6IHRoaXMuZ2V0VmFsdWUoKSwgb25DaGFuZ2U6IHRoaXMudXBkYXRlVmFsdWV9KVxuICAgICAgfVxuICAgIH0pO1xuICAgIHZhciBmb3JtID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybXN5LkZvcm0sIG51bGwsIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRlc3RJbnB1dCwge25hbWU6IFwiZm9vXCIsIHZhbHVlOiBcImZvb1wiLCB2YWxpZGF0aW9uczogXCJpc0VtYWlsXCJ9KVxuICAgICAgKVxuICAgICk7XG5cbiAgICB2YXIgaW5wdXQgPSBUZXN0VXRpbHMuZmluZFJlbmRlcmVkRE9NQ29tcG9uZW50V2l0aFRhZyhmb3JtLCAnSU5QVVQnKTtcbiAgICBleHBlY3QoaXNWYWxpZCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICBUZXN0VXRpbHMuU2ltdWxhdGUuY2hhbmdlKGlucHV0LCB7dGFyZ2V0OiB7dmFsdWU6ICdmb29AZm9vLmNvbSd9fSk7XG4gICAgZXhwZWN0KGlzVmFsaWQpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcblxuICB9KTtcblxufSk7XG4iLCJ2YXIgUmVhY3QgPSBnbG9iYWwuUmVhY3QgfHwgcmVxdWlyZSgncmVhY3QnKTtcbnZhciBGb3Jtc3kgPSB7fTtcbnZhciB2YWxpZGF0aW9uUnVsZXMgPSB7XG4gICdpc1ZhbHVlJzogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlICE9PSAnJztcbiAgfSxcbiAgJ2lzRW1haWwnOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUubWF0Y2goL14oKChbYS16XXxcXGR8WyEjXFwkJSYnXFwqXFwrXFwtXFwvPVxcP1xcXl9ge1xcfH1+XXxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkrKFxcLihbYS16XXxcXGR8WyEjXFwkJSYnXFwqXFwrXFwtXFwvPVxcP1xcXl9ge1xcfH1+XXxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkrKSopfCgoXFx4MjIpKCgoKFxceDIwfFxceDA5KSooXFx4MGRcXHgwYSkpPyhcXHgyMHxcXHgwOSkrKT8oKFtcXHgwMS1cXHgwOFxceDBiXFx4MGNcXHgwZS1cXHgxZlxceDdmXXxcXHgyMXxbXFx4MjMtXFx4NWJdfFtcXHg1ZC1cXHg3ZV18W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pfChcXFxcKFtcXHgwMS1cXHgwOVxceDBiXFx4MGNcXHgwZC1cXHg3Zl18W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pKSkpKigoKFxceDIwfFxceDA5KSooXFx4MGRcXHgwYSkpPyhcXHgyMHxcXHgwOSkrKT8oXFx4MjIpKSlAKCgoW2Etel18XFxkfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKXwoKFthLXpdfFxcZHxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkoW2Etel18XFxkfC18XFwufF98fnxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkqKFthLXpdfFxcZHxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkpKVxcLikrKChbYS16XXxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSl8KChbYS16XXxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkoW2Etel18XFxkfC18XFwufF98fnxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkqKFthLXpdfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKSkpJC9pKTtcbiAgfSxcbiAgJ2lzVHJ1ZSc6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gdHJ1ZTtcbiAgfSxcbiAgJ2lzTnVtZXJpYyc6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZS5tYXRjaCgvXi0/WzAtOV0rJC8pXG4gIH0sXG4gICdpc0FscGhhJzogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlLm1hdGNoKC9eW2EtekEtWl0rJC8pO1xuICB9LFxuICAnaXNXb3Jkcyc6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZS5tYXRjaCgvXlthLXpBLVpcXHNdKyQvKTtcbiAgfSxcbiAgJ2lzU3BlY2lhbFdvcmRzJzogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlLm1hdGNoKC9eW2EtekEtWlxcc1xcdTAwQzAtXFx1MDE3Rl0rJC8pO1xuICB9LFxuICBpc0xlbmd0aDogZnVuY3Rpb24gKHZhbHVlLCBtaW4sIG1heCkge1xuICAgIGlmIChtYXggIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHZhbHVlLmxlbmd0aCA+PSBtaW4gJiYgdmFsdWUubGVuZ3RoIDw9IG1heDtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlLmxlbmd0aCA+PSBtaW47XG4gIH0sXG4gIGVxdWFsczogZnVuY3Rpb24gKHZhbHVlLCBlcWwpIHtcbiAgICByZXR1cm4gdmFsdWUgPT0gZXFsO1xuICB9XG59O1xuXG52YXIgdG9VUkxFbmNvZGVkID0gZnVuY3Rpb24gKGVsZW1lbnQsIGtleSwgbGlzdCkge1xuICB2YXIgbGlzdCA9IGxpc3QgfHwgW107XG4gIGlmICh0eXBlb2YgKGVsZW1lbnQpID09ICdvYmplY3QnKSB7XG4gICAgZm9yICh2YXIgaWR4IGluIGVsZW1lbnQpXG4gICAgICB0b1VSTEVuY29kZWQoZWxlbWVudFtpZHhdLCBrZXkgPyBrZXkgKyAnWycgKyBpZHggKyAnXScgOiBpZHgsIGxpc3QpO1xuICB9IGVsc2Uge1xuICAgIGxpc3QucHVzaChrZXkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQoZWxlbWVudCkpO1xuICB9XG4gIHJldHVybiBsaXN0LmpvaW4oJyYnKTtcbn07XG5cbnZhciByZXF1ZXN0ID0gZnVuY3Rpb24gKG1ldGhvZCwgdXJsLCBkYXRhLCBjb250ZW50VHlwZSwgaGVhZGVycykge1xuXG4gIHZhciBjb250ZW50VHlwZSA9IGNvbnRlbnRUeXBlID09PSAndXJsZW5jb2RlZCcgPyAnYXBwbGljYXRpb24vJyArIGNvbnRlbnRUeXBlLnJlcGxhY2UoJ3VybGVuY29kZWQnLCAneC13d3ctZm9ybS11cmxlbmNvZGVkJykgOiAnYXBwbGljYXRpb24vanNvbic7XG4gIGRhdGEgPSBjb250ZW50VHlwZSA9PT0gJ2FwcGxpY2F0aW9uL2pzb24nID8gSlNPTi5zdHJpbmdpZnkoZGF0YSkgOiB0b1VSTEVuY29kZWQoZGF0YSk7XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICB0cnkge1xuICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgeGhyLm9wZW4obWV0aG9kLCB1cmwsIHRydWUpO1xuICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0FjY2VwdCcsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgY29udGVudFR5cGUpO1xuXG4gICAgICAvLyBBZGQgcGFzc2VkIGhlYWRlcnNcbiAgICAgIE9iamVjdC5rZXlzKGhlYWRlcnMpLmZvckVhY2goZnVuY3Rpb24gKGhlYWRlcikge1xuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihoZWFkZXIsIGhlYWRlcnNbaGVhZGVyXSk7XG4gICAgICB9KTtcblxuICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0geGhyLnJlc3BvbnNlVGV4dCA/IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCkgOiBudWxsO1xuICAgICAgICAgICAgaWYgKHhoci5zdGF0dXMgPj0gMjAwICYmIHhoci5zdGF0dXMgPCAzMDApIHtcbiAgICAgICAgICAgICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZWplY3QocmVzcG9uc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHJlamVjdChlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHhoci5zZW5kKGRhdGEpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJlamVjdChlKTtcbiAgICB9XG4gIH0pO1xuXG59O1xudmFyIGFqYXggPSB7XG4gIHBvc3Q6IHJlcXVlc3QuYmluZChudWxsLCAnUE9TVCcpLFxuICBwdXQ6IHJlcXVlc3QuYmluZChudWxsLCAnUFVUJylcbn07XG52YXIgb3B0aW9ucyA9IHt9O1xuXG5Gb3Jtc3kuZGVmYXVsdHMgPSBmdW5jdGlvbiAocGFzc2VkT3B0aW9ucykge1xuICBvcHRpb25zID0gcGFzc2VkT3B0aW9ucztcbn07XG5cbkZvcm1zeS5NaXhpbiA9IHtcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIF92YWx1ZTogdGhpcy5wcm9wcy52YWx1ZSA/IHRoaXMucHJvcHMudmFsdWUgOiAnJyxcbiAgICAgIF9pc1ZhbGlkOiB0cnVlLFxuICAgICAgX2lzUHJpc3RpbmU6IHRydWVcbiAgICB9O1xuICB9LFxuICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uICgpIHtcblxuICAgIGlmICghdGhpcy5wcm9wcy5uYW1lKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Zvcm0gSW5wdXQgcmVxdWlyZXMgYSBuYW1lIHByb3BlcnR5IHdoZW4gdXNlZCcpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5wcm9wcy5fYXR0YWNoVG9Gb3JtKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Zvcm0gTWl4aW4gcmVxdWlyZXMgY29tcG9uZW50IHRvIGJlIG5lc3RlZCBpbiBhIEZvcm0nKTtcbiAgICB9XG5cbiAgICAvLyBBZGQgdmFsaWRhdGlvbnMgdG8gdGhlIHN0b3JlIGl0c2VsZiBhcyB0aGUgcHJvcHMgb2JqZWN0IGNhbiBub3QgYmUgbW9kaWZpZWRcbiAgICB0aGlzLl92YWxpZGF0aW9ucyA9IHRoaXMucHJvcHMudmFsaWRhdGlvbnMgfHwgJyc7XG5cbiAgICBpZiAodGhpcy5wcm9wcy5yZXF1aXJlZCkge1xuICAgICAgdGhpcy5fdmFsaWRhdGlvbnMgPSB0aGlzLnByb3BzLnZhbGlkYXRpb25zID8gdGhpcy5wcm9wcy52YWxpZGF0aW9ucyArICcsJyA6ICcnO1xuICAgICAgdGhpcy5fdmFsaWRhdGlvbnMgKz0gJ2lzVmFsdWUnO1xuICAgIH1cbiAgICB0aGlzLnByb3BzLl9hdHRhY2hUb0Zvcm0odGhpcyk7XG4gIH0sXG5cbiAgLy8gV2UgaGF2ZSB0byBtYWtlIHRoZSB2YWxpZGF0ZSBtZXRob2QgaXMga2VwdCB3aGVuIG5ldyBwcm9wcyBhcmUgYWRkZWRcbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24gKG5leHRQcm9wcykge1xuICAgIG5leHRQcm9wcy5fYXR0YWNoVG9Gb3JtID0gdGhpcy5wcm9wcy5fYXR0YWNoVG9Gb3JtO1xuICAgIG5leHRQcm9wcy5fZGV0YWNoRnJvbUZvcm0gPSB0aGlzLnByb3BzLl9kZXRhY2hGcm9tRm9ybTtcbiAgICBuZXh0UHJvcHMuX3ZhbGlkYXRlID0gdGhpcy5wcm9wcy5fdmFsaWRhdGU7XG4gIH0sXG5cbiAgLy8gRGV0YWNoIGl0IHdoZW4gY29tcG9uZW50IHVubW91bnRzXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5wcm9wcy5fZGV0YWNoRnJvbUZvcm0odGhpcyk7XG4gIH0sXG5cbiAgLy8gV2UgdmFsaWRhdGUgYWZ0ZXIgdGhlIHZhbHVlIGhhcyBiZWVuIHNldFxuICBzZXRWYWx1ZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBfdmFsdWU6IHZhbHVlLFxuICAgICAgX2lzUHJpc3RpbmU6IGZhbHNlXG4gICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5wcm9wcy5fdmFsaWRhdGUodGhpcyk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgfSxcbiAgcmVzZXRWYWx1ZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgX3ZhbHVlOiAnJyxcbiAgICAgIF9pc1ByaXN0aW5lOiB0cnVlXG4gICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5wcm9wcy5fdmFsaWRhdGUodGhpcyk7XG4gICAgfSk7XG4gIH0sXG4gIGdldFZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUuX3ZhbHVlO1xuICB9LFxuICBoYXNWYWx1ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXRlLl92YWx1ZSAhPT0gJyc7XG4gIH0sXG4gIGdldEVycm9yTWVzc2FnZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmlzVmFsaWQoKSB8fCB0aGlzLnNob3dSZXF1aXJlZCgpID8gbnVsbCA6IHRoaXMuc3RhdGUuX3NlcnZlckVycm9yIHx8IHRoaXMucHJvcHMudmFsaWRhdGlvbkVycm9yO1xuICB9LFxuICBpc1ZhbGlkOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUuX2lzVmFsaWQ7XG4gIH0sXG4gIGlzUHJpc3RpbmU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5faXNQcmlzdGluZTtcbiAgfSxcbiAgaXNSZXF1aXJlZDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAhIXRoaXMucHJvcHMucmVxdWlyZWQ7XG4gIH0sXG4gIHNob3dSZXF1aXJlZDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmlzUmVxdWlyZWQoKSAmJiB0aGlzLnN0YXRlLl92YWx1ZSA9PT0gJyc7XG4gIH0sXG4gIHNob3dFcnJvcjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAhdGhpcy5zaG93UmVxdWlyZWQoKSAmJiAhdGhpcy5zdGF0ZS5faXNWYWxpZDtcbiAgfVxufTtcblxuRm9ybXN5LmFkZFZhbGlkYXRpb25SdWxlID0gZnVuY3Rpb24gKG5hbWUsIGZ1bmMpIHtcbiAgdmFsaWRhdGlvblJ1bGVzW25hbWVdID0gZnVuYztcbn07XG5cbkZvcm1zeS5Gb3JtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkZvcm1cIixcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlzVmFsaWQ6IHRydWUsXG4gICAgICBpc1N1Ym1pdHRpbmc6IGZhbHNlXG4gICAgfTtcbiAgfSxcbiAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGhlYWRlcnM6IHt9LFxuICAgICAgb25TdWNjZXNzOiBmdW5jdGlvbiAoKSB7fSxcbiAgICAgIG9uRXJyb3I6IGZ1bmN0aW9uICgpIHt9LFxuICAgICAgb25TdWJtaXQ6IGZ1bmN0aW9uICgpIHt9LFxuICAgICAgb25TdWJtaXR0ZWQ6IGZ1bmN0aW9uICgpIHt9LFxuICAgICAgb25WYWxpZDogZnVuY3Rpb24gKCkge30sXG4gICAgICBvbkludmFsaWQ6IGZ1bmN0aW9uICgpIHt9XG4gICAgfTtcbiAgfSxcblxuICAvLyBBZGQgYSBtYXAgdG8gc3RvcmUgdGhlIGlucHV0cyBvZiB0aGUgZm9ybSwgYSBtb2RlbCB0byBzdG9yZVxuICAvLyB0aGUgdmFsdWVzIG9mIHRoZSBmb3JtIGFuZCByZWdpc3RlciBjaGlsZCBpbnB1dHNcbiAgY29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5pbnB1dHMgPSB7fTtcbiAgICB0aGlzLm1vZGVsID0ge307XG4gICAgdGhpcy5yZWdpc3RlcklucHV0cyh0aGlzLnByb3BzLmNoaWxkcmVuKTtcbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMudmFsaWRhdGVGb3JtKCk7XG4gIH0sXG5cbiAgLy8gVXBkYXRlIG1vZGVsLCBzdWJtaXQgdG8gdXJsIHByb3AgYW5kIHNlbmQgdGhlIG1vZGVsXG4gIHN1Ym1pdDogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIC8vIFRyaWdnZXIgZm9ybSBhcyBub3QgcHJpc3RpbmUuXG4gICAgLy8gSWYgYW55IGlucHV0cyBoYXZlIG5vdCBiZWVuIHRvdWNoZWQgeWV0IHRoaXMgd2lsbCBtYWtlIHRoZW0gZGlydHlcbiAgICAvLyBzbyB2YWxpZGF0aW9uIGJlY29tZXMgdmlzaWJsZSAoaWYgYmFzZWQgb24gaXNQcmlzdGluZSlcbiAgICB0aGlzLnNldEZvcm1QcmlzdGluZShmYWxzZSk7XG5cbiAgICAvLyBUbyBzdXBwb3J0IHVzZSBjYXNlcyB3aGVyZSBubyBhc3luYyBvciByZXF1ZXN0IG9wZXJhdGlvbiBpcyBuZWVkZWQuXG4gICAgLy8gVGhlIFwib25TdWJtaXRcIiBjYWxsYmFjayBpcyBjYWxsZWQgd2l0aCB0aGUgbW9kZWwgZS5nLiB7ZmllbGROYW1lOiBcIm15VmFsdWVcIn0sXG4gICAgLy8gaWYgd2FudGluZyB0byByZXNldCB0aGUgZW50aXJlIGZvcm0gdG8gb3JpZ2luYWwgc3RhdGUsIHRoZSBzZWNvbmQgcGFyYW0gaXMgYSBjYWxsYmFjayBmb3IgdGhpcy5cbiAgICBpZiAoIXRoaXMucHJvcHMudXJsKSB7XG4gICAgICB0aGlzLnVwZGF0ZU1vZGVsKCk7XG4gICAgICB0aGlzLnByb3BzLm9uU3VibWl0KHRoaXMubWFwTW9kZWwoKSwgdGhpcy5yZXNldE1vZGVsLCB0aGlzLnVwZGF0ZUlucHV0c1dpdGhFcnJvcik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGVNb2RlbCgpO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaXNTdWJtaXR0aW5nOiB0cnVlXG4gICAgfSk7XG5cbiAgICB0aGlzLnByb3BzLm9uU3VibWl0KHRoaXMubWFwTW9kZWwoKSwgdGhpcy5yZXNldE1vZGVsLCB0aGlzLnVwZGF0ZUlucHV0c1dpdGhFcnJvcik7XG5cbiAgICB2YXIgaGVhZGVycyA9IChPYmplY3Qua2V5cyh0aGlzLnByb3BzLmhlYWRlcnMpLmxlbmd0aCAmJiB0aGlzLnByb3BzLmhlYWRlcnMpIHx8IG9wdGlvbnMuaGVhZGVycyB8fCB7fTtcblxuICAgIHZhciBtZXRob2QgPSB0aGlzLnByb3BzLm1ldGhvZCAmJiBhamF4W3RoaXMucHJvcHMubWV0aG9kLnRvTG93ZXJDYXNlKCldID8gdGhpcy5wcm9wcy5tZXRob2QudG9Mb3dlckNhc2UoKSA6ICdwb3N0JztcbiAgICBhamF4W21ldGhvZF0odGhpcy5wcm9wcy51cmwsIHRoaXMubWFwTW9kZWwoKSwgdGhpcy5wcm9wcy5jb250ZW50VHlwZSB8fCBvcHRpb25zLmNvbnRlbnRUeXBlIHx8ICdqc29uJywgaGVhZGVycylcbiAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICB0aGlzLnByb3BzLm9uU3VjY2VzcyhyZXNwb25zZSk7XG4gICAgICAgIHRoaXMucHJvcHMub25TdWJtaXR0ZWQoKTtcbiAgICAgIH0uYmluZCh0aGlzKSlcbiAgICAgIC5jYXRjaCh0aGlzLmZhaWxTdWJtaXQpO1xuICB9LFxuXG4gIG1hcE1vZGVsOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMubWFwcGluZyA/IHRoaXMucHJvcHMubWFwcGluZyh0aGlzLm1vZGVsKSA6IHRoaXMubW9kZWw7XG4gIH0sXG5cbiAgLy8gR29lcyB0aHJvdWdoIGFsbCByZWdpc3RlcmVkIGNvbXBvbmVudHMgYW5kXG4gIC8vIHVwZGF0ZXMgdGhlIG1vZGVsIHZhbHVlc1xuICB1cGRhdGVNb2RlbDogZnVuY3Rpb24gKCkge1xuICAgIE9iamVjdC5rZXlzKHRoaXMuaW5wdXRzKS5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICB2YXIgY29tcG9uZW50ID0gdGhpcy5pbnB1dHNbbmFtZV07XG4gICAgICB0aGlzLm1vZGVsW25hbWVdID0gY29tcG9uZW50LnN0YXRlLl92YWx1ZTtcbiAgICB9LmJpbmQodGhpcykpO1xuICB9LFxuXG4gIC8vIFJlc2V0IGVhY2gga2V5IGluIHRoZSBtb2RlbCB0byB0aGUgb3JpZ2luYWwgLyBpbml0aWFsIHZhbHVlXG4gIHJlc2V0TW9kZWw6IGZ1bmN0aW9uICgpIHtcbiAgICBPYmplY3Qua2V5cyh0aGlzLmlucHV0cykuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgdGhpcy5pbnB1dHNbbmFtZV0ucmVzZXRWYWx1ZSgpO1xuICAgIH0uYmluZCh0aGlzKSk7XG4gICAgdGhpcy52YWxpZGF0ZUZvcm0oKTtcbiAgfSxcblxuICAvLyBHbyB0aHJvdWdoIGVycm9ycyBmcm9tIHNlcnZlciBhbmQgZ3JhYiB0aGUgY29tcG9uZW50c1xuICAvLyBzdG9yZWQgaW4gdGhlIGlucHV0cyBtYXAuIENoYW5nZSB0aGVpciBzdGF0ZSB0byBpbnZhbGlkXG4gIC8vIGFuZCBzZXQgdGhlIHNlcnZlckVycm9yIG1lc3NhZ2VcbiAgdXBkYXRlSW5wdXRzV2l0aEVycm9yOiBmdW5jdGlvbiAoZXJyb3JzKSB7XG4gICAgT2JqZWN0LmtleXMoZXJyb3JzKS5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lLCBpbmRleCkge1xuICAgICAgdmFyIGNvbXBvbmVudCA9IHRoaXMuaW5wdXRzW25hbWVdO1xuXG4gICAgICBpZiAoIWNvbXBvbmVudCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBhcmUgdHJ5aW5nIHRvIHVwZGF0ZSBhbiBpbnB1dCB0aGF0IGRvZXMgbm90IGV4aXN0cy4gVmVyaWZ5IGVycm9ycyBvYmplY3Qgd2l0aCBpbnB1dCBuYW1lcy4gJyArIEpTT04uc3RyaW5naWZ5KGVycm9ycykpO1xuICAgICAgfVxuXG4gICAgICB2YXIgYXJncyA9IFt7XG4gICAgICAgIF9pc1ZhbGlkOiBmYWxzZSxcbiAgICAgICAgX3NlcnZlckVycm9yOiBlcnJvcnNbbmFtZV1cbiAgICAgIH1dO1xuICAgICAgY29tcG9uZW50LnNldFN0YXRlLmFwcGx5KGNvbXBvbmVudCwgYXJncyk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgfSxcblxuICBmYWlsU3VibWl0OiBmdW5jdGlvbiAoZXJyb3JzKSB7XG4gICAgdGhpcy51cGRhdGVJbnB1dHNXaXRoRXJyb3IoZXJyb3JzKTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGlzU3VibWl0dGluZzogZmFsc2VcbiAgICB9KTtcbiAgICB0aGlzLnByb3BzLm9uRXJyb3IoZXJyb3JzKTtcbiAgICB0aGlzLnByb3BzLm9uU3VibWl0dGVkKCk7XG4gIH0sXG5cbiAgLy8gVHJhdmVyc2UgdGhlIGNoaWxkcmVuIGFuZCBjaGlsZHJlbiBvZiBjaGlsZHJlbiB0byBmaW5kXG4gIC8vIGFsbCBpbnB1dHMgYnkgY2hlY2tpbmcgdGhlIG5hbWUgcHJvcC4gTWF5YmUgZG8gYSBiZXR0ZXJcbiAgLy8gY2hlY2sgaGVyZVxuICByZWdpc3RlcklucHV0czogZnVuY3Rpb24gKGNoaWxkcmVuKSB7XG4gICAgUmVhY3QuQ2hpbGRyZW4uZm9yRWFjaChjaGlsZHJlbiwgZnVuY3Rpb24gKGNoaWxkKSB7XG5cbiAgICAgIGlmIChjaGlsZC5wcm9wcyAmJiBjaGlsZC5wcm9wcy5uYW1lKSB7XG4gICAgICAgIGNoaWxkLnByb3BzLl9hdHRhY2hUb0Zvcm0gPSB0aGlzLmF0dGFjaFRvRm9ybTtcbiAgICAgICAgY2hpbGQucHJvcHMuX2RldGFjaEZyb21Gb3JtID0gdGhpcy5kZXRhY2hGcm9tRm9ybTtcbiAgICAgICAgY2hpbGQucHJvcHMuX3ZhbGlkYXRlID0gdGhpcy52YWxpZGF0ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNoaWxkLnByb3BzICYmIGNoaWxkLnByb3BzLmNoaWxkcmVuKSB7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJJbnB1dHMoY2hpbGQucHJvcHMuY2hpbGRyZW4pO1xuICAgICAgfVxuXG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgfSxcblxuICBnZXRDdXJyZW50VmFsdWVzOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuaW5wdXRzKS5yZWR1Y2UoZnVuY3Rpb24gKGRhdGEsIG5hbWUpIHtcbiAgICAgIHZhciBjb21wb25lbnQgPSB0aGlzLmlucHV0c1tuYW1lXTtcbiAgICAgIGRhdGFbbmFtZV0gPSBjb21wb25lbnQuc3RhdGUuX3ZhbHVlO1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfS5iaW5kKHRoaXMpLCB7fSk7XG4gIH0sXG5cbiAgc2V0Rm9ybVByaXN0aW5lOiBmdW5jdGlvbihpc1ByaXN0aW5lKSB7XG4gICAgdmFyIGlucHV0cyA9IHRoaXMuaW5wdXRzO1xuICAgIHZhciBpbnB1dEtleXMgPSBPYmplY3Qua2V5cyhpbnB1dHMpO1xuXG4gICAgLy8gSXRlcmF0ZSB0aHJvdWdoIGVhY2ggY29tcG9uZW50IGFuZCBzZXQgaXQgYXMgcHJpc3RpbmVcbiAgICAvLyBvciBcImRpcnR5XCIuXG4gICAgaW5wdXRLZXlzLmZvckVhY2goZnVuY3Rpb24gKG5hbWUsIGluZGV4KSB7XG4gICAgICB2YXIgY29tcG9uZW50ID0gaW5wdXRzW25hbWVdO1xuICAgICAgY29tcG9uZW50LnNldFN0YXRlKHtcbiAgICAgICAgX2lzUHJpc3RpbmU6IGlzUHJpc3RpbmVcbiAgICAgIH0pO1xuICAgIH0uYmluZCh0aGlzKSk7XG4gIH0sXG5cbiAgLy8gVXNlIHRoZSBiaW5kZWQgdmFsdWVzIGFuZCB0aGUgYWN0dWFsIGlucHV0IHZhbHVlIHRvXG4gIC8vIHZhbGlkYXRlIHRoZSBpbnB1dCBhbmQgc2V0IGl0cyBzdGF0ZS4gVGhlbiBjaGVjayB0aGVcbiAgLy8gc3RhdGUgb2YgdGhlIGZvcm0gaXRzZWxmXG4gIHZhbGlkYXRlOiBmdW5jdGlvbiAoY29tcG9uZW50KSB7XG5cbiAgICBpZiAoIWNvbXBvbmVudC5wcm9wcy5yZXF1aXJlZCAmJiAhY29tcG9uZW50Ll92YWxpZGF0aW9ucykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFJ1biB0aHJvdWdoIHRoZSB2YWxpZGF0aW9ucywgc3BsaXQgdGhlbSB1cCBhbmQgY2FsbFxuICAgIC8vIHRoZSB2YWxpZGF0b3IgSUYgdGhlcmUgaXMgYSB2YWx1ZSBvciBpdCBpcyByZXF1aXJlZFxuICAgIHZhciBpc1ZhbGlkID0gdGhpcy5ydW5WYWxpZGF0aW9uKGNvbXBvbmVudCk7XG5cbiAgICBjb21wb25lbnQuc2V0U3RhdGUoe1xuICAgICAgX2lzVmFsaWQ6IGlzVmFsaWQsXG4gICAgICBfc2VydmVyRXJyb3I6IG51bGxcbiAgICB9LCB0aGlzLnZhbGlkYXRlRm9ybSk7XG5cbiAgfSxcblxuICBydW5WYWxpZGF0aW9uOiBmdW5jdGlvbiAoY29tcG9uZW50KSB7XG4gICAgdmFyIGlzVmFsaWQgPSB0cnVlO1xuICAgIGlmIChjb21wb25lbnQuX3ZhbGlkYXRpb25zLmxlbmd0aCAmJiAoY29tcG9uZW50LnByb3BzLnJlcXVpcmVkIHx8IGNvbXBvbmVudC5zdGF0ZS5fdmFsdWUgIT09ICcnKSkge1xuICAgICAgY29tcG9uZW50Ll92YWxpZGF0aW9ucy5zcGxpdCgnLCcpLmZvckVhY2goZnVuY3Rpb24gKHZhbGlkYXRpb24pIHtcbiAgICAgICAgdmFyIGFyZ3MgPSB2YWxpZGF0aW9uLnNwbGl0KCc6Jyk7XG4gICAgICAgIHZhciB2YWxpZGF0ZU1ldGhvZCA9IGFyZ3Muc2hpZnQoKTtcbiAgICAgICAgYXJncyA9IGFyZ3MubWFwKGZ1bmN0aW9uIChhcmcpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoYXJnKTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICByZXR1cm4gYXJnOyAvLyBJdCBpcyBhIHN0cmluZyBpZiBpdCBjYW4gbm90IHBhcnNlIGl0XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgYXJncyA9IFtjb21wb25lbnQuc3RhdGUuX3ZhbHVlXS5jb25jYXQoYXJncyk7XG4gICAgICAgIGlmICghdmFsaWRhdGlvblJ1bGVzW3ZhbGlkYXRlTWV0aG9kXSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRm9ybXN5IGRvZXMgbm90IGhhdmUgdGhlIHZhbGlkYXRpb24gcnVsZTogJyArIHZhbGlkYXRlTWV0aG9kKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXZhbGlkYXRpb25SdWxlc1t2YWxpZGF0ZU1ldGhvZF0uYXBwbHkodGhpcy5nZXRDdXJyZW50VmFsdWVzKCksIGFyZ3MpKSB7XG4gICAgICAgICAgaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9LmJpbmQodGhpcykpO1xuICAgIH1cbiAgICByZXR1cm4gaXNWYWxpZDtcbiAgfSxcblxuICAvLyBWYWxpZGF0ZSB0aGUgZm9ybSBieSBnb2luZyB0aHJvdWdoIGFsbCBjaGlsZCBpbnB1dCBjb21wb25lbnRzXG4gIC8vIGFuZCBjaGVjayB0aGVpciBzdGF0ZVxuICB2YWxpZGF0ZUZvcm06IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYWxsSXNWYWxpZCA9IHRydWU7XG4gICAgdmFyIGlucHV0cyA9IHRoaXMuaW5wdXRzO1xuICAgIHZhciBpbnB1dEtleXMgPSBPYmplY3Qua2V5cyhpbnB1dHMpO1xuXG4gICAgLy8gV2UgbmVlZCBhIGNhbGxiYWNrIGFzIHdlIGFyZSB2YWxpZGF0aW5nIGFsbCBpbnB1dHMgYWdhaW4uIFRoaXMgd2lsbFxuICAgIC8vIHJ1biB3aGVuIHRoZSBsYXN0IGNvbXBvbmVudCBoYXMgc2V0IGl0cyBzdGF0ZVxuICAgIHZhciBvblZhbGlkYXRpb25Db21wbGV0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlucHV0S2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgIGlmICghaW5wdXRzW25hbWVdLnN0YXRlLl9pc1ZhbGlkKSB7XG4gICAgICAgICAgYWxsSXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgaXNWYWxpZDogYWxsSXNWYWxpZFxuICAgICAgfSk7XG5cbiAgICAgIGFsbElzVmFsaWQgJiYgdGhpcy5wcm9wcy5vblZhbGlkKCk7XG4gICAgICAhYWxsSXNWYWxpZCAmJiB0aGlzLnByb3BzLm9uSW52YWxpZCgpO1xuXG4gICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgLy8gUnVuIHZhbGlkYXRpb24gYWdhaW4gaW4gY2FzZSBhZmZlY3RlZCBieSBvdGhlciBpbnB1dHMuIFRoZVxuICAgIC8vIGxhc3QgY29tcG9uZW50IHZhbGlkYXRlZCB3aWxsIHJ1biB0aGUgb25WYWxpZGF0aW9uQ29tcGxldGUgY2FsbGJhY2tcbiAgICBpbnB1dEtleXMuZm9yRWFjaChmdW5jdGlvbiAobmFtZSwgaW5kZXgpIHtcbiAgICAgIHZhciBjb21wb25lbnQgPSBpbnB1dHNbbmFtZV07XG4gICAgICB2YXIgaXNWYWxpZCA9IHRoaXMucnVuVmFsaWRhdGlvbihjb21wb25lbnQpO1xuICAgICAgY29tcG9uZW50LnNldFN0YXRlKHtcbiAgICAgICAgX2lzVmFsaWQ6IGlzVmFsaWQsXG4gICAgICAgIF9zZXJ2ZXJFcnJvcjogbnVsbFxuICAgICAgfSwgaW5kZXggPT09IGlucHV0S2V5cy5sZW5ndGggLSAxID8gb25WYWxpZGF0aW9uQ29tcGxldGUgOiBudWxsKTtcbiAgICB9LmJpbmQodGhpcykpO1xuXG4gIH0sXG5cbiAgLy8gTWV0aG9kIHB1dCBvbiBlYWNoIGlucHV0IGNvbXBvbmVudCB0byByZWdpc3RlclxuICAvLyBpdHNlbGYgdG8gdGhlIGZvcm1cbiAgYXR0YWNoVG9Gb3JtOiBmdW5jdGlvbiAoY29tcG9uZW50KSB7XG4gICAgdGhpcy5pbnB1dHNbY29tcG9uZW50LnByb3BzLm5hbWVdID0gY29tcG9uZW50O1xuICAgIHRoaXMubW9kZWxbY29tcG9uZW50LnByb3BzLm5hbWVdID0gY29tcG9uZW50LnN0YXRlLl92YWx1ZTtcbiAgICB0aGlzLnZhbGlkYXRlKGNvbXBvbmVudCk7XG4gIH0sXG5cbiAgLy8gTWV0aG9kIHB1dCBvbiBlYWNoIGlucHV0IGNvbXBvbmVudCB0byB1bnJlZ2lzdGVyXG4gIC8vIGl0c2VsZiBmcm9tIHRoZSBmb3JtXG4gIGRldGFjaEZyb21Gb3JtOiBmdW5jdGlvbiAoY29tcG9uZW50KSB7XG4gICAgZGVsZXRlIHRoaXMuaW5wdXRzW2NvbXBvbmVudC5wcm9wcy5uYW1lXTtcbiAgICBkZWxldGUgdGhpcy5tb2RlbFtjb21wb25lbnQucHJvcHMubmFtZV07XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuXG4gICAgcmV0dXJuIFJlYWN0LkRPTS5mb3JtKHtcbiAgICAgICAgb25TdWJtaXQ6IHRoaXMuc3VibWl0LFxuICAgICAgICBjbGFzc05hbWU6IHRoaXMucHJvcHMuY2xhc3NOYW1lXG4gICAgICB9LFxuICAgICAgdGhpcy5wcm9wcy5jaGlsZHJlblxuICAgICk7XG5cbiAgfVxufSk7XG5cbmlmICghZ2xvYmFsLmV4cG9ydHMgJiYgIWdsb2JhbC5tb2R1bGUgJiYgKCFnbG9iYWwuZGVmaW5lIHx8ICFnbG9iYWwuZGVmaW5lLmFtZCkpIHtcbiAgZ2xvYmFsLkZvcm1zeSA9IEZvcm1zeTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBGb3Jtc3k7XG4iXX0=
