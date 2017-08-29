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

  'isLength:3': {

    'should pass with a default value': function (test) {

      const form = TestUtils.renderIntoDocument(<TestForm rule="isLength:3"/>);
      const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
      test.equal(inputComponent.isValid(), true);
      test.done();

    },

    'should fail with a string too small': function (test) {

      const form = TestUtils.renderIntoDocument(<TestForm rule="isLength:3" inputValue="hi"/>);
      const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
      test.equal(inputComponent.isValid(), false);
      test.done();

    },

    'should fail with a string too long': function (test) {

      const form = TestUtils.renderIntoDocument(<TestForm rule="isLength:3" inputValue="hi ho happ"/>);
      const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
      test.equal(inputComponent.isValid(), false);
      test.done();

    },

    'should pass with matching length': function (test) {

      const form = TestUtils.renderIntoDocument(<TestForm rule="isLength:3" inputValue="foo"/>);
      const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
      test.equal(inputComponent.isValid(), true);
      test.done();

    },

    'should pass with undefined': function (test) {

      const form = TestUtils.renderIntoDocument(<TestForm rule="isLength:3" inputValue={undefined}/>);
      const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
      test.equal(inputComponent.isValid(), true);
      test.done();

    },

    'should pass with null': function (test) {

      const form = TestUtils.renderIntoDocument(<TestForm rule="isLength:3" inputValue={null}/>);
      const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
      test.equal(inputComponent.isValid(), true);
      test.done();

    },

    'should pass with empty string': function (test) {

      const form = TestUtils.renderIntoDocument(<TestForm rule="isLength:3" inputValue=""/>);
      const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
      test.equal(inputComponent.isValid(), true);
      test.done();

    },

    'should fail with a number': function (test) {

      const form = TestUtils.renderIntoDocument(<TestForm rule="isLength:3" inputValue={123}/>);
      const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
      test.equal(inputComponent.isValid(), false);
      test.done();

    }

  },

  'isLength:0': {

    'should pass with a default value': function (test) {

      const form = TestUtils.renderIntoDocument(<TestForm rule="isLength:0"/>);
      const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
      test.equal(inputComponent.isValid(), true);
      test.done();

    },

    'should fail with a string too small': function (test) {

      const form = TestUtils.renderIntoDocument(<TestForm rule="isLength:0" inputValue="hi"/>);
      const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
      test.equal(inputComponent.isValid(), false);
      test.done();

    },

    'should fail with a string too long': function (test) {

      const form = TestUtils.renderIntoDocument(<TestForm rule="isLength:0" inputValue="hi ho happ"/>);
      const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
      test.equal(inputComponent.isValid(), false);
      test.done();

    },

    'should pass with matching length': function (test) {

      const form = TestUtils.renderIntoDocument(<TestForm rule="isLength:0" inputValue=""/>);
      const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
      test.equal(inputComponent.isValid(), true);
      test.done();

    },

    'should pass with undefined': function (test) {

      const form = TestUtils.renderIntoDocument(<TestForm rule="isLength:0" inputValue={undefined}/>);
      const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
      test.equal(inputComponent.isValid(), true);
      test.done();

    },

    'should pass with null': function (test) {

      const form = TestUtils.renderIntoDocument(<TestForm rule="isLength:0" inputValue={null}/>);
      const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
      test.equal(inputComponent.isValid(), true);
      test.done();

    },

    'should pass with empty string': function (test) {

      const form = TestUtils.renderIntoDocument(<TestForm rule="isLength:0" inputValue=""/>);
      const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
      test.equal(inputComponent.isValid(), true);
      test.done();

    },

    'should fail with a number': function (test) {

      const form = TestUtils.renderIntoDocument(<TestForm rule="isLength:0" inputValue={123}/>);
      const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
      test.equal(inputComponent.isValid(), false);
      test.done();

    }

  }

};
