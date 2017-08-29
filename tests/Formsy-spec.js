import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';

import Formsy, { addValidationRule } from './..';
import TestInput from './utils/TestInput';
import TestInputHoc from './utils/TestInputHoc';
import immediate from './utils/immediate';
import sinon from 'sinon';

export default {
  'Setting up a form': {
    'should expose the users DOM node through an innerRef prop': function (test) {
      class TestForm extends React.Component {
        render() {
          return (
            <Formsy>
              <TestInputHoc name="name" innerRef={(c) => { this.name = c; }} />
            </Formsy>
          );
        }
      }

      const form = TestUtils.renderIntoDocument(<TestForm/>);
      const input = form.name;
      test.equal(input.methodOnWrappedInstance('foo'), 'foo');

      test.done();
    },

    'should render a form into the document': function (test) {

      const form = TestUtils.renderIntoDocument(<Formsy></Formsy>);
      test.equal(ReactDOM.findDOMNode(form).tagName, 'FORM');

      test.done();

    },

    'should set a class name if passed': function (test) {

      const form = TestUtils.renderIntoDocument( <Formsy className="foo"></Formsy>);
      test.equal(ReactDOM.findDOMNode(form).className, 'foo');

      test.done();

    },

    'should allow for null/undefined children': function (test) {

      let model = null;
      class TestForm extends React.Component {
        render() {
          return (
            <Formsy onSubmit={(formModel) => (model = formModel)}>
              <h1>Test</h1>
              { null }
              { undefined }
              <TestInput name="name" value={ 'foo' } />
            </Formsy>
          );
        }
      }

      const form = TestUtils.renderIntoDocument(<TestForm/>);
      immediate(() => {
        TestUtils.Simulate.submit(ReactDOM.findDOMNode(form));
        test.deepEqual(model, {name: 'foo'});
        test.done();
      });

    },

    'should allow for inputs being added dynamically': function (test) {

      const inputs = [];
      let forceUpdate = null;
      let model = null;
      class TestForm extends React.Component {
        componentWillMount() {
          forceUpdate = this.forceUpdate.bind(this);
        }
        render() {
          return (
            <Formsy onSubmit={(formModel) => (model = formModel)}>
              {inputs}
            </Formsy>);
        }
      }
      const form = TestUtils.renderIntoDocument(<TestForm/>);

      // Wait before adding the input
      setTimeout(() => {
        inputs.push(<TestInput name="test" value="" key={inputs.length}/>);

        forceUpdate(() => {
          // Wait for next event loop, as that does the form
          immediate(() => {
            TestUtils.Simulate.submit(ReactDOM.findDOMNode(form));
            test.ok('test' in model);
            test.done();
          });

        });

      }, 10);

    },

    'should allow dynamically added inputs to update the form-model': function (test) {

      const inputs = [];
      let forceUpdate = null;
      let model = null;
      class TestForm extends React.Component {
        componentWillMount() {
          forceUpdate = this.forceUpdate.bind(this);
        }
        render() {
          return (
            <Formsy onSubmit={(formModel) => (model = formModel)}>
              {inputs}
            </Formsy>);
        }
      }
      const form = TestUtils.renderIntoDocument(<TestForm/>);

      // Wait before adding the input
      immediate(() => {
        inputs.push(<TestInput name="test" key={inputs.length}/>);

        forceUpdate(() => {

          // Wait for next event loop, as that does the form
          immediate(() => {
            TestUtils.Simulate.change(TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT'), {target: {value: 'foo'}});
            TestUtils.Simulate.submit(ReactDOM.findDOMNode(form));
            test.equal(model.test, 'foo');
            test.done();
          });

        });

      });

    },

    'should allow a dynamically updated input to update the form-model': function (test) {

      let forceUpdate = null;
      let model = null;

      class TestForm extends React.Component {
        componentWillMount() {
          forceUpdate = this.forceUpdate.bind(this);
        }
        render() {
          const input = <TestInput name="test" value={this.props.value} />;

          return (
            <Formsy onSubmit={(formModel) => (model = formModel)}>
              {input}
            </Formsy>);
        }
      }
      let form = TestUtils.renderIntoDocument(<TestForm value="foo"/>);

      // Wait before changing the input
      immediate(() => {
        form = TestUtils.renderIntoDocument(<TestForm value="bar"/>);

        forceUpdate(() => {
          // Wait for next event loop, as that does the form
          immediate(() => {
            TestUtils.Simulate.submit(ReactDOM.findDOMNode(form));
            test.equal(model.test, 'bar');
            test.done();
          });

        });

      });

    }

  },

  'validations': {

    'should run when the input changes': function (test) {

      const runRule = sinon.spy();
      const notRunRule = sinon.spy();

      addValidationRule('runRule', runRule);
      addValidationRule('notRunRule', notRunRule);

      const form = TestUtils.renderIntoDocument(
        <Formsy>
          <TestInput name="one" validations="runRule" value="foo"/>
        </Formsy>
      );

      const input = TestUtils.findRenderedDOMComponentWithTag(form, 'input');
      TestUtils.Simulate.change(ReactDOM.findDOMNode(input), {target: {value: 'bar'}});
      test.equal(runRule.calledWith({one: 'bar'}, 'bar', true), true);
      test.equal(notRunRule.called, false);

      test.done();

    },

    'should allow the validation to be changed': function (test) {

      const ruleA = sinon.spy();
      const ruleB = sinon.spy();
      addValidationRule('ruleA', ruleA);
      addValidationRule('ruleB', ruleB);

      class TestForm extends React.Component {
        constructor(props) {
          super(props);
          this.state = {rule: 'ruleA'};
        }
        changeRule = () => {
          this.setState({
            rule: 'ruleB'
          });
        }
        render() {
          return (
            <Formsy>
              <TestInput name="one" validations={this.state.rule} value="foo"/>
            </Formsy>
          );
        }
      }

      const form = TestUtils.renderIntoDocument(<TestForm/>);
      form.changeRule();
      const input = TestUtils.findRenderedDOMComponentWithTag(form, 'input');
      TestUtils.Simulate.change(ReactDOM.findDOMNode(input), {target: {value: 'bar'}});
      test.equal(ruleB.calledWith({one: 'bar'}, 'bar', true), true);

      test.done();

    },

    'should invalidate a form if dynamically inserted input is invalid': function (test) {

      const isInValidSpy = sinon.spy();

      class TestForm extends React.Component {
        constructor(props) {
          super(props);
          this.state = {showSecondInput: false};
        }
        addInput = () => {
          this.setState({
            showSecondInput: true
          });
        }
        render() {
          return (
            <Formsy ref="formsy" onInvalid={isInValidSpy}>
              <TestInput name="one" validations="isEmail" value="foo@bar.com"/>
              {
                this.state.showSecondInput ?
                  <TestInput name="two" validations="isEmail" value="foo@bar"/>
                :
                  null
              }
            </Formsy>
          );
        }
      }

      const form = TestUtils.renderIntoDocument(<TestForm/>);

      test.equal(form.refs.formsy.state.isValid, true);
      form.addInput();

      immediate(() => {
        test.equal(isInValidSpy.called, true);
        test.done();
      });

    },

    'should validate a form when removing an invalid input': function (test) {

      const isValidSpy = sinon.spy();

      class TestForm extends React.Component {
        constructor(props) {
          super(props);
          this.state = {showSecondInput: true};
        }
        removeInput() {
          this.setState({
            showSecondInput: false
          });
        }
        render() {
          return (
            <Formsy ref="formsy" onValid={isValidSpy}>
              <TestInput name="one" validations="isEmail" value="foo@bar.com"/>
              {
                this.state.showSecondInput ?
                  <TestInput name="two" validations="isEmail" value="foo@bar"/>
                :
                  null
              }
            </Formsy>
          );
        }
      }

      const form = TestUtils.renderIntoDocument(<TestForm/>);

      test.equal(form.refs.formsy.state.isValid, false);
      form.removeInput();

      immediate(() => {
        test.equal(isValidSpy.called, true);
        test.done();
      });


    },

    'runs multiple validations': function (test) {

      const ruleA = sinon.spy();
      const ruleB = sinon.spy();
      addValidationRule('ruleA', ruleA);
      addValidationRule('ruleB', ruleB);

      const form = TestUtils.renderIntoDocument(
        <Formsy>
          <TestInput name="one" validations="ruleA,ruleB" value="foo" />
        </Formsy>
      );

      const input = TestUtils.findRenderedDOMComponentWithTag(form, 'input');
      TestUtils.Simulate.change(ReactDOM.findDOMNode(input), {target: {value: 'bar'}});
      test.equal(ruleA.calledWith({one: 'bar'}, 'bar', true), true);
      test.equal(ruleB.calledWith({one: 'bar'}, 'bar', true), true);
      test.done();

    }

  },

  'should not trigger onChange when form is mounted': function (test) {


    const hasChanged = sinon.spy();
    class TestForm extends React.Component {
      render() {
        return <Formsy onChange={hasChanged}></Formsy>;
      }
    }
    TestUtils.renderIntoDocument(<TestForm/>);
    test.equal(hasChanged.called, false);
    test.done();

  },

  'should trigger onChange once when form element is changed': function (test) {

    const hasChanged = sinon.spy();
    const form = TestUtils.renderIntoDocument(
      <Formsy onChange={hasChanged}>
        <TestInput name="foo"/>
      </Formsy>
    );
    TestUtils.Simulate.change(TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT'), {target: {value: 'bar'}});
    test.equal(hasChanged.calledOnce, true);
    test.done();

  },

  'should trigger onChange once when new input is added to form': function (test) {

    const hasChanged = sinon.spy();
    class TestForm extends React.Component {
      state = {
        showInput: false
      }
      addInput() {
        this.setState({
          showInput: true
        })
      }
      render() {
        return (
          <Formsy onChange={hasChanged}>
            {
              this.state.showInput ?
                <TestInput name="test"/>
              :
                null
            }
          </Formsy>);
      }
    }

    const form = TestUtils.renderIntoDocument(<TestForm/>);
    form.addInput();
    immediate(() => {
      test.equal(hasChanged.calledOnce, true);
      test.done();
    });

  },

  'Update a form': {

    'should allow elements to check if the form is disabled': function (test) {

      class TestForm extends React.Component {
        state = { disabled: true };
        enableForm() { this.setState({ disabled: false }); }
        render() {
          return (
            <Formsy disabled={this.state.disabled}>
              <TestInput name="foo"/>
            </Formsy>);
        }
      }

      const form = TestUtils.renderIntoDocument(<TestForm/>);
      const input = TestUtils.findRenderedComponentWithType(form, TestInput);
      test.equal(input.isFormDisabled(), true);

      form.enableForm();
      immediate(() => {
        test.equal(input.isFormDisabled(), false);
        test.done();
      });

    },

    'should be possible to pass error state of elements by changing an errors attribute': function (test) {

      class TestForm extends React.Component {
        state = { validationErrors: { foo: 'bar' } };
        onChange = (values) => {
            this.setState(values.foo ? { validationErrors: {} } : { validationErrors: {foo: 'bar'} });
        }
        render() {
          return (
            <Formsy onChange={this.onChange} validationErrors={this.state.validationErrors}>
              <TestInput name="foo"/>
            </Formsy>);
        }
      }
      const form = TestUtils.renderIntoDocument(<TestForm/>);

      // Wait for update
      immediate(() => {
        const input = TestUtils.findRenderedComponentWithType(form, TestInput);
        test.equal(input.getErrorMessage(), 'bar');
        input.setValue('gotValue');

        // Wait for update
        immediate(() => {
          test.equal(input.getErrorMessage(), null);
          test.done();
        });
      });

    },

    'should trigger an onValidSubmit when submitting a valid form': function (test) {

      let isCalled = sinon.spy();
      class TestForm extends React.Component {
        render() {
          return (
            <Formsy onValidSubmit={isCalled}>
              <TestInput name="foo" validations="isEmail" value="foo@bar.com"/>
            </Formsy>);
        }
      }
      const form = TestUtils.renderIntoDocument(<TestForm/>);
      const FoundForm = TestUtils.findRenderedComponentWithType(form, TestForm);
      TestUtils.Simulate.submit(ReactDOM.findDOMNode(FoundForm));
      test.equal(isCalled.called,true);
      test.done();

    },

    'should trigger an onInvalidSubmit when submitting an invalid form': function (test) {

      let isCalled = sinon.spy();
      class TestForm extends React.Component {
        render() {
          return (
            <Formsy onInvalidSubmit={isCalled}>
              <TestInput name="foo" validations="isEmail" value="foo@bar"/>
            </Formsy>);
        }
      }
      const form = TestUtils.renderIntoDocument(<TestForm/>);

      const FoundForm = TestUtils.findRenderedComponentWithType(form, TestForm);
      TestUtils.Simulate.submit(ReactDOM.findDOMNode(FoundForm));
      test.equal(isCalled.called, true);

      test.done();

    }

  },

  'value === false': {

    'should call onSubmit correctly': function (test) {

      const onSubmit = sinon.spy();
      class TestForm extends React.Component {
        render() {
          return (
            <Formsy onSubmit={onSubmit}>
              <TestInput name="foo" value={false} type="checkbox" />
              <button type="submit">Save</button>
            </Formsy>
          );
        }
      }

      const form = TestUtils.renderIntoDocument(<TestForm/>);
      TestUtils.Simulate.submit(ReactDOM.findDOMNode(form));
      test.equal(onSubmit.calledWith({foo: false}), true);
      test.done();

    },

    'should allow dynamic changes to false': function (test) {

      const onSubmit = sinon.spy();
      class TestForm extends React.Component {
        state = {
          value: true
        }
        changeValue() {
          this.setState({
            value: false
          });
        }
        render() {
          return (
            <Formsy onSubmit={onSubmit}>
              <TestInput name="foo" value={this.state.value} type="checkbox" />
              <button type="submit">Save</button>
            </Formsy>
          );
        }
      }

      const form = TestUtils.renderIntoDocument(<TestForm/>);
      form.changeValue();
      TestUtils.Simulate.submit(ReactDOM.findDOMNode(form));
      test.equal(onSubmit.calledWith({foo: false}), true);
      test.done();

    },

    'should say the form is submitted': function (test) {

      class TestForm extends React.Component {
        render() {
          return (
            <Formsy>
              <TestInput name="foo" value={true} type="checkbox" />
              <button type="submit">Save</button>
            </Formsy>
          );
        }
      }
      const form = TestUtils.renderIntoDocument(<TestForm/>);
      const input = TestUtils.findRenderedComponentWithType(form, TestInput);
      test.equal(input.isFormSubmitted(), false);
      TestUtils.Simulate.submit(ReactDOM.findDOMNode(form));
      test.equal(input.isFormSubmitted(), true);
      test.done();

    },

    'should be able to reset the form to its pristine state': function (test) {

      class TestForm extends React.Component {
        state = {
          value: true
        }
        changeValue() {
          this.setState({
            value: false
          });
        }
        render() {
          return (
            <Formsy>
              <TestInput name="foo" value={this.state.value} type="checkbox" />
              <button type="submit">Save</button>
            </Formsy>
          );
        }
      }
      const form = TestUtils.renderIntoDocument(<TestForm/>);
      const input = TestUtils.findRenderedComponentWithType(form, TestInput);
      const formsyForm = TestUtils.findRenderedComponentWithType(form, Formsy);
      test.equal(input.getValue(), true);
      form.changeValue();
      test.equal(input.getValue(), false);
      formsyForm.reset();
      test.equal(input.getValue(), true);

      test.done();

    },

    'should be able to reset the form using custom data': function (test) {

      class TestForm extends React.Component {
        state = {
          value: true
        }
        changeValue() {
          this.setState({
            value: false
          });
        }
        render() {
          return (
            <Formsy>
              <TestInput name="foo" value={this.state.value} type="checkbox" />
              <button type="submit">Save</button>
            </Formsy>
          );
        }
      }
      const form = TestUtils.renderIntoDocument(<TestForm/>);
      const input = TestUtils.findRenderedComponentWithType(form, TestInput);
      const formsyForm = TestUtils.findRenderedComponentWithType(form, Formsy);

      test.equal(input.getValue(), true);
      form.changeValue();
      test.equal(input.getValue(), false);
      formsyForm.reset({
        foo: 'bar'
      });
      test.equal(input.getValue(), 'bar');
      test.done();

    }

  },

  'should be able to reset the form to empty values': function (test) {

    class TestForm extends React.Component {
      render() {
        return (
          <Formsy>
            <TestInput name="foo" value="42" type="checkbox" />
            <button type="submit">Save</button>
          </Formsy>
        );
      }
    }
    const form = TestUtils.renderIntoDocument(<TestForm/>);
    const input = TestUtils.findRenderedComponentWithType(form, TestInput);
    const formsyForm = TestUtils.findRenderedComponentWithType(form, Formsy);

    formsyForm.reset({
      foo: ''
    });
    test.equal(input.getValue(), '');
    test.done();

  },

  '.isChanged()': {

    'initially returns false': function (test) {

      const hasOnChanged = sinon.spy();
      const form = TestUtils.renderIntoDocument(
        <Formsy onChange={hasOnChanged}>
          <TestInput name="one" value="foo" />
        </Formsy>
      );
      test.equal(form.isChanged(), false);
      test.equal(hasOnChanged.called, false);
      test.done();

    },

    'returns true when changed': function (test) {

      const hasOnChanged = sinon.spy();
      const form = TestUtils.renderIntoDocument(
        <Formsy onChange={hasOnChanged}>
          <TestInput name="one" value="foo" />
        </Formsy>
      );
      const input = TestUtils.findRenderedDOMComponentWithTag(form, 'input');
      TestUtils.Simulate.change(ReactDOM.findDOMNode(input), {target: {value: 'bar'}});
      test.equal(form.isChanged(), true);
      test.equal(hasOnChanged.calledWith({one: 'bar'}), true);
      test.done();

    },

    'returns false if changes are undone': function (test) {

      const hasOnChanged = sinon.spy();
      const form = TestUtils.renderIntoDocument(
        <Formsy onChange={hasOnChanged}>
          <TestInput name="one" value="foo" />
        </Formsy>
      );
      const input = TestUtils.findRenderedDOMComponentWithTag(form, 'input');
      TestUtils.Simulate.change(ReactDOM.findDOMNode(input), {target: {value: 'bar'}});
      test.equal(hasOnChanged.calledWith({one: 'bar'}, true), true);

      TestUtils.Simulate.change(ReactDOM.findDOMNode(input), {target: {value: 'foo'}});
      test.equal(form.isChanged(), false);
      test.equal(hasOnChanged.calledWith({one: 'foo'}, false), true);
      test.done();

    }

  }

};
