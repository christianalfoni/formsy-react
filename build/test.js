var React = require('react');
var Formsy = require('./../src/main.js');

var Input = React.createClass({

  mixins: [Formsy.Mixin],

  render: function () {
    return (
      <div>
      {this.showError()}
      {this.getErrorMessage()}
      <input disabled={this.isFormDisabled()} />
      </div>
    );
  }
});

var FormApp = React.createClass({
  componentDidMount: function () {
    this.refs.form.updateInputsWithError({
      'foo.bar': 'hmmm'
    });
  },
  onSubmit: function (model) {
    console.log('model', model);
  },
  render: function () {
    return (
      <Formsy.Form ref="form" onInvalid={this.onInvalid}>
        <Input name="foo.bar" />
      </Formsy.Form>
    );
  }
});

React.render(<FormApp />, document.getElementById('app'));