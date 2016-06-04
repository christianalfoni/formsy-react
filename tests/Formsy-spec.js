import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import Formsy from './..';
import TestInput from './utils/TestInput';
import immediate from './utils/immediate';
import sinon from 'sinon';

export default {

  'Setting up a form': {

    'should render a form into the document': function (test) {

      const form = TestUtils.renderIntoDocument(<Formsy.Form></Formsy.Form>);
      test.equal(ReactDOM.findDOMNode(form).tagName, 'FORM');

      test.done();

    },

    'should set a class name if passed': function (test) {

      const form = TestUtils.renderIntoDocument( <Formsy.Form className="foo"></Formsy.Form>);
      test.equal(ReactDOM.findDOMNode(form).className, 'foo');

      test.done();

    },

    'should allow for null/undefined children': function (test) {

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
        TestUtils.Simulate.submit(ReactDOM.findDOMNode(form));
        test.deepEqual(model, {name: 'foo'});
        test.done();
      });

    },

    'should allow for inputs being added dynamically': function (test) {

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

      Formsy.addValidationRule('runRule', runRule);
      Formsy.addValidationRule('notRunRule', notRunRule);

      const form = TestUtils.renderIntoDocument(
        <Formsy.Form>
          <TestInput name="one" validations="runRule" value="foo"/>
        </Formsy.Form>
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
      Formsy.addValidationRule('ruleA', ruleA);
      Formsy.addValidationRule('ruleB', ruleB);

      class TestForm extends React.Component {
        constructor(props) {
          super(props);
          this.state = {rule: 'ruleA'};
        }
        changeRule() {
          this.setState({
            rule: 'ruleB'
          });
        }
        render() {
          return (
            <Formsy.Form>
              <TestInput name="one" validations={this.state.rule} value="foo"/>
            </Formsy.Form>
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
        addInput() {
          this.setState({
            showSecondInput: true
          });
        }
        render() {
          return (
            <Formsy.Form ref="formsy" onInvalid={isInValidSpy}>
              <TestInput name="one" validations="isEmail" value="foo@bar.com"/>
              {
                this.state.showSecondInput ?
                  <TestInput name="two" validations="isEmail" value="foo@bar"/>
                :
                  null
              }
            </Formsy.Form>
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
            <Formsy.Form ref="formsy" onValid={isValidSpy}>
              <TestInput name="one" validations="isEmail" value="foo@bar.com"/>
              {
                this.state.showSecondInput ?
                  <TestInput name="two" validations="isEmail" value="foo@bar"/>
                :
                  null
              }
            </Formsy.Form>
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
      Formsy.addValidationRule('ruleA', ruleA);
      Formsy.addValidationRule('ruleB', ruleB);

      const form = TestUtils.renderIntoDocument(
        <Formsy.Form>
          <TestInput name="one" validations="ruleA,ruleB" value="foo" />
        </Formsy.Form>
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
    const TestForm = React.createClass({
      render() {
        return <Formsy.Form onChange={hasChanged}></Formsy.Form>;
      }
    });
    TestUtils.renderIntoDocument(<TestForm/>);
    test.equal(hasChanged.called, false);
    test.done();

  },

  'should trigger onChange once when form element is changed': function (test) {

    const hasChanged = sinon.spy();
    const form = TestUtils.renderIntoDocument(
      <Formsy.Form onChange={hasChanged}>
        <TestInput name="foo"/>
      </Formsy.Form>
    );
    TestUtils.Simulate.change(TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT'), {target: {value: 'bar'}});
    test.equal(hasChanged.calledOnce, true);
    test.done();

  },

  'should trigger onChange once when new input is added to form': function (test) {

    const hasChanged = sinon.spy();
    const TestForm = React.createClass({
      getInitialState() {
        return {
          showInput: false
        };
      },
      addInput() {
        this.setState({
          showInput: true
        })
      },
      render() {
        return (
          <Formsy.Form onChange={hasChanged}>
            {
              this.state.showInput ?
                <TestInput name="test"/>
              :
                null
            }
          </Formsy.Form>);
      }
    });

    const form = TestUtils.renderIntoDocument(<TestForm/>);
    form.addInput();
    immediate(() => {
      test.equal(hasChanged.calledOnce, true);
      test.done();
    });

  },

  'Update a form': {

    'should allow elements to check if the form is disabled': function (test) {

      const TestForm = React.createClass({
        getInitialState() { return { disabled: true }; },
        enableForm() { this.setState({ disabled: false }); },
        render() {
          return (
            <Formsy.Form disabled={this.state.disabled}>
              <TestInput name="foo"/>
            </Formsy.Form>);
        }
      });

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
      const TestForm = React.createClass({
        render() {
          return (
            <Formsy.Form onValidSubmit={isCalled}>
              <TestInput name="foo" validations="isEmail" value="foo@bar.com"/>
            </Formsy.Form>);
        }
      });
      const form = TestUtils.renderIntoDocument(<TestForm/>);
      const FoundForm = TestUtils.findRenderedComponentWithType(form, TestForm);
      TestUtils.Simulate.submit(ReactDOM.findDOMNode(FoundForm));
      test.equal(isCalled.called,true);
      test.done();

    },

    'should trigger an onInvalidSubmit when submitting an invalid form': function (test) {

      let isCalled = sinon.spy();
      const TestForm = React.createClass({
        render() {
          return (
            <Formsy.Form onInvalidSubmit={isCalled}>
              <TestInput name="foo" validations="isEmail" value="foo@bar"/>
            </Formsy.Form>);
        }
      });
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
      const TestForm = React.createClass({
        render() {
          return (
            <Formsy.Form onSubmit={onSubmit}>
              <TestInput name="foo" value={false} type="checkbox" />
              <button type="submit">Save</button>
            </Formsy.Form>
          );
        }
      });

      const form = TestUtils.renderIntoDocument(<TestForm/>);
      TestUtils.Simulate.submit(ReactDOM.findDOMNode(form));
      test.equal(onSubmit.calledWith({foo: false}), true);
      test.done();

    },

    'should allow dynamic changes to false': function (test) {

      const onSubmit = sinon.spy();
      const TestForm = React.createClass({
        getInitialState() {
          return {
            value: true
          };
        },
        changeValue() {
          this.setState({
            value: false
          });
        },
        render() {
          return (
            <Formsy.Form onSubmit={onSubmit}>
              <TestInput name="foo" value={this.state.value} type="checkbox" />
              <button type="submit">Save</button>
            </Formsy.Form>
          );
        }
      });

      const form = TestUtils.renderIntoDocument(<TestForm/>);
      form.changeValue();
      TestUtils.Simulate.submit(ReactDOM.findDOMNode(form));
      test.equal(onSubmit.calledWith({foo: false}), true);
      test.done();

    },

    'should say the form is submitted': function (test) {

      const TestForm = React.createClass({
        render() {
          return (
            <Formsy.Form>
              <TestInput name="foo" value={true} type="checkbox" />
              <button type="submit">Save</button>
            </Formsy.Form>
          );
        }
      });
      const form = TestUtils.renderIntoDocument(<TestForm/>);
      const input = TestUtils.findRenderedComponentWithType(form, TestInput);
      test.equal(input.isFormSubmitted(), false);
      TestUtils.Simulate.submit(ReactDOM.findDOMNode(form));
      test.equal(input.isFormSubmitted(), true);
      test.done();

    },

    'should be able to reset the form to its pristine state': function (test) {

      const TestForm = React.createClass({
        getInitialState() {
          return {
            value: true
          };
        },
        changeValue() {
          this.setState({
            value: false
          });
        },
        render() {
          return (
            <Formsy.Form>
              <TestInput name="foo" value={this.state.value} type="checkbox" />
              <button type="submit">Save</button>
            </Formsy.Form>
          );
        }
      });
      const form = TestUtils.renderIntoDocument(<TestForm/>);
      const input = TestUtils.findRenderedComponentWithType(form, TestInput);
      const formsyForm = TestUtils.findRenderedComponentWithType(form, Formsy.Form);
      test.equal(input.getValue(), true);
      form.changeValue();
      test.equal(input.getValue(), false);
      formsyForm.reset();
      test.equal(input.getValue(), true);

      test.done();

    },

    'should be able to reset the form using custom data': function (test) {

      const TestForm = React.createClass({
        getInitialState() {
          return {
            value: true
          };
        },
        changeValue() {
          this.setState({
            value: false
          });
        },
        render() {
          return (
            <Formsy.Form>
              <TestInput name="foo" value={this.state.value} type="checkbox" />
              <button type="submit">Save</button>
            </Formsy.Form>
          );
        }
      });
      const form = TestUtils.renderIntoDocument(<TestForm/>);
      const input = TestUtils.findRenderedComponentWithType(form, TestInput);
      const formsyForm = TestUtils.findRenderedComponentWithType(form, Formsy.Form);

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

    const TestForm = React.createClass({
      render() {
        return (
          <Formsy.Form>
            <TestInput name="foo" value="42" type="checkbox" />
            <button type="submit">Save</button>
          </Formsy.Form>
        );
      }
    });
    const form = TestUtils.renderIntoDocument(<TestForm/>);
    const input = TestUtils.findRenderedComponentWithType(form, TestInput);
    const formsyForm = TestUtils.findRenderedComponentWithType(form, Formsy.Form);

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
        <Formsy.Form onChange={hasOnChanged}>
          <TestInput name="one" value="foo" />
        </Formsy.Form>
      );
      test.equal(form.isChanged(), false);
      test.equal(hasOnChanged.called, false);
      test.done();

    },

    'returns true when changed': function (test) {

      const hasOnChanged = sinon.spy();
      const form = TestUtils.renderIntoDocument(
        <Formsy.Form onChange={hasOnChanged}>
          <TestInput name="one" value="foo" />
        </Formsy.Form>
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
        <Formsy.Form onChange={hasOnChanged}>
          <TestInput name="one" value="foo" />
        </Formsy.Form>
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
