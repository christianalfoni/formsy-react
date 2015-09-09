import React from 'react';
import TestUtils from 'react-addons-test-utils';

import Formsy from './..';
import { customizeInput } from './utils/TestInput';

describe('Rules: isLength', function () {
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

  describe('isLength:3', () => {

    beforeEach(() => {
      form = TestUtils.renderIntoDocument(
        <Formsy.Form>
          <Input name="foo" validations="isLength:3"/>
        </Formsy.Form>
      );

      input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    });

    it('should pass with a default value', pass());

    it('should fail with a string too small', fail('hi'));

    it('should fail with a string too long', fail('foo bar'));

    it('should pass with the right length', pass('sup'));

    it('should pass with an undefined', pass(undefined));

    it('should pass with a null', pass(null));

    it('should pass with an empty string', pass(''));

    it('should fail with a number', fail(123));

  });

  describe('isLength:0', () => {

    beforeEach(() => {
      form = TestUtils.renderIntoDocument(
        <Formsy.Form>
          <Input name="foo" validations="isLength:0"/>
        </Formsy.Form>
      );

      input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    });

    it('should pass with a default value', pass());

    it('should fail with a string too long', fail('foo bar'));

    it('should pass with an undefined', pass(undefined));

    it('should pass with a null', pass(null));

    it('should pass with an empty string', pass(''));

    it('should fail with a number', fail(123));

  });

});
