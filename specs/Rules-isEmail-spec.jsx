var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var Formsy = require('./../src/main.js');

describe('Rules: isEmail', function() {
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
        <TestInput name="foo" value="foo" validations="isEmail"/>
      </Formsy.Form>
    );

    input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');

  });

  afterEach(function() {
    TestInput = isValid = isInvalid = form = null;
  });

  it('should pass with a default value', pass());

  it('should fail with "foo"', fail('foo'));

  it('should pass with "foo@foo.com"', pass('foo@foo.com'));

  it('should pass with an undefined', pass(undefined));

  it('should pass with a null', pass(null));

  it('should pass with an empty string', pass(''));

  it('should fail with a number', fail(42));

});
