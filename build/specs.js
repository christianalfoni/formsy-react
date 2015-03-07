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
        this.setValue(event.target.value);
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

it('should allow an undefined value to be updated to a value', function (done) {
    var TestInput = React.createClass({displayName: "TestInput",
      mixins: [Formsy.Mixin],
      render: function () {
        return React.createElement("input", {value: this.getValue()})
      }
    });
    var TestForm = React.createClass({displayName: "TestForm",
      getInitialState: function () {
        return {value: undefined};
      },
      changeValue: function () {
        this.setState({
          value: 'foo'
        });
      },
      render: function () {
        return (
          React.createElement(Formsy.Form, {url: "/users"}, 
            React.createElement(TestInput, {name: "A", value: this.state.value})
          )
        );
      }
    });
    var form = TestUtils.renderIntoDocument(
      React.createElement(TestForm, null)
    );

    form.changeValue();
    var input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    setTimeout(function () {
      expect(input.getDOMNode().value).toBe('foo');
      done();
    }, 0);
  });  

it('should be able to dynamically change validations', function (done) {

    var isInvalid = false;
    var TestInput = React.createClass({displayName: "TestInput",
      mixins: [Formsy.Mixin],
      render: function () {
        return React.createElement("input", {value: this.getValue()})
      }
    });
    var TestForm = React.createClass({displayName: "TestForm",
      getInitialState: function () {
        return {value: 'foo@bar.com', validations: 'isEmail'};
      },
      changeValidations: function () {
        this.setState({
          validations: 'equals:foo'
        });
      },
      setInvalid: function () {
        console.log('Running it!');
        isInvalid = true;
      },
      render: function () {
        return (
          React.createElement(Formsy.Form, {url: "/users", onInvalid: this.setInvalid}, 
            React.createElement(TestInput, {name: "A", validations: this.state.validations, value: this.state.value})
          )
        );
      }
    });
    var form = TestUtils.renderIntoDocument(
      React.createElement(TestForm, null)
    );

    form.changeValidations();
    setTimeout(function () {
      expect(isInvalid).toBe(true);
      done();
    }, 0);
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

    it('should allow for null/undefined children', function (done) {
      var TestInput = React.createClass({displayName: "TestInput",
        mixins: [Formsy.Mixin],
        changeValue: function (event) {
          this.setValue(event.target.value);
        },
        render: function () {
          return React.createElement("input", {value: this.getValue(), onChange: this.changeValue})
        }
      });

      var model = null;
      var TestForm = React.createClass({displayName: "TestForm",
        onSubmit: function (formModel) {
          model = formModel;
        },
        render: function () {
          return (
            React.createElement(Formsy.Form, {onSubmit:  this.onSubmit}, 
              React.createElement("h1", null, "Test"), 
              null, 
              undefined, 
              React.createElement(TestInput, {name: "name", value: 'foo' })
            )
          );
        }
      });

      var form = TestUtils.renderIntoDocument(React.createElement(TestForm, null));
      setTimeout(function () {
        TestUtils.Simulate.submit(form.getDOMNode());
        expect(model).toEqual({name: 'foo'});
        done();
      }, 10);
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

    it('should allow a dynamically updated input to update the form-model', function (done) {

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

      var input;
      var TestForm = React.createClass({displayName: "TestForm",
        componentWillMount: function () {
          forceUpdate = this.forceUpdate.bind(this);
        },
        onSubmit: function (formModel) {
          model = formModel;
        },
        render: function () {
          input = React.createElement(TestInput, {name: "test", value:  this.props.value});

          return (
            React.createElement(Formsy.Form, {onSubmit: this.onSubmit}, 
              input
            ));
        }
      });
      var form = TestUtils.renderIntoDocument(React.createElement(TestForm, {value: "foo"}));

      // Wait before changing the input
      setTimeout(function () {
        form.setProps({value: 'bar'});

        forceUpdate(function () {
          // Wait for next event loop, as that does the form
          setTimeout(function () {
            TestUtils.Simulate.submit(form.getDOMNode());
            expect(model.test).toBe('bar');
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

    });

  });

  describe('Update a form', function () {

    it('should allow elements to check if the form is disabled', function (done) {

      var TestInput = React.createClass({displayName: "TestInput",
        mixins: [Formsy.Mixin],
        render: function () {
          return React.createElement("input", {value: this.getValue()})
        }
      });
      var TestForm = React.createClass({displayName: "TestForm",
        getInitialState: function () {
          return {disabled: true};
        },
        enableForm: function () {
          this.setState({
            disabled: false
          });
        },
        render: function () {
          return ( 
            React.createElement(Formsy.Form, {onChange: this.onChange, disabled: this.state.disabled}, 
              React.createElement(TestInput, {name: "foo"})
            ));
        }
      });
      var form = TestUtils.renderIntoDocument( 
        React.createElement(TestForm, null) 
      );

      var input = TestUtils.findRenderedComponentWithType(form, TestInput);
      expect(input.isFormDisabled()).toBe(true);
      form.enableForm();
      setTimeout(function () {
        expect(input.isFormDisabled()).toBe(false);
        done();
      }, 0);

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

  it('RULE: isNumeric (string representation of a float)', function () {

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
    TestUtils.Simulate.change(input, {target: {value: '1.5'}});
    expect(isValid).toHaveBeenCalled();

  });

  it('RULE: isNumeric is false (string representation of an invalid float)', function () {

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
    TestUtils.Simulate.change(input, {target: {value: '1.'}});
    expect(isValid).not.toHaveBeenCalled();

  });

});

},{"./../src/main.js":"/Users/christianalfoni/Documents/dev/formsy-react/src/main.js"}],"/Users/christianalfoni/Documents/dev/formsy-react/src/Mixin.js":[function(require,module,exports){
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

},{}],"/Users/christianalfoni/Documents/dev/formsy-react/src/main.js":[function(require,module,exports){
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

},{"./Mixin.js":"/Users/christianalfoni/Documents/dev/formsy-react/src/Mixin.js","./utils.js":"/Users/christianalfoni/Documents/dev/formsy-react/src/utils.js","./validationRules.js":"/Users/christianalfoni/Documents/dev/formsy-react/src/validationRules.js","react":"react"}],"/Users/christianalfoni/Documents/dev/formsy-react/src/utils.js":[function(require,module,exports){
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

},{}]},{},["./specs/Element-spec.js","./specs/Formsy-spec.js","./specs/Submit-spec.js","./specs/Validation-spec.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcGVjcy9FbGVtZW50LXNwZWMuanMiLCJzcGVjcy9Gb3Jtc3ktc3BlYy5qcyIsInNwZWNzL1N1Ym1pdC1zcGVjLmpzIiwic3BlY3MvVmFsaWRhdGlvbi1zcGVjLmpzIiwic3JjL01peGluLmpzIiwic3JjL21haW4uanMiLCJzcmMvdXRpbHMuanMiLCJzcmMvdmFsaWRhdGlvblJ1bGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUMvSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDbFZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgRm9ybXN5ID0gcmVxdWlyZSgnLi8uLi9zcmMvbWFpbi5qcycpO1xuXG5kZXNjcmliZSgnRWxlbWVudCcsIGZ1bmN0aW9uKCkge1xuXG4gIGl0KCdzaG91bGQgcmV0dXJuIHBhc3NlZCBhbmQgc2V0VmFsdWUoKSB2YWx1ZSB3aGVuIHVzaW5nIGdldFZhbHVlKCknLCBmdW5jdGlvbiAoKSB7XG4gICAgXG4gICAgdmFyIFRlc3RJbnB1dCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJUZXN0SW5wdXRcIixcbiAgICAgIG1peGluczogW0Zvcm1zeS5NaXhpbl0sXG4gICAgICB1cGRhdGVWYWx1ZTogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuc2V0VmFsdWUoZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICAgIH0sXG4gICAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7dmFsdWU6IHRoaXMuZ2V0VmFsdWUoKSwgb25DaGFuZ2U6IHRoaXMudXBkYXRlVmFsdWV9KVxuICAgICAgfVxuICAgIH0pO1xuICAgIHZhciBmb3JtID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybXN5LkZvcm0sIG51bGwsIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRlc3RJbnB1dCwge25hbWU6IFwiZm9vXCIsIHZhbHVlOiBcImZvb1wifSlcbiAgICAgIClcbiAgICApO1xuXG4gICAgdmFyIGlucHV0ID0gVGVzdFV0aWxzLmZpbmRSZW5kZXJlZERPTUNvbXBvbmVudFdpdGhUYWcoZm9ybSwgJ0lOUFVUJyk7XG4gICAgZXhwZWN0KGlucHV0LmdldERPTU5vZGUoKS52YWx1ZSkudG9CZSgnZm9vJyk7XG4gICAgVGVzdFV0aWxzLlNpbXVsYXRlLmNoYW5nZShpbnB1dCwge3RhcmdldDoge3ZhbHVlOiAnZm9vYmFyJ319KTtcbiAgICBleHBlY3QoaW5wdXQuZ2V0RE9NTm9kZSgpLnZhbHVlKS50b0JlKCdmb29iYXInKTtcblxuICB9KTtcblxuICBpdCgnc2hvdWxkIHJldHVybiB0cnVlIG9yIGZhbHNlIHdoZW4gY2FsbGluZyBoYXNWYWx1ZSgpIGRlcGVuZGluZyBvbiB2YWx1ZSBleGlzdGFuY2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgXG4gICAgdmFyIHJlc2V0ID0gbnVsbDtcbiAgICB2YXIgVGVzdElucHV0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlRlc3RJbnB1dFwiLFxuICAgICAgbWl4aW5zOiBbRm9ybXN5Lk1peGluXSxcbiAgICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJlc2V0ID0gdGhpcy5yZXNldFZhbHVlO1xuICAgICAgfSxcbiAgICAgIHVwZGF0ZVZhbHVlOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5zZXRWYWx1ZShldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgfSxcbiAgICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHt2YWx1ZTogdGhpcy5nZXRWYWx1ZSgpLCBvbkNoYW5nZTogdGhpcy51cGRhdGVWYWx1ZX0pXG4gICAgICB9XG4gICAgfSk7XG4gICAgdmFyIGZvcm0gPSBUZXN0VXRpbHMucmVuZGVySW50b0RvY3VtZW50KFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3Jtc3kuRm9ybSwgbnVsbCwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGVzdElucHV0LCB7bmFtZTogXCJmb29cIiwgdmFsdWU6IFwiZm9vXCJ9KVxuICAgICAgKVxuICAgICk7XG5cbiAgICB2YXIgaW5wdXQgPSBUZXN0VXRpbHMuZmluZFJlbmRlcmVkRE9NQ29tcG9uZW50V2l0aFRhZyhmb3JtLCAnSU5QVVQnKTtcbiAgICByZXNldCgpO1xuICAgIGV4cGVjdChpbnB1dC5nZXRET01Ob2RlKCkudmFsdWUpLnRvQmUoJycpO1xuXG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgcmV0dXJuIGVycm9yIG1lc3NhZ2UgcGFzc2VkIHdoZW4gY2FsbGluZyBnZXRFcnJvck1lc3NhZ2UoKScsIGZ1bmN0aW9uICgpIHtcbiAgICBcbiAgICB2YXIgZ2V0RXJyb3JNZXNzYWdlID0gbnVsbDtcbiAgICB2YXIgVGVzdElucHV0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlRlc3RJbnB1dFwiLFxuICAgICAgbWl4aW5zOiBbRm9ybXN5Lk1peGluXSxcbiAgICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGdldEVycm9yTWVzc2FnZSA9IHRoaXMuZ2V0RXJyb3JNZXNzYWdlO1xuICAgICAgfSxcbiAgICAgIHVwZGF0ZVZhbHVlOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5zZXRWYWx1ZShldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgfSxcbiAgICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHt2YWx1ZTogdGhpcy5nZXRWYWx1ZSgpLCBvbkNoYW5nZTogdGhpcy51cGRhdGVWYWx1ZX0pXG4gICAgICB9XG4gICAgfSk7XG4gICAgdmFyIGZvcm0gPSBUZXN0VXRpbHMucmVuZGVySW50b0RvY3VtZW50KFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3Jtc3kuRm9ybSwgbnVsbCwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGVzdElucHV0LCB7bmFtZTogXCJmb29cIiwgdmFsdWU6IFwiZm9vXCIsIHZhbGlkYXRpb25zOiBcImlzRW1haWxcIiwgdmFsaWRhdGlvbkVycm9yOiBcIkhhcyB0byBiZSBlbWFpbFwifSlcbiAgICAgIClcbiAgICApO1xuXG4gICAgZXhwZWN0KGdldEVycm9yTWVzc2FnZSgpKS50b0JlKCdIYXMgdG8gYmUgZW1haWwnKTtcblxuICB9KTtcblxuICBpdCgnc2hvdWxkIHJldHVybiBzZXJ2ZXIgZXJyb3IgbWVzc2FnZSB3aGVuIGNhbGxpbmcgZ2V0RXJyb3JNZXNzYWdlKCknLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIFxuICAgIGphc21pbmUuQWpheC5pbnN0YWxsKCk7XG5cbiAgICB2YXIgZ2V0RXJyb3JNZXNzYWdlID0gbnVsbDtcbiAgICB2YXIgVGVzdElucHV0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlRlc3RJbnB1dFwiLFxuICAgICAgbWl4aW5zOiBbRm9ybXN5Lk1peGluXSxcbiAgICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGdldEVycm9yTWVzc2FnZSA9IHRoaXMuZ2V0RXJyb3JNZXNzYWdlO1xuICAgICAgfSxcbiAgICAgIHVwZGF0ZVZhbHVlOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5zZXRWYWx1ZShldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgfSxcbiAgICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHt2YWx1ZTogdGhpcy5nZXRWYWx1ZSgpLCBvbkNoYW5nZTogdGhpcy51cGRhdGVWYWx1ZX0pXG4gICAgICB9XG4gICAgfSk7XG4gICAgdmFyIGZvcm0gPSBUZXN0VXRpbHMucmVuZGVySW50b0RvY3VtZW50KFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3Jtc3kuRm9ybSwge3VybDogXCIvdXNlcnNcIn0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRlc3RJbnB1dCwge25hbWU6IFwiZm9vXCIsIHZhbHVlOiBcImZvb1wiLCB2YWxpZGF0aW9uczogXCJpc0VtYWlsXCIsIHZhbGlkYXRpb25FcnJvcjogXCJIYXMgdG8gYmUgZW1haWxcIn0pXG4gICAgICApXG4gICAgKTtcblxuICAgIHZhciBmb3JtID0gVGVzdFV0aWxzLlNpbXVsYXRlLnN1Ym1pdChmb3JtLmdldERPTU5vZGUoKSk7XG5cbiAgICBqYXNtaW5lLkFqYXgucmVxdWVzdHMubW9zdFJlY2VudCgpLnJlc3BvbmRXaXRoKHtcbiAgICAgIHN0YXR1czogNTAwLFxuICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgIHJlc3BvbnNlVGV4dDogJ3tcImZvb1wiOiBcImJhclwifSdcbiAgICB9KVxuXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBleHBlY3QoZ2V0RXJyb3JNZXNzYWdlKCkpLnRvQmUoJ2JhcicpO1xuICAgICAgamFzbWluZS5BamF4LnVuaW5zdGFsbCgpO1xuICAgICAgZG9uZSgpO1xuICAgIH0sIDApO1xuXG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgcmV0dXJuIHRydWUgb3IgZmFsc2Ugd2hlbiBjYWxsaW5nIGlzVmFsaWQoKSBkZXBlbmRpbmcgb24gdmFsaWQgc3RhdGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgXG4gICAgdmFyIGlzVmFsaWQgPSBudWxsO1xuICAgIHZhciBUZXN0SW5wdXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiVGVzdElucHV0XCIsXG4gICAgICBtaXhpbnM6IFtGb3Jtc3kuTWl4aW5dLFxuICAgICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaXNWYWxpZCA9IHRoaXMuaXNWYWxpZDtcbiAgICAgIH0sXG4gICAgICB1cGRhdGVWYWx1ZTogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuc2V0VmFsdWUoZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICAgIH0sXG4gICAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7dmFsdWU6IHRoaXMuZ2V0VmFsdWUoKSwgb25DaGFuZ2U6IHRoaXMudXBkYXRlVmFsdWV9KVxuICAgICAgfVxuICAgIH0pO1xuICAgIHZhciBmb3JtID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybXN5LkZvcm0sIHt1cmw6IFwiL3VzZXJzXCJ9LCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUZXN0SW5wdXQsIHtuYW1lOiBcImZvb1wiLCB2YWx1ZTogXCJmb29cIiwgdmFsaWRhdGlvbnM6IFwiaXNFbWFpbFwifSlcbiAgICAgIClcbiAgICApO1xuXG4gICAgZXhwZWN0KGlzVmFsaWQoKSkudG9CZShmYWxzZSk7XG4gICAgdmFyIGlucHV0ID0gVGVzdFV0aWxzLmZpbmRSZW5kZXJlZERPTUNvbXBvbmVudFdpdGhUYWcoZm9ybSwgJ0lOUFVUJyk7XG4gICAgVGVzdFV0aWxzLlNpbXVsYXRlLmNoYW5nZShpbnB1dCwge3RhcmdldDoge3ZhbHVlOiAnZm9vQGZvby5jb20nfX0pO1xuICAgIGV4cGVjdChpc1ZhbGlkKCkpLnRvQmUodHJ1ZSk7XG5cbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCByZXR1cm4gdHJ1ZSBvciBmYWxzZSB3aGVuIGNhbGxpbmcgaXNSZXF1aXJlZCgpIGRlcGVuZGluZyBvbiBwYXNzZWQgcmVxdWlyZWQgYXR0cmlidXRlJywgZnVuY3Rpb24gKCkge1xuICAgIFxuICAgIHZhciBpc1JlcXVpcmVkcyA9IFtdO1xuICAgIHZhciBUZXN0SW5wdXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiVGVzdElucHV0XCIsXG4gICAgICBtaXhpbnM6IFtGb3Jtc3kuTWl4aW5dLFxuICAgICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaXNSZXF1aXJlZHMucHVzaCh0aGlzLmlzUmVxdWlyZWQpO1xuICAgICAgfSxcbiAgICAgIHVwZGF0ZVZhbHVlOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5zZXRWYWx1ZShldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgfSxcbiAgICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHt2YWx1ZTogdGhpcy5nZXRWYWx1ZSgpLCBvbkNoYW5nZTogdGhpcy51cGRhdGVWYWx1ZX0pXG4gICAgICB9XG4gICAgfSk7XG4gICAgdmFyIGZvcm0gPSBUZXN0VXRpbHMucmVuZGVySW50b0RvY3VtZW50KFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3Jtc3kuRm9ybSwge3VybDogXCIvdXNlcnNcIn0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRlc3RJbnB1dCwge25hbWU6IFwiZm9vXCIsIHZhbHVlOiBcImZvb1wifSksIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRlc3RJbnB1dCwge25hbWU6IFwiZm9vXCIsIHZhbHVlOiBcImZvb1wiLCByZXF1aXJlZDogdHJ1ZX0pXG4gICAgICApXG4gICAgKTtcblxuICAgIGV4cGVjdChpc1JlcXVpcmVkc1swXSgpKS50b0JlKGZhbHNlKTtcbiAgICBleHBlY3QoaXNSZXF1aXJlZHNbMV0oKSkudG9CZSh0cnVlKTtcblxuICB9KTtcblxuICBpdCgnc2hvdWxkIHJldHVybiB0cnVlIG9yIGZhbHNlIHdoZW4gY2FsbGluZyBzaG93UmVxdWlyZWQoKSBkZXBlbmRpbmcgb24gaW5wdXQgYmVpbmcgZW1wdHkgYW5kIHJlcXVpcmVkIGlzIHBhc3NlZCwgb3Igbm90JywgZnVuY3Rpb24gKCkge1xuICAgIFxuICAgIHZhciBzaG93UmVxdWlyZWRzID0gW107XG4gICAgdmFyIFRlc3RJbnB1dCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJUZXN0SW5wdXRcIixcbiAgICAgIG1peGluczogW0Zvcm1zeS5NaXhpbl0sXG4gICAgICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gKCkge1xuICAgICAgICBzaG93UmVxdWlyZWRzLnB1c2godGhpcy5zaG93UmVxdWlyZWQpO1xuICAgICAgfSxcbiAgICAgIHVwZGF0ZVZhbHVlOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5zZXRWYWx1ZShldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgfSxcbiAgICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHt2YWx1ZTogdGhpcy5nZXRWYWx1ZSgpLCBvbkNoYW5nZTogdGhpcy51cGRhdGVWYWx1ZX0pXG4gICAgICB9XG4gICAgfSk7XG4gICAgdmFyIGZvcm0gPSBUZXN0VXRpbHMucmVuZGVySW50b0RvY3VtZW50KFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3Jtc3kuRm9ybSwge3VybDogXCIvdXNlcnNcIn0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRlc3RJbnB1dCwge25hbWU6IFwiQVwiLCB2YWx1ZTogXCJmb29cIn0pLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUZXN0SW5wdXQsIHtuYW1lOiBcIkJcIiwgdmFsdWU6IFwiXCIsIHJlcXVpcmVkOiB0cnVlfSksIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRlc3RJbnB1dCwge25hbWU6IFwiQ1wiLCB2YWx1ZTogXCJcIn0pXG4gICAgICApXG4gICAgKTtcblxuICAgIGV4cGVjdChzaG93UmVxdWlyZWRzWzBdKCkpLnRvQmUoZmFsc2UpO1xuICAgIGV4cGVjdChzaG93UmVxdWlyZWRzWzFdKCkpLnRvQmUodHJ1ZSk7XG4gICAgZXhwZWN0KHNob3dSZXF1aXJlZHNbMl0oKSkudG9CZShmYWxzZSk7XG5cbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCByZXR1cm4gdHJ1ZSBvciBmYWxzZSB3aGVuIGNhbGxpbmcgc2hvd0Vycm9yKCkgZGVwZW5kaW5nIG9uIHZhbHVlIGlzIGludmFsaWQgb3IgYSBzZXJ2ZXIgZXJyb3IgaGFzIGFycml2ZWQsIG9yIG5vdCcsIGZ1bmN0aW9uIChkb25lKSB7XG5cbiAgICB2YXIgc2hvd0Vycm9yID0gbnVsbDtcbiAgICB2YXIgVGVzdElucHV0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlRlc3RJbnB1dFwiLFxuICAgICAgbWl4aW5zOiBbRm9ybXN5Lk1peGluXSxcbiAgICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNob3dFcnJvciA9IHRoaXMuc2hvd0Vycm9yO1xuICAgICAgfSxcbiAgICAgIHVwZGF0ZVZhbHVlOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5zZXRWYWx1ZShldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgfSxcbiAgICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHt2YWx1ZTogdGhpcy5nZXRWYWx1ZSgpLCBvbkNoYW5nZTogdGhpcy51cGRhdGVWYWx1ZX0pXG4gICAgICB9XG4gICAgfSk7XG4gICAgdmFyIGZvcm0gPSBUZXN0VXRpbHMucmVuZGVySW50b0RvY3VtZW50KFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3Jtc3kuRm9ybSwge3VybDogXCIvdXNlcnNcIn0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRlc3RJbnB1dCwge25hbWU6IFwiZm9vXCIsIHZhbHVlOiBcImZvb1wiLCB2YWxpZGF0aW9uczogXCJpc0VtYWlsXCIsIHZhbGlkYXRpb25FcnJvcjogXCJUaGlzIGlzIG5vdCBhbiBlbWFpbFwifSlcbiAgICAgIClcbiAgICApO1xuXG4gICAgZXhwZWN0KHNob3dFcnJvcigpKS50b0JlKHRydWUpO1xuXG4gICAgdmFyIGlucHV0ID0gVGVzdFV0aWxzLmZpbmRSZW5kZXJlZERPTUNvbXBvbmVudFdpdGhUYWcoZm9ybSwgJ0lOUFVUJyk7XG4gICAgVGVzdFV0aWxzLlNpbXVsYXRlLmNoYW5nZShpbnB1dCwge3RhcmdldDoge3ZhbHVlOiAnZm9vQGZvby5jb20nfX0pO1xuICAgIGV4cGVjdChzaG93RXJyb3IoKSkudG9CZShmYWxzZSk7XG5cbiAgICBqYXNtaW5lLkFqYXguaW5zdGFsbCgpO1xuICAgIFRlc3RVdGlscy5TaW11bGF0ZS5zdWJtaXQoZm9ybS5nZXRET01Ob2RlKCkpOyAgICBcbiAgICBqYXNtaW5lLkFqYXgucmVxdWVzdHMubW9zdFJlY2VudCgpLnJlc3BvbmRXaXRoKHtcbiAgICAgIHN0YXR1czogNTAwLFxuICAgICAgcmVzcG9uc2VUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICByZXNwb25zZVRleHQ6ICd7XCJmb29cIjogXCJFbWFpbCBhbHJlYWR5IGV4aXN0c1wifSdcbiAgICB9KTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGV4cGVjdChzaG93RXJyb3IoKSkudG9CZSh0cnVlKTtcbiAgICAgIGphc21pbmUuQWpheC51bmluc3RhbGwoKTtcbiAgICAgIGRvbmUoKTtcbiAgICB9LCAwKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCByZXR1cm4gdHJ1ZSBvciBmYWxzZSB3aGVuIGNhbGxpbmcgaXNQcmVzdGluZSgpIGRlcGVuZGluZyBvbiBpbnB1dCBoYXMgYmVlbiBcInRvdWNoZWRcIiBvciBub3QnLCBmdW5jdGlvbiAoKSB7XG4gICAgXG4gICAgdmFyIGlzUHJpc3RpbmUgPSBudWxsO1xuICAgIHZhciBUZXN0SW5wdXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiVGVzdElucHV0XCIsXG4gICAgICBtaXhpbnM6IFtGb3Jtc3kuTWl4aW5dLFxuICAgICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaXNQcmlzdGluZSA9IHRoaXMuaXNQcmlzdGluZTtcbiAgICAgIH0sXG4gICAgICB1cGRhdGVWYWx1ZTogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuc2V0VmFsdWUoZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICAgIH0sXG4gICAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7dmFsdWU6IHRoaXMuZ2V0VmFsdWUoKSwgb25DaGFuZ2U6IHRoaXMudXBkYXRlVmFsdWV9KVxuICAgICAgfVxuICAgIH0pO1xuICAgIHZhciBmb3JtID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybXN5LkZvcm0sIHt1cmw6IFwiL3VzZXJzXCJ9LCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUZXN0SW5wdXQsIHtuYW1lOiBcIkFcIiwgdmFsdWU6IFwiZm9vXCJ9KVxuICAgICAgKVxuICAgICk7XG5cbiAgICBleHBlY3QoaXNQcmlzdGluZSgpKS50b0JlKHRydWUpO1xuICAgIHZhciBpbnB1dCA9IFRlc3RVdGlscy5maW5kUmVuZGVyZWRET01Db21wb25lbnRXaXRoVGFnKGZvcm0sICdJTlBVVCcpO1xuICAgIFRlc3RVdGlscy5TaW11bGF0ZS5jaGFuZ2UoaW5wdXQsIHt0YXJnZXQ6IHt2YWx1ZTogJ2Zvbyd9fSk7XG4gICAgZXhwZWN0KGlzUHJpc3RpbmUoKSkudG9CZShmYWxzZSk7XG4gICAgXG4gIH0pO1xuXG5pdCgnc2hvdWxkIGFsbG93IGFuIHVuZGVmaW5lZCB2YWx1ZSB0byBiZSB1cGRhdGVkIHRvIGEgdmFsdWUnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciBUZXN0SW5wdXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiVGVzdElucHV0XCIsXG4gICAgICBtaXhpbnM6IFtGb3Jtc3kuTWl4aW5dLFxuICAgICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge3ZhbHVlOiB0aGlzLmdldFZhbHVlKCl9KVxuICAgICAgfVxuICAgIH0pO1xuICAgIHZhciBUZXN0Rm9ybSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJUZXN0Rm9ybVwiLFxuICAgICAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB7dmFsdWU6IHVuZGVmaW5lZH07XG4gICAgICB9LFxuICAgICAgY2hhbmdlVmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgdmFsdWU6ICdmb28nXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybXN5LkZvcm0sIHt1cmw6IFwiL3VzZXJzXCJ9LCBcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGVzdElucHV0LCB7bmFtZTogXCJBXCIsIHZhbHVlOiB0aGlzLnN0YXRlLnZhbHVlfSlcbiAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdmFyIGZvcm0gPSBUZXN0VXRpbHMucmVuZGVySW50b0RvY3VtZW50KFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUZXN0Rm9ybSwgbnVsbClcbiAgICApO1xuXG4gICAgZm9ybS5jaGFuZ2VWYWx1ZSgpO1xuICAgIHZhciBpbnB1dCA9IFRlc3RVdGlscy5maW5kUmVuZGVyZWRET01Db21wb25lbnRXaXRoVGFnKGZvcm0sICdJTlBVVCcpO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgZXhwZWN0KGlucHV0LmdldERPTU5vZGUoKS52YWx1ZSkudG9CZSgnZm9vJyk7XG4gICAgICBkb25lKCk7XG4gICAgfSwgMCk7XG4gIH0pOyAgXG5cbml0KCdzaG91bGQgYmUgYWJsZSB0byBkeW5hbWljYWxseSBjaGFuZ2UgdmFsaWRhdGlvbnMnLCBmdW5jdGlvbiAoZG9uZSkge1xuXG4gICAgdmFyIGlzSW52YWxpZCA9IGZhbHNlO1xuICAgIHZhciBUZXN0SW5wdXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiVGVzdElucHV0XCIsXG4gICAgICBtaXhpbnM6IFtGb3Jtc3kuTWl4aW5dLFxuICAgICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge3ZhbHVlOiB0aGlzLmdldFZhbHVlKCl9KVxuICAgICAgfVxuICAgIH0pO1xuICAgIHZhciBUZXN0Rm9ybSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJUZXN0Rm9ybVwiLFxuICAgICAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB7dmFsdWU6ICdmb29AYmFyLmNvbScsIHZhbGlkYXRpb25zOiAnaXNFbWFpbCd9O1xuICAgICAgfSxcbiAgICAgIGNoYW5nZVZhbGlkYXRpb25zOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIHZhbGlkYXRpb25zOiAnZXF1YWxzOmZvbydcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgc2V0SW52YWxpZDogZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnUnVubmluZyBpdCEnKTtcbiAgICAgICAgaXNJbnZhbGlkID0gdHJ1ZTtcbiAgICAgIH0sXG4gICAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1zeS5Gb3JtLCB7dXJsOiBcIi91c2Vyc1wiLCBvbkludmFsaWQ6IHRoaXMuc2V0SW52YWxpZH0sIFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUZXN0SW5wdXQsIHtuYW1lOiBcIkFcIiwgdmFsaWRhdGlvbnM6IHRoaXMuc3RhdGUudmFsaWRhdGlvbnMsIHZhbHVlOiB0aGlzLnN0YXRlLnZhbHVlfSlcbiAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdmFyIGZvcm0gPSBUZXN0VXRpbHMucmVuZGVySW50b0RvY3VtZW50KFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUZXN0Rm9ybSwgbnVsbClcbiAgICApO1xuXG4gICAgZm9ybS5jaGFuZ2VWYWxpZGF0aW9ucygpO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgZXhwZWN0KGlzSW52YWxpZCkudG9CZSh0cnVlKTtcbiAgICAgIGRvbmUoKTtcbiAgICB9LCAwKTtcbiAgfSk7ICBcblxufSk7XG4iLCJ2YXIgRm9ybXN5ID0gcmVxdWlyZSgnLi8uLi9zcmMvbWFpbi5qcycpO1xuXG5kZXNjcmliZSgnRm9ybXN5JywgZnVuY3Rpb24gKCkge1xuXG4gIGRlc2NyaWJlKCdTZXR0aW5nIHVwIGEgZm9ybScsIGZ1bmN0aW9uICgpIHtcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGEgZm9ybSBpbnRvIHRoZSBkb2N1bWVudCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBmb3JtID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudCggUmVhY3QuY3JlYXRlRWxlbWVudChGb3Jtc3kuRm9ybSwgbnVsbCkpO1xuICAgICAgZXhwZWN0KGZvcm0uZ2V0RE9NTm9kZSgpLnRhZ05hbWUpLnRvRXF1YWwoJ0ZPUk0nKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgc2V0IGEgY2xhc3MgbmFtZSBpZiBwYXNzZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgZm9ybSA9IFRlc3RVdGlscy5yZW5kZXJJbnRvRG9jdW1lbnQoIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybXN5LkZvcm0sIHtjbGFzc05hbWU6IFwiZm9vXCJ9KSk7XG4gICAgICBleHBlY3QoZm9ybS5nZXRET01Ob2RlKCkuY2xhc3NOYW1lKS50b0VxdWFsKCdmb28nKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYWxsb3cgZm9yIG51bGwvdW5kZWZpbmVkIGNoaWxkcmVuJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgIHZhciBUZXN0SW5wdXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiVGVzdElucHV0XCIsXG4gICAgICAgIG1peGluczogW0Zvcm1zeS5NaXhpbl0sXG4gICAgICAgIGNoYW5nZVZhbHVlOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICB0aGlzLnNldFZhbHVlKGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge3ZhbHVlOiB0aGlzLmdldFZhbHVlKCksIG9uQ2hhbmdlOiB0aGlzLmNoYW5nZVZhbHVlfSlcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHZhciBtb2RlbCA9IG51bGw7XG4gICAgICB2YXIgVGVzdEZvcm0gPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiVGVzdEZvcm1cIixcbiAgICAgICAgb25TdWJtaXQ6IGZ1bmN0aW9uIChmb3JtTW9kZWwpIHtcbiAgICAgICAgICBtb2RlbCA9IGZvcm1Nb2RlbDtcbiAgICAgICAgfSxcbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybXN5LkZvcm0sIHtvblN1Ym1pdDogIHRoaXMub25TdWJtaXR9LCBcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImgxXCIsIG51bGwsIFwiVGVzdFwiKSwgXG4gICAgICAgICAgICAgIG51bGwsIFxuICAgICAgICAgICAgICB1bmRlZmluZWQsIFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRlc3RJbnB1dCwge25hbWU6IFwibmFtZVwiLCB2YWx1ZTogJ2ZvbycgfSlcbiAgICAgICAgICAgIClcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdmFyIGZvcm0gPSBUZXN0VXRpbHMucmVuZGVySW50b0RvY3VtZW50KFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGVzdEZvcm0sIG51bGwpKTtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBUZXN0VXRpbHMuU2ltdWxhdGUuc3VibWl0KGZvcm0uZ2V0RE9NTm9kZSgpKTtcbiAgICAgICAgZXhwZWN0KG1vZGVsKS50b0VxdWFsKHtuYW1lOiAnZm9vJ30pO1xuICAgICAgICBkb25lKCk7XG4gICAgICB9LCAxMCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGFsbG93IGZvciBpbnB1dHMgYmVpbmcgYWRkZWQgZHluYW1pY2FsbHknLCBmdW5jdGlvbiAoZG9uZSkge1xuXG4gICAgICB2YXIgaW5wdXRzID0gW107XG4gICAgICB2YXIgZm9yY2VVcGRhdGUgPSBudWxsO1xuICAgICAgdmFyIG1vZGVsID0gbnVsbDtcbiAgICAgIHZhciBUZXN0SW5wdXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiVGVzdElucHV0XCIsXG4gICAgICAgIG1peGluczogW0Zvcm1zeS5NaXhpbl0sXG4gICAgICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwpXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdmFyIFRlc3RGb3JtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlRlc3RGb3JtXCIsXG4gICAgICAgIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGZvcmNlVXBkYXRlID0gdGhpcy5mb3JjZVVwZGF0ZS5iaW5kKHRoaXMpO1xuICAgICAgICB9LFxuICAgICAgICBvblN1Ym1pdDogZnVuY3Rpb24gKGZvcm1Nb2RlbCkge1xuICAgICAgICAgIG1vZGVsID0gZm9ybU1vZGVsO1xuICAgICAgICB9LFxuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gKCBcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybXN5LkZvcm0sIHtvblN1Ym1pdDogdGhpcy5vblN1Ym1pdH0sIFxuICAgICAgICAgICAgICBpbnB1dHNcbiAgICAgICAgICAgICkpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHZhciBmb3JtID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudCggXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGVzdEZvcm0sIG51bGwpIFxuICAgICAgKTtcblxuICAgICAgLy8gV2FpdCBiZWZvcmUgYWRkaW5nIHRoZSBpbnB1dFxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgaW5wdXRzLnB1c2goVGVzdElucHV0KHtcbiAgICAgICAgICBuYW1lOiAndGVzdCdcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIGZvcmNlVXBkYXRlKGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgIC8vIFdhaXQgZm9yIG5leHQgZXZlbnQgbG9vcCwgYXMgdGhhdCBkb2VzIHRoZSBmb3JtXG4gICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBUZXN0VXRpbHMuU2ltdWxhdGUuc3VibWl0KGZvcm0uZ2V0RE9NTm9kZSgpKTtcbiAgICAgICAgICAgIGV4cGVjdChtb2RlbC50ZXN0KS50b0JlRGVmaW5lZCgpO1xuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgIH0sIDApO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICB9LCAxMCk7XG5cbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYWxsb3cgZHluYW1pY2FsbHkgYWRkZWQgaW5wdXRzIHRvIHVwZGF0ZSB0aGUgZm9ybS1tb2RlbCcsIGZ1bmN0aW9uIChkb25lKSB7XG5cbiAgICAgIHZhciBpbnB1dHMgPSBbXTtcbiAgICAgIHZhciBmb3JjZVVwZGF0ZSA9IG51bGw7XG4gICAgICB2YXIgbW9kZWwgPSBudWxsO1xuICAgICAgdmFyIFRlc3RJbnB1dCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJUZXN0SW5wdXRcIixcbiAgICAgICAgbWl4aW5zOiBbRm9ybXN5Lk1peGluXSxcbiAgICAgICAgY2hhbmdlVmFsdWU6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgIHRoaXMuc2V0VmFsdWUoZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7dmFsdWU6IHRoaXMuZ2V0VmFsdWUoKSwgb25DaGFuZ2U6IHRoaXMuY2hhbmdlVmFsdWV9KVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHZhciBUZXN0Rm9ybSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJUZXN0Rm9ybVwiLFxuICAgICAgICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBmb3JjZVVwZGF0ZSA9IHRoaXMuZm9yY2VVcGRhdGUuYmluZCh0aGlzKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25TdWJtaXQ6IGZ1bmN0aW9uIChmb3JtTW9kZWwpIHtcbiAgICAgICAgICBtb2RlbCA9IGZvcm1Nb2RlbDtcbiAgICAgICAgfSxcbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuICggXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1zeS5Gb3JtLCB7b25TdWJtaXQ6IHRoaXMub25TdWJtaXR9LCBcbiAgICAgICAgICAgICAgaW5wdXRzXG4gICAgICAgICAgICApKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB2YXIgZm9ybSA9IFRlc3RVdGlscy5yZW5kZXJJbnRvRG9jdW1lbnQoIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRlc3RGb3JtLCBudWxsKSBcbiAgICAgICk7XG5cbiAgICAgIC8vIFdhaXQgYmVmb3JlIGFkZGluZyB0aGUgaW5wdXRcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIGlucHV0cy5wdXNoKFRlc3RJbnB1dCh7XG4gICAgICAgICAgbmFtZTogJ3Rlc3QnXG4gICAgICAgIH0pKTtcblxuICAgICAgICBmb3JjZVVwZGF0ZShmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAvLyBXYWl0IGZvciBuZXh0IGV2ZW50IGxvb3AsIGFzIHRoYXQgZG9lcyB0aGUgZm9ybVxuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgVGVzdFV0aWxzLlNpbXVsYXRlLmNoYW5nZShUZXN0VXRpbHMuZmluZFJlbmRlcmVkRE9NQ29tcG9uZW50V2l0aFRhZyhmb3JtLCAnSU5QVVQnKSwge3RhcmdldDoge3ZhbHVlOiAnZm9vJ319KTtcbiAgICAgICAgICAgIFRlc3RVdGlscy5TaW11bGF0ZS5zdWJtaXQoZm9ybS5nZXRET01Ob2RlKCkpO1xuICAgICAgICAgICAgZXhwZWN0KG1vZGVsLnRlc3QpLnRvQmUoJ2ZvbycpO1xuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgIH0sIDApO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICB9LCAxMCk7XG5cbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYWxsb3cgYSBkeW5hbWljYWxseSB1cGRhdGVkIGlucHV0IHRvIHVwZGF0ZSB0aGUgZm9ybS1tb2RlbCcsIGZ1bmN0aW9uIChkb25lKSB7XG5cbiAgICAgIHZhciBmb3JjZVVwZGF0ZSA9IG51bGw7XG4gICAgICB2YXIgbW9kZWwgPSBudWxsO1xuICAgICAgdmFyIFRlc3RJbnB1dCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJUZXN0SW5wdXRcIixcbiAgICAgICAgbWl4aW5zOiBbRm9ybXN5Lk1peGluXSxcbiAgICAgICAgY2hhbmdlVmFsdWU6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgIHRoaXMuc2V0VmFsdWUoZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7dmFsdWU6IHRoaXMuZ2V0VmFsdWUoKSwgb25DaGFuZ2U6IHRoaXMuY2hhbmdlVmFsdWV9KVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdmFyIGlucHV0O1xuICAgICAgdmFyIFRlc3RGb3JtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlRlc3RGb3JtXCIsXG4gICAgICAgIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGZvcmNlVXBkYXRlID0gdGhpcy5mb3JjZVVwZGF0ZS5iaW5kKHRoaXMpO1xuICAgICAgICB9LFxuICAgICAgICBvblN1Ym1pdDogZnVuY3Rpb24gKGZvcm1Nb2RlbCkge1xuICAgICAgICAgIG1vZGVsID0gZm9ybU1vZGVsO1xuICAgICAgICB9LFxuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpbnB1dCA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGVzdElucHV0LCB7bmFtZTogXCJ0ZXN0XCIsIHZhbHVlOiAgdGhpcy5wcm9wcy52YWx1ZX0pO1xuXG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybXN5LkZvcm0sIHtvblN1Ym1pdDogdGhpcy5vblN1Ym1pdH0sIFxuICAgICAgICAgICAgICBpbnB1dFxuICAgICAgICAgICAgKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdmFyIGZvcm0gPSBUZXN0VXRpbHMucmVuZGVySW50b0RvY3VtZW50KFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGVzdEZvcm0sIHt2YWx1ZTogXCJmb29cIn0pKTtcblxuICAgICAgLy8gV2FpdCBiZWZvcmUgY2hhbmdpbmcgdGhlIGlucHV0XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZm9ybS5zZXRQcm9wcyh7dmFsdWU6ICdiYXInfSk7XG5cbiAgICAgICAgZm9yY2VVcGRhdGUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIC8vIFdhaXQgZm9yIG5leHQgZXZlbnQgbG9vcCwgYXMgdGhhdCBkb2VzIHRoZSBmb3JtXG4gICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBUZXN0VXRpbHMuU2ltdWxhdGUuc3VibWl0KGZvcm0uZ2V0RE9NTm9kZSgpKTtcbiAgICAgICAgICAgIGV4cGVjdChtb2RlbC50ZXN0KS50b0JlKCdiYXInKTtcbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICB9LCAwKTtcblxuICAgICAgICB9KTtcblxuICAgICAgfSwgMTApO1xuXG4gICAgfSk7XG5cblxuICAgIGl0KCdzaG91bGQgaW52YWxpZGF0ZSBhIHZhbGlkIGZvcm0gaWYgZHluYW1pY2FsbHkgaW5zZXJ0ZWQgaW5wdXQgaXMgaW52YWxpZCcsIGZ1bmN0aW9uIChkb25lKSB7XG5cbiAgICAgIHZhciBmb3JjZVVwZGF0ZSA9IG51bGw7XG4gICAgICB2YXIgaXNJbnZhbGlkID0gZmFsc2U7XG4gICAgICB2YXIgVGVzdElucHV0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlRlc3RJbnB1dFwiLFxuICAgICAgICBtaXhpbnM6IFtGb3Jtc3kuTWl4aW5dLFxuICAgICAgICBjaGFuZ2VWYWx1ZTogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgdGhpcy5zZXRWYWx1ZShldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHt2YWx1ZTogdGhpcy5nZXRWYWx1ZSgpLCBvbkNoYW5nZTogdGhpcy5jaGFuZ2VWYWx1ZX0pXG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG5cbiAgICAgIHZhciBpbnB1dHMgPSBbVGVzdElucHV0KHtcbiAgICAgICAgbmFtZTogJ3Rlc3QnLFxuICAgICAgICB2YWxpZGF0aW9uczogJ2lzRW1haWwnLFxuICAgICAgICB2YWx1ZTogJ2Zvb0BiYXIuY29tJ1xuICAgICAgfSldO1xuXG4gICAgICB2YXIgVGVzdEZvcm0gPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiVGVzdEZvcm1cIixcbiAgICAgICAgY29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgZm9yY2VVcGRhdGUgPSB0aGlzLmZvcmNlVXBkYXRlLmJpbmQodGhpcyk7XG4gICAgICAgIH0sXG4gICAgICAgIHNldEludmFsaWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpc0ludmFsaWQgPSB0cnVlO1xuICAgICAgICB9LFxuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gKCBcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybXN5LkZvcm0sIHtvbkludmFsaWQ6IHRoaXMuc2V0SW52YWxpZH0sIFxuICAgICAgICAgICAgICBpbnB1dHNcbiAgICAgICAgICAgICkpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHZhciBmb3JtID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudCggXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGVzdEZvcm0sIG51bGwpIFxuICAgICAgKTtcblxuICAgICAgZXhwZWN0KGlzSW52YWxpZCkudG9CZShmYWxzZSk7XG5cbiAgICAgIGlucHV0cy5wdXNoKFRlc3RJbnB1dCh7XG4gICAgICAgIG5hbWU6ICd0ZXN0MicsXG4gICAgICAgIHZhbGlkYXRpb25zOiAnaXNFbWFpbCcsXG4gICAgICAgIHZhbHVlOiAnZm9vQGJhcidcbiAgICAgIH0pKTtcblxuXG4gICAgICBmb3JjZVVwZGF0ZShmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgLy8gV2FpdCBmb3IgbmV4dCBldmVudCBsb29wLCBhcyB0aGF0IGRvZXMgdGhlIGZvcm1cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgVGVzdFV0aWxzLlNpbXVsYXRlLnN1Ym1pdChmb3JtLmdldERPTU5vZGUoKSk7XG4gICAgICAgICAgZXhwZWN0KGlzSW52YWxpZCkudG9CZSh0cnVlKTtcbiAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH0sIDApO1xuXG4gICAgICB9KTtcblxuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBub3QgdHJpZ2dlciBvbkNoYW5nZSB3aGVuIGZvcm0gaXMgbW91bnRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBoYXNDaGFuZ2VkID0gamFzbWluZS5jcmVhdGVTcHkoJ29uQ2hhbmdlJyk7XG4gICAgICB2YXIgVGVzdEZvcm0gPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiVGVzdEZvcm1cIixcbiAgICAgICAgb25DaGFuZ2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBoYXNDaGFuZ2VkKCk7XG4gICAgICAgIH0sXG4gICAgICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1zeS5Gb3JtLCB7b25DaGFuZ2U6IHRoaXMub25DaGFuZ2V9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB2YXIgZm9ybSA9IFRlc3RVdGlscy5yZW5kZXJJbnRvRG9jdW1lbnQoUmVhY3QuY3JlYXRlRWxlbWVudChUZXN0Rm9ybSwgbnVsbCkpO1xuICAgICAgZXhwZWN0KGhhc0NoYW5nZWQpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHRyaWdnZXIgb25DaGFuZ2Ugd2hlbiBmb3JtIGVsZW1lbnQgaXMgY2hhbmdlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBoYXNDaGFuZ2VkID0gamFzbWluZS5jcmVhdGVTcHkoJ29uQ2hhbmdlJyk7XG4gICAgICB2YXIgTXlJbnB1dCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJNeUlucHV0XCIsXG4gICAgICAgIG1peGluczogW0Zvcm1zeS5NaXhpbl0sXG4gICAgICAgIG9uQ2hhbmdlOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICB0aGlzLnNldFZhbHVlKGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge3ZhbHVlOiB0aGlzLmdldFZhbHVlKCksIG9uQ2hhbmdlOiB0aGlzLm9uQ2hhbmdlfSlcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB2YXIgVGVzdEZvcm0gPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiVGVzdEZvcm1cIixcbiAgICAgICAgb25DaGFuZ2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBoYXNDaGFuZ2VkKCk7XG4gICAgICAgIH0sXG4gICAgICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1zeS5Gb3JtLCB7b25DaGFuZ2U6IHRoaXMub25DaGFuZ2V9LCBcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChNeUlucHV0LCB7bmFtZTogXCJmb29cIn0pXG4gICAgICAgICAgICApXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB2YXIgZm9ybSA9IFRlc3RVdGlscy5yZW5kZXJJbnRvRG9jdW1lbnQoUmVhY3QuY3JlYXRlRWxlbWVudChUZXN0Rm9ybSwgbnVsbCkpO1xuICAgICAgVGVzdFV0aWxzLlNpbXVsYXRlLmNoYW5nZShUZXN0VXRpbHMuZmluZFJlbmRlcmVkRE9NQ29tcG9uZW50V2l0aFRhZyhmb3JtLCAnSU5QVVQnKSwge3RhcmdldDoge3ZhbHVlOiAnYmFyJ319KTtcbiAgICAgIGV4cGVjdChoYXNDaGFuZ2VkKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHRyaWdnZXIgb25DaGFuZ2Ugd2hlbiBuZXcgaW5wdXQgaXMgYWRkZWQgdG8gZm9ybScsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICB2YXIgaGFzQ2hhbmdlZCA9IGphc21pbmUuY3JlYXRlU3B5KCdvbkNoYW5nZScpO1xuICAgICAgdmFyIGlucHV0cyA9IFtdO1xuICAgICAgdmFyIGZvcmNlVXBkYXRlID0gbnVsbDtcbiAgICAgIHZhciBUZXN0SW5wdXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiVGVzdElucHV0XCIsXG4gICAgICAgIG1peGluczogW0Zvcm1zeS5NaXhpbl0sXG4gICAgICAgIGNoYW5nZVZhbHVlOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICB0aGlzLnNldFZhbHVlKGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge3ZhbHVlOiB0aGlzLmdldFZhbHVlKCksIG9uQ2hhbmdlOiB0aGlzLmNoYW5nZVZhbHVlfSlcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB2YXIgVGVzdEZvcm0gPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiVGVzdEZvcm1cIixcbiAgICAgICAgY29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgZm9yY2VVcGRhdGUgPSB0aGlzLmZvcmNlVXBkYXRlLmJpbmQodGhpcyk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uQ2hhbmdlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaGFzQ2hhbmdlZCgpO1xuICAgICAgICB9LFxuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gKCBcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybXN5LkZvcm0sIHtvbkNoYW5nZTogdGhpcy5vbkNoYW5nZX0sIFxuICAgICAgICAgICAgICBpbnB1dHNcbiAgICAgICAgICAgICkpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHZhciBmb3JtID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudCggXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGVzdEZvcm0sIG51bGwpIFxuICAgICAgKTtcblxuICAgICAgLy8gV2FpdCBiZWZvcmUgYWRkaW5nIHRoZSBpbnB1dFxuICAgICAgaW5wdXRzLnB1c2goVGVzdElucHV0KHtcbiAgICAgICAgbmFtZTogJ3Rlc3QnXG4gICAgICB9KSk7XG5cbiAgICAgIGZvcmNlVXBkYXRlKGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAvLyBXYWl0IGZvciBuZXh0IGV2ZW50IGxvb3AsIGFzIHRoYXQgZG9lcyB0aGUgZm9ybVxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBleHBlY3QoaGFzQ2hhbmdlZCkudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfSwgMCk7XG5cbiAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ1VwZGF0ZSBhIGZvcm0nLCBmdW5jdGlvbiAoKSB7XG5cbiAgICBpdCgnc2hvdWxkIGFsbG93IGVsZW1lbnRzIHRvIGNoZWNrIGlmIHRoZSBmb3JtIGlzIGRpc2FibGVkJywgZnVuY3Rpb24gKGRvbmUpIHtcblxuICAgICAgdmFyIFRlc3RJbnB1dCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJUZXN0SW5wdXRcIixcbiAgICAgICAgbWl4aW5zOiBbRm9ybXN5Lk1peGluXSxcbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7dmFsdWU6IHRoaXMuZ2V0VmFsdWUoKX0pXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdmFyIFRlc3RGb3JtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlRlc3RGb3JtXCIsXG4gICAgICAgIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiB7ZGlzYWJsZWQ6IHRydWV9O1xuICAgICAgICB9LFxuICAgICAgICBlbmFibGVGb3JtOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBkaXNhYmxlZDogZmFsc2VcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuICggXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1zeS5Gb3JtLCB7b25DaGFuZ2U6IHRoaXMub25DaGFuZ2UsIGRpc2FibGVkOiB0aGlzLnN0YXRlLmRpc2FibGVkfSwgXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGVzdElucHV0LCB7bmFtZTogXCJmb29cIn0pXG4gICAgICAgICAgICApKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB2YXIgZm9ybSA9IFRlc3RVdGlscy5yZW5kZXJJbnRvRG9jdW1lbnQoIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRlc3RGb3JtLCBudWxsKSBcbiAgICAgICk7XG5cbiAgICAgIHZhciBpbnB1dCA9IFRlc3RVdGlscy5maW5kUmVuZGVyZWRDb21wb25lbnRXaXRoVHlwZShmb3JtLCBUZXN0SW5wdXQpO1xuICAgICAgZXhwZWN0KGlucHV0LmlzRm9ybURpc2FibGVkKCkpLnRvQmUodHJ1ZSk7XG4gICAgICBmb3JtLmVuYWJsZUZvcm0oKTtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBleHBlY3QoaW5wdXQuaXNGb3JtRGlzYWJsZWQoKSkudG9CZShmYWxzZSk7XG4gICAgICAgIGRvbmUoKTtcbiAgICAgIH0sIDApO1xuXG4gICAgfSk7XG5cbiAgfSk7XG5cbn0pO1xuIiwidmFyIEZvcm1zeSA9IHJlcXVpcmUoJy4vLi4vc3JjL21haW4uanMnKTtcblxuZGVzY3JpYmUoJ0FqYXgnLCBmdW5jdGlvbigpIHtcblxuICBiZWZvcmVFYWNoKGZ1bmN0aW9uICgpIHtcbiAgICBqYXNtaW5lLkFqYXguaW5zdGFsbCgpO1xuICB9KTtcblxuICBhZnRlckVhY2goZnVuY3Rpb24gKCkge1xuICAgIGphc21pbmUuQWpheC51bmluc3RhbGwoKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBwb3N0IHRvIGEgZ2l2ZW4gdXJsIGlmIHBhc3NlZCcsIGZ1bmN0aW9uICgpIHtcblxuICAgIHZhciBmb3JtID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybXN5LkZvcm0sIHt1cmw6IFwiL3VzZXJzXCJ9XG4gICAgICApXG4gICAgKTtcbiAgICBcbiAgICBUZXN0VXRpbHMuU2ltdWxhdGUuc3VibWl0KGZvcm0uZ2V0RE9NTm9kZSgpKTtcbiAgICBleHBlY3QoamFzbWluZS5BamF4LnJlcXVlc3RzLm1vc3RSZWNlbnQoKS51cmwpLnRvQmUoJy91c2VycycpO1xuICAgIGV4cGVjdChqYXNtaW5lLkFqYXgucmVxdWVzdHMubW9zdFJlY2VudCgpLm1ldGhvZCkudG9CZSgnUE9TVCcpO1xuXG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgcHV0IHRvIGEgZ2l2ZW4gdXJsIGlmIHBhc3NlZCBhIG1ldGhvZCBhdHRyaWJ1dGUnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICB2YXIgZm9ybSA9IFRlc3RVdGlscy5yZW5kZXJJbnRvRG9jdW1lbnQoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1zeS5Gb3JtLCB7dXJsOiBcIi91c2Vyc1wiLCBtZXRob2Q6IFwiUFVUXCJ9XG4gICAgICApXG4gICAgKTtcbiAgICBcbiAgICBUZXN0VXRpbHMuU2ltdWxhdGUuc3VibWl0KGZvcm0uZ2V0RE9NTm9kZSgpKTtcbiAgICBleHBlY3QoamFzbWluZS5BamF4LnJlcXVlc3RzLm1vc3RSZWNlbnQoKS51cmwpLnRvQmUoJy91c2VycycpO1xuICAgIGV4cGVjdChqYXNtaW5lLkFqYXgucmVxdWVzdHMubW9zdFJlY2VudCgpLm1ldGhvZCkudG9CZSgnUFVUJyk7XG5cbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBwYXNzIHgtd3d3LWZvcm0tdXJsZW5jb2RlZCBhcyBjb250ZW50VHlwZSB3aGVuIHVybGVuY29kZWQgaXMgc2V0IGFzIGNvbnRlbnRUeXBlJywgZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIGZvcm0gPSBUZXN0VXRpbHMucmVuZGVySW50b0RvY3VtZW50KFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3Jtc3kuRm9ybSwge3VybDogXCIvdXNlcnNcIiwgY29udGVudFR5cGU6IFwidXJsZW5jb2RlZFwifVxuICAgICAgKVxuICAgICk7XG4gICAgXG4gICAgVGVzdFV0aWxzLlNpbXVsYXRlLnN1Ym1pdChmb3JtLmdldERPTU5vZGUoKSk7XG4gICAgZXhwZWN0KGphc21pbmUuQWpheC5yZXF1ZXN0cy5tb3N0UmVjZW50KCkuY29udGVudFR5cGUoKSkudG9CZSgnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyk7XG5cbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBydW4gYW4gb25TdWNjZXNzIGhhbmRsZXIsIGlmIHBhc3NlZCBhbmQgYWpheCBpcyBzdWNjZXNzZnVsbC4gRmlyc3QgYXJndW1lbnQgaXMgZGF0YSBmcm9tIHNlcnZlcicsIGZ1bmN0aW9uIChkb25lKSB7XG4gXG4gICAgdmFyIG9uU3VjY2VzcyA9IGphc21pbmUuY3JlYXRlU3B5KFwic3VjY2Vzc1wiKTtcbiAgICB2YXIgZm9ybSA9IFRlc3RVdGlscy5yZW5kZXJJbnRvRG9jdW1lbnQoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1zeS5Gb3JtLCB7dXJsOiBcIi91c2Vyc1wiLCBvblN1Y2Nlc3M6IG9uU3VjY2Vzc31cbiAgICAgIClcbiAgICApO1xuICAgIFxuICAgIGphc21pbmUuQWpheC5zdHViUmVxdWVzdCgnL3VzZXJzJykuYW5kUmV0dXJuKHtcbiAgICAgIHN0YXR1czogMjAwLFxuICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgIHJlc3BvbnNlVGV4dDogJ3t9J1xuICAgIH0pO1xuXG4gICAgVGVzdFV0aWxzLlNpbXVsYXRlLnN1Ym1pdChmb3JtLmdldERPTU5vZGUoKSk7XG5cbiAgICAvLyBTaW5jZSBhamF4IGlzIHJldHVybmVkIGFzIGEgcHJvbWlzZSAoYXN5bmMpLCBtb3ZlIGFzc2VydGlvblxuICAgIC8vIHRvIGVuZCBvZiBldmVudCBsb29wXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBleHBlY3Qob25TdWNjZXNzKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7fSk7XG4gICAgICBkb25lKCk7XG4gICAgfSwgMCk7XG5cbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBub3QgZG8gYWpheCByZXF1ZXN0IGlmIG9uU3VibWl0IGhhbmRsZXIgaXMgcGFzc2VkLCBidXQgcGFzcyB0aGUgbW9kZWwgYXMgZmlyc3QgYXJndW1lbnQgdG8gb25TdWJtaXQgaGFuZGxlcicsIGZ1bmN0aW9uICgpIHtcbiAgICBcbiAgICB2YXIgVGVzdElucHV0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlRlc3RJbnB1dFwiLFxuICAgICAgbWl4aW5zOiBbRm9ybXN5Lk1peGluXSxcbiAgICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHt2YWx1ZTogdGhpcy5nZXRWYWx1ZSgpfSlcbiAgICAgIH1cbiAgICB9KTtcbiAgICB2YXIgZm9ybSA9IFRlc3RVdGlscy5yZW5kZXJJbnRvRG9jdW1lbnQoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1zeS5Gb3JtLCB7b25TdWJtaXQ6IG9uU3VibWl0fSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGVzdElucHV0LCB7bmFtZTogXCJmb29cIiwgdmFsdWU6IFwiYmFyXCJ9KVxuICAgICAgKVxuICAgICk7XG5cbiAgICBUZXN0VXRpbHMuU2ltdWxhdGUuc3VibWl0KGZvcm0uZ2V0RE9NTm9kZSgpKTtcblxuICAgIGV4cGVjdChqYXNtaW5lLkFqYXgucmVxdWVzdHMuY291bnQoKSkudG9CZSgwKTtcblxuICAgIGZ1bmN0aW9uIG9uU3VibWl0IChkYXRhKSB7XG4gICAgICBleHBlY3QoZGF0YSkudG9FcXVhbCh7XG4gICAgICAgIGZvbzogJ2JhcidcbiAgICAgIH0pO1xuICAgIH1cblxuICB9KTtcblxuICBpdCgnc2hvdWxkIHRyaWdnZXIgYW4gb25TdWJtaXR0ZWQgaGFuZGxlciwgaWYgcGFzc2VkIGFuZCB0aGUgc3VibWl0IGhhcyByZXNwb25kZWQgd2l0aCBTVUNDRVNTJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICBcbiAgICB2YXIgb25TdWJtaXR0ZWQgPSBqYXNtaW5lLmNyZWF0ZVNweShcInN1Ym1pdHRlZFwiKTtcbiAgICB2YXIgZm9ybSA9IFRlc3RVdGlscy5yZW5kZXJJbnRvRG9jdW1lbnQoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1zeS5Gb3JtLCB7dXJsOiBcIi91c2Vyc1wiLCBvblN1Ym1pdHRlZDogb25TdWJtaXR0ZWR9XG4gICAgICApXG4gICAgKTtcbiAgICBcbiAgICBqYXNtaW5lLkFqYXguc3R1YlJlcXVlc3QoJy91c2VycycpLmFuZFJldHVybih7XG4gICAgICBzdGF0dXM6IDIwMCxcbiAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICByZXNwb25zZVRleHQ6ICd7fSdcbiAgICB9KTtcblxuICAgIFRlc3RVdGlscy5TaW11bGF0ZS5zdWJtaXQoZm9ybS5nZXRET01Ob2RlKCkpO1xuXG4gICAgLy8gU2luY2UgYWpheCBpcyByZXR1cm5lZCBhcyBhIHByb21pc2UgKGFzeW5jKSwgbW92ZSBhc3NlcnRpb25cbiAgICAvLyB0byBlbmQgb2YgZXZlbnQgbG9vcFxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgZXhwZWN0KG9uU3VibWl0dGVkKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgICBkb25lKCk7XG4gICAgfSwgMCk7XG5cbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCB0cmlnZ2VyIGFuIG9uU3VibWl0dGVkIGhhbmRsZXIsIGlmIHBhc3NlZCBhbmQgdGhlIHN1Ym1pdCBoYXMgcmVzcG9uZGVkIHdpdGggRVJST1InLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIFxuICAgIHZhciBvblN1Ym1pdHRlZCA9IGphc21pbmUuY3JlYXRlU3B5KFwic3VibWl0dGVkXCIpO1xuICAgIHZhciBmb3JtID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybXN5LkZvcm0sIHt1cmw6IFwiL3VzZXJzXCIsIG9uU3VibWl0dGVkOiBvblN1Ym1pdHRlZH1cbiAgICAgIClcbiAgICApO1xuICAgIFxuICAgIGphc21pbmUuQWpheC5zdHViUmVxdWVzdCgnL3VzZXJzJykuYW5kUmV0dXJuKHtcbiAgICAgIHN0YXR1czogNTAwLFxuICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgIHJlc3BvbnNlVGV4dDogJ3t9J1xuICAgIH0pO1xuXG4gICAgVGVzdFV0aWxzLlNpbXVsYXRlLnN1Ym1pdChmb3JtLmdldERPTU5vZGUoKSk7XG5cbiAgICAvLyBTaW5jZSBhamF4IGlzIHJldHVybmVkIGFzIGEgcHJvbWlzZSAoYXN5bmMpLCBtb3ZlIGFzc2VydGlvblxuICAgIC8vIHRvIGVuZCBvZiBldmVudCBsb29wXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBleHBlY3Qob25TdWJtaXR0ZWQpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICAgIGRvbmUoKTtcbiAgICB9LCAwKTtcblxuICB9KTtcblxuICBpdCgnc2hvdWxkIHRyaWdnZXIgYW4gb25FcnJvciBoYW5kbGVyLCBpZiBwYXNzZWQgYW5kIHRoZSBzdWJtaXQgaGFzIHJlc3BvbmRlZCB3aXRoIEVSUk9SJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICBcbiAgICB2YXIgb25FcnJvciA9IGphc21pbmUuY3JlYXRlU3B5KFwiZXJyb3JcIik7XG4gICAgdmFyIGZvcm0gPSBUZXN0VXRpbHMucmVuZGVySW50b0RvY3VtZW50KFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3Jtc3kuRm9ybSwge3VybDogXCIvdXNlcnNcIiwgb25FcnJvcjogb25FcnJvcn1cbiAgICAgIClcbiAgICApO1xuICAgIFxuICAgIC8vIERvIG5vdCByZXR1cm4gYW55IGVycm9yIGJlY2F1c2UgdGhlcmUgYXJlIG5vIGlucHV0c1xuICAgIGphc21pbmUuQWpheC5zdHViUmVxdWVzdCgnL3VzZXJzJykuYW5kUmV0dXJuKHtcbiAgICAgIHN0YXR1czogNTAwLFxuICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgIHJlc3BvbnNlVGV4dDogJ3t9J1xuICAgIH0pO1xuXG4gICAgVGVzdFV0aWxzLlNpbXVsYXRlLnN1Ym1pdChmb3JtLmdldERPTU5vZGUoKSk7XG5cbiAgICAvLyBTaW5jZSBhamF4IGlzIHJldHVybmVkIGFzIGEgcHJvbWlzZSAoYXN5bmMpLCBtb3ZlIGFzc2VydGlvblxuICAgIC8vIHRvIGVuZCBvZiBldmVudCBsb29wXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBleHBlY3Qob25FcnJvcikudG9IYXZlQmVlbkNhbGxlZFdpdGgoe30pO1xuICAgICAgZG9uZSgpO1xuICAgIH0sIDApO1xuXG4gIH0pO1xuXG59KTtcbiIsInZhciBGb3Jtc3kgPSByZXF1aXJlKCcuLy4uL3NyYy9tYWluLmpzJyk7XG5cbmRlc2NyaWJlKCdWYWxpZGF0aW9uJywgZnVuY3Rpb24oKSB7XG5cbiAgaXQoJ3Nob3VsZCB0cmlnZ2VyIGFuIG9uVmFsaWQgaGFuZGxlciwgaWYgcGFzc2VkLCB3aGVuIGZvcm0gaXMgdmFsaWQnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICB2YXIgb25WYWxpZCA9IGphc21pbmUuY3JlYXRlU3B5KCd2YWxpZCcpO1xuICAgIHZhciBUZXN0SW5wdXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiVGVzdElucHV0XCIsXG4gICAgICBtaXhpbnM6IFtGb3Jtc3kuTWl4aW5dLFxuICAgICAgdXBkYXRlVmFsdWU6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICB0aGlzLnNldFZhbHVlKGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gICAgICB9LFxuICAgICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge3ZhbHVlOiB0aGlzLmdldFZhbHVlKCksIG9uQ2hhbmdlOiB0aGlzLnVwZGF0ZVZhbHVlfSlcbiAgICAgIH1cbiAgICB9KTtcbiAgICB2YXIgZm9ybSA9IFRlc3RVdGlscy5yZW5kZXJJbnRvRG9jdW1lbnQoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1zeS5Gb3JtLCB7b25WYWxpZDogb25WYWxpZH0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRlc3RJbnB1dCwge25hbWU6IFwiZm9vXCIsIHJlcXVpcmVkOiB0cnVlfSlcbiAgICAgIClcbiAgICApO1xuXG4gICAgdmFyIGlucHV0ID0gVGVzdFV0aWxzLmZpbmRSZW5kZXJlZERPTUNvbXBvbmVudFdpdGhUYWcoZm9ybSwgJ0lOUFVUJyk7XG4gICAgVGVzdFV0aWxzLlNpbXVsYXRlLmNoYW5nZShpbnB1dCwge3RhcmdldDoge3ZhbHVlOiAnZm9vJ319KTtcbiAgICBleHBlY3Qob25WYWxpZCkudG9IYXZlQmVlbkNhbGxlZCgpO1xuXG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgdHJpZ2dlciBhbiBvbkludmFsaWQgaGFuZGxlciwgaWYgcGFzc2VkLCB3aGVuIGZvcm0gaXMgaW52YWxpZCcsIGZ1bmN0aW9uICgpIHtcblxuICAgIHZhciBvbkludmFsaWQgPSBqYXNtaW5lLmNyZWF0ZVNweSgnaW52YWxpZCcpO1xuICAgIHZhciBUZXN0SW5wdXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiVGVzdElucHV0XCIsXG4gICAgICBtaXhpbnM6IFtGb3Jtc3kuTWl4aW5dLFxuICAgICAgdXBkYXRlVmFsdWU6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICB0aGlzLnNldFZhbHVlKGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gICAgICB9LFxuICAgICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge3ZhbHVlOiB0aGlzLmdldFZhbHVlKCksIG9uQ2hhbmdlOiB0aGlzLnVwZGF0ZVZhbHVlfSlcbiAgICAgIH1cbiAgICB9KTtcbiAgICB2YXIgZm9ybSA9IFRlc3RVdGlscy5yZW5kZXJJbnRvRG9jdW1lbnQoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1zeS5Gb3JtLCB7b25WYWxpZDogb25JbnZhbGlkfSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGVzdElucHV0LCB7bmFtZTogXCJmb29cIiwgdmFsdWU6IFwiZm9vXCJ9KVxuICAgICAgKVxuICAgICk7XG5cbiAgICB2YXIgaW5wdXQgPSBUZXN0VXRpbHMuZmluZFJlbmRlcmVkRE9NQ29tcG9uZW50V2l0aFRhZyhmb3JtLCAnSU5QVVQnKTtcbiAgICBUZXN0VXRpbHMuU2ltdWxhdGUuY2hhbmdlKGlucHV0LCB7dGFyZ2V0OiB7dmFsdWU6ICcnfX0pO1xuICAgIGV4cGVjdChvbkludmFsaWQpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcblxuICB9KTtcblxuICBpdCgnUlVMRTogaXNFbWFpbCcsIGZ1bmN0aW9uICgpIHtcblxuICAgIHZhciBpc1ZhbGlkID0gamFzbWluZS5jcmVhdGVTcHkoJ3ZhbGlkJyk7XG4gICAgdmFyIFRlc3RJbnB1dCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJUZXN0SW5wdXRcIixcbiAgICAgIG1peGluczogW0Zvcm1zeS5NaXhpbl0sXG4gICAgICB1cGRhdGVWYWx1ZTogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuc2V0VmFsdWUoZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICAgIH0sXG4gICAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICAgICAgaXNWYWxpZCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge3ZhbHVlOiB0aGlzLmdldFZhbHVlKCksIG9uQ2hhbmdlOiB0aGlzLnVwZGF0ZVZhbHVlfSlcbiAgICAgIH1cbiAgICB9KTtcbiAgICB2YXIgZm9ybSA9IFRlc3RVdGlscy5yZW5kZXJJbnRvRG9jdW1lbnQoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1zeS5Gb3JtLCBudWxsLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUZXN0SW5wdXQsIHtuYW1lOiBcImZvb1wiLCB2YWx1ZTogXCJmb29cIiwgdmFsaWRhdGlvbnM6IFwiaXNFbWFpbFwifSlcbiAgICAgIClcbiAgICApO1xuXG4gICAgdmFyIGlucHV0ID0gVGVzdFV0aWxzLmZpbmRSZW5kZXJlZERPTUNvbXBvbmVudFdpdGhUYWcoZm9ybSwgJ0lOUFVUJyk7XG4gICAgZXhwZWN0KGlzVmFsaWQpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgVGVzdFV0aWxzLlNpbXVsYXRlLmNoYW5nZShpbnB1dCwge3RhcmdldDoge3ZhbHVlOiAnZm9vQGZvby5jb20nfX0pO1xuICAgIGV4cGVjdChpc1ZhbGlkKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG5cbiAgfSk7XG5cbiAgaXQoJ1JVTEU6IGlzTnVtZXJpYycsIGZ1bmN0aW9uICgpIHtcblxuICAgIHZhciBpc1ZhbGlkID0gamFzbWluZS5jcmVhdGVTcHkoJ3ZhbGlkJyk7XG4gICAgdmFyIFRlc3RJbnB1dCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJUZXN0SW5wdXRcIixcbiAgICAgIG1peGluczogW0Zvcm1zeS5NaXhpbl0sXG4gICAgICB1cGRhdGVWYWx1ZTogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuc2V0VmFsdWUoZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICAgIH0sXG4gICAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICAgICAgaXNWYWxpZCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge3ZhbHVlOiB0aGlzLmdldFZhbHVlKCksIG9uQ2hhbmdlOiB0aGlzLnVwZGF0ZVZhbHVlfSlcbiAgICAgIH1cbiAgICB9KTtcbiAgICB2YXIgZm9ybSA9IFRlc3RVdGlscy5yZW5kZXJJbnRvRG9jdW1lbnQoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1zeS5Gb3JtLCBudWxsLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUZXN0SW5wdXQsIHtuYW1lOiBcImZvb1wiLCB2YWx1ZTogXCJmb29cIiwgdmFsaWRhdGlvbnM6IFwiaXNOdW1lcmljXCJ9KVxuICAgICAgKVxuICAgICk7XG5cbiAgICB2YXIgaW5wdXQgPSBUZXN0VXRpbHMuZmluZFJlbmRlcmVkRE9NQ29tcG9uZW50V2l0aFRhZyhmb3JtLCAnSU5QVVQnKTtcbiAgICBleHBlY3QoaXNWYWxpZCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICBUZXN0VXRpbHMuU2ltdWxhdGUuY2hhbmdlKGlucHV0LCB7dGFyZ2V0OiB7dmFsdWU6ICcxMjMnfX0pO1xuICAgIGV4cGVjdChpc1ZhbGlkKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG5cbiAgfSk7XG5cbiAgaXQoJ1JVTEU6IGlzTnVtZXJpYyAoYWN0dWFsIG51bWJlciknLCBmdW5jdGlvbiAoKSB7XG5cbiAgICB2YXIgaXNWYWxpZCA9IGphc21pbmUuY3JlYXRlU3B5KCd2YWxpZCcpO1xuICAgIHZhciBUZXN0SW5wdXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiVGVzdElucHV0XCIsXG4gICAgICBtaXhpbnM6IFtGb3Jtc3kuTWl4aW5dLFxuICAgICAgdXBkYXRlVmFsdWU6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICB0aGlzLnNldFZhbHVlKE51bWJlcihldmVudC50YXJnZXQudmFsdWUpKTtcbiAgICAgIH0sXG4gICAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICAgICAgaXNWYWxpZCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge3ZhbHVlOiB0aGlzLmdldFZhbHVlKCksIG9uQ2hhbmdlOiB0aGlzLnVwZGF0ZVZhbHVlfSlcbiAgICAgIH1cbiAgICB9KTtcbiAgICB2YXIgZm9ybSA9IFRlc3RVdGlscy5yZW5kZXJJbnRvRG9jdW1lbnQoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1zeS5Gb3JtLCBudWxsLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUZXN0SW5wdXQsIHtuYW1lOiBcImZvb1wiLCB2YWx1ZTogXCJmb29cIiwgdmFsaWRhdGlvbnM6IFwiaXNOdW1lcmljXCJ9KVxuICAgICAgKVxuICAgICk7XG5cbiAgICB2YXIgaW5wdXQgPSBUZXN0VXRpbHMuZmluZFJlbmRlcmVkRE9NQ29tcG9uZW50V2l0aFRhZyhmb3JtLCAnSU5QVVQnKTtcbiAgICBleHBlY3QoaXNWYWxpZCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKTtcbiAgICBUZXN0VXRpbHMuU2ltdWxhdGUuY2hhbmdlKGlucHV0LCB7dGFyZ2V0OiB7dmFsdWU6ICcxMjMnfX0pO1xuICAgIGV4cGVjdChpc1ZhbGlkKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG5cbiAgfSk7XG5cbiAgaXQoJ1JVTEU6IGlzTnVtZXJpYyAoc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIGEgZmxvYXQpJywgZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIGlzVmFsaWQgPSBqYXNtaW5lLmNyZWF0ZVNweSgndmFsaWQnKTtcbiAgICB2YXIgVGVzdElucHV0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlRlc3RJbnB1dFwiLFxuICAgICAgbWl4aW5zOiBbRm9ybXN5Lk1peGluXSxcbiAgICAgIHVwZGF0ZVZhbHVlOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5zZXRWYWx1ZShldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgfSxcbiAgICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICBpc1ZhbGlkKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7dmFsdWU6IHRoaXMuZ2V0VmFsdWUoKSwgb25DaGFuZ2U6IHRoaXMudXBkYXRlVmFsdWV9KVxuICAgICAgfVxuICAgIH0pO1xuICAgIHZhciBmb3JtID0gVGVzdFV0aWxzLnJlbmRlckludG9Eb2N1bWVudChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybXN5LkZvcm0sIG51bGwsIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRlc3RJbnB1dCwge25hbWU6IFwiZm9vXCIsIHZhbHVlOiBcImZvb1wiLCB2YWxpZGF0aW9uczogXCJpc051bWVyaWNcIn0pXG4gICAgICApXG4gICAgKTtcblxuICAgIHZhciBpbnB1dCA9IFRlc3RVdGlscy5maW5kUmVuZGVyZWRET01Db21wb25lbnRXaXRoVGFnKGZvcm0sICdJTlBVVCcpO1xuICAgIGV4cGVjdChpc1ZhbGlkKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgIFRlc3RVdGlscy5TaW11bGF0ZS5jaGFuZ2UoaW5wdXQsIHt0YXJnZXQ6IHt2YWx1ZTogJzEuNSd9fSk7XG4gICAgZXhwZWN0KGlzVmFsaWQpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcblxuICB9KTtcblxuICBpdCgnUlVMRTogaXNOdW1lcmljIGlzIGZhbHNlIChzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgYW4gaW52YWxpZCBmbG9hdCknLCBmdW5jdGlvbiAoKSB7XG5cbiAgICB2YXIgaXNWYWxpZCA9IGphc21pbmUuY3JlYXRlU3B5KCd2YWxpZCcpO1xuICAgIHZhciBUZXN0SW5wdXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiVGVzdElucHV0XCIsXG4gICAgICBtaXhpbnM6IFtGb3Jtc3kuTWl4aW5dLFxuICAgICAgdXBkYXRlVmFsdWU6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICB0aGlzLnNldFZhbHVlKGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gICAgICB9LFxuICAgICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICAgIGlzVmFsaWQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHt2YWx1ZTogdGhpcy5nZXRWYWx1ZSgpLCBvbkNoYW5nZTogdGhpcy51cGRhdGVWYWx1ZX0pXG4gICAgICB9XG4gICAgfSk7XG4gICAgdmFyIGZvcm0gPSBUZXN0VXRpbHMucmVuZGVySW50b0RvY3VtZW50KFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3Jtc3kuRm9ybSwgbnVsbCwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGVzdElucHV0LCB7bmFtZTogXCJmb29cIiwgdmFsdWU6IFwiZm9vXCIsIHZhbGlkYXRpb25zOiBcImlzTnVtZXJpY1wifSlcbiAgICAgIClcbiAgICApO1xuXG4gICAgdmFyIGlucHV0ID0gVGVzdFV0aWxzLmZpbmRSZW5kZXJlZERPTUNvbXBvbmVudFdpdGhUYWcoZm9ybSwgJ0lOUFVUJyk7XG4gICAgZXhwZWN0KGlzVmFsaWQpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgVGVzdFV0aWxzLlNpbXVsYXRlLmNoYW5nZShpbnB1dCwge3RhcmdldDoge3ZhbHVlOiAnMS4nfX0pO1xuICAgIGV4cGVjdChpc1ZhbGlkKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xuXG4gIH0pO1xuXG59KTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgX3ZhbHVlOiB0aGlzLnByb3BzLnZhbHVlID8gdGhpcy5wcm9wcy52YWx1ZSA6ICcnLFxuICAgICAgX2lzVmFsaWQ6IHRydWUsXG4gICAgICBfaXNQcmlzdGluZTogdHJ1ZVxuICAgIH07XG4gIH0sXG4gIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIGNvbmZpZ3VyZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuc2V0VmFsaWRhdGlvbnModGhpcy5wcm9wcy52YWxpZGF0aW9ucywgdGhpcy5wcm9wcy5yZXF1aXJlZCk7XG4gICAgICB0aGlzLnByb3BzLl9hdHRhY2hUb0Zvcm0odGhpcyk7XG4gICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgaWYgKCF0aGlzLnByb3BzLm5hbWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRm9ybSBJbnB1dCByZXF1aXJlcyBhIG5hbWUgcHJvcGVydHkgd2hlbiB1c2VkJyk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnByb3BzLl9hdHRhY2hUb0Zvcm0pIHtcbiAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzTW91bnRlZCgpKSByZXR1cm47XG4gICAgICAgIGlmICghdGhpcy5wcm9wcy5fYXR0YWNoVG9Gb3JtKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdGb3JtIE1peGluIHJlcXVpcmVzIGNvbXBvbmVudCB0byBiZSBuZXN0ZWQgaW4gYSBGb3JtJyk7XG4gICAgICAgIH1cbiAgICAgICAgY29uZmlndXJlKCk7XG4gICAgICB9LmJpbmQodGhpcyksIDApO1xuICAgIH1cbiAgICBjb25maWd1cmUoKTtcblxuICB9LFxuXG4gIC8vIFdlIGhhdmUgdG8gbWFrZSB0aGUgdmFsaWRhdGUgbWV0aG9kIGlzIGtlcHQgd2hlbiBuZXcgcHJvcHMgYXJlIGFkZGVkXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6IGZ1bmN0aW9uIChuZXh0UHJvcHMpIHtcbiAgICBuZXh0UHJvcHMuX2F0dGFjaFRvRm9ybSA9IHRoaXMucHJvcHMuX2F0dGFjaFRvRm9ybTtcbiAgICBuZXh0UHJvcHMuX2RldGFjaEZyb21Gb3JtID0gdGhpcy5wcm9wcy5fZGV0YWNoRnJvbUZvcm07XG4gICAgbmV4dFByb3BzLl92YWxpZGF0ZSA9IHRoaXMucHJvcHMuX3ZhbGlkYXRlO1xuICAgIHRoaXMuc2V0VmFsaWRhdGlvbnMobmV4dFByb3BzLnZhbGlkYXRpb25zLCBuZXh0UHJvcHMucmVxdWlyZWQpO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZTogZnVuY3Rpb24gKHByZXZQcm9wcywgcHJldlN0YXRlKSB7XG5cbiAgICB2YXIgaXNWYWx1ZUNoYW5nZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBcbiAgICAgIHJldHVybiAoXG4gICAgICAgIHRoaXMucHJvcHMudmFsdWUgIT09IHByZXZQcm9wcy52YWx1ZSAmJiAoXG4gICAgICAgICAgdGhpcy5zdGF0ZS5fdmFsdWUgPT09IHByZXZQcm9wcy52YWx1ZSB8fFxuXG4gICAgICAgICAgLy8gU2luY2UgdW5kZWZpbmVkIGlzIGNvbnZlcnRlZCB0byBlbXB0eSBzdHJpbmcgd2UgaGF2ZSB0b1xuICAgICAgICAgIC8vIGNoZWNrIHRoYXQgc3BlY2lmaWNhbGx5XG4gICAgICAgICAgKHRoaXMuc3RhdGUuX3ZhbHVlID09PSAnJyAmJiBwcmV2UHJvcHMudmFsdWUgPT09IHVuZGVmaW5lZClcbiAgICAgICAgKVxuICAgICAgKTtcblxuICAgIH0uYmluZCh0aGlzKTtcblxuXG4gICAgLy8gSWYgdmFsaWRhdGlvbnMgaGFzIGNoYW5nZWQgb3Igc29tZXRoaW5nIG91dHNpZGUgY2hhbmdlcyBcbiAgICAvLyB0aGUgdmFsdWUsIHNldCB0aGUgdmFsdWUgYWdhaW4gcnVubmluZyBhIHZhbGlkYXRpb25cblxuICAgIGlmIChwcmV2UHJvcHMudmFsaWRhdGlvbnMgIT09IHRoaXMucHJvcHMudmFsaWRhdGlvbnMgfHwgaXNWYWx1ZUNoYW5nZWQoKSkge1xuICAgICAgdGhpcy5zZXRWYWx1ZSh0aGlzLnByb3BzLnZhbHVlIHx8ICcnKTtcbiAgICB9XG4gIH0sXG5cbiAgLy8gRGV0YWNoIGl0IHdoZW4gY29tcG9uZW50IHVubW91bnRzXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5wcm9wcy5fZGV0YWNoRnJvbUZvcm0odGhpcyk7XG4gIH0sXG5cbiAgc2V0VmFsaWRhdGlvbnM6IGZ1bmN0aW9uICh2YWxpZGF0aW9ucywgcmVxdWlyZWQpIHtcblxuICAgIC8vIEFkZCB2YWxpZGF0aW9ucyB0byB0aGUgc3RvcmUgaXRzZWxmIGFzIHRoZSBwcm9wcyBvYmplY3QgY2FuIG5vdCBiZSBtb2RpZmllZFxuICAgIHRoaXMuX3ZhbGlkYXRpb25zID0gdmFsaWRhdGlvbnMgfHwgJyc7XG5cbiAgICBpZiAocmVxdWlyZWQpIHtcbiAgICAgIHRoaXMuX3ZhbGlkYXRpb25zID0gdmFsaWRhdGlvbnMgPyB2YWxpZGF0aW9ucyArICcsJyA6ICcnO1xuICAgICAgdGhpcy5fdmFsaWRhdGlvbnMgKz0gJ2lzVmFsdWUnO1xuICAgIH1cblxuICB9LFxuXG4gIC8vIFdlIHZhbGlkYXRlIGFmdGVyIHRoZSB2YWx1ZSBoYXMgYmVlbiBzZXRcbiAgc2V0VmFsdWU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgX3ZhbHVlOiB2YWx1ZSxcbiAgICAgIF9pc1ByaXN0aW5lOiBmYWxzZVxuICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMucHJvcHMuX3ZhbGlkYXRlKHRoaXMpO1xuICAgIH0uYmluZCh0aGlzKSk7XG4gIH0sXG4gIHJlc2V0VmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIF92YWx1ZTogJycsXG4gICAgICBfaXNQcmlzdGluZTogdHJ1ZVxuICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMucHJvcHMuX3ZhbGlkYXRlKHRoaXMpO1xuICAgIH0pO1xuICB9LFxuICBnZXRWYWx1ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXRlLl92YWx1ZTtcbiAgfSxcbiAgaGFzVmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5fdmFsdWUgIT09ICcnO1xuICB9LFxuICBnZXRFcnJvck1lc3NhZ2U6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5pc1ZhbGlkKCkgfHwgdGhpcy5zaG93UmVxdWlyZWQoKSA/IG51bGwgOiB0aGlzLnN0YXRlLl9zZXJ2ZXJFcnJvciB8fCB0aGlzLnByb3BzLnZhbGlkYXRpb25FcnJvcjtcbiAgfSxcbiAgaXNGb3JtRGlzYWJsZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5faXNGb3JtRGlzYWJsZWQoKTtcbiAgfSxcbiAgaXNWYWxpZDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXRlLl9pc1ZhbGlkO1xuICB9LFxuICBpc1ByaXN0aW5lOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUuX2lzUHJpc3RpbmU7XG4gIH0sXG4gIGlzUmVxdWlyZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gISF0aGlzLnByb3BzLnJlcXVpcmVkO1xuICB9LFxuICBzaG93UmVxdWlyZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5pc1JlcXVpcmVkKCkgJiYgdGhpcy5zdGF0ZS5fdmFsdWUgPT09ICcnO1xuICB9LFxuICBzaG93RXJyb3I6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gIXRoaXMuc2hvd1JlcXVpcmVkKCkgJiYgIXRoaXMuc3RhdGUuX2lzVmFsaWQ7XG4gIH1cbn07XG4iLCJ2YXIgUmVhY3QgPSBnbG9iYWwuUmVhY3QgfHwgcmVxdWlyZSgncmVhY3QnKTtcbnZhciBGb3Jtc3kgPSB7fTtcbnZhciB2YWxpZGF0aW9uUnVsZXMgPSByZXF1aXJlKCcuL3ZhbGlkYXRpb25SdWxlcy5qcycpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscy5qcycpO1xudmFyIE1peGluID0gcmVxdWlyZSgnLi9NaXhpbi5qcycpO1xudmFyIG9wdGlvbnMgPSB7fTtcblxuRm9ybXN5Lk1peGluID0gTWl4aW47XG5cbkZvcm1zeS5kZWZhdWx0cyA9IGZ1bmN0aW9uIChwYXNzZWRPcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBwYXNzZWRPcHRpb25zO1xufTtcblxuRm9ybXN5LmFkZFZhbGlkYXRpb25SdWxlID0gZnVuY3Rpb24gKG5hbWUsIGZ1bmMpIHtcbiAgdmFsaWRhdGlvblJ1bGVzW25hbWVdID0gZnVuYztcbn07XG5cbkZvcm1zeS5Gb3JtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkZvcm1cIixcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlzVmFsaWQ6IHRydWUsXG4gICAgICBpc1N1Ym1pdHRpbmc6IGZhbHNlLFxuICAgICAgY2FuQ2hhbmdlOiBmYWxzZVxuICAgIH07XG4gIH0sXG4gIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICBoZWFkZXJzOiB7fSxcbiAgICAgIG9uU3VjY2VzczogZnVuY3Rpb24gKCkge30sXG4gICAgICBvbkVycm9yOiBmdW5jdGlvbiAoKSB7fSxcbiAgICAgIG9uU3VibWl0OiBmdW5jdGlvbiAoKSB7fSxcbiAgICAgIG9uU3VibWl0dGVkOiBmdW5jdGlvbiAoKSB7fSxcbiAgICAgIG9uVmFsaWQ6IGZ1bmN0aW9uICgpIHt9LFxuICAgICAgb25JbnZhbGlkOiBmdW5jdGlvbiAoKSB7fSxcbiAgICAgIG9uQ2hhbmdlOiBmdW5jdGlvbiAoKSB7fVxuICAgIH07XG4gIH0sXG5cbiAgLy8gQWRkIGEgbWFwIHRvIHN0b3JlIHRoZSBpbnB1dHMgb2YgdGhlIGZvcm0sIGEgbW9kZWwgdG8gc3RvcmVcbiAgLy8gdGhlIHZhbHVlcyBvZiB0aGUgZm9ybSBhbmQgcmVnaXN0ZXIgY2hpbGQgaW5wdXRzXG4gIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuaW5wdXRzID0ge307XG4gICAgdGhpcy5tb2RlbCA9IHt9O1xuICAgIHRoaXMucmVnaXN0ZXJJbnB1dHModGhpcy5wcm9wcy5jaGlsZHJlbik7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnZhbGlkYXRlRm9ybSgpO1xuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxVcGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaW5wdXRLZXlzID0gT2JqZWN0LmtleXModGhpcy5pbnB1dHMpO1xuXG4gICAgLy8gVGhlIHVwZGF0ZWQgY2hpbGRyZW4gYXJyYXkgaXMgbm90IGF2YWlsYWJsZSBoZXJlIGZvciBzb21lIHJlYXNvbixcbiAgICAvLyB3ZSBuZWVkIHRvIHdhaXQgZm9yIG5leHQgZXZlbnQgbG9vcFxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXG4gICAgICAvLyBUaGUgY29tcG9uZW50IG1pZ2h0IGhhdmUgYmVlbiB1bm1vdW50ZWQgb24gYW5cbiAgICAgIC8vIHVwZGF0ZVxuICAgICAgaWYgKHRoaXMuaXNNb3VudGVkKCkpIHtcblxuICAgICAgICB0aGlzLnJlZ2lzdGVySW5wdXRzKHRoaXMucHJvcHMuY2hpbGRyZW4pO1xuXG4gICAgICAgIHZhciBuZXdJbnB1dEtleXMgPSBPYmplY3Qua2V5cyh0aGlzLmlucHV0cyk7XG4gICAgICAgIGlmICh1dGlscy5hcnJheXNEaWZmZXIoaW5wdXRLZXlzLCBuZXdJbnB1dEtleXMpKSB7XG4gICAgICAgICAgdGhpcy52YWxpZGF0ZUZvcm0oKTtcbiAgICAgICAgfVxuXG4gICAgICB9XG5cbiAgICB9LmJpbmQodGhpcyksIDApO1xuICB9LFxuXG4gIC8vIFVwZGF0ZSBtb2RlbCwgc3VibWl0IHRvIHVybCBwcm9wIGFuZCBzZW5kIHRoZSBtb2RlbFxuICBzdWJtaXQ6IGZ1bmN0aW9uIChldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAvLyBUcmlnZ2VyIGZvcm0gYXMgbm90IHByaXN0aW5lLlxuICAgIC8vIElmIGFueSBpbnB1dHMgaGF2ZSBub3QgYmVlbiB0b3VjaGVkIHlldCB0aGlzIHdpbGwgbWFrZSB0aGVtIGRpcnR5XG4gICAgLy8gc28gdmFsaWRhdGlvbiBiZWNvbWVzIHZpc2libGUgKGlmIGJhc2VkIG9uIGlzUHJpc3RpbmUpXG4gICAgdGhpcy5zZXRGb3JtUHJpc3RpbmUoZmFsc2UpO1xuXG4gICAgLy8gVG8gc3VwcG9ydCB1c2UgY2FzZXMgd2hlcmUgbm8gYXN5bmMgb3IgcmVxdWVzdCBvcGVyYXRpb24gaXMgbmVlZGVkLlxuICAgIC8vIFRoZSBcIm9uU3VibWl0XCIgY2FsbGJhY2sgaXMgY2FsbGVkIHdpdGggdGhlIG1vZGVsIGUuZy4ge2ZpZWxkTmFtZTogXCJteVZhbHVlXCJ9LFxuICAgIC8vIGlmIHdhbnRpbmcgdG8gcmVzZXQgdGhlIGVudGlyZSBmb3JtIHRvIG9yaWdpbmFsIHN0YXRlLCB0aGUgc2Vjb25kIHBhcmFtIGlzIGEgY2FsbGJhY2sgZm9yIHRoaXMuXG4gICAgaWYgKCF0aGlzLnByb3BzLnVybCkge1xuICAgICAgdGhpcy51cGRhdGVNb2RlbCgpO1xuICAgICAgdGhpcy5wcm9wcy5vblN1Ym1pdCh0aGlzLm1hcE1vZGVsKCksIHRoaXMucmVzZXRNb2RlbCwgdGhpcy51cGRhdGVJbnB1dHNXaXRoRXJyb3IpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMudXBkYXRlTW9kZWwoKTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGlzU3VibWl0dGluZzogdHJ1ZVxuICAgIH0pO1xuXG4gICAgdGhpcy5wcm9wcy5vblN1Ym1pdCh0aGlzLm1hcE1vZGVsKCksIHRoaXMucmVzZXRNb2RlbCwgdGhpcy51cGRhdGVJbnB1dHNXaXRoRXJyb3IpO1xuXG4gICAgdmFyIGhlYWRlcnMgPSAoT2JqZWN0LmtleXModGhpcy5wcm9wcy5oZWFkZXJzKS5sZW5ndGggJiYgdGhpcy5wcm9wcy5oZWFkZXJzKSB8fCBvcHRpb25zLmhlYWRlcnMgfHwge307XG5cbiAgICB2YXIgbWV0aG9kID0gdGhpcy5wcm9wcy5tZXRob2QgJiYgdXRpbHMuYWpheFt0aGlzLnByb3BzLm1ldGhvZC50b0xvd2VyQ2FzZSgpXSA/IHRoaXMucHJvcHMubWV0aG9kLnRvTG93ZXJDYXNlKCkgOiAncG9zdCc7XG4gICAgdXRpbHMuYWpheFttZXRob2RdKHRoaXMucHJvcHMudXJsLCB0aGlzLm1hcE1vZGVsKCksIHRoaXMucHJvcHMuY29udGVudFR5cGUgfHwgb3B0aW9ucy5jb250ZW50VHlwZSB8fCAnanNvbicsIGhlYWRlcnMpXG4gICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5vblN1Y2Nlc3MocmVzcG9uc2UpO1xuICAgICAgICB0aGlzLnByb3BzLm9uU3VibWl0dGVkKCk7XG4gICAgICB9LmJpbmQodGhpcykpXG4gICAgICAuY2F0Y2godGhpcy5mYWlsU3VibWl0KTtcbiAgfSxcblxuICBtYXBNb2RlbDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLm1hcHBpbmcgPyB0aGlzLnByb3BzLm1hcHBpbmcodGhpcy5tb2RlbCkgOiB0aGlzLm1vZGVsO1xuICB9LFxuXG4gIC8vIEdvZXMgdGhyb3VnaCBhbGwgcmVnaXN0ZXJlZCBjb21wb25lbnRzIGFuZFxuICAvLyB1cGRhdGVzIHRoZSBtb2RlbCB2YWx1ZXNcbiAgdXBkYXRlTW9kZWw6IGZ1bmN0aW9uICgpIHtcbiAgICBPYmplY3Qua2V5cyh0aGlzLmlucHV0cykuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgdmFyIGNvbXBvbmVudCA9IHRoaXMuaW5wdXRzW25hbWVdO1xuICAgICAgdGhpcy5tb2RlbFtuYW1lXSA9IGNvbXBvbmVudC5zdGF0ZS5fdmFsdWU7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgfSxcblxuICAvLyBSZXNldCBlYWNoIGtleSBpbiB0aGUgbW9kZWwgdG8gdGhlIG9yaWdpbmFsIC8gaW5pdGlhbCB2YWx1ZVxuICByZXNldE1vZGVsOiBmdW5jdGlvbiAoKSB7XG4gICAgT2JqZWN0LmtleXModGhpcy5pbnB1dHMpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgIHRoaXMuaW5wdXRzW25hbWVdLnJlc2V0VmFsdWUoKTtcbiAgICB9LmJpbmQodGhpcykpO1xuICAgIHRoaXMudmFsaWRhdGVGb3JtKCk7XG4gIH0sXG5cbiAgLy8gR28gdGhyb3VnaCBlcnJvcnMgZnJvbSBzZXJ2ZXIgYW5kIGdyYWIgdGhlIGNvbXBvbmVudHNcbiAgLy8gc3RvcmVkIGluIHRoZSBpbnB1dHMgbWFwLiBDaGFuZ2UgdGhlaXIgc3RhdGUgdG8gaW52YWxpZFxuICAvLyBhbmQgc2V0IHRoZSBzZXJ2ZXJFcnJvciBtZXNzYWdlXG4gIHVwZGF0ZUlucHV0c1dpdGhFcnJvcjogZnVuY3Rpb24gKGVycm9ycykge1xuICAgIE9iamVjdC5rZXlzKGVycm9ycykuZm9yRWFjaChmdW5jdGlvbiAobmFtZSwgaW5kZXgpIHtcbiAgICAgIHZhciBjb21wb25lbnQgPSB0aGlzLmlucHV0c1tuYW1lXTtcblxuICAgICAgaWYgKCFjb21wb25lbnQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgYXJlIHRyeWluZyB0byB1cGRhdGUgYW4gaW5wdXQgdGhhdCBkb2VzIG5vdCBleGlzdHMuIFZlcmlmeSBlcnJvcnMgb2JqZWN0IHdpdGggaW5wdXQgbmFtZXMuICcgKyBKU09OLnN0cmluZ2lmeShlcnJvcnMpKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGFyZ3MgPSBbe1xuICAgICAgICBfaXNWYWxpZDogZmFsc2UsXG4gICAgICAgIF9zZXJ2ZXJFcnJvcjogZXJyb3JzW25hbWVdXG4gICAgICB9XTtcbiAgICAgIGNvbXBvbmVudC5zZXRTdGF0ZS5hcHBseShjb21wb25lbnQsIGFyZ3MpO1xuICAgIH0uYmluZCh0aGlzKSk7XG4gIH0sXG5cbiAgZmFpbFN1Ym1pdDogZnVuY3Rpb24gKGVycm9ycykge1xuICAgIHRoaXMudXBkYXRlSW5wdXRzV2l0aEVycm9yKGVycm9ycyk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpc1N1Ym1pdHRpbmc6IGZhbHNlXG4gICAgfSk7XG4gICAgdGhpcy5wcm9wcy5vbkVycm9yKGVycm9ycyk7XG4gICAgdGhpcy5wcm9wcy5vblN1Ym1pdHRlZCgpO1xuICB9LFxuXG4gIC8vIFRyYXZlcnNlIHRoZSBjaGlsZHJlbiBhbmQgY2hpbGRyZW4gb2YgY2hpbGRyZW4gdG8gZmluZFxuICAvLyBhbGwgaW5wdXRzIGJ5IGNoZWNraW5nIHRoZSBuYW1lIHByb3AuIE1heWJlIGRvIGEgYmV0dGVyXG4gIC8vIGNoZWNrIGhlcmVcbiAgcmVnaXN0ZXJJbnB1dHM6IGZ1bmN0aW9uIChjaGlsZHJlbikge1xuICAgIFJlYWN0LkNoaWxkcmVuLmZvckVhY2goY2hpbGRyZW4sIGZ1bmN0aW9uIChjaGlsZCkge1xuXG4gICAgICBpZiAoY2hpbGQgJiYgY2hpbGQucHJvcHMgJiYgY2hpbGQucHJvcHMubmFtZSkge1xuICAgICAgICBjaGlsZC5wcm9wcy5fYXR0YWNoVG9Gb3JtID0gdGhpcy5hdHRhY2hUb0Zvcm07XG4gICAgICAgIGNoaWxkLnByb3BzLl9kZXRhY2hGcm9tRm9ybSA9IHRoaXMuZGV0YWNoRnJvbUZvcm07XG4gICAgICAgIGNoaWxkLnByb3BzLl92YWxpZGF0ZSA9IHRoaXMudmFsaWRhdGU7XG4gICAgICAgIGNoaWxkLnByb3BzLl9pc0Zvcm1EaXNhYmxlZCA9IHRoaXMuaXNGb3JtRGlzYWJsZWQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChjaGlsZCAmJiBjaGlsZC5wcm9wcyAmJiBjaGlsZC5wcm9wcy5jaGlsZHJlbikge1xuICAgICAgICB0aGlzLnJlZ2lzdGVySW5wdXRzKGNoaWxkLnByb3BzLmNoaWxkcmVuKTtcbiAgICAgIH1cblxuICAgIH0uYmluZCh0aGlzKSk7XG4gIH0sXG5cbiAgaXNGb3JtRGlzYWJsZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5kaXNhYmxlZDtcbiAgfSxcblxuICBnZXRDdXJyZW50VmFsdWVzOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuaW5wdXRzKS5yZWR1Y2UoZnVuY3Rpb24gKGRhdGEsIG5hbWUpIHtcbiAgICAgIHZhciBjb21wb25lbnQgPSB0aGlzLmlucHV0c1tuYW1lXTtcbiAgICAgIGRhdGFbbmFtZV0gPSBjb21wb25lbnQuc3RhdGUuX3ZhbHVlO1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfS5iaW5kKHRoaXMpLCB7fSk7XG4gIH0sXG5cbiAgc2V0Rm9ybVByaXN0aW5lOiBmdW5jdGlvbiAoaXNQcmlzdGluZSkge1xuICAgIHZhciBpbnB1dHMgPSB0aGlzLmlucHV0cztcbiAgICB2YXIgaW5wdXRLZXlzID0gT2JqZWN0LmtleXMoaW5wdXRzKTtcblxuICAgIC8vIEl0ZXJhdGUgdGhyb3VnaCBlYWNoIGNvbXBvbmVudCBhbmQgc2V0IGl0IGFzIHByaXN0aW5lXG4gICAgLy8gb3IgXCJkaXJ0eVwiLlxuICAgIGlucHV0S2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lLCBpbmRleCkge1xuICAgICAgdmFyIGNvbXBvbmVudCA9IGlucHV0c1tuYW1lXTtcbiAgICAgIGNvbXBvbmVudC5zZXRTdGF0ZSh7XG4gICAgICAgIF9pc1ByaXN0aW5lOiBpc1ByaXN0aW5lXG4gICAgICB9KTtcbiAgICB9LmJpbmQodGhpcykpO1xuICB9LFxuXG4gIC8vIFVzZSB0aGUgYmluZGVkIHZhbHVlcyBhbmQgdGhlIGFjdHVhbCBpbnB1dCB2YWx1ZSB0b1xuICAvLyB2YWxpZGF0ZSB0aGUgaW5wdXQgYW5kIHNldCBpdHMgc3RhdGUuIFRoZW4gY2hlY2sgdGhlXG4gIC8vIHN0YXRlIG9mIHRoZSBmb3JtIGl0c2VsZlxuICB2YWxpZGF0ZTogZnVuY3Rpb24gKGNvbXBvbmVudCkge1xuXG4gICAgLy8gVHJpZ2dlciBvbkNoYW5nZVxuICAgIGlmICh0aGlzLnN0YXRlLmNhbkNoYW5nZSkge1xuICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZSh0aGlzLmdldEN1cnJlbnRWYWx1ZXMoKSk7XG4gICAgfVxuXG4gICAgaWYgKCFjb21wb25lbnQucHJvcHMucmVxdWlyZWQgJiYgIWNvbXBvbmVudC5fdmFsaWRhdGlvbnMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBSdW4gdGhyb3VnaCB0aGUgdmFsaWRhdGlvbnMsIHNwbGl0IHRoZW0gdXAgYW5kIGNhbGxcbiAgICAvLyB0aGUgdmFsaWRhdG9yIElGIHRoZXJlIGlzIGEgdmFsdWUgb3IgaXQgaXMgcmVxdWlyZWRcbiAgICB2YXIgaXNWYWxpZCA9IHRoaXMucnVuVmFsaWRhdGlvbihjb21wb25lbnQpO1xuXG4gICAgY29tcG9uZW50LnNldFN0YXRlKHtcbiAgICAgIF9pc1ZhbGlkOiBpc1ZhbGlkLFxuICAgICAgX3NlcnZlckVycm9yOiBudWxsXG4gICAgfSwgdGhpcy52YWxpZGF0ZUZvcm0pO1xuXG4gIH0sXG5cbiAgcnVuVmFsaWRhdGlvbjogZnVuY3Rpb24gKGNvbXBvbmVudCkge1xuICAgIHZhciBpc1ZhbGlkID0gdHJ1ZTtcbiAgICBpZiAoY29tcG9uZW50Ll92YWxpZGF0aW9ucy5sZW5ndGggJiYgKGNvbXBvbmVudC5wcm9wcy5yZXF1aXJlZCB8fCBjb21wb25lbnQuc3RhdGUuX3ZhbHVlICE9PSAnJykpIHtcbiAgICAgIGNvbXBvbmVudC5fdmFsaWRhdGlvbnMuc3BsaXQoJywnKS5mb3JFYWNoKGZ1bmN0aW9uICh2YWxpZGF0aW9uKSB7XG4gICAgICAgIHZhciBhcmdzID0gdmFsaWRhdGlvbi5zcGxpdCgnOicpO1xuICAgICAgICB2YXIgdmFsaWRhdGVNZXRob2QgPSBhcmdzLnNoaWZ0KCk7XG4gICAgICAgIGFyZ3MgPSBhcmdzLm1hcChmdW5jdGlvbiAoYXJnKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKGFyZyk7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgcmV0dXJuIGFyZzsgLy8gSXQgaXMgYSBzdHJpbmcgaWYgaXQgY2FuIG5vdCBwYXJzZSBpdFxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGFyZ3MgPSBbY29tcG9uZW50LnN0YXRlLl92YWx1ZV0uY29uY2F0KGFyZ3MpO1xuICAgICAgICBpZiAoIXZhbGlkYXRpb25SdWxlc1t2YWxpZGF0ZU1ldGhvZF0pIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Zvcm1zeSBkb2VzIG5vdCBoYXZlIHRoZSB2YWxpZGF0aW9uIHJ1bGU6ICcgKyB2YWxpZGF0ZU1ldGhvZCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF2YWxpZGF0aW9uUnVsZXNbdmFsaWRhdGVNZXRob2RdLmFwcGx5KHRoaXMuZ2V0Q3VycmVudFZhbHVlcygpLCBhcmdzKSkge1xuICAgICAgICAgIGlzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9XG4gICAgcmV0dXJuIGlzVmFsaWQ7XG4gIH0sXG5cbiAgLy8gVmFsaWRhdGUgdGhlIGZvcm0gYnkgZ29pbmcgdGhyb3VnaCBhbGwgY2hpbGQgaW5wdXQgY29tcG9uZW50c1xuICAvLyBhbmQgY2hlY2sgdGhlaXIgc3RhdGVcbiAgdmFsaWRhdGVGb3JtOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGFsbElzVmFsaWQgPSB0cnVlO1xuICAgIHZhciBpbnB1dHMgPSB0aGlzLmlucHV0cztcbiAgICB2YXIgaW5wdXRLZXlzID0gT2JqZWN0LmtleXMoaW5wdXRzKTtcblxuICAgIC8vIFdlIG5lZWQgYSBjYWxsYmFjayBhcyB3ZSBhcmUgdmFsaWRhdGluZyBhbGwgaW5wdXRzIGFnYWluLiBUaGlzIHdpbGxcbiAgICAvLyBydW4gd2hlbiB0aGUgbGFzdCBjb21wb25lbnQgaGFzIHNldCBpdHMgc3RhdGVcbiAgICB2YXIgb25WYWxpZGF0aW9uQ29tcGxldGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpbnB1dEtleXMuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICBpZiAoIWlucHV0c1tuYW1lXS5zdGF0ZS5faXNWYWxpZCkge1xuICAgICAgICAgIGFsbElzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfS5iaW5kKHRoaXMpKTtcblxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGlzVmFsaWQ6IGFsbElzVmFsaWRcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoYWxsSXNWYWxpZCkge1xuICAgICAgICB0aGlzLnByb3BzLm9uVmFsaWQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucHJvcHMub25JbnZhbGlkKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIFRlbGwgdGhlIGZvcm0gdGhhdCBpdCBjYW4gc3RhcnQgdG8gdHJpZ2dlciBjaGFuZ2UgZXZlbnRzXG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgY2FuQ2hhbmdlOiB0cnVlXG4gICAgICB9KTtcblxuICAgIH0uYmluZCh0aGlzKTtcblxuICAgIC8vIFJ1biB2YWxpZGF0aW9uIGFnYWluIGluIGNhc2UgYWZmZWN0ZWQgYnkgb3RoZXIgaW5wdXRzLiBUaGVcbiAgICAvLyBsYXN0IGNvbXBvbmVudCB2YWxpZGF0ZWQgd2lsbCBydW4gdGhlIG9uVmFsaWRhdGlvbkNvbXBsZXRlIGNhbGxiYWNrXG4gICAgaW5wdXRLZXlzLmZvckVhY2goZnVuY3Rpb24gKG5hbWUsIGluZGV4KSB7XG4gICAgICB2YXIgY29tcG9uZW50ID0gaW5wdXRzW25hbWVdO1xuICAgICAgdmFyIGlzVmFsaWQgPSB0aGlzLnJ1blZhbGlkYXRpb24oY29tcG9uZW50KTtcbiAgICAgIGNvbXBvbmVudC5zZXRTdGF0ZSh7XG4gICAgICAgIF9pc1ZhbGlkOiBpc1ZhbGlkLFxuICAgICAgICBfc2VydmVyRXJyb3I6IG51bGxcbiAgICAgIH0sIGluZGV4ID09PSBpbnB1dEtleXMubGVuZ3RoIC0gMSA/IG9uVmFsaWRhdGlvbkNvbXBsZXRlIDogbnVsbCk7XG4gICAgfS5iaW5kKHRoaXMpKTtcblxuICAgIC8vIElmIHRoZXJlIGFyZSBubyBpbnB1dHMsIHNldCBzdGF0ZSB3aGVyZSBmb3JtIGlzIHJlYWR5IHRvIHRyaWdnZXJcbiAgICAvLyBjaGFuZ2UgZXZlbnQuIE5ldyBpbnB1dHMgbWlnaHQgYmUgYWRkZWQgbGF0ZXJcbiAgICBpZiAoIWlucHV0S2V5cy5sZW5ndGggJiYgdGhpcy5pc01vdW50ZWQoKSkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGNhbkNoYW5nZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfVxuICB9LFxuXG4gIC8vIE1ldGhvZCBwdXQgb24gZWFjaCBpbnB1dCBjb21wb25lbnQgdG8gcmVnaXN0ZXJcbiAgLy8gaXRzZWxmIHRvIHRoZSBmb3JtXG4gIGF0dGFjaFRvRm9ybTogZnVuY3Rpb24gKGNvbXBvbmVudCkge1xuICAgIHRoaXMuaW5wdXRzW2NvbXBvbmVudC5wcm9wcy5uYW1lXSA9IGNvbXBvbmVudDtcbiAgICB0aGlzLm1vZGVsW2NvbXBvbmVudC5wcm9wcy5uYW1lXSA9IGNvbXBvbmVudC5zdGF0ZS5fdmFsdWU7XG4gICAgdGhpcy52YWxpZGF0ZShjb21wb25lbnQpO1xuICB9LFxuXG4gIC8vIE1ldGhvZCBwdXQgb24gZWFjaCBpbnB1dCBjb21wb25lbnQgdG8gdW5yZWdpc3RlclxuICAvLyBpdHNlbGYgZnJvbSB0aGUgZm9ybVxuICBkZXRhY2hGcm9tRm9ybTogZnVuY3Rpb24gKGNvbXBvbmVudCkge1xuICAgIGRlbGV0ZSB0aGlzLmlucHV0c1tjb21wb25lbnQucHJvcHMubmFtZV07XG4gICAgZGVsZXRlIHRoaXMubW9kZWxbY29tcG9uZW50LnByb3BzLm5hbWVdO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcblxuICAgIHJldHVybiBSZWFjdC5ET00uZm9ybSh7XG4gICAgICAgIG9uU3VibWl0OiB0aGlzLnN1Ym1pdCxcbiAgICAgICAgY2xhc3NOYW1lOiB0aGlzLnByb3BzLmNsYXNzTmFtZVxuICAgICAgfSxcbiAgICAgIHRoaXMucHJvcHMuY2hpbGRyZW5cbiAgICApO1xuXG4gIH1cbn0pO1xuXG5pZiAoIWdsb2JhbC5leHBvcnRzICYmICFnbG9iYWwubW9kdWxlICYmICghZ2xvYmFsLmRlZmluZSB8fCAhZ2xvYmFsLmRlZmluZS5hbWQpKSB7XG4gIGdsb2JhbC5Gb3Jtc3kgPSBGb3Jtc3k7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRm9ybXN5O1xuIiwidmFyIGNzcmZUb2tlblNlbGVjdG9yID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWV0YVtuYW1lPVwiY3NyZi10b2tlblwiXScpO1xuXG52YXIgdG9VUkxFbmNvZGVkID0gZnVuY3Rpb24gKGVsZW1lbnQsIGtleSwgbGlzdCkge1xuICB2YXIgbGlzdCA9IGxpc3QgfHwgW107XG4gIGlmICh0eXBlb2YgKGVsZW1lbnQpID09ICdvYmplY3QnKSB7XG4gICAgZm9yICh2YXIgaWR4IGluIGVsZW1lbnQpXG4gICAgICB0b1VSTEVuY29kZWQoZWxlbWVudFtpZHhdLCBrZXkgPyBrZXkgKyAnWycgKyBpZHggKyAnXScgOiBpZHgsIGxpc3QpO1xuICB9IGVsc2Uge1xuICAgIGxpc3QucHVzaChrZXkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQoZWxlbWVudCkpO1xuICB9XG4gIHJldHVybiBsaXN0LmpvaW4oJyYnKTtcbn07XG5cbnZhciByZXF1ZXN0ID0gZnVuY3Rpb24gKG1ldGhvZCwgdXJsLCBkYXRhLCBjb250ZW50VHlwZSwgaGVhZGVycykge1xuXG4gIHZhciBjb250ZW50VHlwZSA9IGNvbnRlbnRUeXBlID09PSAndXJsZW5jb2RlZCcgPyAnYXBwbGljYXRpb24vJyArIGNvbnRlbnRUeXBlLnJlcGxhY2UoJ3VybGVuY29kZWQnLCAneC13d3ctZm9ybS11cmxlbmNvZGVkJykgOiAnYXBwbGljYXRpb24vanNvbic7XG4gIGRhdGEgPSBjb250ZW50VHlwZSA9PT0gJ2FwcGxpY2F0aW9uL2pzb24nID8gSlNPTi5zdHJpbmdpZnkoZGF0YSkgOiB0b1VSTEVuY29kZWQoZGF0YSk7XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICB0cnkge1xuICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgeGhyLm9wZW4obWV0aG9kLCB1cmwsIHRydWUpO1xuICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0FjY2VwdCcsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgY29udGVudFR5cGUpO1xuXG4gICAgICBpZiAoISFjc3JmVG9rZW5TZWxlY3RvciAmJiAhIWNzcmZUb2tlblNlbGVjdG9yLmNvbnRlbnQpIHtcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ1gtQ1NSRi1Ub2tlbicsIGNzcmZUb2tlblNlbGVjdG9yLmNvbnRlbnQpO1xuICAgICAgfVxuXG4gICAgICAvLyBBZGQgcGFzc2VkIGhlYWRlcnNcbiAgICAgIE9iamVjdC5rZXlzKGhlYWRlcnMpLmZvckVhY2goZnVuY3Rpb24gKGhlYWRlcikge1xuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihoZWFkZXIsIGhlYWRlcnNbaGVhZGVyXSk7XG4gICAgICB9KTtcblxuICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0geGhyLnJlc3BvbnNlVGV4dCA/IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCkgOiBudWxsO1xuICAgICAgICAgICAgaWYgKHhoci5zdGF0dXMgPj0gMjAwICYmIHhoci5zdGF0dXMgPCAzMDApIHtcbiAgICAgICAgICAgICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZWplY3QocmVzcG9uc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHJlamVjdChlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHhoci5zZW5kKGRhdGEpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJlamVjdChlKTtcbiAgICB9XG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFycmF5c0RpZmZlcjogZnVuY3Rpb24gKGFycmF5QSwgYXJyYXlCKSB7XG4gICAgdmFyIGlzRGlmZmVyZW50ID0gZmFsc2U7XG4gICAgaWYgKGFycmF5QS5sZW5ndGggIT09IGFycmF5Qi5sZW5ndGgpIHtcbiAgICAgIGlzRGlmZmVyZW50ID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXJyYXlBLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XG4gICAgICAgIGlmIChpdGVtICE9PSBhcnJheUJbaW5kZXhdKSB7XG4gICAgICAgICAgaXNEaWZmZXJlbnQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGlzRGlmZmVyZW50O1xuICB9LFxuICBhamF4OiB7XG4gICAgcG9zdDogcmVxdWVzdC5iaW5kKG51bGwsICdQT1NUJyksXG4gICAgcHV0OiByZXF1ZXN0LmJpbmQobnVsbCwgJ1BVVCcpXG4gIH1cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgJ2lzVmFsdWUnOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgIT09ICcnO1xuICB9LFxuICAnaXNFbWFpbCc6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZS5tYXRjaCgvXigoKFthLXpdfFxcZHxbISNcXCQlJidcXCpcXCtcXC1cXC89XFw/XFxeX2B7XFx8fX5dfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKSsoXFwuKFthLXpdfFxcZHxbISNcXCQlJidcXCpcXCtcXC1cXC89XFw/XFxeX2B7XFx8fX5dfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKSspKil8KChcXHgyMikoKCgoXFx4MjB8XFx4MDkpKihcXHgwZFxceDBhKSk/KFxceDIwfFxceDA5KSspPygoW1xceDAxLVxceDA4XFx4MGJcXHgwY1xceDBlLVxceDFmXFx4N2ZdfFxceDIxfFtcXHgyMy1cXHg1Yl18W1xceDVkLVxceDdlXXxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSl8KFxcXFwoW1xceDAxLVxceDA5XFx4MGJcXHgwY1xceDBkLVxceDdmXXxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkpKSkqKCgoXFx4MjB8XFx4MDkpKihcXHgwZFxceDBhKSk/KFxceDIwfFxceDA5KSspPyhcXHgyMikpKUAoKChbYS16XXxcXGR8W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pfCgoW2Etel18XFxkfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKShbYS16XXxcXGR8LXxcXC58X3x+fFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKSooW2Etel18XFxkfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKSkpXFwuKSsoKFthLXpdfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKXwoKFthLXpdfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKShbYS16XXxcXGR8LXxcXC58X3x+fFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKSooW2Etel18W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pKSkkL2kpO1xuICB9LFxuICAnaXNUcnVlJzogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSB0cnVlO1xuICB9LFxuICAnaXNOdW1lcmljJzogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBtYXRjaFJlc3VsdHMgPSB2YWx1ZS5tYXRjaCgvWy0rXT8oXFxkKlsuXSk/XFxkKy8pO1xuICAgICAgaWYgKCEhIG1hdGNoUmVzdWx0cykge1xuICAgICAgICByZXR1cm4gbWF0Y2hSZXN1bHRzWzBdID09IHZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgJ2lzQWxwaGEnOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUubWF0Y2goL15bYS16QS1aXSskLyk7XG4gIH0sXG4gICdpc1dvcmRzJzogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlLm1hdGNoKC9eW2EtekEtWlxcc10rJC8pO1xuICB9LFxuICAnaXNTcGVjaWFsV29yZHMnOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUubWF0Y2goL15bYS16QS1aXFxzXFx1MDBDMC1cXHUwMTdGXSskLyk7XG4gIH0sXG4gIGlzTGVuZ3RoOiBmdW5jdGlvbiAodmFsdWUsIG1pbiwgbWF4KSB7XG4gICAgaWYgKG1heCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdmFsdWUubGVuZ3RoID49IG1pbiAmJiB2YWx1ZS5sZW5ndGggPD0gbWF4O1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWUubGVuZ3RoID49IG1pbjtcbiAgfSxcbiAgZXF1YWxzOiBmdW5jdGlvbiAodmFsdWUsIGVxbCkge1xuICAgIHJldHVybiB2YWx1ZSA9PSBlcWw7XG4gIH0sXG4gIGVxdWFsc0ZpZWxkOiBmdW5jdGlvbiAodmFsdWUsIGZpZWxkKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSB0aGlzW2ZpZWxkXTtcbiAgfVxufTtcbiJdfQ==
