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
        <TestInput name="foo" validations={this.props.rule} value={this.props.inputValue}/>
      </Formsy>
    );
  }
}

export default {

  'minLength:3': {

    'should pass with a default value': function (test) {

      const form = TestUtils.renderIntoDocument(<TestForm rule="minLength:3"/>);
      const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
      test.equal(inputComponent.isValid(), true);
      test.done();

    },

    'should pass when a string\'s length is bigger': function (test) {

      const form = TestUtils.renderIntoDocument(<TestForm rule="minLength:3" inputValue="myValue"/>);
      const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
      test.equal(inputComponent.isValid(), true);
      test.done();

    },

    'should fail when a string\'s length is smaller': function (test) {

      const form = TestUtils.renderIntoDocument(<TestForm rule="minLength:3" inputValue="my"/>);
      const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
      test.equal(inputComponent.isValid(), false);
      test.done();

    },

    'should pass with empty string': function (test) {

      const form = TestUtils.renderIntoDocument(<TestForm rule="minLength:3" inputValue=""/>);
      const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
      test.equal(inputComponent.isValid(), true);
      test.done();

    },

    'should pass with an undefined': function (test) {

      const form = TestUtils.renderIntoDocument(<TestForm rule="minLength:3" inputValue={undefined}/>);
      const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
      test.equal(inputComponent.isValid(), true);
      test.done();

    },

    'should pass with a null': function (test) {

      const form = TestUtils.renderIntoDocument(<TestForm rule="minLength:3" inputValue={null}/>);
      const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
      test.equal(inputComponent.isValid(), true);
      test.done();

    },

    'should fail with a number': function (test) {

      const form = TestUtils.renderIntoDocument(<TestForm rule="minLength:3" inputValue={42}/>);
      const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
      test.equal(inputComponent.isValid(), false);
      test.done();

    }

  },

  'minLength:0': {

    'should pass with a default value': function (test) {

      const form = TestUtils.renderIntoDocument(<TestForm rule="minLength:0"/>);
      const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
      test.equal(inputComponent.isValid(), true);
      test.done();

    },

    'should pass when a string\'s length is bigger': function (test) {

      const form = TestUtils.renderIntoDocument(<TestForm rule="minLength:0" inputValue="myValue"/>);
      const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
      test.equal(inputComponent.isValid(), true);
      test.done();

    },

    'should pass with empty string': function (test) {

      const form = TestUtils.renderIntoDocument(<TestForm rule="minLength:0" inputValue=""/>);
      const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
      test.equal(inputComponent.isValid(), true);
      test.done();

    },

    'should pass with an undefined': function (test) {

      const form = TestUtils.renderIntoDocument(<TestForm rule="minLength:0" inputValue={undefined}/>);
      const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
      test.equal(inputComponent.isValid(), true);
      test.done();

    },

    'should pass with a null': function (test) {

      const form = TestUtils.renderIntoDocument(<TestForm rule="minLength:0" inputValue={null}/>);
      const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
      test.equal(inputComponent.isValid(), true);
      test.done();

    },

    'should fail with a number': function (test) {

      const form = TestUtils.renderIntoDocument(<TestForm rule="minLength:0" inputValue={42}/>);
      const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
      test.equal(inputComponent.isValid(), false);
      test.done();

    }

  }

};
