import React from 'react';
import TestUtils from 'react-dom/test-utils';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import sinon from 'sinon';
import ReactDOM from 'react-dom';

import Formsy from './..';
import TestInput, { InputFactory } from './utils/TestInput';
import immediate from './utils/immediate';

export default {

  'should return passed and setValue() value when using getValue()': function (test) {

    const form = TestUtils.renderIntoDocument(
      <Formsy.Form>
        <TestInput name="foo" value="foo"/>
      </Formsy.Form>
    );

    const input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    test.equal(input.value, 'foo');
    TestUtils.Simulate.change(input, {target: {value: 'foobar'}});
    test.equal(input.value, 'foobar');

    test.done();

  },

  'should set _pristineValue to the passed value': function(test) {
    const form = TestUtils.renderIntoDocument(
      <Formsy.Form>
        <TestInput name="foo" value="foo"/>
      </Formsy.Form>
    );

    const input = TestUtils.findRenderedComponentWithType(form, TestInput);
    test.equal(input.state._pristineValue, 'foo');

    test.done();
  },

  'should set _pristineValue to the passed defaultValue': function(test) {
    const form = TestUtils.renderIntoDocument(
      <Formsy.Form>
        <TestInput name="foo" defaultValue="foo"/>
      </Formsy.Form>
    );

    const input = TestUtils.findRenderedComponentWithType(form, TestInput);
    test.equal(input.state._pristineValue, 'foo');

    test.done();
  },

  'should set _value to the passed value': function(test) {
    const form = TestUtils.renderIntoDocument(
      <Formsy.Form>
        <TestInput name="foo" value="foo"/>
      </Formsy.Form>
    );

    const input = TestUtils.findRenderedComponentWithType(form, TestInput);
    test.equal(input.state._value, 'foo');

    test.done();
  },

  'should set _value to the passed defaultValue': function(test) {
    const form = TestUtils.renderIntoDocument(
      <Formsy.Form>
        <TestInput name="foo" defaultValue="foo"/>
      </Formsy.Form>
    );

    const input = TestUtils.findRenderedComponentWithType(form, TestInput);
    test.equal(input.state._value, 'foo');

    test.done();
  },

  'should set back to pristine value when running reset': function (test) {

    let reset = null;
    const Input = InputFactory({
      componentDidMount() {
        reset = this.resetValue;
      }
    });
    const form = TestUtils.renderIntoDocument(
      <Formsy.Form>
        <Input name="foo" value="foo"/>
      </Formsy.Form>
    );

    const input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    TestUtils.Simulate.change(input, {target: {value: 'foobar'}});
    reset();
    test.equal(input.value, 'foo');

    test.done();

  },

  'should return error message passed when calling getErrorMessage()': function (test) {

    let getErrorMessage = null;
    const Input = InputFactory({
      componentDidMount() {
        getErrorMessage = this.getErrorMessage;
      }
    });
    TestUtils.renderIntoDocument(
      <Formsy.Form>
        <Input name="foo" value="foo" validations="isEmail" validationError="Has to be email"/>
      </Formsy.Form>
    );

    test.equal(getErrorMessage(), 'Has to be email');

    test.done();

  },

  'should return true or false when calling isValid() depending on valid state': function (test) {

    let isValid = null;
    const Input = InputFactory({
      componentDidMount() {
        isValid = this.isValid;
      }
    });
    const form = TestUtils.renderIntoDocument(
      <Formsy.Form url="/users">
        <Input name="foo" value="foo" validations="isEmail"/>
      </Formsy.Form>
    );

    test.equal(isValid(), false);
    const input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    TestUtils.Simulate.change(input, {target: {value: 'foo@foo.com'}});
    test.equal(isValid(), true);

    test.done();

  },

  'should return true or false when calling isRequired() depending on passed required attribute': function (test) {

    const isRequireds = [];
    const Input = InputFactory({
      componentDidMount() {
        isRequireds.push(this.isRequired);
      }
    });
    TestUtils.renderIntoDocument(
      <Formsy.Form url="/users">
        <Input name="foo" value=""/>
        <Input name="foo" value="" required/>
        <Input name="foo" value="foo" required="isLength:3"/>
      </Formsy.Form>
    );

    test.equal(isRequireds[0](), false);
    test.equal(isRequireds[1](), true);
    test.equal(isRequireds[2](), true);

    test.done();

  },

  'should return true or false when calling showRequired() depending on input being empty and required is passed, or not': function (test) {

    const showRequireds = [];
    const Input = InputFactory({
      componentDidMount() {
        showRequireds.push(this.showRequired);
      }
    });
    TestUtils.renderIntoDocument(
      <Formsy.Form url="/users">
        <Input name="A" value="foo"/>
        <Input name="B" value="" required/>
        <Input name="C" value=""/>
      </Formsy.Form>
    );

    test.equal(showRequireds[0](), false);
    test.equal(showRequireds[1](), true);
    test.equal(showRequireds[2](), false);

    test.done();

  },

  'should return true or false when calling isPristine() depending on input has been "touched" or not': function (test) {

    let isPristine = null;
    const Input = InputFactory({
      componentDidMount() {
        isPristine = this.isPristine;
      }
    });
    const form = TestUtils.renderIntoDocument(
      <Formsy.Form url="/users">
        <Input name="A" value="foo"/>
      </Formsy.Form>
    );

    test.equal(isPristine(), true);
    const input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    TestUtils.Simulate.change(input, {target: {value: 'foo'}});
    test.equal(isPristine(), false);

    test.done();

  },

  'should allow an undefined value to be updated to a value': function (test) {
    class TestForm extends React.Component {
      state = {value: undefined};

      changeValue = () => {
        this.setState({
          value: 'foo'
        });
      };

      render() {
        return (
          <Formsy.Form url="/users">
            <TestInput name="A" value={this.state.value}/>
          </Formsy.Form>
        );
      }
    }

    const form = TestUtils.renderIntoDocument(<TestForm/>);

    form.changeValue();
    const input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    immediate(() => {
      test.equal(input.value, 'foo');
      test.done();
    });
  },

  'should be able to test a values validity': function (test) {
    class TestForm extends React.Component {
      render() {
        return (
          <Formsy.Form>
            <TestInput name="A" validations="isEmail"/>
          </Formsy.Form>
        );
      }
    }

    const form = TestUtils.renderIntoDocument(<TestForm/>);

    const input = TestUtils.findRenderedComponentWithType(form, TestInput);
    test.equal(input.isValidValue('foo@bar.com'), true);
    test.equal(input.isValidValue('foo@bar'), false);
    test.done();
  },

  'should be able to use an object as validations property': function (test) {
    class TestForm extends React.Component {
      render() {
        return (
          <Formsy.Form>
            <TestInput name="A" validations={{
              isEmail: true
            }}/>
          </Formsy.Form>
        );
      }
    }

    const form = TestUtils.renderIntoDocument(<TestForm/>);

    const input = TestUtils.findRenderedComponentWithType(form, TestInput);
    test.equal(input.isValidValue('foo@bar.com'), true);
    test.equal(input.isValidValue('foo@bar'), false);

    test.done();
  },

  'should be able to pass complex values to a validation rule': function (test) {
    class TestForm extends React.Component {
      render() {
        return (
          <Formsy.Form>
            <TestInput name="A" validations={{
              matchRegexp: /foo/
            }} value="foo"/>
          </Formsy.Form>
        );
      }
    }

    const form = TestUtils.renderIntoDocument(<TestForm/>);

    const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
    test.equal(inputComponent.isValid(), true);
    const input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    TestUtils.Simulate.change(input, {target: {value: 'bar'}});
    test.equal(inputComponent.isValid(), false);

    test.done();
  },

  'should be able to run a function to validate': function (test) {
    class TestForm extends React.Component {
      customValidationA = (values, value) => {
        return value === 'foo';
      };

      customValidationB = (values, value) => {
        return value === 'foo' && values.A === 'foo';
      };

      render() {
        return (
          <Formsy.Form>
            <TestInput name="A" validations={{
              custom: this.customValidationA
            }} value="foo"/>
            <TestInput name="B" validations={{
              custom: this.customValidationB
            }} value="foo"/>
          </Formsy.Form>
        );
      }
    }

    const form = TestUtils.renderIntoDocument(<TestForm/>);

    const inputComponent = TestUtils.scryRenderedComponentsWithType(form, TestInput);
    test.equal(inputComponent[0].isValid(), true);
    test.equal(inputComponent[1].isValid(), true);
    const input = TestUtils.scryRenderedDOMComponentsWithTag(form, 'INPUT');
    TestUtils.Simulate.change(input[0], {target: {value: 'bar'}});
    test.equal(inputComponent[0].isValid(), false);
    test.equal(inputComponent[1].isValid(), false);

    test.done();
  },

  'should not override error messages with error messages passed by form if passed eror messages is an empty object': function (test) {
    class TestForm extends React.Component {
      render() {
        return (
          <Formsy.Form validationErrors={{}}>
            <TestInput name="A" validations={{
              isEmail: true
            }} validationError="bar2" validationErrors={{isEmail: 'bar3'}} value="foo"/>
          </Formsy.Form>
        );
      }
    }

    const form = TestUtils.renderIntoDocument(<TestForm/>);

    const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
    test.equal(inputComponent.getErrorMessage(), 'bar3');

    test.done();
  },


  'should override all error messages with error messages passed by form': function (test) {
    class TestForm extends React.Component {
      render() {
        return (
          <Formsy.Form validationErrors={{A: 'bar'}}>
            <TestInput name="A" validations={{
              isEmail: true
            }} validationError="bar2" validationErrors={{isEmail: 'bar3'}} value="foo"/>
          </Formsy.Form>
        );
      }
    }

    const form = TestUtils.renderIntoDocument(<TestForm/>);

    const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
    test.equal(inputComponent.getErrorMessage(), 'bar');

    test.done();
  },

  'should override validation rules with required rules': function (test) {
    class TestForm extends React.Component {
      render() {
        return (
          <Formsy.Form>
            <TestInput name="A"
              validations={{
                isEmail: true
              }}
              validationError="bar"
              validationErrors={{isEmail: 'bar2', isLength: 'bar3'}}
              value="f"
              required={{
                isLength: 1
              }}
            />
          </Formsy.Form>
        );
      }
    }

    const form = TestUtils.renderIntoDocument(<TestForm/>);

    const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
    test.equal(inputComponent.getErrorMessage(), 'bar3');

    test.done();
  },

  'should fall back to default error message when non exist in validationErrors map': function (test) {
    class TestForm extends React.Component {
      render() {
        return (
          <Formsy.Form>
            <TestInput name="A"
              validations={{
                isEmail: true
              }}
              validationError="bar"
              validationErrors={{foo: 'bar'}}
              value="foo"
            />
          </Formsy.Form>
        );
      }
    }

    const form = TestUtils.renderIntoDocument(<TestForm/>);

    const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
    test.equal(inputComponent.getErrorMessage(), 'bar');

    test.done();
  },

  'should not be valid if it is required and required rule is true': function (test) {
    class TestForm extends React.Component {
      render() {
        return (
          <Formsy.Form>
            <TestInput name="A"
            required
            />
          </Formsy.Form>
        );
      }
    }

    const form = TestUtils.renderIntoDocument(<TestForm/>);

    const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput);
    test.equal(inputComponent.isValid(), false);

    test.done();
  },

  'should handle objects and arrays as values': function (test) {
    class TestForm extends React.Component {
      state = {
        foo: {foo: 'bar'},
        bar: ['foo']
      };

      render() {
        return (
          <Formsy.Form>
            <TestInput name="foo" value={this.state.foo}/>
            <TestInput name="bar" value={this.state.bar}/>
          </Formsy.Form>
        );
      }
    }

    const form = TestUtils.renderIntoDocument(<TestForm/>);

    form.setState({
      foo: {foo: 'foo'},
      bar: ['bar']
    });

    const inputs = TestUtils.scryRenderedComponentsWithType(form, TestInput);
    test.deepEqual(inputs[0].getValue(), {foo: 'foo'});
    test.deepEqual(inputs[1].getValue(), ['bar']);

    test.done();
  },

  'should handle isFormDisabled with dynamic inputs': function (test) {
    class TestForm extends React.Component {
      state = {
        bool: true
      };

      flip = () => {
        this.setState({
          bool: !this.state.bool
        });
      };

      render() {
        return (
          <Formsy.Form disabled={this.state.bool}>
            {this.state.bool ?
              <TestInput name="foo" /> :
              <TestInput name="bar" />
            }
          </Formsy.Form>
        );
      }
    }

    const form = TestUtils.renderIntoDocument(<TestForm/>);

    const input = TestUtils.findRenderedComponentWithType(form, TestInput);
    test.equal(input.isFormDisabled(), true);
    form.flip();
    test.equal(input.isFormDisabled(), false);

    test.done();
  },

  'should allow for dot notation in name which maps to a deep object': function (test) {
    class TestForm extends React.Component {
      onSubmit = model => {
        test.deepEqual(model, {foo: {bar: 'foo', test: 'test'}});
      };

      render() {
        return (
          <Formsy.Form onSubmit={this.onSubmit}>
            <TestInput name="foo.bar" value="foo"/>
            <TestInput name="foo.test" value="test"/>
          </Formsy.Form>
        );
      }
    }

    const form = TestUtils.renderIntoDocument(<TestForm/>);

    test.expect(1);

    const formEl = TestUtils.findRenderedDOMComponentWithTag(form, 'form');
    TestUtils.Simulate.submit(formEl);

    test.done();
  },

  'should allow for application/x-www-form-urlencoded syntax and convert to object': function (test) {
    class TestForm extends React.Component {
      onSubmit = model => {
        test.deepEqual(model, {foo: ['foo', 'bar']});
      };

      render() {
        return (
          <Formsy.Form onSubmit={this.onSubmit}>
            <TestInput name="foo[0]" value="foo"/>
            <TestInput name="foo[1]" value="bar"/>
          </Formsy.Form>
        );
      }
    }

    const form = TestUtils.renderIntoDocument(<TestForm/>);

    test.expect(1);

    const formEl = TestUtils.findRenderedDOMComponentWithTag(form, 'form');
    TestUtils.Simulate.submit(formEl);

    test.done();
  },

  'input should rendered once with PureRenderMixin': function (test) {

    var renderSpy = sinon.spy();

    const Input = InputFactory({
      mixins: [Formsy.Mixin, PureRenderMixin],
      render() {
        renderSpy();
        return <input type={this.props.type} value={this.getValue()} onChange={this.updateValue}/>;
      }
    });

    const form = TestUtils.renderIntoDocument(
      <Formsy.Form>
        <Input name="foo" value="foo"/>
      </Formsy.Form>
    );

    test.equal(renderSpy.calledOnce, true);

    test.done();

  },

  'should not render the form when passed `skipFormRender`': function(test) {
    class TestForm extends React.Component {
      onSubmit = model => {
        test.deepEqual(model, {foo: ['foo', 'bar']});
      };

      render() {
        return (
          <div>
            <Formsy.Form onSubmit={this.onSubmit} skipFormRender>
              <TestInput name="foo[0]" value="foo"/>
              <TestInput name="foo[1]" value="bar"/>
            </Formsy.Form>
          </div>
        );
      }
    }

    const form = TestUtils.renderIntoDocument(<TestForm/>);
    test.equal(ReactDOM.findDOMNode(form).getElementsByTagName("form").length, 0);

    test.done();
  }

};
