var React = require('react');
var ReactDOM = require('react-dom');
var Formsy = require('./../src/main.js');

var Input = React.createClass({

  mixins: [Formsy.Mixin],
  onChange: function (event) {
    this.setValue(event.currentTarget.value);
  },
  render: function () {
    return (
      <div>
      {this.showRequired() ? 'required' : ''}
      <input disabled={this.isFormDisabled()} value={this.getValue()} onChange={this.onChange}/>
      </div>
    );
  }
});

var SomeComp = React.createClass({
  getInitialState: function () {
    return  {
      isRequired: false
    };
  },
  toggleRequired: function () {
    this.setState({
      isRequired: !this.state.isRequired
    });
  },
  render: function () {
    return (
      <div>
        <Input name="foo[0]" value={''} validations="isEmail" validationError="No email" required={this.state.isRequired}/>
        <button onClick={this.toggleRequired}>Test</button>
      </div>
    )
  }
});

var FormApp = React.createClass({
  onSubmit: function (model) {
    console.log('model', model);
  },
  render: function () {
    return (
      <Formsy.Form ref="form" onSubmit={this.onSubmit}>
        <SomeComp/>
      </Formsy.Form>
    );
  }
});

ReactDOM.render(<FormApp />, document.getElementById('app'));
