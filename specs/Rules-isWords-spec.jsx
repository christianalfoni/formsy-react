var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var Formsy = require('./../src/main.js');

describe('Rules: isWords', function() {
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
        <TestInput name="foo" validations="isWords"/>
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

  it('should fail with a number', function () {
    expect(isValid).not.toHaveBeenCalled();
    TestUtils.Simulate.change(input, {target: {value: 123}});
    expect(isValid).not.toHaveBeenCalled();
  });

  it('should pass with a 1 word', function () {
    expect(isValid).not.toHaveBeenCalled();
    TestUtils.Simulate.change(input, {target: {value: 'sup'}});
    expect(isValid).toHaveBeenCalled();
  });

  it('should pass with 2 words', function () {
    expect(isValid).not.toHaveBeenCalled();
    TestUtils.Simulate.change(input, {target: {value: 'sup dude'}});
    expect(isValid).toHaveBeenCalled();
  });

});
