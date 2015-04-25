var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var Formsy = require('./../src/main.js');

describe('Element', function() {

  it('should return passed and setValue() value when using getValue()', function () {

    var TestInput = React.createClass({
      mixins: [Formsy.Mixin],
      updateValue: function (event) {
        this.setValue(event.target.value);
      },
      render: function () {
        return <input value={this.getValue()} onChange={this.updateValue}/>
      }
    });
    var form = TestUtils.renderIntoDocument(
      <Formsy.Form>
        <TestInput name="foo" value="foo"/>
      </Formsy.Form>
    );

    var input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    expect(input.getDOMNode().value).toBe('foo');
    TestUtils.Simulate.change(input, {target: {value: 'foobar'}});
    expect(input.getDOMNode().value).toBe('foobar');

  });

  it('should set back to pristine value when running reset', function () {

    var reset = null;
    var TestInput = React.createClass({
      mixins: [Formsy.Mixin],
      componentDidMount: function () {
        reset = this.resetValue;
      },
      updateValue: function (event) {
        this.setValue(event.target.value);
      },
      render: function () {
        return <input value={this.getValue()} onChange={this.updateValue}/>
      }
    });
    var form = TestUtils.renderIntoDocument(
      <Formsy.Form>
        <TestInput name="foo" value="foo"/>
      </Formsy.Form>
    );

    var input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    TestUtils.Simulate.change(input, {target: {value: 'foobar'}});
    reset();
    expect(input.getDOMNode().value).toBe('foo');

  });

  it('should return error message passed when calling getErrorMessage()', function () {

    var getErrorMessage = null;
    var TestInput = React.createClass({
      mixins: [Formsy.Mixin],
      componentDidMount: function () {
        getErrorMessage = this.getErrorMessage;
      },
      updateValue: function (event) {
        this.setValue(event.target.value);
      },
      render: function () {
        return <input value={this.getValue()} onChange={this.updateValue}/>
      }
    });
    var form = TestUtils.renderIntoDocument(
      <Formsy.Form>
        <TestInput name="foo" value="foo" validations="isEmail" validationError="Has to be email"/>
      </Formsy.Form>
    );

    expect(getErrorMessage()).toBe('Has to be email');

  });

  it('should return true or false when calling isValid() depending on valid state', function () {

    var isValid = null;
    var TestInput = React.createClass({
      mixins: [Formsy.Mixin],
      componentDidMount: function () {
        isValid = this.isValid;
      },
      updateValue: function (event) {
        this.setValue(event.target.value);
      },
      render: function () {
        return <input value={this.getValue()} onChange={this.updateValue}/>
      }
    });
    var form = TestUtils.renderIntoDocument(
      <Formsy.Form url="/users">
        <TestInput name="foo" value="foo" validations="isEmail"/>
      </Formsy.Form>
    );

    expect(isValid()).toBe(false);
    var input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    TestUtils.Simulate.change(input, {target: {value: 'foo@foo.com'}});
    expect(isValid()).toBe(true);

  });

  it('should return true or false when calling isRequired() depending on passed required attribute', function () {

    var isRequireds = [];
    var TestInput = React.createClass({
      mixins: [Formsy.Mixin],
      componentDidMount: function () {
        isRequireds.push(this.isRequired);
      },
      updateValue: function (event) {
        this.setValue(event.target.value);
      },
      render: function () {
        return <input value={this.getValue()} onChange={this.updateValue}/>
      }
    });
    var form = TestUtils.renderIntoDocument(
      <Formsy.Form url="/users">
        <TestInput name="foo" value=""/>
        <TestInput name="foo" value="" required/>
        <TestInput name="foo" value="foo" required="isLength:3"/>
      </Formsy.Form>
    );

    expect(isRequireds[0]()).toBe(false);
    expect(isRequireds[1]()).toBe(true);
    expect(isRequireds[2]()).toBe(true);

  });

  it('should return true or false when calling showRequired() depending on input being empty and required is passed, or not', function () {

    var showRequireds = [];
    var TestInput = React.createClass({
      mixins: [Formsy.Mixin],
      componentDidMount: function () {
        showRequireds.push(this.showRequired);
      },
      updateValue: function (event) {
        this.setValue(event.target.value);
      },
      render: function () {
        return <input value={this.getValue()} onChange={this.updateValue}/>
      }
    });
    var form = TestUtils.renderIntoDocument(
      <Formsy.Form url="/users">
        <TestInput name="A" value="foo"/>
        <TestInput name="B" value="" required/>
        <TestInput name="C" value=""/>
      </Formsy.Form>
    );

    expect(showRequireds[0]()).toBe(false);
    expect(showRequireds[1]()).toBe(true);
    expect(showRequireds[2]()).toBe(false);

  });

  it('should return true or false when calling isPristine() depending on input has been "touched" or not', function () {

    var isPristine = null;
    var TestInput = React.createClass({
      mixins: [Formsy.Mixin],
      componentDidMount: function () {
        isPristine = this.isPristine;
      },
      updateValue: function (event) {
        this.setValue(event.target.value);
      },
      render: function () {
        return <input value={this.getValue()} onChange={this.updateValue}/>
      }
    });
    var form = TestUtils.renderIntoDocument(
      <Formsy.Form url="/users">
        <TestInput name="A" value="foo"/>
      </Formsy.Form>
    );

    expect(isPristine()).toBe(true);
    var input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    TestUtils.Simulate.change(input, {target: {value: 'foo'}});
    expect(isPristine()).toBe(false);

  });

it('should allow an undefined value to be updated to a value', function (done) {
    var TestInput = React.createClass({
      mixins: [Formsy.Mixin],
      render: function () {
        return <input value={this.getValue()}/>
      }
    });
    var TestForm = React.createClass({
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
          <Formsy.Form url="/users">
            <TestInput name="A" value={this.state.value}/>
          </Formsy.Form>
        );
      }
    });
    var form = TestUtils.renderIntoDocument(
      <TestForm/>
    );

    form.changeValue();
    var input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    setTimeout(function () {
      expect(input.getDOMNode().value).toBe('foo');
      done();
    }, 0);
  });

  it('should be able to test a values validity', function () {

    var isInvalid = false;
    var TestInput = React.createClass({
      mixins: [Formsy.Mixin],
      render: function () {
        return <input value={this.getValue()}/>
      }
    });
    var TestForm = React.createClass({
      render: function () {
        return (
          <Formsy.Form>
            <TestInput name="A" validations="isEmail"/>
          </Formsy.Form>
        );
      }
    });
    var form = TestUtils.renderIntoDocument(
      <TestForm/>
    );

    var input = TestUtils.findRenderedComponentWithType(form, TestInput);
    expect(input.isValidValue('foo@bar.com')).toBe(true);
    expect(input.isValidValue('foo@bar')).toBe(false);

  });

  it('should be able to use an object as validations property', function () {

    var TestInput = React.createClass({
      mixins: [Formsy.Mixin],
      render: function () {
        return <input value={this.getValue()}/>
      }
    });
    var TestForm = React.createClass({
      render: function () {
        return (
          <Formsy.Form>
            <TestInput name="A" validations={{
              isEmail: true
            }}/>
          </Formsy.Form>
        );
      }
    });
    var form = TestUtils.renderIntoDocument(
      <TestForm/>
    );

    var input = TestUtils.findRenderedComponentWithType(form, TestInput);
    expect(input.isValidValue('foo@bar.com')).toBe(true);
    expect(input.isValidValue('foo@bar')).toBe(false);
  });

  it('should be able to pass complex values to a validation rule', function () {

    var TestInput = React.createClass({
      mixins: [Formsy.Mixin],
      changeValue: function (event) {
        this.setValue(event.target.value);
      },
      render: function () {
        return <input value={this.getValue()} onChange={this.changeValue}/>
      }
    });
    var TestForm = React.createClass({
      render: function () {
        return (
          <Formsy.Form>
            <TestInput name="A" validations={{
              matchRegexp: /foo/
            }} value="foo"/>
          </Formsy.Form>
        );
      }
    });
    var form = TestUtils.renderIntoDocument(
      <TestForm/>
    );

    var inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
    expect(inputComponent.isValid()).toBe(true);
    var input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    TestUtils.Simulate.change(input, {target: {value: 'bar'}});
    expect(inputComponent.isValid()).toBe(false);
  });

  it('should be able to run a function to validate', function () {

    var TestInput = React.createClass({
      mixins: [Formsy.Mixin],
      changeValue: function (event) {
        this.setValue(event.target.value);
      },
      render: function () {
        return <input value={this.getValue()} onChange={this.changeValue}/>
      }
    });
    var TestForm = React.createClass({
      customValidationA: function (values, value) {
        return value === 'foo';
      },
      customValidationB: function (values, value) {
        return value === 'foo' && values.A === 'foo';
      },
      render: function () {
        return (
          <Formsy.Form>
            <TestInput name="A" validations={{
              custom: this.customValidationA
            }} value="foo"/>
            <TestInput name="B" validations={{
              custom: this.customValidationB
            }} value="foo"/>
          </Formsy.Form>
        );
      }
    });
    var form = TestUtils.renderIntoDocument(
      <TestForm/>
    );

    var inputComponent = TestUtils.scryRenderedComponentsWithType(form, TestInput);
    expect(inputComponent[0].isValid()).toBe(true);
    expect(inputComponent[1].isValid()).toBe(true);
    var input = TestUtils.scryRenderedDOMComponentsWithTag(form, 'INPUT');
    TestUtils.Simulate.change(input[0], {target: {value: 'bar'}});
    expect(inputComponent[0].isValid()).toBe(false);
    expect(inputComponent[1].isValid()).toBe(false);
  });

  it('should override all error messages with error messages passed by form', function () {
    var TestInput = React.createClass({
      mixins: [Formsy.Mixin],
      render: function () {
        return <input value={this.getValue()}/>
      }
    });
    var TestForm = React.createClass({
      render: function () {
        return (
          <Formsy.Form validationErrors={{A: 'bar'}}>
            <TestInput name="A" validations={{
              isEmail: true
            }} validationError="bar2" validationErrors={{isEmail: 'bar3'}} value="foo"/>
          </Formsy.Form>
        );
      }
    });
    var form = TestUtils.renderIntoDocument(
      <TestForm/>
    );

    var inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
    expect(inputComponent.getErrorMessage()).toBe('bar');
  });

  it('should override validation rules with required rules', function () {
    var TestInput = React.createClass({
      mixins: [Formsy.Mixin],
      render: function () {
        return <input value={this.getValue()}/>
      }
    });
    var TestForm = React.createClass({
      render: function () {
        return (
          <Formsy.Form>
            <TestInput name="A"
              validations={{
                isEmail: true
              }}
              validationError="bar"
              validationErrors={{isEmail: 'bar2', isLength: 'bar3'}}
              value="f"
              required={{
                isLength: 1
              }}
            />
          </Formsy.Form>
        );
      }
    });
    var form = TestUtils.renderIntoDocument(
      <TestForm/>
    );

    var inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
    expect(inputComponent.getErrorMessage()).toBe('bar3');
  });

  it('should fall back to default error message when non exist in validationErrors map', function () {
    var TestInput = React.createClass({
      mixins: [Formsy.Mixin],
      render: function () {
        return <input value={this.getValue()}/>
      }
    });
    var TestForm = React.createClass({
      render: function () {
        return (
          <Formsy.Form>
            <TestInput name="A"
              validations={{
                isEmail: true
              }}
              validationError="bar"
              validationErrors={{foo: 'bar'}}
              value="foo"
            />
          </Formsy.Form>
        );
      }
    });
    var form = TestUtils.renderIntoDocument(
      <TestForm/>
    );

    var inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
    expect(inputComponent.getErrorMessage()).toBe('bar');
  });

  it('should not be valid if it is required and required rule is true', function () {
    var TestInput = React.createClass({
      mixins: [Formsy.Mixin],
      render: function () {
        return <input value={this.getValue()}/>
      }
    });
    var TestForm = React.createClass({
      render: function () {
        return (
          <Formsy.Form>
            <TestInput name="A"
            required
            />
          </Formsy.Form>
        );
      }
    });
    var form = TestUtils.renderIntoDocument(
      <TestForm/>
    );

    var inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
    expect(inputComponent.isValid()).toBe(false);
  });

  it('should handle objects and arrays as values', function () {

    var TestInput = React.createClass({
      mixins: [Formsy.Mixin],
      render: function () {
        return <div>{JSON.stringify(this.getValue())}</div>
      }
    });
    var TestForm = React.createClass({
      getInitialState: function () {
        return {
          foo: {foo: 'bar'},
          bar: ['foo']
        };
      },
      render: function () {
        return (
          <Formsy.Form>
            <TestInput name="foo" value={this.state.foo}/>
            <TestInput name="bar" value={this.state.bar}/>
          </Formsy.Form>
        );
      }
    });
    var form = TestUtils.renderIntoDocument(<TestForm/>);

    form.setState({
      foo: {foo: 'foo'},
      bar: ['bar']
    });

    var inputs = TestUtils.scryRenderedComponentsWithType(form, TestInput);
    expect(inputs[0].getValue()).toEqual({foo: 'foo'});
    expect(inputs[1].getValue()).toEqual(['bar']);

  });

});
