import React from 'react';
import TestUtils from 'react-addons-test-utils';

import Formsy from './..';
import { customizeInput } from './utils/TestInput';

describe('Rules: isExisty', function () {
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
        <Input name="foo" validations="isExisty"/>
      </Formsy.Form>
    );

    input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');

  });

  afterEach(() => {
    Input = isValid = form = null;
  });

  it('should fail with a default value', fail());

  it('should pass with a string', pass('myValue'));

  it('should pass with an empty string', pass(''));

  it('should fail with an undefined', fail(undefined));

  it('should fail with a null', fail(null));

  it('should pass with a number', pass(42));

  it('should pass with a zero', pass(0));

});
