import React from 'react';
import TestUtils from 'react-dom/test-utils';

import Formsy from './..';
import TestInput, {InputFactory} from './utils/TestInput';
import immediate from './utils/immediate';
import sinon from 'sinon';

export default {

  'should reset only changed form element when external error is passed': function (test) {

    const form = TestUtils.renderIntoDocument(
      <Formsy.Form onSubmit={(model, reset, invalidate) => invalidate({ foo: 'bar', bar: 'foo' })}>
        <TestInput name="foo"/>
        <TestInput name="bar"/>
      </Formsy.Form>
    );

    const input = TestUtils.scryRenderedDOMComponentsWithTag(form, 'INPUT')[0];
    const inputComponents = TestUtils.scryRenderedComponentsWithType(form, TestInput);

    form.submit();
    test.equal(inputComponents[0].isValid(), false);
    test.equal(inputComponents[1].isValid(), false);

    TestUtils.Simulate.change(input, {target: {value: 'bar'}});
    immediate(() => {
      test.equal(inputComponents[0].isValid(), true);
      test.equal(inputComponents[1].isValid(), false);
      test.done();
    });

  },

  'should let normal validation take over when component with external error is changed': function (test) {

    const form = TestUtils.renderIntoDocument(
      <Formsy.Form onSubmit={(model, reset, invalidate) => invalidate({ foo: 'bar' })}>
        <TestInput name="foo" validations="isEmail"/>
      </Formsy.Form>
    );

    const input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);

    form.submit();
    test.equal(inputComponent.isValid(), false);

    TestUtils.Simulate.change(input, {target: {value: 'bar'}});
    immediate(() => {
      test.equal(inputComponent.getValue(), 'bar');
      test.equal(inputComponent.isValid(), false);
      test.done();
    });

  },

  'should trigger an onValid handler, if passed, when form is valid': function (test) {

    const onValid = sinon.spy();
    const onInvalid = sinon.spy();

    TestUtils.renderIntoDocument(
      <Formsy.Form onValid={onValid} onInvalid={onInvalid}>
        <TestInput name="foo" value="bar" required/>
      </Formsy.Form>
    );

    test.equal(onValid.called, true);
    test.equal(onInvalid.called, false);
    test.done();

  },

  'should trigger an onInvalid handler, if passed, when form is invalid': function (test) {

    const onValid = sinon.spy();
    const onInvalid = sinon.spy();

    TestUtils.renderIntoDocument(
      <Formsy.Form onValid={onValid} onInvalid={onInvalid}>
        <TestInput name="foo" required />
      </Formsy.Form>
    );

    test.equal(onValid.called, false);
    test.equal(onInvalid.called, true);
    test.done();

  },

  'should be able to use provided validate function': function (test) {

    let isValid = false;
    const CustomInput = InputFactory({
      componentDidMount() {
        isValid = this.isValid();
      }
    });
    const form = TestUtils.renderIntoDocument(
      <Formsy.Form>
        <CustomInput name="foo" value="foo" required/>
      </Formsy.Form>
    );

    const input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    test.equal(isValid, true);
    test.done();

  },

  'should provide invalidate callback on onValiSubmit': function (test) {
    class TestForm extends React.Component {
      render() {
        return (
          <Formsy.Form onValidSubmit={(model, reset, invalidate) => invalidate({ foo: 'bar' })}>
            <TestInput name="foo" value="foo"/>
          </Formsy.Form>
        );
      }
    }

    const form = TestUtils.renderIntoDocument(<TestForm/>);

    const formEl = TestUtils.findRenderedDOMComponentWithTag(form, 'form');
    const input = TestUtils.findRenderedComponentWithType(form, TestInput);
    TestUtils.Simulate.submit(formEl);
    test.equal(input.isValid(), false);
    test.done();
  },

  'should provide invalidate callback on onInvalidSubmit': function (test) {
    class TestForm extends React.Component {
      render() {
        return (
          <Formsy.Form onInvalidSubmit={(model, reset, invalidate) => invalidate({ foo: 'bar' })}>
            <TestInput name="foo" value="foo" validations="isEmail"/>
          </Formsy.Form>
        );
      }
    }

    const form = TestUtils.renderIntoDocument(<TestForm/>);
    const formEl = TestUtils.findRenderedDOMComponentWithTag(form, 'form');
    const input = TestUtils.findRenderedComponentWithType(form, TestInput);
    TestUtils.Simulate.submit(formEl);
    test.equal(input.getErrorMessage(), 'bar');

    test.done();
  },

  'should not invalidate inputs on external errors with preventExternalInvalidation prop': function (test) {
    class TestForm extends React.Component {
      render() {
        return (
          <Formsy.Form
            preventExternalInvalidation
            onSubmit={(model, reset, invalidate) => invalidate({ foo: 'bar' })}>
            <TestInput name="foo" value="foo"/>
          </Formsy.Form>
        );
      }
    }

    const form = TestUtils.renderIntoDocument(<TestForm/>);
    const formEl = TestUtils.findRenderedDOMComponentWithTag(form, 'form');
    const input = TestUtils.findRenderedComponentWithType(form, TestInput);
    TestUtils.Simulate.submit(formEl);
    test.equal(input.isValid(), true);
    test.done();
  },

  'should invalidate inputs on external errors without preventExternalInvalidation prop': function (test) {
    class TestForm extends React.Component {
      render() {
        return (
          <Formsy.Form onSubmit={(model, reset, invalidate) => invalidate({ foo: 'bar' })}>
            <TestInput name="foo" value="foo"/>
          </Formsy.Form>
        );
      }
    }

    const form = TestUtils.renderIntoDocument(<TestForm/>);
    const formEl = TestUtils.findRenderedDOMComponentWithTag(form, 'form');
    const input = TestUtils.findRenderedComponentWithType(form, TestInput);
    TestUtils.Simulate.submit(formEl);
    test.equal(input.isValid(), false);
    test.done();
  }

};
