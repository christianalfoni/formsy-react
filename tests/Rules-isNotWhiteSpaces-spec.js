import React from 'react';
import TestUtils from 'react-addons-test-utils';

import Formsy from './..';
import { InputFactory } from './utils/TestInput';

const TestInput = InputFactory({
    render() {
        return <input value={this.getValue()} readOnly/>;
    }
});

const TestForm = React.createClass({
    render() {
        return (
            <Formsy.Form>
                <TestInput name="foo" validations="isNotWhiteSpaces" value={this.props.inputValue}/>
            </Formsy.Form>
        );
    }
});

export default {

    'should pass with a default value': function (test) {

        const form = TestUtils.renderIntoDocument(<TestForm/>);
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

    'should pass with an empty string': function (test) {

        const form = TestUtils.renderIntoDocument(<TestForm inputValue=""/>);
        const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
        test.equal(inputComponent.isValid(), true);
        test.done();

    },

    'should pass with a string without spaces': function (test) {

        const form = TestUtils.renderIntoDocument(<TestForm inputValue="foo"/>);
        const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
        test.equal(inputComponent.isValid(), true);
        test.done();

    },

    'should pass with a string with spaces': function (test) {

        const form = TestUtils.renderIntoDocument(<TestForm inputValue="foo bar"/>);
        const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
        test.equal(inputComponent.isValid(), true);
        test.done();

    },

    'should pass with an int': function (test) {

        const form = TestUtils.renderIntoDocument(<TestForm inputValue={5}/>);
        const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
        test.equal(inputComponent.isValid(), true);
        test.done();

    },

    'should fail with a whitespaces string': function (test) {

        const form = TestUtils.renderIntoDocument(<TestForm inputValue=" "/>);
        const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
        test.equal(inputComponent.isValid(), false);
        test.done();

    },

    'should fail with a tab space': function (test) {

        const form = TestUtils.renderIntoDocument(<TestForm inputValue="&#09;"/>);
        const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
        test.equal(inputComponent.isValid(), false);
        test.done();

    }
}
