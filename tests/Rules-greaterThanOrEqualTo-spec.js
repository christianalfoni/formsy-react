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
                <TestInput name="foo" validations={this.props.rule} value={this.props.inputValue}/>
            </Formsy.Form>
        );
    }
});

export default {

    'should pass with a default value': function (test) {

        const form = TestUtils.renderIntoDocument(<TestForm rule="greaterThanOrEqualTo:5"/>);
        const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
        test.equal(inputComponent.isValid(), true);
        test.done();

    },

    'should pass with an undefined': function (test) {

        const form = TestUtils.renderIntoDocument(<TestForm rule="greaterThanOrEqualTo:5" inputValue={undefined}/>);
        const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
        test.equal(inputComponent.isValid(), true);
        test.done();

    },

    'should pass with a null': function (test) {

        const form = TestUtils.renderIntoDocument(<TestForm rule="greaterThanOrEqualTo:5" inputValue={null}/>);
        const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
        test.equal(inputComponent.isValid(), true);
        test.done();

    },

    'should pass with an empty string': function (test) {

        const form = TestUtils.renderIntoDocument(<TestForm rule="greaterThanOrEqualTo:5" inputValue=""/>);
        const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
        test.equal(inputComponent.isValid(), true);
        test.done();

    },

    'should pass with string 10 >= 5': function (test) {

        const form = TestUtils.renderIntoDocument(<TestForm rule="greaterThanOrEqualTo:5" inputValue="10"/>);
        const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
        test.equal(inputComponent.isValid(), true);
        test.done();

    },

    'should pass with number 7 >= 5': function (test) {

        const form = TestUtils.renderIntoDocument(<TestForm rule="greaterThanOrEqualTo:5" inputValue={7}/>);
        const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
        test.equal(inputComponent.isValid(), true);
        test.done();

    },

    'should fail with 1 >= 5': function (test) {

        const form = TestUtils.renderIntoDocument(<TestForm rule="greaterThanOrEqualTo:5" inputValue="1"/>);
        const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
        test.equal(inputComponent.isValid(), false);
        test.done();

    },

    'should pass with number 5 >= 5': function (test) {

        const form = TestUtils.renderIntoDocument(<TestForm rule="greaterThanOrEqualTo:5" inputValue="5"/>);
        const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
        test.equal(inputComponent.isValid(), true);
        test.done();

    },

    'should pass with number -1 >= -5': function (test) {

        const form = TestUtils.renderIntoDocument(<TestForm rule="greaterThanOrEqualTo:-5" inputValue="-1"/>);
        const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
        test.equal(inputComponent.isValid(), true);
        test.done();

    },

    'should fail with number -5 >= -1': function (test) {

        const form = TestUtils.renderIntoDocument(<TestForm rule="greaterThanOrEqualTo:-1" inputValue="-5"/>);
        const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
        test.equal(inputComponent.isValid(), false);
        test.done();

    },

    'should fail with string': function (test) {

        const form = TestUtils.renderIntoDocument(<TestForm rule="greaterThanOrEqualTo:5" inputValue="foo"/>);
        const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
        test.equal(inputComponent.isValid(), false);
        test.done();

    }

}
