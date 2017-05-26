import React from 'react';
import Formsy from 'formsy-react';
import createReactClass from 'create-react-class';

const MyRadioGroup = createReactClass({
  mixins: [Formsy.Mixin],

  componentDidMount() {
    const value = this.props.value;
    this.setValue(value);
    this.setState({ value });
  },

  changeValue(value) {
    this.setValue(value);
    this.setState({ value });
  },

  render() {
    const className = 'form-group' + (this.props.className || ' ') +
      (this.showRequired() ? 'required' : this.showError() ? 'error' : '');
    const errorMessage = this.getErrorMessage();

    const { name, title, items } = this.props;
    return (
      <div className={className}>
        <label htmlFor={name}>{title}</label>
        {items.map((item, i) => (
          <div key={i}>
            <input
              type="radio"
              name={name}
              onChange={this.changeValue.bind(this, item)}
              checked={this.state.value === item}
            />
            <span>{item.toString()}</span>
          </div>
        ))
        }
        <span className='validation-error'>{errorMessage}</span>
      </div>
    );
  }

});

export default MyRadioGroup;
