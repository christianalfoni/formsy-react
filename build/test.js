var React = require('react');
var Formsy = require('./../src/main.js');

var Input = React.createClass({

  mixins: [Formsy.Mixin],

  render: function () {
    return <input disabled={this.isFormDisabled()} />
  }
});

var FormApp = React.createClass({
  getInitialState: function () {
    return {
      bool: true
    };
  },
  flip: function () {
    this.setState({
      bool: !this.state.bool
    });
  },
  render: function () {
    return (
      <Formsy.Form disabled={this.state.bool}>
        {this.state.bool ?
          <Input name="foo" /> :
          <Input name="bar" />   
        }
      </Formsy.Form>
    );
  }
});

React.render(<FormApp />, document.getElementById('app'));