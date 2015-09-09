import React from 'react';
import TestUtils from 'react-addons-test-utils';

import Formsy from './..';
import TestInput, { customizeInput } from './utils/TestInput';
import immediate from './utils/immediate';

describe('Validation', function () {

  it('should reset only changed form element when external error is passed', function (done) {

    const form = TestUtils.renderIntoDocument(
      <Formsy.Form onSubmit={(model, reset, invalidate) => invalidate({ foo: 'bar', bar: 'foo' })}>
        <TestInput name="foo"/>
        <TestInput name="bar"/>
      </Formsy.Form>
    );

    const input = TestUtils.scryRenderedDOMComponentsWithTag(form, 'INPUT')[0];
    const inputComponents = TestUtils.scryRenderedComponentsWithType(form, TestInput);

    form.submit();
    expect(inputComponents[0].isValid()).toBe(false);
    expect(inputComponents[1].isValid()).toBe(false);

    TestUtils.Simulate.change(input, {target: {value: 'bar'}});
    immediate(() => {
      expect(inputComponents[0].isValid()).toBe(true);
      expect(inputComponents[1].isValid()).toBe(false);
      done();
    });

  });

  it('should let normal validation take over when component with external error is changed', function (done) {

    const form = TestUtils.renderIntoDocument(
      <Formsy.Form onSubmit={(model, reset, invalidate) => invalidate({ foo: 'bar' })}>
        <TestInput name="foo" validations="isEmail"/>
      </Formsy.Form>
    );

    const input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);

    form.submit();
    expect(inputComponent.isValid()).toBe(false);

    TestUtils.Simulate.change(input, {target: {value: 'bar'}});
    immediate(() => {
      expect(inputComponent.getValue()).toBe('bar');
      expect(inputComponent.isValid()).toBe(false);
      done();
    });

  });

  it('should trigger an onValid handler, if passed, when form is valid', function () {

    const onValid = jasmine.createSpy('valid');
    const onInvalid = jasmine.createSpy('invalid');

    TestUtils.renderIntoDocument(
      <Formsy.Form onValid={onValid} onInvalid={onInvalid}>
        <TestInput name="foo" value="bar" required/>
      </Formsy.Form>
    );

    expect(onValid).toHaveBeenCalled();
    expect(onInvalid).not.toHaveBeenCalled();

  });

  it('should trigger an onInvalid handler, if passed, when form is invalid', function () {

    const onValid = jasmine.createSpy('valid');
    const onInvalid = jasmine.createSpy('invalid');

    TestUtils.renderIntoDocument(
      <Formsy.Form onValid={onValid} onInvalid={onInvalid}>
        <TestInput name="foo" required />
      </Formsy.Form>
    );

    expect(onValid).not.toHaveBeenCalled();
    expect(onInvalid).toHaveBeenCalled();

  });

  it('should use provided validate function', function () {

    const isValid = jasmine.createSpy('valid');

    const Input = customizeInput({
      render() {
        if (this.isValid()) {
          isValid();
        }
        return <input value={this.getValue()} onChange={this.updateValue}/>;
      },
      validate() {
        return this.getValue() === 'checkValidity';
      }
    });

    const form = TestUtils.renderIntoDocument(
      <Formsy.Form>
        <Input name="foo" value="checkInvalidity"/>
      </Formsy.Form>
    );

    const input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    TestUtils.Simulate.change(input, {target: {value: 'checkValidity'}});
    expect(isValid).toHaveBeenCalled();

  });

  it('should provide invalidate callback on onValiSubmit', function () {

    const TestForm = React.createClass({
      render() {
        return (
          <Formsy.Form onValidSubmit={(model, reset, invalidate) => invalidate({ foo: 'bar' })}>
            <TestInput name="foo" value="foo"/>
          </Formsy.Form>
        );
      }
    });

    const form = TestUtils.renderIntoDocument(<TestForm/>);

    const formEl = TestUtils.findRenderedDOMComponentWithTag(form, 'form');
    const input = TestUtils.findRenderedComponentWithType(form, TestInput);
    TestUtils.Simulate.submit(formEl);
    expect(input.isValid()).toBe(false);

  });

  it('should provide invalidate callback on onInvalidSubmit', function () {

    const TestForm = React.createClass({
      render() {
        return (
          <Formsy.Form onInvalidSubmit={(model, reset, invalidate) => invalidate({ foo: 'bar' })}>
            <TestInput name="foo" value="foo" validations="isEmail"/>
          </Formsy.Form>
        );
      }
    });

    const form = TestUtils.renderIntoDocument(<TestForm/>);
    const formEl = TestUtils.findRenderedDOMComponentWithTag(form, 'form');
    const input = TestUtils.findRenderedComponentWithType(form, TestInput);
    TestUtils.Simulate.submit(formEl);
    expect(input.getErrorMessage()).toBe('bar');

  });


  it('should not invalidate inputs on external errors with preventExternalInvalidation prop', function () {

    const TestForm = React.createClass({
      render() {
        return (
          <Formsy.Form
            preventExternalInvalidation
            onSubmit={(model, reset, invalidate) => invalidate({ foo: 'bar' })}>
            <TestInput name="foo" value="foo"/>
          </Formsy.Form>
        );
      }
    });

    const form = TestUtils.renderIntoDocument(<TestForm/>);
    const formEl = TestUtils.findRenderedDOMComponentWithTag(form, 'form');
    const input = TestUtils.findRenderedComponentWithType(form, TestInput);
    TestUtils.Simulate.submit(formEl);
    expect(input.isValid()).toBe(true);

  });

  it('should invalidate inputs on external errors without preventExternalInvalidation prop', function () {

    const TestForm = React.createClass({
      render() {
        return (
          <Formsy.Form onSubmit={(model, reset, invalidate) => invalidate({ foo: 'bar' })}>
            <TestInput name="foo" value="foo"/>
          </Formsy.Form>
        );
      }
    });

    const form = TestUtils.renderIntoDocument(<TestForm/>);
    const formEl = TestUtils.findRenderedDOMComponentWithTag(form, 'form');
    const input = TestUtils.findRenderedComponentWithType(form, TestInput);
    TestUtils.Simulate.submit(formEl);
    expect(input.isValid()).toBe(false);

  });

});
