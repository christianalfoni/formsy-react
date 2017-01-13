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
                <TestInput name="foo" validations="isCreditCardNumber" value={this.props.inputValue}/>
            </Formsy.Form>
        );
    }
});

export default {
    'should fail with a default value': function (test) {

        const form = TestUtils.renderIntoDocument(<TestForm/>);
        const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
        test.equal(inputComponent.isValid(), false);
        test.done();

    },

    'should fail with an undefined': function (test) {

        const form = TestUtils.renderIntoDocument(<TestForm inputValue={undefined}/>);
        const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
        test.equal(inputComponent.isValid(), false);
        test.done();

    },

    'should fail with an empty string': function (test) {

        const form = TestUtils.renderIntoDocument(<TestForm inputValue=""/>);
        const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
        test.equal(inputComponent.isValid(), false);
        test.done();

    },

    'should fail with a non credit card number': function (test) {

        const form = TestUtils.renderIntoDocument(<TestForm inputValue="1234567890123456"/>);
        const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
        test.equal(inputComponent.isValid(), false);
        test.done();

    },

    'should fail with a short length number': function (test) {

        const form = TestUtils.renderIntoDocument(<TestForm inputValue="1111111"/>);
        const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
        test.equal(inputComponent.isValid(), false);
        test.done();

    },

    'should pass with a valid Master Card credit card number': function (test) {

        const form = TestUtils.renderIntoDocument(<TestForm inputValue="5555555555554444"/>);
        const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
        test.equal(inputComponent.isValid(), true);
        test.done();

    },

    'should pass with a valid Visa credit card number': function (test) {

        const form = TestUtils.renderIntoDocument(<TestForm inputValue="4111111111111111"/>);
        const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
        test.equal(inputComponent.isValid(), true);
        test.done();

    },

    'should pass with a valid Diners credit card number': function (test) {

        const form = TestUtils.renderIntoDocument(<TestForm inputValue={30569309025904}/>);
        const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
        test.equal(inputComponent.isValid(), true);
        test.done();

    }
}
