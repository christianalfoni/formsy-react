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

describe('Formsy', function () {

  describe('Setting up a form', function () {

    it('should render a form into the document', function () {
      var form = TestUtils.renderIntoDocument( React.createElement(Formsy.Form, null));
      expect(form.getDOMNode().tagName).toEqual('FORM');
    });

    it('should set a class name if passed', function () {
      var form = TestUtils.renderIntoDocument( React.createElement(Formsy.Form, {className: "foo"}));
      expect(form.getDOMNode().className).toEqual('foo');
    });

    it('should allow for inputs being added dynamically', function (done) {

      var inputs = [];
      var forceUpdate = null;
      var model = null;
      var TestInput = React.createClass({displayName: "TestInput",
        mixins: [Formsy.Mixin],
        render: function () {
          return React.createElement("div", null)
        }
      });
      var TestForm = React.createClass({displayName: "TestForm",
        componentWillMount: function () {
          forceUpdate = this.forceUpdate.bind(this);
        },
        onSubmit: function (formModel) {
          model = formModel;
        },
        render: function () {
          return ( 
            React.createElement(Formsy.Form, {onSubmit: this.onSubmit}, 
              inputs
            ));
        }
      });
      var form = TestUtils.renderIntoDocument( 
        React.createElement(TestForm, null) 
      );

      // Wait before adding the input
      setTimeout(function () {

        inputs.push(TestInput({
          name: 'test'
        }));

        forceUpdate(function () {

          // Wait for next event loop, as that does the form
          setTimeout(function () {
            TestUtils.Simulate.submit(form.getDOMNode());
            expect(model.test).toBeDefined();
            done();
          }, 0);

        });

      }, 10);

    });

    it('should allow dynamically added inputs to update the form-model', function (done) {

      var inputs = [];
      var forceUpdate = null;
      var model = null;
      var TestInput = React.createClass({displayName: "TestInput",
        mixins: [Formsy.Mixin],
        changeValue: function (event) {
          this.setValue(event.target.value);
        },
        render: function () {
          return React.createElement("input", {value: this.getValue(), onChange: this.changeValue})
        }
      });
      var TestForm = React.createClass({displayName: "TestForm",
        componentWillMount: function () {
          forceUpdate = this.forceUpdate.bind(this);
        },
        onSubmit: function (formModel) {
          model = formModel;
        },
        render: function () {
          return ( 
            React.createElement(Formsy.Form, {onSubmit: this.onSubmit}, 
              inputs
            ));
        }
      });
      var form = TestUtils.renderIntoDocument( 
        React.createElement(TestForm, null) 
      );

      // Wait before adding the input
      setTimeout(function () {

        inputs.push(TestInput({
          name: 'test'
        }));

        forceUpdate(function () {

          // Wait for next event loop, as that does the form
          setTimeout(function () {
            TestUtils.Simulate.change(TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT'), {target: {value: 'foo'}});
            TestUtils.Simulate.submit(form.getDOMNode());
            expect(model.test).toBe('foo');
            done();
          }, 0);

        });

      }, 10);

    });

    it('should invalidate a valid form if dynamically inserted input is invalid', function (done) {

      var forceUpdate = null;
      var isInvalid = false;
      var TestInput = React.createClass({displayName: "TestInput",
        mixins: [Formsy.Mixin],
        changeValue: function (event) {
          this.setValue(event.target.value);
        },
        render: function () {
          return React.createElement("input", {value: this.getValue(), onChange: this.changeValue})
        }
      });


      var inputs = [TestInput({
        name: 'test',
        validations: 'isEmail',
        value: 'foo@bar.com'
      })];

      var TestForm = React.createClass({displayName: "TestForm",
        componentWillMount: function () {
          forceUpdate = this.forceUpdate.bind(this);
        },
        setInvalid: function () {
          isInvalid = true;
        },
        render: function () {
          return ( 
            React.createElement(Formsy.Form, {onInvalid: this.setInvalid}, 
              inputs
            ));
        }
      });
      var form = TestUtils.renderIntoDocument( 
        React.createElement(TestForm, null) 
      );

      expect(isInvalid).toBe(false);

      // Wait before adding the input
      setTimeout(function () {

        
        inputs.push(TestInput({
          name: 'test2',
          validations: 'isEmail',
          value: 'foo@bar'
        }));


        forceUpdate(function () {

          // Wait for next event loop, as that does the form
          setTimeout(function () {
            TestUtils.Simulate.submit(form.getDOMNode());
            expect(isInvalid).toBe(true);
            done();
          }, 0);

        });

      }, 10);

    });

    it('should not trigger onChange when form is mounted', function () {
      var hasChanged = jasmine.createSpy('onChange');
      var TestForm = React.createClass({displayName: "TestForm",
        onChange: function () {
          hasChanged();
        },
        render: function () {
          return React.createElement(Formsy.Form, {onChange: this.onChange});
        }
      });
      var form = TestUtils.renderIntoDocument(React.createElement(TestForm, null));
      expect(hasChanged).not.toHaveBeenCalled();
    });

    it('should trigger onChange when form element is changed', function () {
      var hasChanged = jasmine.createSpy('onChange');
      var MyInput = React.createClass({displayName: "MyInput",
        mixins: [Formsy.Mixin],
        onChange: function (event) {
          this.setValue(event.target.value);
        },
        render: function () {
          return React.createElement("input", {value: this.getValue(), onChange: this.onChange})
        }
      });
      var TestForm = React.createClass({displayName: "TestForm",
        onChange: function () {
          hasChanged();
        },
        render: function () {
          return (
            React.createElement(Formsy.Form, {onChange: this.onChange}, 
              React.createElement(MyInput, {name: "foo"})
            )
          );
        }
      });
      var form = TestUtils.renderIntoDocument(React.createElement(TestForm, null));
      TestUtils.Simulate.change(TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT'), {target: {value: 'bar'}});
      expect(hasChanged).toHaveBeenCalled();
    });

    it('should trigger onChange when new input is added to form', function (done) {
      var hasChanged = jasmine.createSpy('onChange');
      var inputs = [];
      var forceUpdate = null;
      var TestInput = React.createClass({displayName: "TestInput",
        mixins: [Formsy.Mixin],
        changeValue: function (event) {
          this.setValue(event.target.value);
        },
        render: function () {
          return React.createElement("input", {value: this.getValue(), onChange: this.changeValue})
        }
      });
      var TestForm = React.createClass({displayName: "TestForm",
        componentWillMount: function () {
          forceUpdate = this.forceUpdate.bind(this);
        },
        onChange: function () {
          hasChanged();
        },
        render: function () {
          return ( 
            React.createElement(Formsy.Form, {onChange: this.onChange}, 
              inputs
            ));
        }
      });
      var form = TestUtils.renderIntoDocument( 
        React.createElement(TestForm, null) 
      );

      // Wait before adding the input
      setTimeout(function () {

        inputs.push(TestInput({
          name: 'test'
        }));

        forceUpdate(function () {

          // Wait for next event loop, as that does the form
          setTimeout(function () {
            expect(hasChanged).toHaveBeenCalled();
            done();
          }, 0);

        });

      }, 10);

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

  it('RULE: isNumeric', function () {
    
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
        React.createElement(TestInput, {name: "foo", value: "foo", validations: "isNumeric"})
      )
    );

    var input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    expect(isValid).not.toHaveBeenCalled();
    TestUtils.Simulate.change(input, {target: {value: '123'}});
    expect(isValid).toHaveBeenCalled();

  });

  it('RULE: isNumeric (actual number)', function () {
    
    var isValid = jasmine.createSpy('valid');
    var TestInput = React.createClass({displayName: "TestInput",
      mixins: [Formsy.Mixin],
      updateValue: function (event) {
        this.setValue(Number(event.target.value));
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
        React.createElement(TestInput, {name: "foo", value: "foo", validations: "isNumeric"})
      )
    );

    var input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    expect(isValid).not.toHaveBeenCalled();
    TestUtils.Simulate.change(input, {target: {value: '123'}});
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

},{"react":"react"}]},{},["./specs/Element-spec.js","./specs/Formsy-spec.js","./specs/Submit-spec.js","./specs/Validation-spec.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcGVjcy9FbGVtZW50LXNwZWMuanMiLCJzcGVjcy9Gb3Jtc3ktc3BlYy5qcyIsInNwZWNzL1N1Ym1pdC1zcGVjLmpzIiwic3BlY3MvVmFsaWRhdGlvbi1zcGVjLmpzIiwic3JjL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgRm9ybXN5ID0gcmVxdWlyZSgnLi8uLi9zcmMvbWFpbi5qcycpO1xuXG5kZXNjcmliZSgnRWxlbWVudCcsIGZ1bmN0aW9uKCkge1xuXG4gIGl0KCdzaG91bGQgcmV0dXJuIHBhc3NlZCBhbmQgc2V0VmFsdWUoKSB2YWx1ZSB3aGVuIHVzaW5nIGdldFZhbHVlKCknLCBmdW5jdGlvbiAoKSB7XG4gICAgXG4gICAgdmFyIFRlc3RJbnB1dCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJUZXN0SW5wdXRcIixcbiAgICAgIG1peGluczogW0Zvcm1zeS5NaXhpbl0sXG4gICAgICB1cGRhdGVWYWx1ZTogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuc2V0VmFsdWUoZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICAgIH0sXG4gICAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7dmFsdWU6IHRoaXMuZ2V0VmFsdWUoKSwgb25DaGFuZ2U6IHRoaXMudXBkYXRlVmFsdWV9KVxuICAgICAgfVxuICAgIH0pO1xuICAgIHZhciBmb3JtID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybXN5LkZvcm0sIG51bGwsIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRlc3RJbnB1dCwge25hbWU6IFwiZm9vXCIsIHZhbHVlOiBcImZvb1wifSlcbiAgICAgIClcbiAgICApO1xuXG4gICAgdmFyIGlucHV0ID0gVGVzdFV0aWxzLmZpbmRSZW5kZXJlZERPTUNvbXBvbmVudFdpdGhUYWcoZm9ybSwgJ0lOUFVUJyk7XG4gICAgZXhwZWN0KGlucHV0LmdldERPTU5vZGUoKS52YWx1ZSkudG9CZSgnZm9vJyk7XG4gICAgVGVzdFV0aWxzLlNpbXVsYXRlLmNoYW5nZShpbnB1dCwge3RhcmdldDoge3ZhbHVlOiAnZm9vYmFyJ319KTtcbiAgICBleHBlY3QoaW5wdXQuZ2V0RE9NTm9kZSgpLnZhbHVlKS50b0JlKCdmb29iYXInKTtcblxuICB9KTtcblxuICBpdCgnc2hvdWxkIHJldHVybiB0cnVlIG9yIGZhbHNlIHdoZW4gY2FsbGluZyBoYXNWYWx1ZSgpIGRlcGVuZGluZyBvbiB2YWx1ZSBleGlzdGFuY2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgXG4gICAgdmFyIHJlc2V0ID0gbnVsbDtcbiAgICB2YXIgVGVzdElucHV0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlRlc3RJbnB1dFwiLFxuICAgICAgbWl4aW5zOiBbRm9ybXN5Lk1peGluXSxcbiAgICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJlc2V0ID0gdGhpcy5yZXNldFZhbHVlO1xuICAgICAgfSxcbiAgICAgIHVwZGF0ZVZhbHVlOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5zZXRWYWx1ZShldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgfSxcbiAgICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHt2YWx1ZTogdGhpcy5nZXRWYWx1ZSgpLCBvbkNoYW5nZTogdGhpcy51cGRhdGVWYWx1ZX0pXG4gICAgICB9XG4gICAgfSk7XG4gICAgdmFyIGZvcm0gPSBUZXN0VXRpbHMucmVuZGVySW50b0RvY3VtZW50KFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3Jtc3kuRm9ybSwgbnVsbCwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGVzdElucHV0LCB7bmFtZTogXCJmb29cIiwgdmFsdWU6IFwiZm9vXCJ9KVxuICAgICAgKVxuICAgICk7XG5cbiAgICB2YXIgaW5wdXQgPSBUZXN0VXRpbHMuZmluZFJlbmRlcmVkRE9NQ29tcG9uZW50V2l0aFRhZyhmb3JtLCAnSU5QVVQnKTtcbiAgICByZXNldCgpO1xuICAgIGV4cGVjdChpbnB1dC5nZXRET01Ob2RlKCkudmFsdWUpLnRvQmUoJycpO1xuXG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgcmV0dXJuIGVycm9yIG1lc3NhZ2UgcGFzc2VkIHdoZW4gY2FsbGluZyBnZXRFcnJvck1lc3NhZ2UoKScsIGZ1bmN0aW9uICgpIHtcbiAgICBcbiAgICB2YXIgZ2V0RXJyb3JNZXNzYWdlID0gbnVsbDtcbiAgICB2YXIgVGVzdElucHV0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlRlc3RJbnB1dFwiLFxuICAgICAgbWl4aW5zOiBbRm9ybXN5Lk1peGluXSxcbiAgICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGdldEVycm9yTWVzc2FnZSA9IHRoaXMuZ2V0RXJyb3JNZXNzYWdlO1xuICAgICAgfSxcbiAgICAgIHVwZGF0ZVZhbHVlOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5zZXRWYWx1ZShldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgfSxcbiAgICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHt2YWx1ZTogdGhpcy5nZXRWYWx1ZSgpLCBvbkNoYW5nZTogdGhpcy51cGRhdGVWYWx1ZX0pXG4gICAgICB9XG4gICAgfSk7XG4gICAgdmFyIGZvcm0gPSBUZXN0VXRpbHMucmVuZGVySW50b0RvY3VtZW50KFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3Jtc3kuRm9ybSwgbnVsbCwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGVzdElucHV0LCB7bmFtZTogXCJmb29cIiwgdmFsdWU6IFwiZm9vXCIsIHZhbGlkYXRpb25zOiBcImlzRW1haWxcIiwgdmFsaWRhdGlvbkVycm9yOiBcIkhhcyB0byBiZSBlbWFpbFwifSlcbiAgICAgIClcbiAgICApO1xuXG4gICAgZXhwZWN0KGdldEVycm9yTWVzc2FnZSgpKS50b0JlKCdIYXMgdG8gYmUgZW1haWwnKTtcblxuICB9KTtcblxuICBpdCgnc2hvdWxkIHJldHVybiBzZXJ2ZXIgZXJyb3IgbWVzc2FnZSB3aGVuIGNhbGxpbmcgZ2V0RXJyb3JNZXNzYWdlKCknLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIFxuICAgIGphc21pbmUuQWpheC5pbnN0YWxsKCk7XG5cbiAgICB2YXIgZ2V0RXJyb3JNZXNzYWdlID0gbnVsbDtcbiAgICB2YXIgVGVzdElucHV0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlRlc3RJbnB1dFwiLFxuICAgICAgbWl4aW5zOiBbRm9ybXN5Lk1peGluXSxcbiAgICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGdldEVycm9yTWVzc2FnZSA9IHRoaXMuZ2V0RXJyb3JNZXNzYWdlO1xuICAgICAgfSxcbiAgICAgIHVwZGF0ZVZhbHVlOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5zZXRWYWx1ZShldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgfSxcbiAgICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHt2YWx1ZTogdGhpcy5nZXRWYWx1ZSgpLCBvbkNoYW5nZTogdGhpcy51cGRhdGVWYWx1ZX0pXG4gICAgICB9XG4gICAgfSk7XG4gICAgdmFyIGZvcm0gPSBUZXN0VXRpbHMucmVuZGVySW50b0RvY3VtZW50KFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3Jtc3kuRm9ybSwge3VybDogXCIvdXNlcnNcIn0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRlc3RJbnB1dCwge25hbWU6IFwiZm9vXCIsIHZhbHVlOiBcImZvb1wiLCB2YWxpZGF0aW9uczogXCJpc0VtYWlsXCIsIHZhbGlkYXRpb25FcnJvcjogXCJIYXMgdG8gYmUgZW1haWxcIn0pXG4gICAgICApXG4gICAgKTtcblxuICAgIHZhciBmb3JtID0gVGVzdFV0aWxzLlNpbXVsYXRlLnN1Ym1pdChmb3JtLmdldERPTU5vZGUoKSk7XG5cbiAgICBqYXNtaW5lLkFqYXgucmVxdWVzdHMubW9zdFJlY2VudCgpLnJlc3BvbmRXaXRoKHtcbiAgICAgIHN0YXR1czogNTAwLFxuICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgIHJlc3BvbnNlVGV4dDogJ3tcImZvb1wiOiBcImJhclwifSdcbiAgICB9KVxuXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBleHBlY3QoZ2V0RXJyb3JNZXNzYWdlKCkpLnRvQmUoJ2JhcicpO1xuICAgICAgamFzbWluZS5BamF4LnVuaW5zdGFsbCgpO1xuICAgICAgZG9uZSgpO1xuICAgIH0sIDApO1xuXG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgcmV0dXJuIHRydWUgb3IgZmFsc2Ugd2hlbiBjYWxsaW5nIGlzVmFsaWQoKSBkZXBlbmRpbmcgb24gdmFsaWQgc3RhdGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgXG4gICAgdmFyIGlzVmFsaWQgPSBudWxsO1xuICAgIHZhciBUZXN0SW5wdXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiVGVzdElucHV0XCIsXG4gICAgICBtaXhpbnM6IFtGb3Jtc3kuTWl4aW5dLFxuICAgICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaXNWYWxpZCA9IHRoaXMuaXNWYWxpZDtcbiAgICAgIH0sXG4gICAgICB1cGRhdGVWYWx1ZTogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdldmVudC50YXJnZXQudmFsdWUnLCBldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgICB0aGlzLnNldFZhbHVlKGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCd0aGlzLmdldFZhbHVlKCknLCB0aGlzLmdldFZhbHVlKCkpO1xuICAgICAgICB9LmJpbmQodGhpcyksIDEwMCk7XG4gICAgICB9LFxuICAgICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge3ZhbHVlOiB0aGlzLmdldFZhbHVlKCksIG9uQ2hhbmdlOiB0aGlzLnVwZGF0ZVZhbHVlfSlcbiAgICAgIH1cbiAgICB9KTtcbiAgICB2YXIgZm9ybSA9IFRlc3RVdGlscy5yZW5kZXJJbnRvRG9jdW1lbnQoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1zeS5Gb3JtLCB7dXJsOiBcIi91c2Vyc1wifSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGVzdElucHV0LCB7bmFtZTogXCJmb29cIiwgdmFsdWU6IFwiZm9vXCIsIHZhbGlkYXRpb25zOiBcImlzRW1haWxcIn0pXG4gICAgICApXG4gICAgKTtcblxuICAgIGV4cGVjdChpc1ZhbGlkKCkpLnRvQmUoZmFsc2UpO1xuICAgIHZhciBpbnB1dCA9IFRlc3RVdGlscy5maW5kUmVuZGVyZWRET01Db21wb25lbnRXaXRoVGFnKGZvcm0sICdJTlBVVCcpO1xuICAgIFRlc3RVdGlscy5TaW11bGF0ZS5jaGFuZ2UoaW5wdXQsIHt0YXJnZXQ6IHt2YWx1ZTogJ2Zvb0Bmb28uY29tJ319KTtcbiAgICBleHBlY3QoaXNWYWxpZCgpKS50b0JlKHRydWUpO1xuXG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgcmV0dXJuIHRydWUgb3IgZmFsc2Ugd2hlbiBjYWxsaW5nIGlzUmVxdWlyZWQoKSBkZXBlbmRpbmcgb24gcGFzc2VkIHJlcXVpcmVkIGF0dHJpYnV0ZScsIGZ1bmN0aW9uICgpIHtcbiAgICBcbiAgICB2YXIgaXNSZXF1aXJlZHMgPSBbXTtcbiAgICB2YXIgVGVzdElucHV0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlRlc3RJbnB1dFwiLFxuICAgICAgbWl4aW5zOiBbRm9ybXN5Lk1peGluXSxcbiAgICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlzUmVxdWlyZWRzLnB1c2godGhpcy5pc1JlcXVpcmVkKTtcbiAgICAgIH0sXG4gICAgICB1cGRhdGVWYWx1ZTogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuc2V0VmFsdWUoZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICAgIH0sXG4gICAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7dmFsdWU6IHRoaXMuZ2V0VmFsdWUoKSwgb25DaGFuZ2U6IHRoaXMudXBkYXRlVmFsdWV9KVxuICAgICAgfVxuICAgIH0pO1xuICAgIHZhciBmb3JtID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybXN5LkZvcm0sIHt1cmw6IFwiL3VzZXJzXCJ9LCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUZXN0SW5wdXQsIHtuYW1lOiBcImZvb1wiLCB2YWx1ZTogXCJmb29cIn0pLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUZXN0SW5wdXQsIHtuYW1lOiBcImZvb1wiLCB2YWx1ZTogXCJmb29cIiwgcmVxdWlyZWQ6IHRydWV9KVxuICAgICAgKVxuICAgICk7XG5cbiAgICBleHBlY3QoaXNSZXF1aXJlZHNbMF0oKSkudG9CZShmYWxzZSk7XG4gICAgZXhwZWN0KGlzUmVxdWlyZWRzWzFdKCkpLnRvQmUodHJ1ZSk7XG5cbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCByZXR1cm4gdHJ1ZSBvciBmYWxzZSB3aGVuIGNhbGxpbmcgc2hvd1JlcXVpcmVkKCkgZGVwZW5kaW5nIG9uIGlucHV0IGJlaW5nIGVtcHR5IGFuZCByZXF1aXJlZCBpcyBwYXNzZWQsIG9yIG5vdCcsIGZ1bmN0aW9uICgpIHtcbiAgICBcbiAgICB2YXIgc2hvd1JlcXVpcmVkcyA9IFtdO1xuICAgIHZhciBUZXN0SW5wdXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiVGVzdElucHV0XCIsXG4gICAgICBtaXhpbnM6IFtGb3Jtc3kuTWl4aW5dLFxuICAgICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2hvd1JlcXVpcmVkcy5wdXNoKHRoaXMuc2hvd1JlcXVpcmVkKTtcbiAgICAgIH0sXG4gICAgICB1cGRhdGVWYWx1ZTogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuc2V0VmFsdWUoZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICAgIH0sXG4gICAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7dmFsdWU6IHRoaXMuZ2V0VmFsdWUoKSwgb25DaGFuZ2U6IHRoaXMudXBkYXRlVmFsdWV9KVxuICAgICAgfVxuICAgIH0pO1xuICAgIHZhciBmb3JtID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybXN5LkZvcm0sIHt1cmw6IFwiL3VzZXJzXCJ9LCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUZXN0SW5wdXQsIHtuYW1lOiBcIkFcIiwgdmFsdWU6IFwiZm9vXCJ9KSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGVzdElucHV0LCB7bmFtZTogXCJCXCIsIHZhbHVlOiBcIlwiLCByZXF1aXJlZDogdHJ1ZX0pLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUZXN0SW5wdXQsIHtuYW1lOiBcIkNcIiwgdmFsdWU6IFwiXCJ9KVxuICAgICAgKVxuICAgICk7XG5cbiAgICBleHBlY3Qoc2hvd1JlcXVpcmVkc1swXSgpKS50b0JlKGZhbHNlKTtcbiAgICBleHBlY3Qoc2hvd1JlcXVpcmVkc1sxXSgpKS50b0JlKHRydWUpO1xuICAgIGV4cGVjdChzaG93UmVxdWlyZWRzWzJdKCkpLnRvQmUoZmFsc2UpO1xuXG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgcmV0dXJuIHRydWUgb3IgZmFsc2Ugd2hlbiBjYWxsaW5nIHNob3dFcnJvcigpIGRlcGVuZGluZyBvbiB2YWx1ZSBpcyBpbnZhbGlkIG9yIGEgc2VydmVyIGVycm9yIGhhcyBhcnJpdmVkLCBvciBub3QnLCBmdW5jdGlvbiAoZG9uZSkge1xuXG4gICAgdmFyIHNob3dFcnJvciA9IG51bGw7XG4gICAgdmFyIFRlc3RJbnB1dCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJUZXN0SW5wdXRcIixcbiAgICAgIG1peGluczogW0Zvcm1zeS5NaXhpbl0sXG4gICAgICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gKCkge1xuICAgICAgICBzaG93RXJyb3IgPSB0aGlzLnNob3dFcnJvcjtcbiAgICAgIH0sXG4gICAgICB1cGRhdGVWYWx1ZTogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuc2V0VmFsdWUoZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICAgIH0sXG4gICAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7dmFsdWU6IHRoaXMuZ2V0VmFsdWUoKSwgb25DaGFuZ2U6IHRoaXMudXBkYXRlVmFsdWV9KVxuICAgICAgfVxuICAgIH0pO1xuICAgIHZhciBmb3JtID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybXN5LkZvcm0sIHt1cmw6IFwiL3VzZXJzXCJ9LCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUZXN0SW5wdXQsIHtuYW1lOiBcImZvb1wiLCB2YWx1ZTogXCJmb29cIiwgdmFsaWRhdGlvbnM6IFwiaXNFbWFpbFwiLCB2YWxpZGF0aW9uRXJyb3I6IFwiVGhpcyBpcyBub3QgYW4gZW1haWxcIn0pXG4gICAgICApXG4gICAgKTtcblxuICAgIGV4cGVjdChzaG93RXJyb3IoKSkudG9CZSh0cnVlKTtcblxuICAgIHZhciBpbnB1dCA9IFRlc3RVdGlscy5maW5kUmVuZGVyZWRET01Db21wb25lbnRXaXRoVGFnKGZvcm0sICdJTlBVVCcpO1xuICAgIFRlc3RVdGlscy5TaW11bGF0ZS5jaGFuZ2UoaW5wdXQsIHt0YXJnZXQ6IHt2YWx1ZTogJ2Zvb0Bmb28uY29tJ319KTtcbiAgICBleHBlY3Qoc2hvd0Vycm9yKCkpLnRvQmUoZmFsc2UpO1xuXG4gICAgamFzbWluZS5BamF4Lmluc3RhbGwoKTtcbiAgICBUZXN0VXRpbHMuU2ltdWxhdGUuc3VibWl0KGZvcm0uZ2V0RE9NTm9kZSgpKTsgICAgXG4gICAgamFzbWluZS5BamF4LnJlcXVlc3RzLm1vc3RSZWNlbnQoKS5yZXNwb25kV2l0aCh7XG4gICAgICBzdGF0dXM6IDUwMCxcbiAgICAgIHJlc3BvbnNlVHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgcmVzcG9uc2VUZXh0OiAne1wiZm9vXCI6IFwiRW1haWwgYWxyZWFkeSBleGlzdHNcIn0nXG4gICAgfSk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBleHBlY3Qoc2hvd0Vycm9yKCkpLnRvQmUodHJ1ZSk7XG4gICAgICBqYXNtaW5lLkFqYXgudW5pbnN0YWxsKCk7XG4gICAgICBkb25lKCk7XG4gICAgfSwgMCk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgcmV0dXJuIHRydWUgb3IgZmFsc2Ugd2hlbiBjYWxsaW5nIGlzUHJlc3RpbmUoKSBkZXBlbmRpbmcgb24gaW5wdXQgaGFzIGJlZW4gXCJ0b3VjaGVkXCIgb3Igbm90JywgZnVuY3Rpb24gKCkge1xuICAgIFxuICAgIHZhciBpc1ByaXN0aW5lID0gbnVsbDtcbiAgICB2YXIgVGVzdElucHV0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlRlc3RJbnB1dFwiLFxuICAgICAgbWl4aW5zOiBbRm9ybXN5Lk1peGluXSxcbiAgICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlzUHJpc3RpbmUgPSB0aGlzLmlzUHJpc3RpbmU7XG4gICAgICB9LFxuICAgICAgdXBkYXRlVmFsdWU6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICB0aGlzLnNldFZhbHVlKGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gICAgICB9LFxuICAgICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge3ZhbHVlOiB0aGlzLmdldFZhbHVlKCksIG9uQ2hhbmdlOiB0aGlzLnVwZGF0ZVZhbHVlfSlcbiAgICAgIH1cbiAgICB9KTtcbiAgICB2YXIgZm9ybSA9IFRlc3RVdGlscy5yZW5kZXJJbnRvRG9jdW1lbnQoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1zeS5Gb3JtLCB7dXJsOiBcIi91c2Vyc1wifSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGVzdElucHV0LCB7bmFtZTogXCJBXCIsIHZhbHVlOiBcImZvb1wifSlcbiAgICAgIClcbiAgICApO1xuXG4gICAgZXhwZWN0KGlzUHJpc3RpbmUoKSkudG9CZSh0cnVlKTtcbiAgICB2YXIgaW5wdXQgPSBUZXN0VXRpbHMuZmluZFJlbmRlcmVkRE9NQ29tcG9uZW50V2l0aFRhZyhmb3JtLCAnSU5QVVQnKTtcbiAgICBUZXN0VXRpbHMuU2ltdWxhdGUuY2hhbmdlKGlucHV0LCB7dGFyZ2V0OiB7dmFsdWU6ICdmb28nfX0pO1xuICAgIGV4cGVjdChpc1ByaXN0aW5lKCkpLnRvQmUoZmFsc2UpO1xuICAgIFxuICB9KTtcblxufSk7XG4iLCJ2YXIgRm9ybXN5ID0gcmVxdWlyZSgnLi8uLi9zcmMvbWFpbi5qcycpO1xuXG5kZXNjcmliZSgnRm9ybXN5JywgZnVuY3Rpb24gKCkge1xuXG4gIGRlc2NyaWJlKCdTZXR0aW5nIHVwIGEgZm9ybScsIGZ1bmN0aW9uICgpIHtcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGEgZm9ybSBpbnRvIHRoZSBkb2N1bWVudCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBmb3JtID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudCggUmVhY3QuY3JlYXRlRWxlbWVudChGb3Jtc3kuRm9ybSwgbnVsbCkpO1xuICAgICAgZXhwZWN0KGZvcm0uZ2V0RE9NTm9kZSgpLnRhZ05hbWUpLnRvRXF1YWwoJ0ZPUk0nKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgc2V0IGEgY2xhc3MgbmFtZSBpZiBwYXNzZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgZm9ybSA9IFRlc3RVdGlscy5yZW5kZXJJbnRvRG9jdW1lbnQoIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybXN5LkZvcm0sIHtjbGFzc05hbWU6IFwiZm9vXCJ9KSk7XG4gICAgICBleHBlY3QoZm9ybS5nZXRET01Ob2RlKCkuY2xhc3NOYW1lKS50b0VxdWFsKCdmb28nKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYWxsb3cgZm9yIGlucHV0cyBiZWluZyBhZGRlZCBkeW5hbWljYWxseScsIGZ1bmN0aW9uIChkb25lKSB7XG5cbiAgICAgIHZhciBpbnB1dHMgPSBbXTtcbiAgICAgIHZhciBmb3JjZVVwZGF0ZSA9IG51bGw7XG4gICAgICB2YXIgbW9kZWwgPSBudWxsO1xuICAgICAgdmFyIFRlc3RJbnB1dCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJUZXN0SW5wdXRcIixcbiAgICAgICAgbWl4aW5zOiBbRm9ybXN5Lk1peGluXSxcbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbClcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB2YXIgVGVzdEZvcm0gPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiVGVzdEZvcm1cIixcbiAgICAgICAgY29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgZm9yY2VVcGRhdGUgPSB0aGlzLmZvcmNlVXBkYXRlLmJpbmQodGhpcyk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uU3VibWl0OiBmdW5jdGlvbiAoZm9ybU1vZGVsKSB7XG4gICAgICAgICAgbW9kZWwgPSBmb3JtTW9kZWw7XG4gICAgICAgIH0sXG4gICAgICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiAoIFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3Jtc3kuRm9ybSwge29uU3VibWl0OiB0aGlzLm9uU3VibWl0fSwgXG4gICAgICAgICAgICAgIGlucHV0c1xuICAgICAgICAgICAgKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdmFyIGZvcm0gPSBUZXN0VXRpbHMucmVuZGVySW50b0RvY3VtZW50KCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUZXN0Rm9ybSwgbnVsbCkgXG4gICAgICApO1xuXG4gICAgICAvLyBXYWl0IGJlZm9yZSBhZGRpbmcgdGhlIGlucHV0XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblxuICAgICAgICBpbnB1dHMucHVzaChUZXN0SW5wdXQoe1xuICAgICAgICAgIG5hbWU6ICd0ZXN0J1xuICAgICAgICB9KSk7XG5cbiAgICAgICAgZm9yY2VVcGRhdGUoZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgLy8gV2FpdCBmb3IgbmV4dCBldmVudCBsb29wLCBhcyB0aGF0IGRvZXMgdGhlIGZvcm1cbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIFRlc3RVdGlscy5TaW11bGF0ZS5zdWJtaXQoZm9ybS5nZXRET01Ob2RlKCkpO1xuICAgICAgICAgICAgZXhwZWN0KG1vZGVsLnRlc3QpLnRvQmVEZWZpbmVkKCk7XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgfSwgMCk7XG5cbiAgICAgICAgfSk7XG5cbiAgICAgIH0sIDEwKTtcblxuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBhbGxvdyBkeW5hbWljYWxseSBhZGRlZCBpbnB1dHMgdG8gdXBkYXRlIHRoZSBmb3JtLW1vZGVsJywgZnVuY3Rpb24gKGRvbmUpIHtcblxuICAgICAgdmFyIGlucHV0cyA9IFtdO1xuICAgICAgdmFyIGZvcmNlVXBkYXRlID0gbnVsbDtcbiAgICAgIHZhciBtb2RlbCA9IG51bGw7XG4gICAgICB2YXIgVGVzdElucHV0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlRlc3RJbnB1dFwiLFxuICAgICAgICBtaXhpbnM6IFtGb3Jtc3kuTWl4aW5dLFxuICAgICAgICBjaGFuZ2VWYWx1ZTogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgdGhpcy5zZXRWYWx1ZShldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHt2YWx1ZTogdGhpcy5nZXRWYWx1ZSgpLCBvbkNoYW5nZTogdGhpcy5jaGFuZ2VWYWx1ZX0pXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdmFyIFRlc3RGb3JtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlRlc3RGb3JtXCIsXG4gICAgICAgIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGZvcmNlVXBkYXRlID0gdGhpcy5mb3JjZVVwZGF0ZS5iaW5kKHRoaXMpO1xuICAgICAgICB9LFxuICAgICAgICBvblN1Ym1pdDogZnVuY3Rpb24gKGZvcm1Nb2RlbCkge1xuICAgICAgICAgIG1vZGVsID0gZm9ybU1vZGVsO1xuICAgICAgICB9LFxuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gKCBcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybXN5LkZvcm0sIHtvblN1Ym1pdDogdGhpcy5vblN1Ym1pdH0sIFxuICAgICAgICAgICAgICBpbnB1dHNcbiAgICAgICAgICAgICkpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHZhciBmb3JtID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudCggXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGVzdEZvcm0sIG51bGwpIFxuICAgICAgKTtcblxuICAgICAgLy8gV2FpdCBiZWZvcmUgYWRkaW5nIHRoZSBpbnB1dFxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgaW5wdXRzLnB1c2goVGVzdElucHV0KHtcbiAgICAgICAgICBuYW1lOiAndGVzdCdcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIGZvcmNlVXBkYXRlKGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgIC8vIFdhaXQgZm9yIG5leHQgZXZlbnQgbG9vcCwgYXMgdGhhdCBkb2VzIHRoZSBmb3JtXG4gICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBUZXN0VXRpbHMuU2ltdWxhdGUuY2hhbmdlKFRlc3RVdGlscy5maW5kUmVuZGVyZWRET01Db21wb25lbnRXaXRoVGFnKGZvcm0sICdJTlBVVCcpLCB7dGFyZ2V0OiB7dmFsdWU6ICdmb28nfX0pO1xuICAgICAgICAgICAgVGVzdFV0aWxzLlNpbXVsYXRlLnN1Ym1pdChmb3JtLmdldERPTU5vZGUoKSk7XG4gICAgICAgICAgICBleHBlY3QobW9kZWwudGVzdCkudG9CZSgnZm9vJyk7XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgfSwgMCk7XG5cbiAgICAgICAgfSk7XG5cbiAgICAgIH0sIDEwKTtcblxuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBpbnZhbGlkYXRlIGEgdmFsaWQgZm9ybSBpZiBkeW5hbWljYWxseSBpbnNlcnRlZCBpbnB1dCBpcyBpbnZhbGlkJywgZnVuY3Rpb24gKGRvbmUpIHtcblxuICAgICAgdmFyIGZvcmNlVXBkYXRlID0gbnVsbDtcbiAgICAgIHZhciBpc0ludmFsaWQgPSBmYWxzZTtcbiAgICAgIHZhciBUZXN0SW5wdXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiVGVzdElucHV0XCIsXG4gICAgICAgIG1peGluczogW0Zvcm1zeS5NaXhpbl0sXG4gICAgICAgIGNoYW5nZVZhbHVlOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICB0aGlzLnNldFZhbHVlKGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge3ZhbHVlOiB0aGlzLmdldFZhbHVlKCksIG9uQ2hhbmdlOiB0aGlzLmNoYW5nZVZhbHVlfSlcbiAgICAgICAgfVxuICAgICAgfSk7XG5cblxuICAgICAgdmFyIGlucHV0cyA9IFtUZXN0SW5wdXQoe1xuICAgICAgICBuYW1lOiAndGVzdCcsXG4gICAgICAgIHZhbGlkYXRpb25zOiAnaXNFbWFpbCcsXG4gICAgICAgIHZhbHVlOiAnZm9vQGJhci5jb20nXG4gICAgICB9KV07XG5cbiAgICAgIHZhciBUZXN0Rm9ybSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJUZXN0Rm9ybVwiLFxuICAgICAgICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBmb3JjZVVwZGF0ZSA9IHRoaXMuZm9yY2VVcGRhdGUuYmluZCh0aGlzKTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0SW52YWxpZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlzSW52YWxpZCA9IHRydWU7XG4gICAgICAgIH0sXG4gICAgICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiAoIFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3Jtc3kuRm9ybSwge29uSW52YWxpZDogdGhpcy5zZXRJbnZhbGlkfSwgXG4gICAgICAgICAgICAgIGlucHV0c1xuICAgICAgICAgICAgKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdmFyIGZvcm0gPSBUZXN0VXRpbHMucmVuZGVySW50b0RvY3VtZW50KCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUZXN0Rm9ybSwgbnVsbCkgXG4gICAgICApO1xuXG4gICAgICBleHBlY3QoaXNJbnZhbGlkKS50b0JlKGZhbHNlKTtcblxuICAgICAgLy8gV2FpdCBiZWZvcmUgYWRkaW5nIHRoZSBpbnB1dFxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgXG4gICAgICAgIGlucHV0cy5wdXNoKFRlc3RJbnB1dCh7XG4gICAgICAgICAgbmFtZTogJ3Rlc3QyJyxcbiAgICAgICAgICB2YWxpZGF0aW9uczogJ2lzRW1haWwnLFxuICAgICAgICAgIHZhbHVlOiAnZm9vQGJhcidcbiAgICAgICAgfSkpO1xuXG5cbiAgICAgICAgZm9yY2VVcGRhdGUoZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgLy8gV2FpdCBmb3IgbmV4dCBldmVudCBsb29wLCBhcyB0aGF0IGRvZXMgdGhlIGZvcm1cbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIFRlc3RVdGlscy5TaW11bGF0ZS5zdWJtaXQoZm9ybS5nZXRET01Ob2RlKCkpO1xuICAgICAgICAgICAgZXhwZWN0KGlzSW52YWxpZCkudG9CZSh0cnVlKTtcbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICB9LCAwKTtcblxuICAgICAgICB9KTtcblxuICAgICAgfSwgMTApO1xuXG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG5vdCB0cmlnZ2VyIG9uQ2hhbmdlIHdoZW4gZm9ybSBpcyBtb3VudGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGhhc0NoYW5nZWQgPSBqYXNtaW5lLmNyZWF0ZVNweSgnb25DaGFuZ2UnKTtcbiAgICAgIHZhciBUZXN0Rm9ybSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJUZXN0Rm9ybVwiLFxuICAgICAgICBvbkNoYW5nZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGhhc0NoYW5nZWQoKTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybXN5LkZvcm0sIHtvbkNoYW5nZTogdGhpcy5vbkNoYW5nZX0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHZhciBmb3JtID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudChSZWFjdC5jcmVhdGVFbGVtZW50KFRlc3RGb3JtLCBudWxsKSk7XG4gICAgICBleHBlY3QoaGFzQ2hhbmdlZCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgdHJpZ2dlciBvbkNoYW5nZSB3aGVuIGZvcm0gZWxlbWVudCBpcyBjaGFuZ2VkJywgZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGhhc0NoYW5nZWQgPSBqYXNtaW5lLmNyZWF0ZVNweSgnb25DaGFuZ2UnKTtcbiAgICAgIHZhciBNeUlucHV0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIk15SW5wdXRcIixcbiAgICAgICAgbWl4aW5zOiBbRm9ybXN5Lk1peGluXSxcbiAgICAgICAgb25DaGFuZ2U6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgIHRoaXMuc2V0VmFsdWUoZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7dmFsdWU6IHRoaXMuZ2V0VmFsdWUoKSwgb25DaGFuZ2U6IHRoaXMub25DaGFuZ2V9KVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHZhciBUZXN0Rm9ybSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJUZXN0Rm9ybVwiLFxuICAgICAgICBvbkNoYW5nZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGhhc0NoYW5nZWQoKTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybXN5LkZvcm0sIHtvbkNoYW5nZTogdGhpcy5vbkNoYW5nZX0sIFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE15SW5wdXQsIHtuYW1lOiBcImZvb1wifSlcbiAgICAgICAgICAgIClcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHZhciBmb3JtID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudChSZWFjdC5jcmVhdGVFbGVtZW50KFRlc3RGb3JtLCBudWxsKSk7XG4gICAgICBUZXN0VXRpbHMuU2ltdWxhdGUuY2hhbmdlKFRlc3RVdGlscy5maW5kUmVuZGVyZWRET01Db21wb25lbnRXaXRoVGFnKGZvcm0sICdJTlBVVCcpLCB7dGFyZ2V0OiB7dmFsdWU6ICdiYXInfX0pO1xuICAgICAgZXhwZWN0KGhhc0NoYW5nZWQpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgdHJpZ2dlciBvbkNoYW5nZSB3aGVuIG5ldyBpbnB1dCBpcyBhZGRlZCB0byBmb3JtJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgIHZhciBoYXNDaGFuZ2VkID0gamFzbWluZS5jcmVhdGVTcHkoJ29uQ2hhbmdlJyk7XG4gICAgICB2YXIgaW5wdXRzID0gW107XG4gICAgICB2YXIgZm9yY2VVcGRhdGUgPSBudWxsO1xuICAgICAgdmFyIFRlc3RJbnB1dCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJUZXN0SW5wdXRcIixcbiAgICAgICAgbWl4aW5zOiBbRm9ybXN5Lk1peGluXSxcbiAgICAgICAgY2hhbmdlVmFsdWU6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgIHRoaXMuc2V0VmFsdWUoZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7dmFsdWU6IHRoaXMuZ2V0VmFsdWUoKSwgb25DaGFuZ2U6IHRoaXMuY2hhbmdlVmFsdWV9KVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHZhciBUZXN0Rm9ybSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJUZXN0Rm9ybVwiLFxuICAgICAgICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBmb3JjZVVwZGF0ZSA9IHRoaXMuZm9yY2VVcGRhdGUuYmluZCh0aGlzKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25DaGFuZ2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBoYXNDaGFuZ2VkKCk7XG4gICAgICAgIH0sXG4gICAgICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiAoIFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3Jtc3kuRm9ybSwge29uQ2hhbmdlOiB0aGlzLm9uQ2hhbmdlfSwgXG4gICAgICAgICAgICAgIGlucHV0c1xuICAgICAgICAgICAgKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdmFyIGZvcm0gPSBUZXN0VXRpbHMucmVuZGVySW50b0RvY3VtZW50KCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUZXN0Rm9ybSwgbnVsbCkgXG4gICAgICApO1xuXG4gICAgICAvLyBXYWl0IGJlZm9yZSBhZGRpbmcgdGhlIGlucHV0XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblxuICAgICAgICBpbnB1dHMucHVzaChUZXN0SW5wdXQoe1xuICAgICAgICAgIG5hbWU6ICd0ZXN0J1xuICAgICAgICB9KSk7XG5cbiAgICAgICAgZm9yY2VVcGRhdGUoZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgLy8gV2FpdCBmb3IgbmV4dCBldmVudCBsb29wLCBhcyB0aGF0IGRvZXMgdGhlIGZvcm1cbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGV4cGVjdChoYXNDaGFuZ2VkKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgfSwgMCk7XG5cbiAgICAgICAgfSk7XG5cbiAgICAgIH0sIDEwKTtcblxuICAgIH0pO1xuXG4gIH0pO1xuXG59KTtcbiIsInZhciBGb3Jtc3kgPSByZXF1aXJlKCcuLy4uL3NyYy9tYWluLmpzJyk7XG5cbmRlc2NyaWJlKCdBamF4JywgZnVuY3Rpb24oKSB7XG5cbiAgYmVmb3JlRWFjaChmdW5jdGlvbiAoKSB7XG4gICAgamFzbWluZS5BamF4Lmluc3RhbGwoKTtcbiAgfSk7XG5cbiAgYWZ0ZXJFYWNoKGZ1bmN0aW9uICgpIHtcbiAgICBqYXNtaW5lLkFqYXgudW5pbnN0YWxsKCk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgcG9zdCB0byBhIGdpdmVuIHVybCBpZiBwYXNzZWQnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICB2YXIgZm9ybSA9IFRlc3RVdGlscy5yZW5kZXJJbnRvRG9jdW1lbnQoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1zeS5Gb3JtLCB7dXJsOiBcIi91c2Vyc1wifVxuICAgICAgKVxuICAgICk7XG4gICAgXG4gICAgVGVzdFV0aWxzLlNpbXVsYXRlLnN1Ym1pdChmb3JtLmdldERPTU5vZGUoKSk7XG4gICAgZXhwZWN0KGphc21pbmUuQWpheC5yZXF1ZXN0cy5tb3N0UmVjZW50KCkudXJsKS50b0JlKCcvdXNlcnMnKTtcbiAgICBleHBlY3QoamFzbWluZS5BamF4LnJlcXVlc3RzLm1vc3RSZWNlbnQoKS5tZXRob2QpLnRvQmUoJ1BPU1QnKTtcblxuICB9KTtcblxuICBpdCgnc2hvdWxkIHB1dCB0byBhIGdpdmVuIHVybCBpZiBwYXNzZWQgYSBtZXRob2QgYXR0cmlidXRlJywgZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIGZvcm0gPSBUZXN0VXRpbHMucmVuZGVySW50b0RvY3VtZW50KFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3Jtc3kuRm9ybSwge3VybDogXCIvdXNlcnNcIiwgbWV0aG9kOiBcIlBVVFwifVxuICAgICAgKVxuICAgICk7XG4gICAgXG4gICAgVGVzdFV0aWxzLlNpbXVsYXRlLnN1Ym1pdChmb3JtLmdldERPTU5vZGUoKSk7XG4gICAgZXhwZWN0KGphc21pbmUuQWpheC5yZXF1ZXN0cy5tb3N0UmVjZW50KCkudXJsKS50b0JlKCcvdXNlcnMnKTtcbiAgICBleHBlY3QoamFzbWluZS5BamF4LnJlcXVlc3RzLm1vc3RSZWNlbnQoKS5tZXRob2QpLnRvQmUoJ1BVVCcpO1xuXG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgcGFzcyB4LXd3dy1mb3JtLXVybGVuY29kZWQgYXMgY29udGVudFR5cGUgd2hlbiB1cmxlbmNvZGVkIGlzIHNldCBhcyBjb250ZW50VHlwZScsIGZ1bmN0aW9uICgpIHtcblxuICAgIHZhciBmb3JtID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybXN5LkZvcm0sIHt1cmw6IFwiL3VzZXJzXCIsIGNvbnRlbnRUeXBlOiBcInVybGVuY29kZWRcIn1cbiAgICAgIClcbiAgICApO1xuICAgIFxuICAgIFRlc3RVdGlscy5TaW11bGF0ZS5zdWJtaXQoZm9ybS5nZXRET01Ob2RlKCkpO1xuICAgIGV4cGVjdChqYXNtaW5lLkFqYXgucmVxdWVzdHMubW9zdFJlY2VudCgpLmNvbnRlbnRUeXBlKCkpLnRvQmUoJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpO1xuXG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgcnVuIGFuIG9uU3VjY2VzcyBoYW5kbGVyLCBpZiBwYXNzZWQgYW5kIGFqYXggaXMgc3VjY2Vzc2Z1bGwuIEZpcnN0IGFyZ3VtZW50IGlzIGRhdGEgZnJvbSBzZXJ2ZXInLCBmdW5jdGlvbiAoZG9uZSkge1xuIFxuICAgIHZhciBvblN1Y2Nlc3MgPSBqYXNtaW5lLmNyZWF0ZVNweShcInN1Y2Nlc3NcIik7XG4gICAgdmFyIGZvcm0gPSBUZXN0VXRpbHMucmVuZGVySW50b0RvY3VtZW50KFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3Jtc3kuRm9ybSwge3VybDogXCIvdXNlcnNcIiwgb25TdWNjZXNzOiBvblN1Y2Nlc3N9XG4gICAgICApXG4gICAgKTtcbiAgICBcbiAgICBqYXNtaW5lLkFqYXguc3R1YlJlcXVlc3QoJy91c2VycycpLmFuZFJldHVybih7XG4gICAgICBzdGF0dXM6IDIwMCxcbiAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICByZXNwb25zZVRleHQ6ICd7fSdcbiAgICB9KTtcblxuICAgIFRlc3RVdGlscy5TaW11bGF0ZS5zdWJtaXQoZm9ybS5nZXRET01Ob2RlKCkpO1xuXG4gICAgLy8gU2luY2UgYWpheCBpcyByZXR1cm5lZCBhcyBhIHByb21pc2UgKGFzeW5jKSwgbW92ZSBhc3NlcnRpb25cbiAgICAvLyB0byBlbmQgb2YgZXZlbnQgbG9vcFxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgZXhwZWN0KG9uU3VjY2VzcykudG9IYXZlQmVlbkNhbGxlZFdpdGgoe30pO1xuICAgICAgZG9uZSgpO1xuICAgIH0sIDApO1xuXG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgbm90IGRvIGFqYXggcmVxdWVzdCBpZiBvblN1Ym1pdCBoYW5kbGVyIGlzIHBhc3NlZCwgYnV0IHBhc3MgdGhlIG1vZGVsIGFzIGZpcnN0IGFyZ3VtZW50IHRvIG9uU3VibWl0IGhhbmRsZXInLCBmdW5jdGlvbiAoKSB7XG4gICAgXG4gICAgdmFyIFRlc3RJbnB1dCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJUZXN0SW5wdXRcIixcbiAgICAgIG1peGluczogW0Zvcm1zeS5NaXhpbl0sXG4gICAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7dmFsdWU6IHRoaXMuZ2V0VmFsdWUoKX0pXG4gICAgICB9XG4gICAgfSk7XG4gICAgdmFyIGZvcm0gPSBUZXN0VXRpbHMucmVuZGVySW50b0RvY3VtZW50KFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3Jtc3kuRm9ybSwge29uU3VibWl0OiBvblN1Ym1pdH0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRlc3RJbnB1dCwge25hbWU6IFwiZm9vXCIsIHZhbHVlOiBcImJhclwifSlcbiAgICAgIClcbiAgICApO1xuXG4gICAgVGVzdFV0aWxzLlNpbXVsYXRlLnN1Ym1pdChmb3JtLmdldERPTU5vZGUoKSk7XG5cbiAgICBleHBlY3QoamFzbWluZS5BamF4LnJlcXVlc3RzLmNvdW50KCkpLnRvQmUoMCk7XG5cbiAgICBmdW5jdGlvbiBvblN1Ym1pdCAoZGF0YSkge1xuICAgICAgZXhwZWN0KGRhdGEpLnRvRXF1YWwoe1xuICAgICAgICBmb286ICdiYXInXG4gICAgICB9KTtcbiAgICB9XG5cbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCB0cmlnZ2VyIGFuIG9uU3VibWl0dGVkIGhhbmRsZXIsIGlmIHBhc3NlZCBhbmQgdGhlIHN1Ym1pdCBoYXMgcmVzcG9uZGVkIHdpdGggU1VDQ0VTUycsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgXG4gICAgdmFyIG9uU3VibWl0dGVkID0gamFzbWluZS5jcmVhdGVTcHkoXCJzdWJtaXR0ZWRcIik7XG4gICAgdmFyIGZvcm0gPSBUZXN0VXRpbHMucmVuZGVySW50b0RvY3VtZW50KFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3Jtc3kuRm9ybSwge3VybDogXCIvdXNlcnNcIiwgb25TdWJtaXR0ZWQ6IG9uU3VibWl0dGVkfVxuICAgICAgKVxuICAgICk7XG4gICAgXG4gICAgamFzbWluZS5BamF4LnN0dWJSZXF1ZXN0KCcvdXNlcnMnKS5hbmRSZXR1cm4oe1xuICAgICAgc3RhdHVzOiAyMDAsXG4gICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgcmVzcG9uc2VUZXh0OiAne30nXG4gICAgfSk7XG5cbiAgICBUZXN0VXRpbHMuU2ltdWxhdGUuc3VibWl0KGZvcm0uZ2V0RE9NTm9kZSgpKTtcblxuICAgIC8vIFNpbmNlIGFqYXggaXMgcmV0dXJuZWQgYXMgYSBwcm9taXNlIChhc3luYyksIG1vdmUgYXNzZXJ0aW9uXG4gICAgLy8gdG8gZW5kIG9mIGV2ZW50IGxvb3BcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGV4cGVjdChvblN1Ym1pdHRlZCkudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgZG9uZSgpO1xuICAgIH0sIDApO1xuXG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgdHJpZ2dlciBhbiBvblN1Ym1pdHRlZCBoYW5kbGVyLCBpZiBwYXNzZWQgYW5kIHRoZSBzdWJtaXQgaGFzIHJlc3BvbmRlZCB3aXRoIEVSUk9SJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICBcbiAgICB2YXIgb25TdWJtaXR0ZWQgPSBqYXNtaW5lLmNyZWF0ZVNweShcInN1Ym1pdHRlZFwiKTtcbiAgICB2YXIgZm9ybSA9IFRlc3RVdGlscy5yZW5kZXJJbnRvRG9jdW1lbnQoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1zeS5Gb3JtLCB7dXJsOiBcIi91c2Vyc1wiLCBvblN1Ym1pdHRlZDogb25TdWJtaXR0ZWR9XG4gICAgICApXG4gICAgKTtcbiAgICBcbiAgICBqYXNtaW5lLkFqYXguc3R1YlJlcXVlc3QoJy91c2VycycpLmFuZFJldHVybih7XG4gICAgICBzdGF0dXM6IDUwMCxcbiAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICByZXNwb25zZVRleHQ6ICd7fSdcbiAgICB9KTtcblxuICAgIFRlc3RVdGlscy5TaW11bGF0ZS5zdWJtaXQoZm9ybS5nZXRET01Ob2RlKCkpO1xuXG4gICAgLy8gU2luY2UgYWpheCBpcyByZXR1cm5lZCBhcyBhIHByb21pc2UgKGFzeW5jKSwgbW92ZSBhc3NlcnRpb25cbiAgICAvLyB0byBlbmQgb2YgZXZlbnQgbG9vcFxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgZXhwZWN0KG9uU3VibWl0dGVkKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICBkb25lKCk7XG4gICAgfSwgMCk7XG5cbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCB0cmlnZ2VyIGFuIG9uRXJyb3IgaGFuZGxlciwgaWYgcGFzc2VkIGFuZCB0aGUgc3VibWl0IGhhcyByZXNwb25kZWQgd2l0aCBFUlJPUicsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgXG4gICAgdmFyIG9uRXJyb3IgPSBqYXNtaW5lLmNyZWF0ZVNweShcImVycm9yXCIpO1xuICAgIHZhciBmb3JtID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybXN5LkZvcm0sIHt1cmw6IFwiL3VzZXJzXCIsIG9uRXJyb3I6IG9uRXJyb3J9XG4gICAgICApXG4gICAgKTtcbiAgICBcbiAgICAvLyBEbyBub3QgcmV0dXJuIGFueSBlcnJvciBiZWNhdXNlIHRoZXJlIGFyZSBubyBpbnB1dHNcbiAgICBqYXNtaW5lLkFqYXguc3R1YlJlcXVlc3QoJy91c2VycycpLmFuZFJldHVybih7XG4gICAgICBzdGF0dXM6IDUwMCxcbiAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICByZXNwb25zZVRleHQ6ICd7fSdcbiAgICB9KTtcblxuICAgIFRlc3RVdGlscy5TaW11bGF0ZS5zdWJtaXQoZm9ybS5nZXRET01Ob2RlKCkpO1xuXG4gICAgLy8gU2luY2UgYWpheCBpcyByZXR1cm5lZCBhcyBhIHByb21pc2UgKGFzeW5jKSwgbW92ZSBhc3NlcnRpb25cbiAgICAvLyB0byBlbmQgb2YgZXZlbnQgbG9vcFxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgZXhwZWN0KG9uRXJyb3IpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHt9KTtcbiAgICAgIGRvbmUoKTtcbiAgICB9LCAwKTtcblxuICB9KTtcblxufSk7XG4iLCJ2YXIgRm9ybXN5ID0gcmVxdWlyZSgnLi8uLi9zcmMvbWFpbi5qcycpO1xuXG5kZXNjcmliZSgnVmFsaWRhdGlvbicsIGZ1bmN0aW9uKCkge1xuXG4gIGl0KCdzaG91bGQgdHJpZ2dlciBhbiBvblZhbGlkIGhhbmRsZXIsIGlmIHBhc3NlZCwgd2hlbiBmb3JtIGlzIHZhbGlkJywgZnVuY3Rpb24gKCkge1xuICAgIFxuICAgIHZhciBvblZhbGlkID0gamFzbWluZS5jcmVhdGVTcHkoJ3ZhbGlkJyk7XG4gICAgdmFyIFRlc3RJbnB1dCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJUZXN0SW5wdXRcIixcbiAgICAgIG1peGluczogW0Zvcm1zeS5NaXhpbl0sXG4gICAgICB1cGRhdGVWYWx1ZTogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuc2V0VmFsdWUoZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICAgIH0sXG4gICAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7dmFsdWU6IHRoaXMuZ2V0VmFsdWUoKSwgb25DaGFuZ2U6IHRoaXMudXBkYXRlVmFsdWV9KVxuICAgICAgfVxuICAgIH0pO1xuICAgIHZhciBmb3JtID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybXN5LkZvcm0sIHtvblZhbGlkOiBvblZhbGlkfSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGVzdElucHV0LCB7bmFtZTogXCJmb29cIiwgcmVxdWlyZWQ6IHRydWV9KVxuICAgICAgKVxuICAgICk7XG5cbiAgICB2YXIgaW5wdXQgPSBUZXN0VXRpbHMuZmluZFJlbmRlcmVkRE9NQ29tcG9uZW50V2l0aFRhZyhmb3JtLCAnSU5QVVQnKTtcbiAgICBUZXN0VXRpbHMuU2ltdWxhdGUuY2hhbmdlKGlucHV0LCB7dGFyZ2V0OiB7dmFsdWU6ICdmb28nfX0pO1xuICAgIGV4cGVjdChvblZhbGlkKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG5cbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCB0cmlnZ2VyIGFuIG9uSW52YWxpZCBoYW5kbGVyLCBpZiBwYXNzZWQsIHdoZW4gZm9ybSBpcyBpbnZhbGlkJywgZnVuY3Rpb24gKCkge1xuICAgIFxuICAgIHZhciBvbkludmFsaWQgPSBqYXNtaW5lLmNyZWF0ZVNweSgnaW52YWxpZCcpO1xuICAgIHZhciBUZXN0SW5wdXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiVGVzdElucHV0XCIsXG4gICAgICBtaXhpbnM6IFtGb3Jtc3kuTWl4aW5dLFxuICAgICAgdXBkYXRlVmFsdWU6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICB0aGlzLnNldFZhbHVlKGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gICAgICB9LFxuICAgICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge3ZhbHVlOiB0aGlzLmdldFZhbHVlKCksIG9uQ2hhbmdlOiB0aGlzLnVwZGF0ZVZhbHVlfSlcbiAgICAgIH1cbiAgICB9KTtcbiAgICB2YXIgZm9ybSA9IFRlc3RVdGlscy5yZW5kZXJJbnRvRG9jdW1lbnQoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1zeS5Gb3JtLCB7b25WYWxpZDogb25JbnZhbGlkfSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGVzdElucHV0LCB7bmFtZTogXCJmb29cIiwgdmFsdWU6IFwiZm9vXCJ9KVxuICAgICAgKVxuICAgICk7XG5cbiAgICB2YXIgaW5wdXQgPSBUZXN0VXRpbHMuZmluZFJlbmRlcmVkRE9NQ29tcG9uZW50V2l0aFRhZyhmb3JtLCAnSU5QVVQnKTtcbiAgICBUZXN0VXRpbHMuU2ltdWxhdGUuY2hhbmdlKGlucHV0LCB7dGFyZ2V0OiB7dmFsdWU6ICcnfX0pO1xuICAgIGV4cGVjdChvbkludmFsaWQpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcblxuICB9KTtcblxuICBpdCgnUlVMRTogaXNFbWFpbCcsIGZ1bmN0aW9uICgpIHtcbiAgICBcbiAgICB2YXIgaXNWYWxpZCA9IGphc21pbmUuY3JlYXRlU3B5KCd2YWxpZCcpO1xuICAgIHZhciBUZXN0SW5wdXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiVGVzdElucHV0XCIsXG4gICAgICBtaXhpbnM6IFtGb3Jtc3kuTWl4aW5dLFxuICAgICAgdXBkYXRlVmFsdWU6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICB0aGlzLnNldFZhbHVlKGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gICAgICB9LFxuICAgICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICAgIGlzVmFsaWQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHt2YWx1ZTogdGhpcy5nZXRWYWx1ZSgpLCBvbkNoYW5nZTogdGhpcy51cGRhdGVWYWx1ZX0pXG4gICAgICB9XG4gICAgfSk7XG4gICAgdmFyIGZvcm0gPSBUZXN0VXRpbHMucmVuZGVySW50b0RvY3VtZW50KFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3Jtc3kuRm9ybSwgbnVsbCwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGVzdElucHV0LCB7bmFtZTogXCJmb29cIiwgdmFsdWU6IFwiZm9vXCIsIHZhbGlkYXRpb25zOiBcImlzRW1haWxcIn0pXG4gICAgICApXG4gICAgKTtcblxuICAgIHZhciBpbnB1dCA9IFRlc3RVdGlscy5maW5kUmVuZGVyZWRET01Db21wb25lbnRXaXRoVGFnKGZvcm0sICdJTlBVVCcpO1xuICAgIGV4cGVjdChpc1ZhbGlkKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgIFRlc3RVdGlscy5TaW11bGF0ZS5jaGFuZ2UoaW5wdXQsIHt0YXJnZXQ6IHt2YWx1ZTogJ2Zvb0Bmb28uY29tJ319KTtcbiAgICBleHBlY3QoaXNWYWxpZCkudG9IYXZlQmVlbkNhbGxlZCgpO1xuXG4gIH0pO1xuXG4gIGl0KCdSVUxFOiBpc051bWVyaWMnLCBmdW5jdGlvbiAoKSB7XG4gICAgXG4gICAgdmFyIGlzVmFsaWQgPSBqYXNtaW5lLmNyZWF0ZVNweSgndmFsaWQnKTtcbiAgICB2YXIgVGVzdElucHV0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlRlc3RJbnB1dFwiLFxuICAgICAgbWl4aW5zOiBbRm9ybXN5Lk1peGluXSxcbiAgICAgIHVwZGF0ZVZhbHVlOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5zZXRWYWx1ZShldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgfSxcbiAgICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICBpc1ZhbGlkKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7dmFsdWU6IHRoaXMuZ2V0VmFsdWUoKSwgb25DaGFuZ2U6IHRoaXMudXBkYXRlVmFsdWV9KVxuICAgICAgfVxuICAgIH0pO1xuICAgIHZhciBmb3JtID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybXN5LkZvcm0sIG51bGwsIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRlc3RJbnB1dCwge25hbWU6IFwiZm9vXCIsIHZhbHVlOiBcImZvb1wiLCB2YWxpZGF0aW9uczogXCJpc051bWVyaWNcIn0pXG4gICAgICApXG4gICAgKTtcblxuICAgIHZhciBpbnB1dCA9IFRlc3RVdGlscy5maW5kUmVuZGVyZWRET01Db21wb25lbnRXaXRoVGFnKGZvcm0sICdJTlBVVCcpO1xuICAgIGV4cGVjdChpc1ZhbGlkKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgIFRlc3RVdGlscy5TaW11bGF0ZS5jaGFuZ2UoaW5wdXQsIHt0YXJnZXQ6IHt2YWx1ZTogJzEyMyd9fSk7XG4gICAgZXhwZWN0KGlzVmFsaWQpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcblxuICB9KTtcblxuICBpdCgnUlVMRTogaXNOdW1lcmljIChhY3R1YWwgbnVtYmVyKScsIGZ1bmN0aW9uICgpIHtcbiAgICBcbiAgICB2YXIgaXNWYWxpZCA9IGphc21pbmUuY3JlYXRlU3B5KCd2YWxpZCcpO1xuICAgIHZhciBUZXN0SW5wdXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiVGVzdElucHV0XCIsXG4gICAgICBtaXhpbnM6IFtGb3Jtc3kuTWl4aW5dLFxuICAgICAgdXBkYXRlVmFsdWU6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICB0aGlzLnNldFZhbHVlKE51bWJlcihldmVudC50YXJnZXQudmFsdWUpKTtcbiAgICAgIH0sXG4gICAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICAgICAgaXNWYWxpZCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge3ZhbHVlOiB0aGlzLmdldFZhbHVlKCksIG9uQ2hhbmdlOiB0aGlzLnVwZGF0ZVZhbHVlfSlcbiAgICAgIH1cbiAgICB9KTtcbiAgICB2YXIgZm9ybSA9IFRlc3RVdGlscy5yZW5kZXJJbnRvRG9jdW1lbnQoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1zeS5Gb3JtLCBudWxsLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUZXN0SW5wdXQsIHtuYW1lOiBcImZvb1wiLCB2YWx1ZTogXCJmb29cIiwgdmFsaWRhdGlvbnM6IFwiaXNOdW1lcmljXCJ9KVxuICAgICAgKVxuICAgICk7XG5cbiAgICB2YXIgaW5wdXQgPSBUZXN0VXRpbHMuZmluZFJlbmRlcmVkRE9NQ29tcG9uZW50V2l0aFRhZyhmb3JtLCAnSU5QVVQnKTtcbiAgICBleHBlY3QoaXNWYWxpZCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICBUZXN0VXRpbHMuU2ltdWxhdGUuY2hhbmdlKGlucHV0LCB7dGFyZ2V0OiB7dmFsdWU6ICcxMjMnfX0pO1xuICAgIGV4cGVjdChpc1ZhbGlkKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG5cbiAgfSk7XG5cbn0pO1xuIiwidmFyIFJlYWN0ID0gZ2xvYmFsLlJlYWN0IHx8IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgRm9ybXN5ID0ge307XG52YXIgdmFsaWRhdGlvblJ1bGVzID0ge1xuICAnaXNWYWx1ZSc6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSAhPT0gJyc7XG4gIH0sXG4gICdpc0VtYWlsJzogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlLm1hdGNoKC9eKCgoW2Etel18XFxkfFshI1xcJCUmJ1xcKlxcK1xcLVxcLz1cXD9cXF5fYHtcXHx9fl18W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pKyhcXC4oW2Etel18XFxkfFshI1xcJCUmJ1xcKlxcK1xcLVxcLz1cXD9cXF5fYHtcXHx9fl18W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pKykqKXwoKFxceDIyKSgoKChcXHgyMHxcXHgwOSkqKFxceDBkXFx4MGEpKT8oXFx4MjB8XFx4MDkpKyk/KChbXFx4MDEtXFx4MDhcXHgwYlxceDBjXFx4MGUtXFx4MWZcXHg3Zl18XFx4MjF8W1xceDIzLVxceDViXXxbXFx4NWQtXFx4N2VdfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKXwoXFxcXChbXFx4MDEtXFx4MDlcXHgwYlxceDBjXFx4MGQtXFx4N2ZdfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKSkpKSooKChcXHgyMHxcXHgwOSkqKFxceDBkXFx4MGEpKT8oXFx4MjB8XFx4MDkpKyk/KFxceDIyKSkpQCgoKFthLXpdfFxcZHxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSl8KChbYS16XXxcXGR8W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pKFthLXpdfFxcZHwtfFxcLnxffH58W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pKihbYS16XXxcXGR8W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pKSlcXC4pKygoW2Etel18W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pfCgoW2Etel18W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pKFthLXpdfFxcZHwtfFxcLnxffH58W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pKihbYS16XXxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkpKSQvaSk7XG4gIH0sXG4gICdpc1RydWUnOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IHRydWU7XG4gIH0sXG4gICdpc051bWVyaWMnOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB2YWx1ZS5tYXRjaCgvXi0/WzAtOV0rJC8pO1xuICAgIH1cbiAgfSxcbiAgJ2lzQWxwaGEnOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUubWF0Y2goL15bYS16QS1aXSskLyk7XG4gIH0sXG4gICdpc1dvcmRzJzogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlLm1hdGNoKC9eW2EtekEtWlxcc10rJC8pO1xuICB9LFxuICAnaXNTcGVjaWFsV29yZHMnOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUubWF0Y2goL15bYS16QS1aXFxzXFx1MDBDMC1cXHUwMTdGXSskLyk7XG4gIH0sXG4gIGlzTGVuZ3RoOiBmdW5jdGlvbiAodmFsdWUsIG1pbiwgbWF4KSB7XG4gICAgaWYgKG1heCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdmFsdWUubGVuZ3RoID49IG1pbiAmJiB2YWx1ZS5sZW5ndGggPD0gbWF4O1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWUubGVuZ3RoID49IG1pbjtcbiAgfSxcbiAgZXF1YWxzOiBmdW5jdGlvbiAodmFsdWUsIGVxbCkge1xuICAgIHJldHVybiB2YWx1ZSA9PSBlcWw7XG4gIH0sXG4gIGVxdWFsc0ZpZWxkOiBmdW5jdGlvbiAodmFsdWUsIGZpZWxkKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSB0aGlzW2ZpZWxkXTtcbiAgfVxufTtcblxudmFyIHRvVVJMRW5jb2RlZCA9IGZ1bmN0aW9uIChlbGVtZW50LCBrZXksIGxpc3QpIHtcbiAgdmFyIGxpc3QgPSBsaXN0IHx8IFtdO1xuICBpZiAodHlwZW9mIChlbGVtZW50KSA9PSAnb2JqZWN0Jykge1xuICAgIGZvciAodmFyIGlkeCBpbiBlbGVtZW50KVxuICAgICAgdG9VUkxFbmNvZGVkKGVsZW1lbnRbaWR4XSwga2V5ID8ga2V5ICsgJ1snICsgaWR4ICsgJ10nIDogaWR4LCBsaXN0KTtcbiAgfSBlbHNlIHtcbiAgICBsaXN0LnB1c2goa2V5ICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KGVsZW1lbnQpKTtcbiAgfVxuICByZXR1cm4gbGlzdC5qb2luKCcmJyk7XG59O1xuXG52YXIgcmVxdWVzdCA9IGZ1bmN0aW9uIChtZXRob2QsIHVybCwgZGF0YSwgY29udGVudFR5cGUsIGhlYWRlcnMpIHtcblxuICB2YXIgY29udGVudFR5cGUgPSBjb250ZW50VHlwZSA9PT0gJ3VybGVuY29kZWQnID8gJ2FwcGxpY2F0aW9uLycgKyBjb250ZW50VHlwZS5yZXBsYWNlKCd1cmxlbmNvZGVkJywgJ3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpIDogJ2FwcGxpY2F0aW9uL2pzb24nO1xuICBkYXRhID0gY29udGVudFR5cGUgPT09ICdhcHBsaWNhdGlvbi9qc29uJyA/IEpTT04uc3RyaW5naWZ5KGRhdGEpIDogdG9VUkxFbmNvZGVkKGRhdGEpO1xuXG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdHJ5IHtcbiAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgIHhoci5vcGVuKG1ldGhvZCwgdXJsLCB0cnVlKTtcbiAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdBY2NlcHQnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsIGNvbnRlbnRUeXBlKTtcblxuICAgICAgLy8gQWRkIHBhc3NlZCBoZWFkZXJzXG4gICAgICBPYmplY3Qua2V5cyhoZWFkZXJzKS5mb3JFYWNoKGZ1bmN0aW9uIChoZWFkZXIpIHtcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoaGVhZGVyLCBoZWFkZXJzW2hlYWRlcl0pO1xuICAgICAgfSk7XG5cbiAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCkge1xuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhciByZXNwb25zZSA9IHhoci5yZXNwb25zZVRleHQgPyBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpIDogbnVsbDtcbiAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgMzAwKSB7XG4gICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmVqZWN0KHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICB4aHIuc2VuZChkYXRhKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZWplY3QoZSk7XG4gICAgfVxuICB9KTtcblxufTtcblxudmFyIGFycmF5c0RpZmZlciA9IGZ1bmN0aW9uIChhcnJheUEsIGFycmF5Qikge1xuICB2YXIgaXNEaWZmZXJlbnQgPSBmYWxzZTtcbiAgaWYgKGFycmF5QS5sZW5ndGggIT09IGFycmF5Qi5sZW5ndGgpIHtcbiAgICBpc0RpZmZlcmVudCA9IHRydWU7XG4gIH0gZWxzZSB7XG4gICAgYXJyYXlBLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XG4gICAgICBpZiAoaXRlbSAhPT0gYXJyYXlCW2luZGV4XSkge1xuICAgICAgICBpc0RpZmZlcmVudCA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIGlzRGlmZmVyZW50O1xufTtcblxudmFyIGFqYXggPSB7XG4gIHBvc3Q6IHJlcXVlc3QuYmluZChudWxsLCAnUE9TVCcpLFxuICBwdXQ6IHJlcXVlc3QuYmluZChudWxsLCAnUFVUJylcbn07XG52YXIgb3B0aW9ucyA9IHt9O1xuXG5Gb3Jtc3kuZGVmYXVsdHMgPSBmdW5jdGlvbiAocGFzc2VkT3B0aW9ucykge1xuICBvcHRpb25zID0gcGFzc2VkT3B0aW9ucztcbn07XG5cbkZvcm1zeS5NaXhpbiA9IHtcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIF92YWx1ZTogdGhpcy5wcm9wcy52YWx1ZSA/IHRoaXMucHJvcHMudmFsdWUgOiAnJyxcbiAgICAgIF9pc1ZhbGlkOiB0cnVlLFxuICAgICAgX2lzUHJpc3RpbmU6IHRydWVcbiAgICB9O1xuICB9LFxuICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uICgpIHtcblxuICAgIHZhciBjb25maWd1cmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBBZGQgdmFsaWRhdGlvbnMgdG8gdGhlIHN0b3JlIGl0c2VsZiBhcyB0aGUgcHJvcHMgb2JqZWN0IGNhbiBub3QgYmUgbW9kaWZpZWRcbiAgICAgIHRoaXMuX3ZhbGlkYXRpb25zID0gdGhpcy5wcm9wcy52YWxpZGF0aW9ucyB8fCAnJztcblxuICAgICAgaWYgKHRoaXMucHJvcHMucmVxdWlyZWQpIHtcbiAgICAgICAgdGhpcy5fdmFsaWRhdGlvbnMgPSB0aGlzLnByb3BzLnZhbGlkYXRpb25zID8gdGhpcy5wcm9wcy52YWxpZGF0aW9ucyArICcsJyA6ICcnO1xuICAgICAgICB0aGlzLl92YWxpZGF0aW9ucyArPSAnaXNWYWx1ZSc7XG4gICAgICB9XG4gICAgICB0aGlzLnByb3BzLl9hdHRhY2hUb0Zvcm0odGhpcyk7XG4gICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgaWYgKCF0aGlzLnByb3BzLm5hbWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRm9ybSBJbnB1dCByZXF1aXJlcyBhIG5hbWUgcHJvcGVydHkgd2hlbiB1c2VkJyk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnByb3BzLl9hdHRhY2hUb0Zvcm0pIHtcbiAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLnByb3BzLl9hdHRhY2hUb0Zvcm0pIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Zvcm0gTWl4aW4gcmVxdWlyZXMgY29tcG9uZW50IHRvIGJlIG5lc3RlZCBpbiBhIEZvcm0nKTtcbiAgICAgICAgfVxuICAgICAgICBjb25maWd1cmUoKTtcbiAgICAgIH0uYmluZCh0aGlzKSwgMCk7XG4gICAgfVxuICAgIGNvbmZpZ3VyZSgpO1xuXG4gIH0sXG5cbiAgLy8gV2UgaGF2ZSB0byBtYWtlIHRoZSB2YWxpZGF0ZSBtZXRob2QgaXMga2VwdCB3aGVuIG5ldyBwcm9wcyBhcmUgYWRkZWRcbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24gKG5leHRQcm9wcykge1xuICAgIG5leHRQcm9wcy5fYXR0YWNoVG9Gb3JtID0gdGhpcy5wcm9wcy5fYXR0YWNoVG9Gb3JtO1xuICAgIG5leHRQcm9wcy5fZGV0YWNoRnJvbUZvcm0gPSB0aGlzLnByb3BzLl9kZXRhY2hGcm9tRm9ybTtcbiAgICBuZXh0UHJvcHMuX3ZhbGlkYXRlID0gdGhpcy5wcm9wcy5fdmFsaWRhdGU7XG4gIH0sXG5cbiAgLy8gRGV0YWNoIGl0IHdoZW4gY29tcG9uZW50IHVubW91bnRzXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5wcm9wcy5fZGV0YWNoRnJvbUZvcm0odGhpcyk7XG4gIH0sXG5cbiAgLy8gV2UgdmFsaWRhdGUgYWZ0ZXIgdGhlIHZhbHVlIGhhcyBiZWVuIHNldFxuICBzZXRWYWx1ZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBfdmFsdWU6IHZhbHVlLFxuICAgICAgX2lzUHJpc3RpbmU6IGZhbHNlXG4gICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5wcm9wcy5fdmFsaWRhdGUodGhpcyk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgfSxcbiAgcmVzZXRWYWx1ZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgX3ZhbHVlOiAnJyxcbiAgICAgIF9pc1ByaXN0aW5lOiB0cnVlXG4gICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5wcm9wcy5fdmFsaWRhdGUodGhpcyk7XG4gICAgfSk7XG4gIH0sXG4gIGdldFZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUuX3ZhbHVlO1xuICB9LFxuICBoYXNWYWx1ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXRlLl92YWx1ZSAhPT0gJyc7XG4gIH0sXG4gIGdldEVycm9yTWVzc2FnZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmlzVmFsaWQoKSB8fCB0aGlzLnNob3dSZXF1aXJlZCgpID8gbnVsbCA6IHRoaXMuc3RhdGUuX3NlcnZlckVycm9yIHx8IHRoaXMucHJvcHMudmFsaWRhdGlvbkVycm9yO1xuICB9LFxuICBpc1ZhbGlkOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUuX2lzVmFsaWQ7XG4gIH0sXG4gIGlzUHJpc3RpbmU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5faXNQcmlzdGluZTtcbiAgfSxcbiAgaXNSZXF1aXJlZDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAhIXRoaXMucHJvcHMucmVxdWlyZWQ7XG4gIH0sXG4gIHNob3dSZXF1aXJlZDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmlzUmVxdWlyZWQoKSAmJiB0aGlzLnN0YXRlLl92YWx1ZSA9PT0gJyc7XG4gIH0sXG4gIHNob3dFcnJvcjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAhdGhpcy5zaG93UmVxdWlyZWQoKSAmJiAhdGhpcy5zdGF0ZS5faXNWYWxpZDtcbiAgfVxufTtcblxuRm9ybXN5LmFkZFZhbGlkYXRpb25SdWxlID0gZnVuY3Rpb24gKG5hbWUsIGZ1bmMpIHtcbiAgdmFsaWRhdGlvblJ1bGVzW25hbWVdID0gZnVuYztcbn07XG5cbkZvcm1zeS5Gb3JtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkZvcm1cIixcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlzVmFsaWQ6IHRydWUsXG4gICAgICBpc1N1Ym1pdHRpbmc6IGZhbHNlLFxuICAgICAgY2FuQ2hhbmdlOiBmYWxzZVxuICAgIH07XG4gIH0sXG4gIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICBoZWFkZXJzOiB7fSxcbiAgICAgIG9uU3VjY2VzczogZnVuY3Rpb24gKCkge30sXG4gICAgICBvbkVycm9yOiBmdW5jdGlvbiAoKSB7fSxcbiAgICAgIG9uU3VibWl0OiBmdW5jdGlvbiAoKSB7fSxcbiAgICAgIG9uU3VibWl0dGVkOiBmdW5jdGlvbiAoKSB7fSxcbiAgICAgIG9uVmFsaWQ6IGZ1bmN0aW9uICgpIHt9LFxuICAgICAgb25JbnZhbGlkOiBmdW5jdGlvbiAoKSB7fSxcbiAgICAgIG9uQ2hhbmdlOiBmdW5jdGlvbiAoKSB7fVxuICAgIH07XG4gIH0sXG5cbiAgLy8gQWRkIGEgbWFwIHRvIHN0b3JlIHRoZSBpbnB1dHMgb2YgdGhlIGZvcm0sIGEgbW9kZWwgdG8gc3RvcmVcbiAgLy8gdGhlIHZhbHVlcyBvZiB0aGUgZm9ybSBhbmQgcmVnaXN0ZXIgY2hpbGQgaW5wdXRzXG4gIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuaW5wdXRzID0ge307XG4gICAgdGhpcy5tb2RlbCA9IHt9O1xuICAgIHRoaXMucmVnaXN0ZXJJbnB1dHModGhpcy5wcm9wcy5jaGlsZHJlbik7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnZhbGlkYXRlRm9ybSgpO1xuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxVcGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaW5wdXRLZXlzID0gT2JqZWN0LmtleXModGhpcy5pbnB1dHMpO1xuXG4gICAgLy8gVGhlIHVwZGF0ZWQgY2hpbGRyZW4gYXJyYXkgaXMgbm90IGF2YWlsYWJsZSBoZXJlIGZvciBzb21lIHJlYXNvbixcbiAgICAvLyB3ZSBuZWVkIHRvIHdhaXQgZm9yIG5leHQgZXZlbnQgbG9vcFxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5yZWdpc3RlcklucHV0cyh0aGlzLnByb3BzLmNoaWxkcmVuKTtcblxuICAgICAgdmFyIG5ld0lucHV0S2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuaW5wdXRzKTtcbiAgICAgIGlmIChhcnJheXNEaWZmZXIoaW5wdXRLZXlzLCBuZXdJbnB1dEtleXMpKSB7XG4gICAgICAgIHRoaXMudmFsaWRhdGVGb3JtKCk7XG4gICAgICB9XG4gICAgfS5iaW5kKHRoaXMpLCAwKTtcbiAgfSxcblxuICAvLyBVcGRhdGUgbW9kZWwsIHN1Ym1pdCB0byB1cmwgcHJvcCBhbmQgc2VuZCB0aGUgbW9kZWxcbiAgc3VibWl0OiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgLy8gVHJpZ2dlciBmb3JtIGFzIG5vdCBwcmlzdGluZS5cbiAgICAvLyBJZiBhbnkgaW5wdXRzIGhhdmUgbm90IGJlZW4gdG91Y2hlZCB5ZXQgdGhpcyB3aWxsIG1ha2UgdGhlbSBkaXJ0eVxuICAgIC8vIHNvIHZhbGlkYXRpb24gYmVjb21lcyB2aXNpYmxlIChpZiBiYXNlZCBvbiBpc1ByaXN0aW5lKVxuICAgIHRoaXMuc2V0Rm9ybVByaXN0aW5lKGZhbHNlKTtcblxuICAgIC8vIFRvIHN1cHBvcnQgdXNlIGNhc2VzIHdoZXJlIG5vIGFzeW5jIG9yIHJlcXVlc3Qgb3BlcmF0aW9uIGlzIG5lZWRlZC5cbiAgICAvLyBUaGUgXCJvblN1Ym1pdFwiIGNhbGxiYWNrIGlzIGNhbGxlZCB3aXRoIHRoZSBtb2RlbCBlLmcuIHtmaWVsZE5hbWU6IFwibXlWYWx1ZVwifSxcbiAgICAvLyBpZiB3YW50aW5nIHRvIHJlc2V0IHRoZSBlbnRpcmUgZm9ybSB0byBvcmlnaW5hbCBzdGF0ZSwgdGhlIHNlY29uZCBwYXJhbSBpcyBhIGNhbGxiYWNrIGZvciB0aGlzLlxuICAgIGlmICghdGhpcy5wcm9wcy51cmwpIHtcbiAgICAgIHRoaXMudXBkYXRlTW9kZWwoKTtcbiAgICAgIHRoaXMucHJvcHMub25TdWJtaXQodGhpcy5tYXBNb2RlbCgpLCB0aGlzLnJlc2V0TW9kZWwsIHRoaXMudXBkYXRlSW5wdXRzV2l0aEVycm9yKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZU1vZGVsKCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpc1N1Ym1pdHRpbmc6IHRydWVcbiAgICB9KTtcblxuICAgIHRoaXMucHJvcHMub25TdWJtaXQodGhpcy5tYXBNb2RlbCgpLCB0aGlzLnJlc2V0TW9kZWwsIHRoaXMudXBkYXRlSW5wdXRzV2l0aEVycm9yKTtcblxuICAgIHZhciBoZWFkZXJzID0gKE9iamVjdC5rZXlzKHRoaXMucHJvcHMuaGVhZGVycykubGVuZ3RoICYmIHRoaXMucHJvcHMuaGVhZGVycykgfHwgb3B0aW9ucy5oZWFkZXJzIHx8IHt9O1xuXG4gICAgdmFyIG1ldGhvZCA9IHRoaXMucHJvcHMubWV0aG9kICYmIGFqYXhbdGhpcy5wcm9wcy5tZXRob2QudG9Mb3dlckNhc2UoKV0gPyB0aGlzLnByb3BzLm1ldGhvZC50b0xvd2VyQ2FzZSgpIDogJ3Bvc3QnO1xuICAgIGFqYXhbbWV0aG9kXSh0aGlzLnByb3BzLnVybCwgdGhpcy5tYXBNb2RlbCgpLCB0aGlzLnByb3BzLmNvbnRlbnRUeXBlIHx8IG9wdGlvbnMuY29udGVudFR5cGUgfHwgJ2pzb24nLCBoZWFkZXJzKVxuICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIHRoaXMucHJvcHMub25TdWNjZXNzKHJlc3BvbnNlKTtcbiAgICAgICAgdGhpcy5wcm9wcy5vblN1Ym1pdHRlZCgpO1xuICAgICAgfS5iaW5kKHRoaXMpKVxuICAgICAgLmNhdGNoKHRoaXMuZmFpbFN1Ym1pdCk7XG4gIH0sXG5cbiAgbWFwTW9kZWw6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5tYXBwaW5nID8gdGhpcy5wcm9wcy5tYXBwaW5nKHRoaXMubW9kZWwpIDogdGhpcy5tb2RlbDtcbiAgfSxcblxuICAvLyBHb2VzIHRocm91Z2ggYWxsIHJlZ2lzdGVyZWQgY29tcG9uZW50cyBhbmRcbiAgLy8gdXBkYXRlcyB0aGUgbW9kZWwgdmFsdWVzXG4gIHVwZGF0ZU1vZGVsOiBmdW5jdGlvbiAoKSB7XG4gICAgT2JqZWN0LmtleXModGhpcy5pbnB1dHMpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgIHZhciBjb21wb25lbnQgPSB0aGlzLmlucHV0c1tuYW1lXTtcbiAgICAgIHRoaXMubW9kZWxbbmFtZV0gPSBjb21wb25lbnQuc3RhdGUuX3ZhbHVlO1xuICAgIH0uYmluZCh0aGlzKSk7XG4gIH0sXG5cbiAgLy8gUmVzZXQgZWFjaCBrZXkgaW4gdGhlIG1vZGVsIHRvIHRoZSBvcmlnaW5hbCAvIGluaXRpYWwgdmFsdWVcbiAgcmVzZXRNb2RlbDogZnVuY3Rpb24gKCkge1xuICAgIE9iamVjdC5rZXlzKHRoaXMuaW5wdXRzKS5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICB0aGlzLmlucHV0c1tuYW1lXS5yZXNldFZhbHVlKCk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLnZhbGlkYXRlRm9ybSgpO1xuICB9LFxuXG4gIC8vIEdvIHRocm91Z2ggZXJyb3JzIGZyb20gc2VydmVyIGFuZCBncmFiIHRoZSBjb21wb25lbnRzXG4gIC8vIHN0b3JlZCBpbiB0aGUgaW5wdXRzIG1hcC4gQ2hhbmdlIHRoZWlyIHN0YXRlIHRvIGludmFsaWRcbiAgLy8gYW5kIHNldCB0aGUgc2VydmVyRXJyb3IgbWVzc2FnZVxuICB1cGRhdGVJbnB1dHNXaXRoRXJyb3I6IGZ1bmN0aW9uIChlcnJvcnMpIHtcbiAgICBPYmplY3Qua2V5cyhlcnJvcnMpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUsIGluZGV4KSB7XG4gICAgICB2YXIgY29tcG9uZW50ID0gdGhpcy5pbnB1dHNbbmFtZV07XG5cbiAgICAgIGlmICghY29tcG9uZW50KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignWW91IGFyZSB0cnlpbmcgdG8gdXBkYXRlIGFuIGlucHV0IHRoYXQgZG9lcyBub3QgZXhpc3RzLiBWZXJpZnkgZXJyb3JzIG9iamVjdCB3aXRoIGlucHV0IG5hbWVzLiAnICsgSlNPTi5zdHJpbmdpZnkoZXJyb3JzKSk7XG4gICAgICB9XG5cbiAgICAgIHZhciBhcmdzID0gW3tcbiAgICAgICAgX2lzVmFsaWQ6IGZhbHNlLFxuICAgICAgICBfc2VydmVyRXJyb3I6IGVycm9yc1tuYW1lXVxuICAgICAgfV07XG4gICAgICBjb21wb25lbnQuc2V0U3RhdGUuYXBwbHkoY29tcG9uZW50LCBhcmdzKTtcbiAgICB9LmJpbmQodGhpcykpO1xuICB9LFxuXG4gIGZhaWxTdWJtaXQ6IGZ1bmN0aW9uIChlcnJvcnMpIHtcbiAgICB0aGlzLnVwZGF0ZUlucHV0c1dpdGhFcnJvcihlcnJvcnMpO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaXNTdWJtaXR0aW5nOiBmYWxzZVxuICAgIH0pO1xuICAgIHRoaXMucHJvcHMub25FcnJvcihlcnJvcnMpO1xuICAgIHRoaXMucHJvcHMub25TdWJtaXR0ZWQoKTtcbiAgfSxcblxuICAvLyBUcmF2ZXJzZSB0aGUgY2hpbGRyZW4gYW5kIGNoaWxkcmVuIG9mIGNoaWxkcmVuIHRvIGZpbmRcbiAgLy8gYWxsIGlucHV0cyBieSBjaGVja2luZyB0aGUgbmFtZSBwcm9wLiBNYXliZSBkbyBhIGJldHRlclxuICAvLyBjaGVjayBoZXJlXG4gIHJlZ2lzdGVySW5wdXRzOiBmdW5jdGlvbiAoY2hpbGRyZW4pIHtcbiAgICBSZWFjdC5DaGlsZHJlbi5mb3JFYWNoKGNoaWxkcmVuLCBmdW5jdGlvbiAoY2hpbGQpIHtcblxuICAgICAgaWYgKGNoaWxkLnByb3BzICYmIGNoaWxkLnByb3BzLm5hbWUpIHtcbiAgICAgICAgY2hpbGQucHJvcHMuX2F0dGFjaFRvRm9ybSA9IHRoaXMuYXR0YWNoVG9Gb3JtO1xuICAgICAgICBjaGlsZC5wcm9wcy5fZGV0YWNoRnJvbUZvcm0gPSB0aGlzLmRldGFjaEZyb21Gb3JtO1xuICAgICAgICBjaGlsZC5wcm9wcy5fdmFsaWRhdGUgPSB0aGlzLnZhbGlkYXRlO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2hpbGQucHJvcHMgJiYgY2hpbGQucHJvcHMuY2hpbGRyZW4pIHtcbiAgICAgICAgdGhpcy5yZWdpc3RlcklucHV0cyhjaGlsZC5wcm9wcy5jaGlsZHJlbik7XG4gICAgICB9XG5cbiAgICB9LmJpbmQodGhpcykpO1xuICB9LFxuXG4gIGdldEN1cnJlbnRWYWx1ZXM6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5pbnB1dHMpLnJlZHVjZShmdW5jdGlvbiAoZGF0YSwgbmFtZSkge1xuICAgICAgdmFyIGNvbXBvbmVudCA9IHRoaXMuaW5wdXRzW25hbWVdO1xuICAgICAgZGF0YVtuYW1lXSA9IGNvbXBvbmVudC5zdGF0ZS5fdmFsdWU7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9LmJpbmQodGhpcyksIHt9KTtcbiAgfSxcblxuICBzZXRGb3JtUHJpc3RpbmU6IGZ1bmN0aW9uIChpc1ByaXN0aW5lKSB7XG4gICAgdmFyIGlucHV0cyA9IHRoaXMuaW5wdXRzO1xuICAgIHZhciBpbnB1dEtleXMgPSBPYmplY3Qua2V5cyhpbnB1dHMpO1xuXG4gICAgLy8gSXRlcmF0ZSB0aHJvdWdoIGVhY2ggY29tcG9uZW50IGFuZCBzZXQgaXQgYXMgcHJpc3RpbmVcbiAgICAvLyBvciBcImRpcnR5XCIuXG4gICAgaW5wdXRLZXlzLmZvckVhY2goZnVuY3Rpb24gKG5hbWUsIGluZGV4KSB7XG4gICAgICB2YXIgY29tcG9uZW50ID0gaW5wdXRzW25hbWVdO1xuICAgICAgY29tcG9uZW50LnNldFN0YXRlKHtcbiAgICAgICAgX2lzUHJpc3RpbmU6IGlzUHJpc3RpbmVcbiAgICAgIH0pO1xuICAgIH0uYmluZCh0aGlzKSk7XG4gIH0sXG5cbiAgLy8gVXNlIHRoZSBiaW5kZWQgdmFsdWVzIGFuZCB0aGUgYWN0dWFsIGlucHV0IHZhbHVlIHRvXG4gIC8vIHZhbGlkYXRlIHRoZSBpbnB1dCBhbmQgc2V0IGl0cyBzdGF0ZS4gVGhlbiBjaGVjayB0aGVcbiAgLy8gc3RhdGUgb2YgdGhlIGZvcm0gaXRzZWxmXG4gIHZhbGlkYXRlOiBmdW5jdGlvbiAoY29tcG9uZW50KSB7XG5cbiAgICAvLyBUcmlnZ2VyIG9uQ2hhbmdlXG4gICAgdGhpcy5zdGF0ZS5jYW5DaGFuZ2UgJiYgdGhpcy5wcm9wcy5vbkNoYW5nZSAmJiB0aGlzLnByb3BzLm9uQ2hhbmdlKHRoaXMuZ2V0Q3VycmVudFZhbHVlcygpKTtcblxuICAgIGlmICghY29tcG9uZW50LnByb3BzLnJlcXVpcmVkICYmICFjb21wb25lbnQuX3ZhbGlkYXRpb25zKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gUnVuIHRocm91Z2ggdGhlIHZhbGlkYXRpb25zLCBzcGxpdCB0aGVtIHVwIGFuZCBjYWxsXG4gICAgLy8gdGhlIHZhbGlkYXRvciBJRiB0aGVyZSBpcyBhIHZhbHVlIG9yIGl0IGlzIHJlcXVpcmVkXG4gICAgdmFyIGlzVmFsaWQgPSB0aGlzLnJ1blZhbGlkYXRpb24oY29tcG9uZW50KTtcblxuICAgIGNvbXBvbmVudC5zZXRTdGF0ZSh7XG4gICAgICBfaXNWYWxpZDogaXNWYWxpZCxcbiAgICAgIF9zZXJ2ZXJFcnJvcjogbnVsbFxuICAgIH0sIHRoaXMudmFsaWRhdGVGb3JtKTtcblxuICB9LFxuXG4gIHJ1blZhbGlkYXRpb246IGZ1bmN0aW9uIChjb21wb25lbnQpIHtcbiAgICB2YXIgaXNWYWxpZCA9IHRydWU7XG4gICAgaWYgKGNvbXBvbmVudC5fdmFsaWRhdGlvbnMubGVuZ3RoICYmIChjb21wb25lbnQucHJvcHMucmVxdWlyZWQgfHwgY29tcG9uZW50LnN0YXRlLl92YWx1ZSAhPT0gJycpKSB7XG4gICAgICBjb21wb25lbnQuX3ZhbGlkYXRpb25zLnNwbGl0KCcsJykuZm9yRWFjaChmdW5jdGlvbiAodmFsaWRhdGlvbikge1xuICAgICAgICB2YXIgYXJncyA9IHZhbGlkYXRpb24uc3BsaXQoJzonKTtcbiAgICAgICAgdmFyIHZhbGlkYXRlTWV0aG9kID0gYXJncy5zaGlmdCgpO1xuICAgICAgICBhcmdzID0gYXJncy5tYXAoZnVuY3Rpb24gKGFyZykge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShhcmcpO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHJldHVybiBhcmc7IC8vIEl0IGlzIGEgc3RyaW5nIGlmIGl0IGNhbiBub3QgcGFyc2UgaXRcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBhcmdzID0gW2NvbXBvbmVudC5zdGF0ZS5fdmFsdWVdLmNvbmNhdChhcmdzKTtcbiAgICAgICAgaWYgKCF2YWxpZGF0aW9uUnVsZXNbdmFsaWRhdGVNZXRob2RdKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdGb3Jtc3kgZG9lcyBub3QgaGF2ZSB0aGUgdmFsaWRhdGlvbiBydWxlOiAnICsgdmFsaWRhdGVNZXRob2QpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdmFsaWRhdGlvblJ1bGVzW3ZhbGlkYXRlTWV0aG9kXS5hcHBseSh0aGlzLmdldEN1cnJlbnRWYWx1ZXMoKSwgYXJncykpIHtcbiAgICAgICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgfVxuICAgIHJldHVybiBpc1ZhbGlkO1xuICB9LFxuXG4gIC8vIFZhbGlkYXRlIHRoZSBmb3JtIGJ5IGdvaW5nIHRocm91Z2ggYWxsIGNoaWxkIGlucHV0IGNvbXBvbmVudHNcbiAgLy8gYW5kIGNoZWNrIHRoZWlyIHN0YXRlXG4gIHZhbGlkYXRlRm9ybTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBhbGxJc1ZhbGlkID0gdHJ1ZTtcbiAgICB2YXIgaW5wdXRzID0gdGhpcy5pbnB1dHM7XG4gICAgdmFyIGlucHV0S2V5cyA9IE9iamVjdC5rZXlzKGlucHV0cyk7XG5cbiAgICAvLyBXZSBuZWVkIGEgY2FsbGJhY2sgYXMgd2UgYXJlIHZhbGlkYXRpbmcgYWxsIGlucHV0cyBhZ2Fpbi4gVGhpcyB3aWxsXG4gICAgLy8gcnVuIHdoZW4gdGhlIGxhc3QgY29tcG9uZW50IGhhcyBzZXQgaXRzIHN0YXRlXG4gICAgdmFyIG9uVmFsaWRhdGlvbkNvbXBsZXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgaW5wdXRLZXlzLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgaWYgKCFpbnB1dHNbbmFtZV0uc3RhdGUuX2lzVmFsaWQpIHtcbiAgICAgICAgICBhbGxJc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBpc1ZhbGlkOiBhbGxJc1ZhbGlkXG4gICAgICB9KTtcblxuICAgICAgYWxsSXNWYWxpZCAmJiB0aGlzLnByb3BzLm9uVmFsaWQoKTtcbiAgICAgICFhbGxJc1ZhbGlkICYmIHRoaXMucHJvcHMub25JbnZhbGlkKCk7XG5cbiAgICAgIC8vIFRlbGwgdGhlIGZvcm0gdGhhdCBpdCBjYW4gc3RhcnQgdG8gdHJpZ2dlciBjaGFuZ2UgZXZlbnRzXG4gICAgICB0aGlzLnNldFN0YXRlKHtjYW5DaGFuZ2U6IHRydWV9KTtcblxuICAgIH0uYmluZCh0aGlzKTtcblxuICAgIC8vIFJ1biB2YWxpZGF0aW9uIGFnYWluIGluIGNhc2UgYWZmZWN0ZWQgYnkgb3RoZXIgaW5wdXRzLiBUaGVcbiAgICAvLyBsYXN0IGNvbXBvbmVudCB2YWxpZGF0ZWQgd2lsbCBydW4gdGhlIG9uVmFsaWRhdGlvbkNvbXBsZXRlIGNhbGxiYWNrXG4gICAgaW5wdXRLZXlzLmZvckVhY2goZnVuY3Rpb24gKG5hbWUsIGluZGV4KSB7XG4gICAgICB2YXIgY29tcG9uZW50ID0gaW5wdXRzW25hbWVdO1xuICAgICAgdmFyIGlzVmFsaWQgPSB0aGlzLnJ1blZhbGlkYXRpb24oY29tcG9uZW50KTtcbiAgICAgIGNvbXBvbmVudC5zZXRTdGF0ZSh7XG4gICAgICAgIF9pc1ZhbGlkOiBpc1ZhbGlkLFxuICAgICAgICBfc2VydmVyRXJyb3I6IG51bGxcbiAgICAgIH0sIGluZGV4ID09PSBpbnB1dEtleXMubGVuZ3RoIC0gMSA/IG9uVmFsaWRhdGlvbkNvbXBsZXRlIDogbnVsbCk7XG4gICAgfS5iaW5kKHRoaXMpKTtcblxuICAgIC8vIElmIHRoZXJlIGFyZSBubyBpbnB1dHMsIGl0IGlzIHJlYWR5IHRvIHRyaWdnZXIgY2hhbmdlIGV2ZW50c1xuICAgIGlmICghaW5wdXRLZXlzLmxlbmd0aCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7Y2FuQ2hhbmdlOiB0cnVlfSk7XG4gICAgfVxuXG4gIH0sXG5cbiAgLy8gTWV0aG9kIHB1dCBvbiBlYWNoIGlucHV0IGNvbXBvbmVudCB0byByZWdpc3RlclxuICAvLyBpdHNlbGYgdG8gdGhlIGZvcm1cbiAgYXR0YWNoVG9Gb3JtOiBmdW5jdGlvbiAoY29tcG9uZW50KSB7XG4gICAgdGhpcy5pbnB1dHNbY29tcG9uZW50LnByb3BzLm5hbWVdID0gY29tcG9uZW50O1xuICAgIHRoaXMubW9kZWxbY29tcG9uZW50LnByb3BzLm5hbWVdID0gY29tcG9uZW50LnN0YXRlLl92YWx1ZTtcbiAgICB0aGlzLnZhbGlkYXRlKGNvbXBvbmVudCk7XG4gIH0sXG5cbiAgLy8gTWV0aG9kIHB1dCBvbiBlYWNoIGlucHV0IGNvbXBvbmVudCB0byB1bnJlZ2lzdGVyXG4gIC8vIGl0c2VsZiBmcm9tIHRoZSBmb3JtXG4gIGRldGFjaEZyb21Gb3JtOiBmdW5jdGlvbiAoY29tcG9uZW50KSB7XG4gICAgZGVsZXRlIHRoaXMuaW5wdXRzW2NvbXBvbmVudC5wcm9wcy5uYW1lXTtcbiAgICBkZWxldGUgdGhpcy5tb2RlbFtjb21wb25lbnQucHJvcHMubmFtZV07XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuXG4gICAgcmV0dXJuIFJlYWN0LkRPTS5mb3JtKHtcbiAgICAgICAgb25TdWJtaXQ6IHRoaXMuc3VibWl0LFxuICAgICAgICBjbGFzc05hbWU6IHRoaXMucHJvcHMuY2xhc3NOYW1lXG4gICAgICB9LFxuICAgICAgdGhpcy5wcm9wcy5jaGlsZHJlblxuICAgICk7XG5cbiAgfVxufSk7XG5cbmlmICghZ2xvYmFsLmV4cG9ydHMgJiYgIWdsb2JhbC5tb2R1bGUgJiYgKCFnbG9iYWwuZGVmaW5lIHx8ICFnbG9iYWwuZGVmaW5lLmFtZCkpIHtcbiAgZ2xvYmFsLkZvcm1zeSA9IEZvcm1zeTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBGb3Jtc3k7XG4iXX0=
