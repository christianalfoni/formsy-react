import React from 'react';
import TestUtils from 'react-dom/test-utils';

import Formsy from './..';
import { InputFactory } from './utils/TestInput';

const TestInput = InputFactory({
  render() {
    return <input value={this.props.getValue()} readOnly/>;
  }
});

class TestForm extends React.Component {
  render() {
    return (
      <Formsy>
        <TestInput name="foo" validations="isWords" value={this.props.inputValue}/>
      </Formsy>
    );
  }
}

export default {

  'should pass with a default value': function (test) {

    const form = TestUtils.renderIntoDocument(<TestForm/>);
    const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
    test.equal(inputComponent.isValid(), true);
    test.done();

  },

  'should pass with a 1 word': function (test) {

    const form = TestUtils.renderIntoDocument(<TestForm inputValue="sup"/>);
    const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
    test.equal(inputComponent.isValid(), true);
    test.done();

  },

  'should pass with 2 words': function (test) {

    const form = TestUtils.renderIntoDocument(<TestForm inputValue="sup dude"/>);
    const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
    test.equal(inputComponent.isValid(), true);
    test.done();

  },

  'should fail with a string with numbers': function (test) {

    const form = TestUtils.renderIntoDocument(<TestForm inputValue="sup 42"/>);
    const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
    test.equal(inputComponent.isValid(), false);
    test.done();

  },

  'should pass with an undefined': function (test) {

    const form = TestUtils.renderIntoDocument(<TestForm inputValue={undefined}/>);
    const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
    test.equal(inputComponent.isValid(), true);
    test.done();

  },

  'should pass with a null': function (test) {

    const form = TestUtils.renderIntoDocument(<TestForm inputValue={null}/>);
    const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
    test.equal(inputComponent.isValid(), true);
    test.done();

  },

  'should fail with a number': function (test) {

    const form = TestUtils.renderIntoDocument(<TestForm inputValue={42}/>);
    const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
    test.equal(inputComponent.isValid(), false);
    test.done();

  }

};
