import React from 'react';
import TestUtils from 'react-dom/test-utils';

import Formsy, { withFormsy } from './..';
import { InputFactory } from './utils/TestInput';
import immediate from './utils/immediate';
import sinon from 'sinon';

class MyTest extends React.Component {
    static defaultProps = { type: 'text' };

    handleChange = (event) => {
        this.props.setValue(event.target.value);
    }

    render() {
      return <input type={this.props.type} value={this.props.getValue()} onChange={this.handleChange}/>;
    }
}
const FormsyTest = withFormsy(MyTest);

export default {

  'should reset only changed form element when external error is passed': function (test) {

    const form = TestUtils.renderIntoDocument(
      <Formsy onSubmit={(model, reset, invalidate) => invalidate({ foo: 'bar', bar: 'foo' })}>
        <FormsyTest name="foo"/>
        <FormsyTest name="bar"/>
      </Formsy>
    );

    const input = TestUtils.scryRenderedDOMComponentsWithTag(form, 'INPUT')[0];
    const inputComponents = TestUtils.scryRenderedComponentsWithType(form, FormsyTest);

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
      <Formsy onSubmit={(model, reset, invalidate) => invalidate({ foo: 'bar' })}>
        <FormsyTest name="foo" validations="isEmail"/>
      </Formsy>
    );

    const input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    const inputComponent = TestUtils.findRenderedComponentWithType(form, FormsyTest);

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
      <Formsy onValid={onValid} onInvalid={onInvalid}>
        <FormsyTest name="foo" value="bar" required/>
      </Formsy>
    );

    test.equal(onValid.called, true);
    test.equal(onInvalid.called, false);
    test.done();

  },

  'should trigger an onInvalid handler, if passed, when form is invalid': function (test) {

    const onValid = sinon.spy();
    const onInvalid = sinon.spy();

    TestUtils.renderIntoDocument(
      <Formsy onValid={onValid} onInvalid={onInvalid}>
        <FormsyTest name="foo" required />
      </Formsy>
    );

    test.equal(onValid.called, false);
    test.equal(onInvalid.called, true);
    test.done();

  },

  'should be able to use provided validate function': function (test) {

    let isValid = false;
    const CustomInput = InputFactory({
      componentDidMount: function() {
        isValid = this.props.isValid();
      }
    });
    const form = TestUtils.renderIntoDocument(
      <Formsy>
        <CustomInput name="foo" value="foo" required/>
      </Formsy>
    );

    const input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    test.equal(isValid, true);
    test.done();

  },

  'should provide invalidate callback on onValidSubmit': function (test) {

    class TestForm extends React.Component {
      render() {
        return (
          <Formsy onValidSubmit={(model, reset, invalidate) => invalidate({ foo: 'bar' })}>
            <FormsyTest name="foo" value="foo"/>
          </Formsy>
        );
      }
    }

    const form = TestUtils.renderIntoDocument(<TestForm/>);

    const formEl = TestUtils.findRenderedDOMComponentWithTag(form, 'form');
    const input = TestUtils.findRenderedComponentWithType(form, FormsyTest);
    TestUtils.Simulate.submit(formEl);
    test.equal(input.isValid(), false);
    test.done();

  },

  'should provide invalidate callback on onInvalidSubmit': function (test) {

    class TestForm extends React.Component {
      render() {
        return (
          <Formsy onInvalidSubmit={(model, reset, invalidate) => invalidate({ foo: 'bar' })}>
            <FormsyTest name="foo" value="foo" validations="isEmail"/>
          </Formsy>
        );
      }
    }

    const form = TestUtils.renderIntoDocument(<TestForm/>);
    const formEl = TestUtils.findRenderedDOMComponentWithTag(form, 'form');
    const input = TestUtils.findRenderedComponentWithType(form, FormsyTest);
    TestUtils.Simulate.submit(formEl);
    test.equal(input.getErrorMessage(), 'bar');

    test.done();

  },

  'should not invalidate inputs on external errors with preventExternalInvalidation prop': function (test) {

    class TestForm extends React.Component {
      render() {
        return (
          <Formsy
            preventExternalInvalidation
            onSubmit={(model, reset, invalidate) => invalidate({ foo: 'bar' })}>
            <FormsyTest name="foo" value="foo"/>
          </Formsy>
        );
      }
    }

    const form = TestUtils.renderIntoDocument(<TestForm/>);
    const formEl = TestUtils.findRenderedDOMComponentWithTag(form, 'form');
    const input = TestUtils.findRenderedComponentWithType(form, FormsyTest);
    TestUtils.Simulate.submit(formEl);
    test.equal(input.isValid(), true);
    test.done();

  },

  'should invalidate inputs on external errors without preventExternalInvalidation prop': function (test) {

    class TestForm extends React.Component {
      render() {
        return (
          <Formsy onSubmit={(model, reset, invalidate) => invalidate({ foo: 'bar' })}>
            <FormsyTest name="foo" value="foo"/>
          </Formsy>
        );
      }
    }

    const form = TestUtils.renderIntoDocument(<TestForm/>);
    const formEl = TestUtils.findRenderedDOMComponentWithTag(form, 'form');
    const input = TestUtils.findRenderedComponentWithType(form, FormsyTest);
    TestUtils.Simulate.submit(formEl);
    test.equal(input.isValid(), false);
    test.done();

  }

};
