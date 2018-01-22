/**
 * Created by iamraphson on 9/24/16.
 */
import React from 'react';
import Formsy from 'formsy-react';

const MyTextarea = React.createClass({

    // Add the Formsy Mixin
    mixins: [Formsy.Mixin],

    // setValue() will set the value of the component, which in
    // turn will validate it and the rest of the form
    changeValue(event) {
        this.setValue(event.currentTarget.value);
    },
    render() {

        // Set a specific className based on the validation
        // state of this component. showRequired() is true
        // when the value is empty and the required prop is
        // passed to the input. showError() is true when the
        // value typed is invalid
        const className = 'form-group' + (this.props.className || ' ') +
            (this.showRequired() ? ' required' : this.showError() ? ' error' : '');

        // An error message is returned ONLY if the component is invalid
        // or the server has returned an error message
        const errorMessage = this.getErrorMessage();

        return (
            <div className={className}>
                <label htmlFor={this.props.name}>{this.props.title}</label>
                <textarea
                name={this.props.name}
                cols={this.props.cols || '20'}
                rows={this.props.rows || '3'}
                onChange={this.changeValue}
                placeholder={this.props.placeholder || ''}
                value={this.getValue() || ''} />
                <span className='validation-error'>{errorMessage}</span>
            </div>
    );
    }
});

export default MyTextarea;