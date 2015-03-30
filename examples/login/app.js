var React = require('react');
var Formsy = require('./../..');

var App = React.createClass({
  getInitialState: function() {
    return { canSubmit: false };
  },
  submit: function (data) {
    alert(JSON.stringify(data, null, 4));
  },
  enableButton: function () {
    this.setState({
      canSubmit: true
    });
  },
  disableButton: function () {
    this.setState({
      canSubmit: false
    });
  },
  render: function () {
    return (
      <Formsy.Form onSubmit={this.submit} onValid={this.enableButton} onInvalid={this.disableButton} className="login">
        <MyOwnInput name="email" title="Email" validations="isEmail" validationError="This is not a valid email" required />
        <MyOwnInput name="password" title="Password" type="password" required />
        <button type="submit" disabled={!this.state.canSubmit}>Submit</button>
      </Formsy.Form>
    );
  }
});

var MyOwnInput = React.createClass({

  // Add the Formsy Mixin
  mixins: [Formsy.Mixin],

  // setValue() will set the value of the component, which in 
  // turn will validate it and the rest of the form
  changeValue: function (event) {
    this.setValue(event.currentTarget.value);
  },
  render: function () {

    // Set a specific className based on the validation
    // state of this component. showRequired() is true 
    // when the value is empty and the required prop is 
    // passed to the input. showError() is true when the 
    // value typed is invalid
    var className = this.props.className + ' ' + (this.showRequired() ? 'required' : this.showError() ? 'error' : null);

    // An error message is returned ONLY if the component is invalid
    // or the server has returned an error message
    var errorMessage = this.getErrorMessage();

    return (
      <div className='form-group'>
        <label htmlFor={this.props.name}>{this.props.title}</label>
        <input type={this.props.type || 'text'} name={this.props.name} onChange={this.changeValue} value={this.getValue()}/>
        <span className='validation-error'>{errorMessage}</span>
      </div>
    );
  }
});

React.render(<App/>, document.getElementById('example'));