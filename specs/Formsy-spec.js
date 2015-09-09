import React from 'react';
import TestUtils from 'react-addons-test-utils';

import Formsy from './..';
import TestInput from './utils/TestInput';
import immediate from './utils/immediate';

describe('Formsy', function () {

  describe('Setting up a form', function () {

    it('should render a form into the document', function () {
      const form = TestUtils.renderIntoDocument(<Formsy.Form></Formsy.Form>);
      expect(React.findDOMNode(form).tagName).toEqual('FORM');
    });

    it('should set a class name if passed', function () {
      const form = TestUtils.renderIntoDocument( <Formsy.Form className="foo"></Formsy.Form>);
      expect(React.findDOMNode(form).className).toEqual('foo');
    });

    it('should allow for null/undefined children', function (done) {

      let model = null;
      const TestForm = React.createClass({
        render() {
          return (
            <Formsy.Form onSubmit={(formModel) => (model = formModel)}>
              <h1>Test</h1>
              { null }
              { undefined }
              <TestInput name="name" value={ 'foo' } />
            </Formsy.Form>
          );
        }
      });

      const form = TestUtils.renderIntoDocument(<TestForm/>);
      immediate(() => {
        TestUtils.Simulate.submit(React.findDOMNode(form));
        expect(model).toEqual({name: 'foo'});
        done();
      });

    });

    it('should allow for inputs being added dynamically', function (done) {

      const inputs = [];
      let forceUpdate = null;
      let model = null;
      const TestForm = React.createClass({
        componentWillMount() {
          forceUpdate = this.forceUpdate.bind(this);
        },
        render() {
          return (
            <Formsy.Form onSubmit={(formModel) => (model = formModel)}>
              {inputs}
            </Formsy.Form>);
        }
      });
      const form = TestUtils.renderIntoDocument(<TestForm/>);

      // Wait before adding the input
      setTimeout(() => {
        inputs.push(<TestInput name="test" value="" key={inputs.length}/>);

        forceUpdate(() => {
          // Wait for next event loop, as that does the form
          immediate(() => {
            TestUtils.Simulate.submit(React.findDOMNode(form));
            expect(model.test).toBeDefined();
            done();
          });

        });

      }, 10);

    });

    it('should allow dynamically added inputs to update the form-model', function (done) {

      const inputs = [];
      let forceUpdate = null;
      let model = null;
      const TestForm = React.createClass({
        componentWillMount() {
          forceUpdate = this.forceUpdate.bind(this);
        },
        render() {
          return (
            <Formsy.Form onSubmit={(formModel) => (model = formModel)}>
              {inputs}
            </Formsy.Form>);
        }
      });
      const form = TestUtils.renderIntoDocument(<TestForm/>);

      // Wait before adding the input
      immediate(() => {
        inputs.push(<TestInput name="test" key={inputs.length}/>);

        forceUpdate(() => {

          // Wait for next event loop, as that does the form
          immediate(() => {
            TestUtils.Simulate.change(TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT'), {target: {value: 'foo'}});
            TestUtils.Simulate.submit(React.findDOMNode(form));
            expect(model.test).toBe('foo');
            done();
          });

        });

      });

    });

    it('should allow a dynamically updated input to update the form-model', function (done) {

      let forceUpdate = null;
      let model = null;

      const TestForm = React.createClass({
        componentWillMount() {
          forceUpdate = this.forceUpdate.bind(this);
        },
        render() {
          const input = <TestInput name="test" value={this.props.value} />;

          return (
            <Formsy.Form onSubmit={(formModel) => (model = formModel)}>
              {input}
            </Formsy.Form>);
        }
      });
      let form = TestUtils.renderIntoDocument(<TestForm value="foo"/>);

      // Wait before changing the input
      immediate(() => {
        form = TestUtils.renderIntoDocument(<TestForm value="bar"/>);

        forceUpdate(() => {
          // Wait for next event loop, as that does the form
          immediate(() => {
            TestUtils.Simulate.submit(React.findDOMNode(form));
            expect(model.test).toBe('bar');
            done();
          });

        });

      });

    });

    describe('validations', function () {
      let CheckValid, onSubmit, OtherCheckValid;
      let isValid;

      const TestForm = React.createClass({
        getDefaultProps() {
          return { inputs: [] };
        },
        render() {
          const builtInputs = this.props.inputs.map((input) => <TestInput { ...input } key={ input.name } />);
          return (
            <Formsy.Form
              onSubmit={(arg1) => onSubmit(arg1)}
              onValid={() => (isValid = true)}
              onInvalid={() => (isValid = false)}>
              { builtInputs }
            </Formsy.Form>
          );
        }
      });

      beforeEach(() => {
        isValid = true;
        CheckValid = jasmine.createSpy('CheckValid');
        Formsy.addValidationRule('CheckValid', CheckValid);
        OtherCheckValid = jasmine.createSpy('CheckValid');
        Formsy.addValidationRule('OtherCheckValid', OtherCheckValid);
        onSubmit = jasmine.createSpy('onSubmit');
      });

      it('should run when the input changes', function () {
        const inputs = [{name: 'one', validations: 'CheckValid', value: 'foo'}];
        const form = TestUtils.renderIntoDocument(<TestForm inputs={inputs}/>);
        const input = TestUtils.findRenderedDOMComponentWithTag(form, 'input');
        TestUtils.Simulate.change(React.findDOMNode(input), {target: {value: 'bar'}});
        expect(CheckValid).toHaveBeenCalledWith({one: 'bar'}, 'bar', true);
        expect(OtherCheckValid).not.toHaveBeenCalled();
      });

      it('should allow the validation to be changed', function () {
        const inputs = [{name: 'one', validations: 'CheckValid', value: 'foo'}];
        const form = TestUtils.renderIntoDocument(<TestForm inputs={inputs}/>);
        form.setProps({inputs: [{name: 'one', validations: 'OtherCheckValid', value: 'foo'}] });
        const input = TestUtils.findRenderedDOMComponentWithTag(form, 'input');
        TestUtils.Simulate.change(React.findDOMNode(input), {target: {value: 'bar'}});
        expect(OtherCheckValid).toHaveBeenCalledWith({one: 'bar'}, 'bar', true);
      });

      it('should invalidate a form if dynamically inserted input is invalid', function (done) {
        const inputs = [{name: 'one', validations: 'isEmail', value: 'foo@bar.com'}];
        const form = TestUtils.renderIntoDocument(<TestForm inputs={inputs}/>);
        expect(isValid).toEqual(true);
        form.setProps({inputs: [
          {name: 'one', validations: 'isEmail', value: 'foo@bar.com'},
          {name: 'two', validations: 'isEmail', value: 'foo@bar'}
        ]}, () => {
          immediate(() => {
            expect(isValid).toEqual(false);
            done();
          });
        });
      });

      it('should validate a form when removing an invalid input', function (done) {
        const form = TestUtils.renderIntoDocument(<TestForm inputs={ [
          {name: 'one', validations: 'isEmail', value: 'foo@bar.com'},
          {name: 'two', validations: 'isEmail', value: 'foo@bar'}
        ] } />);
        expect(isValid).toEqual(false);
        form.setProps({inputs: [{name: 'one', validations: 'isEmail', value: 'foo@bar.com'}]}, () => {
          immediate(() => {
            expect(isValid).toEqual(true);
            done();
          });
        });
      });

      it('runs multiple validations', function () {
        const inputs = [{name: 'one', validations: 'CheckValid,OtherCheckValid', value: 'foo'}];
        const form = TestUtils.renderIntoDocument(<TestForm inputs={inputs}/>);
        const input = TestUtils.findRenderedDOMComponentWithTag(form, 'input');
        TestUtils.Simulate.change(React.findDOMNode(input), {target: {value: 'bar'}});
        expect(CheckValid).toHaveBeenCalledWith({one: 'bar'}, 'bar', true);
        expect(OtherCheckValid).toHaveBeenCalledWith({one: 'bar'}, 'bar', true);
      });
    });

    it('should not trigger onChange when form is mounted', function () {
      const hasChanged = jasmine.createSpy('onChange');
      const TestForm = React.createClass({
        render() {
          return <Formsy.Form onChange={hasChanged}></Formsy.Form>;
        }
      });
      TestUtils.renderIntoDocument(<TestForm/>);
      expect(hasChanged).not.toHaveBeenCalled();
    });

    it('should trigger onChange when form element is changed', function () {
      const hasChanged = jasmine.createSpy('onChange');
      const TestForm = React.createClass({
        render() {
          return (
            <Formsy.Form onChange={hasChanged}>
              <TestInput name="foo"/>
            </Formsy.Form>
          );
        }
      });
      const form = TestUtils.renderIntoDocument(<TestForm/>);
      TestUtils.Simulate.change(TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT'), {target: {value: 'bar'}});
      expect(hasChanged).toHaveBeenCalled();
    });

    it('should trigger onChange when new input is added to form', function (done) {
      const hasChanged = jasmine.createSpy('onChange');
      const inputs = [];
      let forceUpdate = null;
      const TestForm = React.createClass({
        componentWillMount() {
          forceUpdate = this.forceUpdate.bind(this);
        },
        render() {
          return (
            <Formsy.Form onChange={hasChanged}>
              {inputs}
            </Formsy.Form>);
        }
      });
      TestUtils.renderIntoDocument(<TestForm/>);

      // Wait before adding the input
      inputs.push(<TestInput name="test" key={inputs.length}/>);

      forceUpdate(() => {

        // Wait for next event loop, as that does the form
        immediate(() => {
          expect(hasChanged).toHaveBeenCalled();
          done();
        });

      });

    });

  });

  describe('Update a form', function () {

    it('should allow elements to check if the form is disabled', function (done) {

      const TestForm = React.createClass({
        getInitialState() { return { disabled: true }; },
        enableForm() { this.setState({ disabled: false }); },
        render() {
          return (
            <Formsy.Form onChange={this.onChange} disabled={this.state.disabled}>
              <TestInput name="foo"/>
            </Formsy.Form>);
        }
      });
      const form = TestUtils.renderIntoDocument(<TestForm/>);

      const input = TestUtils.findRenderedComponentWithType(form, TestInput);
      expect(input.isFormDisabled()).toBe(true);

      form.enableForm();
      immediate(() => {
        expect(input.isFormDisabled()).toBe(false);
        done();
      });

    });

    it('should be possible to pass error state of elements by changing an errors attribute', function (done) {

      const TestForm = React.createClass({
        getInitialState() { return { validationErrors: { foo: 'bar' } }; },
        onChange(values) {
            this.setState(values.foo ? { validationErrors: {} } : { validationErrors: {foo: 'bar'} });
        },
        render() {
          return (
            <Formsy.Form onChange={this.onChange} validationErrors={this.state.validationErrors}>
              <TestInput name="foo"/>
            </Formsy.Form>);
        }
      });
      const form = TestUtils.renderIntoDocument(<TestForm/>);

      // Wait for update
      immediate(() => {
        const input = TestUtils.findRenderedComponentWithType(form, TestInput);
        expect(input.getErrorMessage()).toBe('bar');
        input.setValue('gotValue');

        // Wait for update
        immediate(() => {
          expect(input.getErrorMessage()).toBe(null);
          done();
        });
      });

    });


    it('should trigger an onValidSubmit when submitting a valid form', function () {

      let isCalled = false;
      const TestForm = React.createClass({
        render() {
          return (
            <Formsy.Form onValidSubmit={() => (isCalled = true)}>
              <TestInput name="foo" validations="isEmail" value="foo@bar.com"/>
            </Formsy.Form>);
        }
      });
      const form = TestUtils.renderIntoDocument(<TestForm/>);

      const FoundForm = TestUtils.findRenderedComponentWithType(form, TestForm);
      TestUtils.Simulate.submit(React.findDOMNode(FoundForm));
      expect(isCalled).toBe(true);

    });

    it('should trigger an onInvalidSubmit when submitting an invalid form', function () {

      let isCalled = false;
      const TestForm = React.createClass({
        render() {
          return (
            <Formsy.Form onInvalidSubmit={() => (isCalled = true)}>
              <TestInput name="foo" validations="isEmail" value="foo@bar"/>
            </Formsy.Form>);
        }
      });
      const form = TestUtils.renderIntoDocument(
        <TestForm/>
      );

      const FoundForm = TestUtils.findRenderedComponentWithType(form, TestForm);
      TestUtils.Simulate.submit(React.findDOMNode(FoundForm));
      expect(isCalled).toBe(true);

    });

  });

  describe("value === false", function () {
    let onSubmit;
    const TestForm = React.createClass({
      render() {
        return (
          <Formsy.Form onSubmit={(x) => onSubmit(x)}>
            <TestInput name="foo" value={ this.props.value } type="checkbox" />
            <button type="submit">Save</button>
          </Formsy.Form>
        );
      }
    });

    beforeEach(() => {
      onSubmit = jasmine.createSpy('onSubmit');
    });

    it("should call onSubmit correctly", function () {
      const form = TestUtils.renderIntoDocument(<TestForm value={ false }/>);
      TestUtils.Simulate.submit(React.findDOMNode(form));
      expect(onSubmit).toHaveBeenCalledWith({foo: false});
    });

    it("should allow dynamic changes to false", function () {
      const form = TestUtils.renderIntoDocument(<TestForm value={ true }/>);
      form.setProps({value: false});
      TestUtils.Simulate.submit(React.findDOMNode(form));
      expect(onSubmit).toHaveBeenCalledWith({foo: false});
    });

    it("should say the form is submitted", function () {
      const form = TestUtils.renderIntoDocument(<TestForm value={ true }/>);
      const input = TestUtils.findRenderedComponentWithType(form, TestInput);
      expect(input.isFormSubmitted()).toBe(false);
      TestUtils.Simulate.submit(React.findDOMNode(form));
      expect(input.isFormSubmitted()).toBe(true);
    });

    it("should be able to reset the form to its pristine state", function () {
      const form = TestUtils.renderIntoDocument(<TestForm value={ true }/>);
      const input = TestUtils.findRenderedComponentWithType(form, TestInput);
      const formsyForm = TestUtils.findRenderedComponentWithType(form, Formsy.Form);
      expect(input.getValue()).toBe(true);
      form.setProps({value: false});
      expect(input.getValue()).toBe(false);
      formsyForm.reset();
      expect(input.getValue()).toBe(true);
    });

    it("should be able to reset the form using custom data", function () {
      const form = TestUtils.renderIntoDocument(<TestForm value={ true }/>);
      const input = TestUtils.findRenderedComponentWithType(form, TestInput);
      const formsyForm = TestUtils.findRenderedComponentWithType(form, Formsy.Form);
      expect(input.getValue()).toBe(true);
      form.setProps({value: false});
      expect(input.getValue()).toBe(false);
      formsyForm.reset({
        foo: 'bar'
      });
      expect(input.getValue()).toBe('bar');
    });

  });

  describe('.isChanged()', function () {
    let onChange;

    const TestForm = React.createClass({
      getDefaultProps() {
        return { inputs: [] };
      },
      render() {
        const builtInputs = this.props.inputs.map((input) => <TestInput {...input} key={input.name}/>);
        return (
          <Formsy.Form ref="formsy" onChange={ onChange }>
            { builtInputs }
            { this.props.children }
          </Formsy.Form>
        );
      }
    });

    beforeEach(() => {
      onChange = jasmine.createSpy('onChange');
    });

    it('initially returns false', function () {
      const form = TestUtils.renderIntoDocument(<TestForm inputs={ [{name: 'one', value: 'foo'}] }/>);
      expect(form.refs.formsy.isChanged()).toEqual(false);
      expect(onChange).not.toHaveBeenCalled();
    });

    it('returns true when changed', function () {
      const form = TestUtils.renderIntoDocument(<TestForm inputs={ [{name: 'one', value: 'foo'}] }/>);
      const input = TestUtils.findRenderedDOMComponentWithTag(form, 'input');
      TestUtils.Simulate.change(React.findDOMNode(input), {target: {value: 'bar'}});
      expect(form.refs.formsy.isChanged()).toEqual(true);
      expect(onChange).toHaveBeenCalledWith({one: 'bar'}, true);
    });

    it('returns false if changes are undone', function () {
      const form = TestUtils.renderIntoDocument(<TestForm inputs={ [{name: 'one', value: 'foo'}] }/>);
      const input = TestUtils.findRenderedDOMComponentWithTag(form, 'input');
      TestUtils.Simulate.change(React.findDOMNode(input), {target: {value: 'bar'}});
      expect(onChange).toHaveBeenCalledWith({one: 'bar'}, true);
      TestUtils.Simulate.change(React.findDOMNode(input), {target: {value: 'foo'}});
      expect(form.refs.formsy.isChanged()).toEqual(false);
      expect(onChange).toHaveBeenCalledWith({one: 'foo'}, false);
    });
  });

});
