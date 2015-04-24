var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var Formsy = require('./../src/main.js');

describe('Rules: equals', function() {
  var TestInput, isValid, form, input;

  beforeEach(function() {
    isValid = jasmine.createSpy('valid');

    TestInput = React.createClass({
      mixins: [Formsy.Mixin],
      updateValue: function (event) {
        this.setValue(event.target.value);
      },
      render: function () {
        if (this.isValid()) {
          isValid();
        }
        return <input value={this.getValue()} onChange={this.updateValue}/>
      }
    });

    form = TestUtils.renderIntoDocument(
      <Formsy.Form>
        <TestInput name="foo" validations="equals:myValue"/>
      </Formsy.Form>
    );

    input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');

  });

  afterEach(function() {
    TestInput = isValid = isInvalid = form = null;
  });

  it('should fail with undefined', function () {
    expect(isValid).not.toHaveBeenCalled();
    TestUtils.Simulate.change(input, {target: {value: undefined}});
    expect(isValid).not.toHaveBeenCalled();
  });

  it('should fail with null', function () {
    expect(isValid).not.toHaveBeenCalled();
    TestUtils.Simulate.change(input, {target: {value: null}});
    expect(isValid).not.toHaveBeenCalled();
  });

  it('should fail when the value is not equal', function () {
    expect(isValid).not.toHaveBeenCalled();
    TestUtils.Simulate.change(input, {target: {value: 'foo'}});
    expect(isValid).not.toHaveBeenCalled();
  });

  it('should pass when the value is equal', function () {
    expect(isValid).not.toHaveBeenCalled();
    TestUtils.Simulate.change(input, {target: {value: 'myValue'}});
    expect(isValid).toHaveBeenCalled();
  });

});
