import React from 'react';
import TestUtils from 'react-addons-test-utils';

import Formsy from './..';
import { customizeInput } from './utils/TestInput';

describe('Rules: isNumeric', function () {
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
        <Input name="foo" validations="isNumeric"/>
      </Formsy.Form>
    );

    input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');

  });

  afterEach(() => {
    Input = isValid = form = null;
  });

  it('should pass with a default value', pass());

  it('should pass with an empty string', pass(''));

  it('should fail with an unempty string', fail('myValue'));

  it('should pass with a number as string', pass('+42'));

  it('should fail with a number as string with not digits', fail('42 as an answer'));

  it('should pass with an int', pass(42));

  it('should pass with a float', pass(Math.PI));

  it('should pass with an undefined', pass(undefined));

  it('should pass with a null', pass(null));

  it('should pass with a zero', pass(0));

});
