var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var Formsy = require('./../src/main.js');

describe('Rules: isNumeric', function() {
  var TestInput, isValid, form, input;

  function pass(value) {
    return pass.length ? function () {
      TestUtils.Simulate.change(input, {target: {value: value}});
      expect(isValid).toBe(true);
    } : function () { expect(isValid).toBe(true); };
  }

  function fail(value) {
    return fail.length ? function () {
      TestUtils.Simulate.change(input, {target: {value: value}});
      expect(isValid).toBe(false);
    } : function () { expect(isValid).toBe(false); };
  }

  beforeEach(function() {
    TestInput = React.createClass({
      mixins: [Formsy.Mixin],
      updateValue: function (event) {
        this.setValue(event.target.value);
      },
      render: function () {
        isValid = this.isValid();
        return <input value={this.getValue()} onChange={this.updateValue}/>
      }
    });

    form = TestUtils.renderIntoDocument(
      <Formsy.Form>
        <TestInput name="foo" validations="isNumeric"/>
      </Formsy.Form>
    );

    input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');

  });

  afterEach(function() {
    TestInput = isValid = isInvalid = form = null;
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
