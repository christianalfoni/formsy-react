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

        const form = TestUtils.renderIntoDocument(<TestForm rule="betweenNumbers:[1,12]"/>);
        const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
        test.equal(inputComponent.isValid(), true);
        test.done();

    },

    'should pass with an undefined': function (test) {

        const form = TestUtils.renderIntoDocument(<TestForm rule="betweenNumbers:[1,12]" inputValue={undefined}/>);
        const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
        test.equal(inputComponent.isValid(), true);
        test.done();

    },

    'should pass with a null': function (test) {

        const form = TestUtils.renderIntoDocument(<TestForm rule="betweenNumbers:[1,12]" inputValue={null}/>);
        const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
        test.equal(inputComponent.isValid(), true);
        test.done();

    },

    'should pass with an empty string': function (test) {

        const form = TestUtils.renderIntoDocument(<TestForm rule="betweenNumbers:[1,12]" inputValue=""/>);
        const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
        test.equal(inputComponent.isValid(), true);
        test.done();

    },

    'should pass with number 5 between 1 and 12': function (test) {

        const form = TestUtils.renderIntoDocument(<TestForm rule="betweenNumbers:[1,12]" inputValue="5"/>);
        const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
        test.equal(inputComponent.isValid(), true);
        test.done();

    },

    'should pass with number 1 between 1 and 12': function (test) {

        const form = TestUtils.renderIntoDocument(<TestForm rule="betweenNumbers:[1,12]" inputValue="1"/>);
        const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
        test.equal(inputComponent.isValid(), true);
        test.done();

    },

    'should fail with number 13 between 1 and 12': function (test) {

        const form = TestUtils.renderIntoDocument(<TestForm rule="betweenNumbers:[1,12]" inputValue="13"/>);
        const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
        test.equal(inputComponent.isValid(), false);
        test.done();

    },

    'should pass with number -2 between -12 and -1': function (test) {

        const form = TestUtils.renderIntoDocument(<TestForm rule="betweenNumbers:[-12,-1]" inputValue="-2"/>);
        const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
        test.equal(inputComponent.isValid(), true);
        test.done();

    },

    'should fail with number -16 between -1 and -12': function (test) {

        const form = TestUtils.renderIntoDocument(<TestForm rule="betweenNumbers:[-1,-12]" inputValue="-16"/>);
        const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
        test.equal(inputComponent.isValid(), false);
        test.done();

    },

    'should fail with string a between 1 and 12': function (test) {

        const form = TestUtils.renderIntoDocument(<TestForm rule="betweenNumbers:[1,12]" inputValue="a"/>);
        const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
        test.equal(inputComponent.isValid(), false);
        test.done();

    }

}
