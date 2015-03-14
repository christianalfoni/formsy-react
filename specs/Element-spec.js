var Formsy = require('./../src/main.js');

describe('Element', function() {

  it('should return passed and setValue() value when using getValue()', function () {
    
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
      <Formsy.Form>
        <TestInput name="foo" value="foo"/>
      </Formsy.Form>
    );

    var input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    expect(input.getDOMNode().value).toBe('foo');
    TestUtils.Simulate.change(input, {target: {value: 'foobar'}});
    expect(input.getDOMNode().value).toBe('foobar');

  });

  it('should return true or false when calling hasValue() depending on value existance', function () {
    
    var reset = null;
    var TestInput = React.createClass({
      mixins: [Formsy.Mixin],
      componentDidMount: function () {
        reset = this.resetValue;
      },
      updateValue: function (event) {
        this.setValue(event.target.value);
      },
      render: function () {
        return <input value={this.getValue()} onChange={this.updateValue}/>
      }
    });
    var form = TestUtils.renderIntoDocument(
      <Formsy.Form>
        <TestInput name="foo" value="foo"/>
      </Formsy.Form>
    );

    var input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    reset();
    expect(input.getDOMNode().value).toBe('');

  });

  it('should return error message passed when calling getErrorMessage()', function () {
    
    var getErrorMessage = null;
    var TestInput = React.createClass({
      mixins: [Formsy.Mixin],
      componentDidMount: function () {
        getErrorMessage = this.getErrorMessage;
      },
      updateValue: function (event) {
        this.setValue(event.target.value);
      },
      render: function () {
        return <input value={this.getValue()} onChange={this.updateValue}/>
      }
    });
    var form = TestUtils.renderIntoDocument(
      <Formsy.Form>
        <TestInput name="foo" value="foo" validations="isEmail" validationError="Has to be email"/>
      </Formsy.Form>
    );

    expect(getErrorMessage()).toBe('Has to be email');

  });

  it('should return server error message when calling getErrorMessage()', function (done) {
    
    jasmine.Ajax.install();

    var getErrorMessage = null;
    var TestInput = React.createClass({
      mixins: [Formsy.Mixin],
      componentDidMount: function () {
        getErrorMessage = this.getErrorMessage;
      },
      updateValue: function (event) {
        this.setValue(event.target.value);
      },
      render: function () {
        return <input value={this.getValue()} onChange={this.updateValue}/>
      }
    });
    var form = TestUtils.renderIntoDocument(
      <Formsy.Form url="/users">
        <TestInput name="foo" value="foo" validations="isEmail" validationError="Has to be email"/>
      </Formsy.Form>
    );

    var form = TestUtils.Simulate.submit(form.getDOMNode());

    jasmine.Ajax.requests.mostRecent().respondWith({
      status: 500,
      contentType: 'application/json',
      responseText: '{"foo": "bar"}'
    })

    setTimeout(function () {
      expect(getErrorMessage()).toBe('bar');
      jasmine.Ajax.uninstall();
      done();
    }, 0);

  });

  it('should return true or false when calling isValid() depending on valid state', function () {
    
    var isValid = null;
    var TestInput = React.createClass({
      mixins: [Formsy.Mixin],
      componentDidMount: function () {
        isValid = this.isValid;
      },
      updateValue: function (event) {
        this.setValue(event.target.value);
      },
      render: function () {
        return <input value={this.getValue()} onChange={this.updateValue}/>
      }
    });
    var form = TestUtils.renderIntoDocument(
      <Formsy.Form url="/users">
        <TestInput name="foo" value="foo" validations="isEmail"/>
      </Formsy.Form>
    );

    expect(isValid()).toBe(false);
    var input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    TestUtils.Simulate.change(input, {target: {value: 'foo@foo.com'}});
    expect(isValid()).toBe(true);

  });

  it('should return true or false when calling isRequired() depending on passed required attribute', function () {
    
    var isRequireds = [];
    var TestInput = React.createClass({
      mixins: [Formsy.Mixin],
      componentDidMount: function () {
        isRequireds.push(this.isRequired);
      },
      updateValue: function (event) {
        this.setValue(event.target.value);
      },
      render: function () {
        return <input value={this.getValue()} onChange={this.updateValue}/>
      }
    });
    var form = TestUtils.renderIntoDocument(
      <Formsy.Form url="/users">
        <TestInput name="foo" value="foo"/>
        <TestInput name="foo" value="foo" required/>
      </Formsy.Form>
    );

    expect(isRequireds[0]()).toBe(false);
    expect(isRequireds[1]()).toBe(true);

  });

  it('should return true or false when calling showRequired() depending on input being empty and required is passed, or not', function () {
    
    var showRequireds = [];
    var TestInput = React.createClass({
      mixins: [Formsy.Mixin],
      componentDidMount: function () {
        showRequireds.push(this.showRequired);
      },
      updateValue: function (event) {
        this.setValue(event.target.value);
      },
      render: function () {
        return <input value={this.getValue()} onChange={this.updateValue}/>
      }
    });
    var form = TestUtils.renderIntoDocument(
      <Formsy.Form url="/users">
        <TestInput name="A" value="foo"/>
        <TestInput name="B" value="" required/>
        <TestInput name="C" value=""/>
      </Formsy.Form>
    );

    expect(showRequireds[0]()).toBe(false);
    expect(showRequireds[1]()).toBe(true);
    expect(showRequireds[2]()).toBe(false);

  });

  it('should return true or false when calling showError() depending on value is invalid or a server error has arrived, or not', function (done) {

    var showError = null;
    var TestInput = React.createClass({
      mixins: [Formsy.Mixin],
      componentDidMount: function () {
        showError = this.showError;
      },
      updateValue: function (event) {
        this.setValue(event.target.value);
      },
      render: function () {
        return <input value={this.getValue()} onChange={this.updateValue}/>
      }
    });
    var form = TestUtils.renderIntoDocument(
      <Formsy.Form url="/users">
        <TestInput name="foo" value="foo" validations="isEmail" validationError="This is not an email"/>
      </Formsy.Form>
    );

    expect(showError()).toBe(true);

    var input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    TestUtils.Simulate.change(input, {target: {value: 'foo@foo.com'}});
    expect(showError()).toBe(false);

    jasmine.Ajax.install();
    TestUtils.Simulate.submit(form.getDOMNode());    
    jasmine.Ajax.requests.mostRecent().respondWith({
      status: 500,
      responseType: 'application/json',
      responseText: '{"foo": "Email already exists"}'
    });
    setTimeout(function () {
      expect(showError()).toBe(true);
      jasmine.Ajax.uninstall();
      done();
    }, 0);
  });

  it('should return true or false when calling isPristine() depending on input has been "touched" or not', function () {
    
    var isPristine = null;
    var TestInput = React.createClass({
      mixins: [Formsy.Mixin],
      componentDidMount: function () {
        isPristine = this.isPristine;
      },
      updateValue: function (event) {
        this.setValue(event.target.value);
      },
      render: function () {
        return <input value={this.getValue()} onChange={this.updateValue}/>
      }
    });
    var form = TestUtils.renderIntoDocument(
      <Formsy.Form url="/users">
        <TestInput name="A" value="foo"/>
      </Formsy.Form>
    );

    expect(isPristine()).toBe(true);
    var input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    TestUtils.Simulate.change(input, {target: {value: 'foo'}});
    expect(isPristine()).toBe(false);
    
  });

it('should allow an undefined value to be updated to a value', function (done) {
    var TestInput = React.createClass({
      mixins: [Formsy.Mixin],
      render: function () {
        return <input value={this.getValue()}/>
      }
    });
    var TestForm = React.createClass({
      getInitialState: function () {
        return {value: undefined};
      },
      changeValue: function () {
        this.setState({
          value: 'foo'
        });
      },
      render: function () {
        return (
          <Formsy.Form url="/users">
            <TestInput name="A" value={this.state.value}/>
          </Formsy.Form>
        );
      }
    });
    var form = TestUtils.renderIntoDocument(
      <TestForm/>
    );

    form.changeValue();
    var input = TestUtils.findRenderedDOMComponentWithTag(form, 'INPUT');
    setTimeout(function () {
      expect(input.getDOMNode().value).toBe('foo');
      done();
    }, 0);
  });  

it('should be able to dynamically change validations', function (done) {

    var isInvalid = false;
    var TestInput = React.createClass({
      mixins: [Formsy.Mixin],
      render: function () {
        return <input value={this.getValue()}/>
      }
    });
    var TestForm = React.createClass({
      getInitialState: function () {
        return {value: 'foo@bar.com', validations: 'isEmail'};
      },
      changeValidations: function () {
        this.setState({
          validations: 'equals:foo'
        });
      },
      setInvalid: function () {
        console.log('Running it!');
        isInvalid = true;
      },
      render: function () {
        return (
          <Formsy.Form url="/users" onInvalid={this.setInvalid}>
            <TestInput name="A" validations={this.state.validations} value={this.state.value}/>
          </Formsy.Form>
        );
      }
    });
    var form = TestUtils.renderIntoDocument(
      <TestForm/>
    );

    form.changeValidations();
    setTimeout(function () {
      expect(isInvalid).toBe(true);
      done();
    }, 0);
  });  

});
