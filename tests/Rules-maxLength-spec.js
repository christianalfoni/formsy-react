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
        <TestInput name="foo" validations="maxLength:3" value={this.props.inputValue}/>
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

  'should pass when a string\'s length is smaller': function (test) {

    const form = TestUtils.renderIntoDocument(<TestForm inputValue="hi"/>);
    const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
    test.equal(inputComponent.isValid(), true);
    test.done();

  },

  'should pass when a string\'s length is equal': function (test) {

    const form = TestUtils.renderIntoDocument(<TestForm inputValue="bar"/>);
    const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
    test.equal(inputComponent.isValid(), true);
    test.done();

  },

  'should fail when a string\'s length is bigger': function (test) {

    const form = TestUtils.renderIntoDocument(<TestForm inputValue="foobar"/>);
    const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
    test.equal(inputComponent.isValid(), false);
    test.done();

  },

  'should pass with empty string': function (test) {

    const form = TestUtils.renderIntoDocument(<TestForm inputValue=""/>);
    const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
    test.equal(inputComponent.isValid(), true);
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
