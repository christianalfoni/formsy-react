var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var Formsy = require('./../src/main.js');

describe('Validation', function() {

  it('should reset only changed form element when external error is passed', function (done) {

    var onSubmit = function (model, reset, invalidate) {
      invalidate({
        foo: 'bar',
        bar: 'foo'
      });
    }
    var TestInput = React.createClass({
      mixins: [Formsy.Mixin],
      updateValue: function (event) {
        this.setValue(event.target.value);
      },
      render: function () {
        return <input value={this.getValue()} onChange={this.updateValue}/>
      }
    });
    var form = TestUtils.renderIntoDocument(
      <Formsy.Form onSubmit={onSubmit}>
        <TestInput name="foo"/>
        <TestInput name="bar"/>
      </Formsy.Form>
    );

    var input = TestUtils.scryRenderedDOMComponentsWithTag(form, 'INPUT')[0];
    var inputComponents = TestUtils.scryRenderedComponentsWithType(form, TestInput);

    form.submit();
    expect(inputComponents[0].isValid()).toBe(false);
    expect(inputComponents[1].isValid()).toBe(false);
    TestUtils.Simulate.change(input, {target: {value: 'bar'}});
    setTimeout(function () {
      expect(inputComponents[0].isValid()).toBe(true);
      expect(inputComponents[1].isValid()).toBe(false);
      done();
    }, 0);
  });

  it('should let normal validation take over when component with external error is changed', function (done) {

    var onSubmit = function (model, reset, invalidate) {
      invalidate({
        foo: 'bar'
      });
    }
    var TestInput = React.createClass({
      mixins: [Formsy.Mixin],
      updateValue: function (event) {
        this.setValue(event.target.value);
      },
      render: function () {
        return <input value={this.getValue()} onChange={this.updateValue}/>
      }
    });
    var form = TestUtils.renderIntoDocument(
      <Formsy.Form onSubmit={onSubmit}>
        <TestInput name="foo" validations="isEmail"/>
      </Formsy.Form>
    );

    var input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    var inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);

    form.submit();
    expect(inputComponent.isValid()).toBe(false);
    TestUtils.Simulate.change(input, {target: {value: 'bar'}});
    setTimeout(function () {
      expect(inputComponent.getValue()).toBe('bar');
      expect(inputComponent.isValid()).toBe(false);
      done();
    }, 0);
  });

  it('should trigger an onValid handler, if passed, when form is valid', function () {

    var onValid = jasmine.createSpy('valid');
    var TestInput = React.createClass({
      mixins: [Formsy.Mixin],
      updateValue: function (event) {
        this.setValue(event.target.value);
      },
      render: function () {
        return <input value={this.getValue()} onChange={this.updateValue}/>
      }
    });
    var form = TestUtils.renderIntoDocument(
      <Formsy.Form onValid={onValid}>
        <TestInput name="foo" required/>
      </Formsy.Form>
    );

    var input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    TestUtils.Simulate.change(input, {target: {value: 'foo'}});
    expect(onValid).toHaveBeenCalled();

  });

  it('should trigger an onInvalid handler, if passed, when form is invalid', function () {

    var onInvalid = jasmine.createSpy('invalid');
    var TestInput = React.createClass({
      mixins: [Formsy.Mixin],
      updateValue: function (event) {
        this.setValue(event.target.value);
      },
      render: function () {
        return <input value={this.getValue()} onChange={this.updateValue}/>
      }
    });
    var form = TestUtils.renderIntoDocument(
      <Formsy.Form onValid={onInvalid}>
        <TestInput name="foo" value="foo"/>
      </Formsy.Form>
    );

    var input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    TestUtils.Simulate.change(input, {target: {value: ''}});
    expect(onInvalid).toHaveBeenCalled();

  });

  it('should use provided validate function', function () {

    var isValid = jasmine.createSpy('valid');
    var TestInput = React.createClass({
      mixins: [Formsy.Mixin],
      updateValue: function (event) {
        this.setValue(event.target.value);
      },
      render: function () {
        if (this.isValid()) {
          isValid();
        }
        return <input value={this.getValue()} onChange={this.updateValue}/>
      },
      validate: function () {
        return this.getValue() === "checkValidity";
      }
    });
    var form = TestUtils.renderIntoDocument(
      <Formsy.Form>
        <TestInput name="foo" value="checkInvalidity"/>
      </Formsy.Form>
    );

    var input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    TestUtils.Simulate.change(input, {target: {value: 'checkValidity'}});
    expect(isValid).toHaveBeenCalled();

  });

  it('should provide invalidate callback on onValiSubmit', function () {

    var TestInput = React.createClass({
      mixins: [Formsy.Mixin],
      render: function () {
        return <input value={this.getValue()}/>
      }
    });
    var TestForm = React.createClass({
      invalidate: function (model, reset, invalidate) {
        invalidate({
          foo: 'bar'
        });
      },
      render: function () {
        return (
          <Formsy.Form onValidSubmit={this.invalidate}>
            <TestInput name="foo" value="foo"/>
          </Formsy.Form>
        );
      }
    });
    var form = TestUtils.renderIntoDocument(<TestForm/>);

    var formEl = TestUtils.findRenderedDOMComponentWithTag(form, 'form');
    var input = TestUtils.findRenderedComponentWithType(form, TestInput);
    TestUtils.Simulate.submit(formEl);
    expect(input.isValid()).toBe(false);

  });

  it('should provide invalidate callback on onInvalidSubmit', function () {

    var TestInput = React.createClass({
      mixins: [Formsy.Mixin],
      render: function () {
        return <input value={this.getValue()}/>
      }
    });
    var TestForm = React.createClass({
      invalidate: function (model, reset, invalidate) {
        invalidate({
          foo: 'bar'
        });
      },
      render: function () {
        return (
          <Formsy.Form onInvalidSubmit={this.invalidate}>
            <TestInput name="foo" value="foo" validations="isEmail"/>
          </Formsy.Form>
        );
      }
    });
    var form = TestUtils.renderIntoDocument(<TestForm/>);

    var formEl = TestUtils.findRenderedDOMComponentWithTag(form, 'form');
    var input = TestUtils.findRenderedComponentWithType(form, TestInput);
    TestUtils.Simulate.submit(formEl);
    expect(input.getErrorMessage()).toBe('bar');

  });

});
