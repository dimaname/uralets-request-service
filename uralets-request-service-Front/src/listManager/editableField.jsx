import * as React from 'react';
import {ControlLabel, FormControl, FormGroup} from "react-bootstrap";

const classNames = require('classnames');
const styles = require('./listManager.css');

export class EditableField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.initialValue
        }
    }

    render() {
        return <FormGroup bsSize="small"
                          className={classNames(styles.editableField, {[this.props.className]: this.props.className})}
                          validationState={this.props.validateError ? 'error' : null}>
            {this.props.label && <ControlLabel className={styles.fieldLabel}>
                {this.props.label}
            </ControlLabel>}

            <FormControl
                className={classNames(styles.editableFieldInput, styles.editableFioField)}
                type="text"
                maxLength="200"
                disabled={this.props.disabled}
                placeholder={this.props.placeholder || ''}
                value={this.state.value || ''}
                onChange={this.onChange}
            />
        </FormGroup>
    }

    setValue = (value) => {
        this.setState({value});
    };

    onChange = (event) => {
        this.setState({
            value: event.target.value
        });
        if (this.props.onChange) {
            this.props.onChange(event.target.value);
        }
    }
}