import React from 'react';
import TestUtils from 'react-addons-test-utils';

import Formsy from './..';
import { customizeInput } from './utils/TestInput';

describe('Rules: isAlphanumeric', function () {
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

    form = TestUtils.renderIntoDocument(
      <Formsy.Form>
        <Input name="foo" validations="isAlphanumeric"/>
      </Formsy.Form>
    );

    input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');

  });

  afterEach(() => {
    Input = isValid = form = null;
  });

  it('should pass with a default value', pass());

  it('should pass with a string is only latin letters', pass('myValue'));

  it('should pass with a string with numbers', pass('myValue42'));

  it('should pass with an undefined', pass(undefined));

  it('should pass with a null', pass(null));

  it('should pass with an empty string', pass(''));

  it('should pass with a number', pass(42));

  it('should fail with a non alpha and number symbols', fail('!@#$%^&*()'));

});
