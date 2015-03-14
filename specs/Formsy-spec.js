var Formsy = require('./../src/main.js');

describe('Formsy', function () {

  describe('Setting up a form', function () {

    it('should render a form into the document', function () {
      var form = TestUtils.renderIntoDocument( <Formsy.Form></Formsy.Form>);
      expect(form.getDOMNode().tagName).toEqual('FORM');
    });

    it('should set a class name if passed', function () {
      var form = TestUtils.renderIntoDocument( <Formsy.Form className="foo"></Formsy.Form>);
      expect(form.getDOMNode().className).toEqual('foo');
    });

    it('should allow for null/undefined children', function (done) {
      var TestInput = React.createClass({
        mixins: [Formsy.Mixin],
        changeValue: function (event) {
          this.setValue(event.target.value);
        },
        render: function () {
          return <input value={this.getValue()} onChange={this.changeValue}/>
        }
      });

      var model = null;
      var TestForm = React.createClass({
        onSubmit: function (formModel) {
          model = formModel;
        },
        render: function () {
          return (
            <Formsy.Form onSubmit={ this.onSubmit }>
              <h1>Test</h1>
              { null }
              { undefined }
              <TestInput name='name' value={ 'foo' } />
            </Formsy.Form>
          );
        }
      });

      var form = TestUtils.renderIntoDocument(<TestForm/>);
      setTimeout(function () {
        TestUtils.Simulate.submit(form.getDOMNode());
        expect(model).toEqual({name: 'foo'});
        done();
      }, 10);
    });

    it('should allow for inputs being added dynamically', function (done) {

      var inputs = [];
      var forceUpdate = null;
      var model = null;
      var TestInput = React.createClass({
        mixins: [Formsy.Mixin],
        render: function () {
          return <div/>
        }
      });
      var TestForm = React.createClass({
        componentWillMount: function () {
          forceUpdate = this.forceUpdate.bind(this);
        },
        onSubmit: function (formModel) {
          model = formModel;
        },
        render: function () {
          return ( 
            <Formsy.Form onSubmit={this.onSubmit}> 
              {inputs}
            </Formsy.Form>);
        }
      });
      var form = TestUtils.renderIntoDocument( 
        <TestForm/> 
      );

      // Wait before adding the input
      setTimeout(function () {

        inputs.push(TestInput({
          name: 'test'
        }));

        forceUpdate(function () {

          // Wait for next event loop, as that does the form
          setTimeout(function () {
            TestUtils.Simulate.submit(form.getDOMNode());
            expect(model.test).toBeDefined();
            done();
          }, 0);

        });

      }, 10);

    });

    it('should allow dynamically added inputs to update the form-model', function (done) {

      var inputs = [];
      var forceUpdate = null;
      var model = null;
      var TestInput = React.createClass({
        mixins: [Formsy.Mixin],
        changeValue: function (event) {
          this.setValue(event.target.value);
        },
        render: function () {
          return <input value={this.getValue()} onChange={this.changeValue}/>
        }
      });
      var TestForm = React.createClass({
        componentWillMount: function () {
          forceUpdate = this.forceUpdate.bind(this);
        },
        onSubmit: function (formModel) {
          model = formModel;
        },
        render: function () {
          return ( 
            <Formsy.Form onSubmit={this.onSubmit}> 
              {inputs}
            </Formsy.Form>);
        }
      });
      var form = TestUtils.renderIntoDocument( 
        <TestForm/> 
      );

      // Wait before adding the input
      setTimeout(function () {

        inputs.push(TestInput({
          name: 'test'
        }));

        forceUpdate(function () {

          // Wait for next event loop, as that does the form
          setTimeout(function () {
            TestUtils.Simulate.change(TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT'), {target: {value: 'foo'}});
            TestUtils.Simulate.submit(form.getDOMNode());
            expect(model.test).toBe('foo');
            done();
          }, 0);

        });

      }, 10);

    });

    it('should allow a dynamically updated input to update the form-model', function (done) {

      var forceUpdate = null;
      var model = null;
      var TestInput = React.createClass({
        mixins: [Formsy.Mixin],
        changeValue: function (event) {
          this.setValue(event.target.value);
        },
        render: function () {
          return <input value={this.getValue()} onChange={this.changeValue}/>
        }
      });

      var input;
      var TestForm = React.createClass({
        componentWillMount: function () {
          forceUpdate = this.forceUpdate.bind(this);
        },
        onSubmit: function (formModel) {
          model = formModel;
        },
        render: function () {
          input = <TestInput name='test' value={ this.props.value } />;

          return (
            <Formsy.Form onSubmit={this.onSubmit}>
              {input}
            </Formsy.Form>);
        }
      });
      var form = TestUtils.renderIntoDocument(<TestForm value='foo'/>);

      // Wait before changing the input
      setTimeout(function () {
        form.setProps({value: 'bar'});

        forceUpdate(function () {
          // Wait for next event loop, as that does the form
          setTimeout(function () {
            TestUtils.Simulate.submit(form.getDOMNode());
            expect(model.test).toBe('bar');
            done();
          }, 0);

        });

      }, 10);

    });


    it('should invalidate a valid form if dynamically inserted input is invalid', function (done) {

      var forceUpdate = null;
      var isInvalid = false;
      var TestInput = React.createClass({
        mixins: [Formsy.Mixin],
        changeValue: function (event) {
          this.setValue(event.target.value);
        },
        render: function () {
          return <input value={this.getValue()} onChange={this.changeValue}/>
        }
      });


      var inputs = [TestInput({
        name: 'test',
        validations: 'isEmail',
        value: 'foo@bar.com'
      })];

      var TestForm = React.createClass({
        componentWillMount: function () {
          forceUpdate = this.forceUpdate.bind(this);
        },
        setInvalid: function () {
          isInvalid = true;
        },
        render: function () {
          return ( 
            <Formsy.Form onInvalid={this.setInvalid}> 
              {inputs}
            </Formsy.Form>);
        }
      });
      var form = TestUtils.renderIntoDocument( 
        <TestForm/> 
      );

      expect(isInvalid).toBe(false);

      inputs.push(TestInput({
        name: 'test2',
        validations: 'isEmail',
        value: 'foo@bar'
      }));


      forceUpdate(function () {

        // Wait for next event loop, as that does the form
        setTimeout(function () {
          TestUtils.Simulate.submit(form.getDOMNode());
          expect(isInvalid).toBe(true);
          done();
        }, 0);

      });

    });

    it('should not trigger onChange when form is mounted', function () {
      var hasChanged = jasmine.createSpy('onChange');
      var TestForm = React.createClass({
        onChange: function () {
          hasChanged();
        },
        render: function () {
          return <Formsy.Form onChange={this.onChange}></Formsy.Form>;
        }
      });
      var form = TestUtils.renderIntoDocument(<TestForm/>);
      expect(hasChanged).not.toHaveBeenCalled();
    });

    it('should trigger onChange when form element is changed', function () {
      var hasChanged = jasmine.createSpy('onChange');
      var MyInput = React.createClass({
        mixins: [Formsy.Mixin],
        onChange: function (event) {
          this.setValue(event.target.value);
        },
        render: function () {
          return <input value={this.getValue()} onChange={this.onChange}/>
        }
      });
      var TestForm = React.createClass({
        onChange: function () {
          hasChanged();
        },
        render: function () {
          return (
            <Formsy.Form onChange={this.onChange}>
              <MyInput name="foo"/>
            </Formsy.Form>
          );
        }
      });
      var form = TestUtils.renderIntoDocument(<TestForm/>);
      TestUtils.Simulate.change(TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT'), {target: {value: 'bar'}});
      expect(hasChanged).toHaveBeenCalled();
    });

    it('should trigger onChange when new input is added to form', function (done) {
      var hasChanged = jasmine.createSpy('onChange');
      var inputs = [];
      var forceUpdate = null;
      var TestInput = React.createClass({
        mixins: [Formsy.Mixin],
        changeValue: function (event) {
          this.setValue(event.target.value);
        },
        render: function () {
          return <input value={this.getValue()} onChange={this.changeValue}/>
        }
      });
      var TestForm = React.createClass({
        componentWillMount: function () {
          forceUpdate = this.forceUpdate.bind(this);
        },
        onChange: function () {
          hasChanged();
        },
        render: function () {
          return ( 
            <Formsy.Form onChange={this.onChange}> 
              {inputs}
            </Formsy.Form>);
        }
      });
      var form = TestUtils.renderIntoDocument( 
        <TestForm/> 
      );

      // Wait before adding the input
      inputs.push(TestInput({
        name: 'test'
      }));

      forceUpdate(function () {

        // Wait for next event loop, as that does the form
        setTimeout(function () {
          expect(hasChanged).toHaveBeenCalled();
          done();
        }, 0);

      });

    });

  });

  describe('Update a form', function () {

    it('should allow elements to check if the form is disabled', function (done) {

      var TestInput = React.createClass({
        mixins: [Formsy.Mixin],
        render: function () {
          return <input value={this.getValue()}/>
        }
      });
      var TestForm = React.createClass({
        getInitialState: function () {
          return {disabled: true};
        },
        enableForm: function () {
          this.setState({
            disabled: false
          });
        },
        render: function () {
          return ( 
            <Formsy.Form onChange={this.onChange} disabled={this.state.disabled}> 
              <TestInput name="foo"/>
            </Formsy.Form>);
        }
      });
      var form = TestUtils.renderIntoDocument( 
        <TestForm/> 
      );

      var input = TestUtils.findRenderedComponentWithType(form, TestInput);
      expect(input.isFormDisabled()).toBe(true);
      form.enableForm();
      setTimeout(function () {
        expect(input.isFormDisabled()).toBe(false);
        done();
      }, 0);

    });

  });

  describe("value === false", function() {
    var onSubmit;
    var TestInput = React.createClass({
      mixins: [Formsy.Mixin],
      getDefaultProps: function() {
        return {
          type: "text",
        };
      },
      changeValue: function() {
        this.setValue(e.target[this.props.type === "checkbox" ? "checked" : "value"]);
      },
      render: function () {
        return <input type={ this.props.type } value={ this.getValue() } onChange={ this.changeValue }/>
      }
    });

    var TestForm = React.createClass({
      render: function () {
        return (
          <Formsy.Form onSubmit={ function(arg1) { onSubmit(arg1); } }>
            <TestInput name="foo" value={ this.props.value } type="checkbox" />
            <button type="submit">Save</button>
          </Formsy.Form>
        );
      }
    });

    beforeEach(function() {
      onSubmit = jasmine.createSpy("onSubmit");
    });

    it("should call onSubmit correctly", function() {
      var form = TestUtils.renderIntoDocument(<TestForm value={ false }/>);
      TestUtils.Simulate.submit(form.getDOMNode());
      expect(onSubmit).toHaveBeenCalledWith({foo: false});
    });

    it("should allow dynamic changes to false", function() {
      var form = TestUtils.renderIntoDocument(<TestForm value={ true }/>);
      form.setProps({value: false});
      TestUtils.Simulate.submit(form.getDOMNode());
      expect(onSubmit).toHaveBeenCalledWith({foo: false});
    });
  });
});
