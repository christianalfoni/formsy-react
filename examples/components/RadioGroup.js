import React from 'react';
import { withFormsy } from 'formsy-react';

class MyRadioGroup extends React.Component {
  state = {};

  componentDidMount() {
    const value = this.props.value;
    this.props.setValue(value);
    this.setState({ value });
  }

  changeValue = (value) => {
    this.props.setValue(value);
    this.setState({ value });
  }

  render() {
    const className = 'form-group' + (this.props.className || ' ') +
      (this.props.showRequired() ? 'required' : this.props.showError() ? 'error' : '');
    const errorMessage = this.props.getErrorMessage();

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
}

export default withFormsy(MyRadioGroup);
