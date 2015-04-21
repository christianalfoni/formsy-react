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

  describe('RULE: isNumeric (text input)', function() {
    var isValid, changeInput;

    beforeEach(function() {
      isValid = false;

      var TestInput = React.createClass({
        mixins: [Formsy.Mixin],
        updateValue: function (event) {
          this.setValue(event.target.value);
        },
        render: function () {
          isValid = this.isValid();
          return <input value={this.getValue()} onChange={this.updateValue}/>
        }
      });

      var form = TestUtils.renderIntoDocument(
        <Formsy.Form>
          <TestInput name="foo" value="" validations="isNumeric"/>
        </Formsy.Form>
      );

      var input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');

      changeInput = function(value) {
        TestUtils.Simulate.change(input, {target: {value: value}});
      }
    });

    it('empty value', function () {
      expect(isValid).toBe(true);
      changeInput('');
      expect(isValid).toBe(true);
    });

    it('valid integer', function () {
      changeInput('123');
      expect(isValid).toBe(true);
      changeInput('-123');
      expect(isValid).toBe(true);
      changeInput('+123');
      expect(isValid).toBe(true);
    });

    it('non-integer string', function () {
      changeInput('abc');
      expect(isValid).toBe(false);
      changeInput('two');
      expect(isValid).toBe(false);
    });

    it('ignores surrounding whitespace', function () {
      changeInput('  123  ');
      expect(isValid).toBe(true);
      changeInput('\t123\n');
      expect(isValid).toBe(true);
    });

    it('string representation of a float', function () {
      changeInput('1.5');
      expect(isValid).toBe(true);
      changeInput('0.5');
      expect(isValid).toBe(true);
      changeInput('.5');
      expect(isValid).toBe(true);
    });

    it('string representation of an invalid float', function () {
      changeInput('1.');
      expect(isValid).toBe(false);
    });
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
