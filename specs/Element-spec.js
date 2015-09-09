import React from 'react';
import TestUtils from 'react-addons-test-utils';

import Formsy from './..';
import TestInput, { customizeInput } from './utils/TestInput';
import immediate from './utils/immediate';

describe('Element', function () {

  it('should return passed and setValue() value when using getValue()', function () {

    const form = TestUtils.renderIntoDocument(
      <Formsy.Form>
        <TestInput name="foo" value="foo"/>
      </Formsy.Form>
    );

    const input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    expect(input.value).toBe('foo');
    TestUtils.Simulate.change(input, {target: {value: 'foobar'}});
    expect(input.value).toBe('foobar');

  });

  it('should set back to pristine value when running reset', function () {

    let reset = null;
    const Input = customizeInput({
      componentDidMount() {
        reset = this.resetValue;
      }
    });
    const form = TestUtils.renderIntoDocument(
      <Formsy.Form>
        <Input name="foo" value="foo"/>
      </Formsy.Form>
    );

    const input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    TestUtils.Simulate.change(input, {target: {value: 'foobar'}});
    reset();
    expect(input.value).toBe('foo');

  });

  it('should return error message passed when calling getErrorMessage()', function () {

    let getErrorMessage = null;
    const Input = customizeInput({
      componentDidMount() {
        getErrorMessage = this.getErrorMessage;
      }
    });
    TestUtils.renderIntoDocument(
      <Formsy.Form>
        <Input name="foo" value="foo" validations="isEmail" validationError="Has to be email"/>
      </Formsy.Form>
    );

    expect(getErrorMessage()).toBe('Has to be email');

  });

  it('should return true or false when calling isValid() depending on valid state', function () {

    let isValid = null;
    const Input = customizeInput({
      componentDidMount() {
        isValid = this.isValid;
      }
    });
    const form = TestUtils.renderIntoDocument(
      <Formsy.Form url="/users">
        <Input name="foo" value="foo" validations="isEmail"/>
      </Formsy.Form>
    );

    expect(isValid()).toBe(false);
    const input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    TestUtils.Simulate.change(input, {target: {value: 'foo@foo.com'}});
    expect(isValid()).toBe(true);

  });

  it('should return true or false when calling isRequired() depending on passed required attribute', function () {

    const isRequireds = [];
    const Input = customizeInput({
      componentDidMount() {
        isRequireds.push(this.isRequired);
      }
    });
    TestUtils.renderIntoDocument(
      <Formsy.Form url="/users">
        <Input name="foo" value=""/>
        <Input name="foo" value="" required/>
        <Input name="foo" value="foo" required="isLength:3"/>
      </Formsy.Form>
    );

    expect(isRequireds[0]()).toBe(false);
    expect(isRequireds[1]()).toBe(true);
    expect(isRequireds[2]()).toBe(true);

  });

  it('should return true or false when calling showRequired() depending on input being empty and required is passed, or not', function () {

    const showRequireds = [];
    const Input = customizeInput({
      componentDidMount() {
        showRequireds.push(this.showRequired);
      }
    });
    TestUtils.renderIntoDocument(
      <Formsy.Form url="/users">
        <Input name="A" value="foo"/>
        <Input name="B" value="" required/>
        <Input name="C" value=""/>
      </Formsy.Form>
    );

    expect(showRequireds[0]()).toBe(false);
    expect(showRequireds[1]()).toBe(true);
    expect(showRequireds[2]()).toBe(false);

  });

  it('should return true or false when calling isPristine() depending on input has been "touched" or not', function () {

    let isPristine = null;
    const Input = customizeInput({
      componentDidMount() {
        isPristine = this.isPristine;
      }
    });
    const form = TestUtils.renderIntoDocument(
      <Formsy.Form url="/users">
        <Input name="A" value="foo"/>
      </Formsy.Form>
    );

    expect(isPristine()).toBe(true);
    const input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    TestUtils.Simulate.change(input, {target: {value: 'foo'}});
    expect(isPristine()).toBe(false);

  });

it('should allow an undefined value to be updated to a value', function (done) {

    const TestForm = React.createClass({
      getInitialState() {
        return {value: undefined};
      },
      changeValue() {
        this.setState({
          value: 'foo'
        });
      },
      render() {
        return (
          <Formsy.Form url="/users">
            <TestInput name="A" value={this.state.value}/>
          </Formsy.Form>
        );
      }
    });
    const form = TestUtils.renderIntoDocument(<TestForm/>);

    form.changeValue();
    const input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    immediate(() => {
      expect(input.value).toBe('foo');
      done();
    });

  });

  it('should be able to test a values validity', function () {

    const TestForm = React.createClass({
      render() {
        return (
          <Formsy.Form>
            <TestInput name="A" validations="isEmail"/>
          </Formsy.Form>
        );
      }
    });
    const form = TestUtils.renderIntoDocument(<TestForm/>);

    const input = TestUtils.findRenderedComponentWithType(form, TestInput);
    expect(input.isValidValue('foo@bar.com')).toBe(true);
    expect(input.isValidValue('foo@bar')).toBe(false);

  });

  it('should be able to use an object as validations property', function () {

    const TestForm = React.createClass({
      render() {
        return (
          <Formsy.Form>
            <TestInput name="A" validations={{
              isEmail: true
            }}/>
          </Formsy.Form>
        );
      }
    });
    const form = TestUtils.renderIntoDocument(<TestForm/>);

    const input = TestUtils.findRenderedComponentWithType(form, TestInput);
    expect(input.isValidValue('foo@bar.com')).toBe(true);
    expect(input.isValidValue('foo@bar')).toBe(false);

  });

  it('should be able to pass complex values to a validation rule', function () {

    const TestForm = React.createClass({
      render() {
        return (
          <Formsy.Form>
            <TestInput name="A" validations={{
              matchRegexp: /foo/
            }} value="foo"/>
          </Formsy.Form>
        );
      }
    });
    const form = TestUtils.renderIntoDocument(<TestForm/>);

    const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
    expect(inputComponent.isValid()).toBe(true);
    const input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    TestUtils.Simulate.change(input, {target: {value: 'bar'}});
    expect(inputComponent.isValid()).toBe(false);

  });

  it('should be able to run a function to validate', function () {

    const TestForm = React.createClass({
      customValidationA(values, value) {
        return value === 'foo';
      },
      customValidationB(values, value) {
        return value === 'foo' && values.A === 'foo';
      },
      render() {
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
    const form = TestUtils.renderIntoDocument(<TestForm/>);

    const inputComponent = TestUtils.scryRenderedComponentsWithType(form, TestInput);
    expect(inputComponent[0].isValid()).toBe(true);
    expect(inputComponent[1].isValid()).toBe(true);
    const input = TestUtils.scryRenderedDOMComponentsWithTag(form, 'INPUT');
    TestUtils.Simulate.change(input[0], {target: {value: 'bar'}});
    expect(inputComponent[0].isValid()).toBe(false);
    expect(inputComponent[1].isValid()).toBe(false);

  });

  it('should override all error messages with error messages passed by form', function () {

    const TestForm = React.createClass({
      render() {
        return (
          <Formsy.Form validationErrors={{A: 'bar'}}>
            <TestInput name="A" validations={{
              isEmail: true
            }} validationError="bar2" validationErrors={{isEmail: 'bar3'}} value="foo"/>
          </Formsy.Form>
        );
      }
    });
    const form = TestUtils.renderIntoDocument(<TestForm/>);

    const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
    expect(inputComponent.getErrorMessage()).toBe('bar');

  });

  it('should override validation rules with required rules', function () {

    const TestForm = React.createClass({
      render() {
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
    const form = TestUtils.renderIntoDocument(<TestForm/>);

    const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
    expect(inputComponent.getErrorMessage()).toBe('bar3');

  });

  it('should fall back to default error message when non exist in validationErrors map', function () {

    const TestForm = React.createClass({
      render() {
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
    const form = TestUtils.renderIntoDocument(<TestForm/>);

    const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
    expect(inputComponent.getErrorMessage()).toBe('bar');

  });

  it('should not be valid if it is required and required rule is true', function () {

    const TestForm = React.createClass({
      render() {
        return (
          <Formsy.Form>
            <TestInput name="A"
            required
            />
          </Formsy.Form>
        );
      }
    });
    const form = TestUtils.renderIntoDocument(<TestForm/>);

    const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
    expect(inputComponent.isValid()).toBe(false);

  });

  it('should handle objects and arrays as values', function () {

    const TestForm = React.createClass({
      getInitialState() {
        return {
          foo: {foo: 'bar'},
          bar: ['foo']
        };
      },
      render() {
        return (
          <Formsy.Form>
            <TestInput name="foo" value={this.state.foo}/>
            <TestInput name="bar" value={this.state.bar}/>
          </Formsy.Form>
        );
      }
    });
    const form = TestUtils.renderIntoDocument(<TestForm/>);

    form.setState({
      foo: {foo: 'foo'},
      bar: ['bar']
    });

    const inputs = TestUtils.scryRenderedComponentsWithType(form, TestInput);
    expect(inputs[0].getValue()).toEqual({foo: 'foo'});
    expect(inputs[1].getValue()).toEqual(['bar']);

  });

  it('should handle isFormDisabled with dynamic inputs', function () {

    const TestForm = React.createClass({
      getInitialState() {
        return {
          bool: true
        };
      },
      flip() {
        this.setState({
          bool: !this.state.bool
        });
      },
      render() {
        return (
          <Formsy.Form disabled={this.state.bool}>
            {this.state.bool ?
              <TestInput name="foo" /> :
              <TestInput name="bar" />
            }
          </Formsy.Form>
        );
      }
    });
    const form = TestUtils.renderIntoDocument(<TestForm/>);

    const input = TestUtils.findRenderedComponentWithType(form, TestInput);
    expect(input.isFormDisabled()).toBe(true);
    form.flip();
    expect(input.isFormDisabled()).toBe(false);

  });

  it('should allow for dot notation in name which maps to a deep object', function () {

    const TestForm = React.createClass({
      onSubmit(model) {
        expect(model).toEqual({foo: {bar: 'foo', test: 'test'}});
      },
      render() {
        return (
          <Formsy.Form onSubmit={this.onSubmit}>
            <TestInput name="foo.bar" value="foo"/>
            <TestInput name="foo.test" value="test"/>
          </Formsy.Form>
        );
      }
    });
    const form = TestUtils.renderIntoDocument(<TestForm/>);

    const formEl = TestUtils.findRenderedDOMComponentWithTag(form, 'form');
    TestUtils.Simulate.submit(formEl);

  });

  it('should allow for application/x-www-form-urlencoded syntax and convert to object', function () {

    const TestForm = React.createClass({
      onSubmit(model) {
        expect(model).toEqual({foo: ['foo', 'bar']});
      },
      render() {
        return (
          <Formsy.Form onSubmit={this.onSubmit}>
            <TestInput name="foo[0]" value="foo"/>
            <TestInput name="foo[1]" value="bar"/>
          </Formsy.Form>
        );
      }
    });
    const form = TestUtils.renderIntoDocument(<TestForm/>);

    const formEl = TestUtils.findRenderedDOMComponentWithTag(form, 'form');
    TestUtils.Simulate.submit(formEl);

  });

});
