import React from 'react';
import TestUtils from 'react-addons-test-utils';

import Formsy from './..';
import { customizeInput } from './utils/TestInput';

describe('Rules: minLength', function () {
  let Input, isValid, form, input;

  function pass(value) {
    return pass.length ? () => {
      TestUtils.Simulate.change(input, {target: {value}});
      expect(isValid).toBe(true);
    } : () => expect(isValid).toBe(true);
  }

  function fail(value) {
    return fail.length ? () => {
      TestUtils.Simulate.change(input, {target: {value}});
      expect(isValid).toBe(false);
    } : () => expect(isValid).toBe(false);
  }

  beforeEach(() => {
    Input = customizeInput({
      render() {
        isValid = this.isValid();
        return <input value={this.getValue()} onChange={this.updateValue}/>;
      }
    });
  });

  afterEach(() => {
    Input = isValid = form = null;
  });

  describe('minLength:3', function () {

    beforeEach(() => {
      form = TestUtils.renderIntoDocument(
        <Formsy.Form>
          <Input name="foo" validations="minLength:3"/>
        </Formsy.Form>
      );

      input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    });

    it('should pass with a default value', pass());

    it('should fail when a string\'s length is smaller', fail('hi'));

    it('should pass when a string\'s length is equal', pass('bar'));

    it('should pass when a string\'s length is bigger', pass('myValue'));

    it('should pass with an empty string', pass(''));

    it('should pass with an undefined', pass(undefined));

    it('should pass with a null', pass(null));

    it('should fail with a number', fail(123));

  });

  describe('minLength:0', () => {

    beforeEach(() => {
      form = TestUtils.renderIntoDocument(
        <Formsy.Form>
          <Input name="foo" validations="minLength:0"/>
        </Formsy.Form>
      );

      input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    });

    it('should pass with a default value', pass());

    it('should pass when a string\'s length is bigger', pass('myValue'));

    it('should pass with empty string', pass(''));

    it('should pass with undefined', pass(undefined));

    it('should pass with null', pass(null));

    it('should fail with a number', fail(123));

  });

});
