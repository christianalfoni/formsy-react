var Formsy = require('./../src/main.js');

describe('Validation', function() {

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

  it('should not trigger an onInvalid handler, if passed, when form is already invalid', function () {

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
      <Formsy.Form onInvalid={onInvalid}>
        <TestInput name="foo" value="foo"/>
      </Formsy.Form>
    );

    var input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    TestUtils.Simulate.change(input, {target: {value: ''}});
    expect(onInvalid).not.toHaveBeenCalled();

  });

  it('should trigger an onInvalid handler, if passed, when form becomes invalid', function () {

    var onValid = jasmine.createSpy('valid');
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
      <Formsy.Form onValid={onValid} onInvalid={onInvalid}>
        <TestInput name="foo" required/>
      </Formsy.Form>
    );

    var input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    TestUtils.Simulate.change(input, {target: {value: 'foo'}});
    expect(onValid).toHaveBeenCalled();
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

  it('RULE: isEmail', function () {

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
      }
    });
    var form = TestUtils.renderIntoDocument(
      <Formsy.Form>
        <TestInput name="foo" value="foo" validations="isEmail"/>
      </Formsy.Form>
    );

    var input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    expect(isValid).not.toHaveBeenCalled();
    TestUtils.Simulate.change(input, {target: {value: 'foo@foo.com'}});
    expect(isValid).toHaveBeenCalled();

  });

  it('RULE: isNumeric', function () {

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
      }
    });
    var form = TestUtils.renderIntoDocument(
      <Formsy.Form>
        <TestInput name="foo" value="foo" validations="isNumeric"/>
      </Formsy.Form>
    );

    var input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    expect(isValid).not.toHaveBeenCalled();
    TestUtils.Simulate.change(input, {target: {value: '123'}});
    expect(isValid).toHaveBeenCalled();

  });

  it('RULE: isNumeric (actual number)', function () {

    var isValid = jasmine.createSpy('valid');
    var TestInput = React.createClass({
      mixins: [Formsy.Mixin],
      updateValue: function (event) {
        this.setValue(Number(event.target.value));
      },
      render: function () {
        if (this.isValid()) {
          isValid();
        }
        return <input value={this.getValue()} onChange={this.updateValue}/>
      }
    });
    var form = TestUtils.renderIntoDocument(
      <Formsy.Form>
        <TestInput name="foo" value="foo" validations="isNumeric"/>
      </Formsy.Form>
    );

    var input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    expect(isValid).not.toHaveBeenCalled();
    TestUtils.Simulate.change(input, {target: {value: '123'}});
    expect(isValid).toHaveBeenCalled();

  });

  it('RULE: isNumeric (string representation of a float)', function () {

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
      }
    });
    var form = TestUtils.renderIntoDocument(
      <Formsy.Form>
        <TestInput name="foo" value="foo" validations="isNumeric"/>
      </Formsy.Form>
    );

    var input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    expect(isValid).not.toHaveBeenCalled();
    TestUtils.Simulate.change(input, {target: {value: '1.5'}});
    expect(isValid).toHaveBeenCalled();

  });

  it('RULE: isNumeric is false (string representation of an invalid float)', function () {

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
      }
    });
    var form = TestUtils.renderIntoDocument(
      <Formsy.Form>
        <TestInput name="foo" value="foo" validations="isNumeric"/>
      </Formsy.Form>
    );

    var input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    expect(isValid).not.toHaveBeenCalled();
    TestUtils.Simulate.change(input, {target: {value: '1.'}});
    expect(isValid).not.toHaveBeenCalled();

  });

  it('RULE: equalsField', function () {

    var TestInput = React.createClass({
      mixins: [Formsy.Mixin],
      render: function () {
        return <input value={this.getValue()}/>
      }
    });
    var form = TestUtils.renderIntoDocument(
      <Formsy.Form>
        <TestInput name="foo" value="foo" validations="equalsField:bar"/>
        <TestInput name="bar" value="foo" validations="equalsField:foobar"/>
        <TestInput name="foobar" value="bar"/>
      </Formsy.Form>
    );

    var input = TestUtils.scryRenderedComponentsWithType(form, TestInput);
    expect(input[0].isValid()).toBe(true);
    expect(input[1].isValid()).toBe(false);

  });

});
