import * as React from 'react';
import {ControlLabel, FormControl, FormGroup, InputGroup} from "react-bootstrap";

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
        const size = this.props.middleSize ? {} : {'bsSize': 'small'};
        const formInput = <FormControl
            className={classNames(styles.editableFieldInput, styles.editableFioField)}
            type="text"
            maxLength="200"
            disabled={this.props.disabled}
            placeholder={this.props.placeholder || ''}
            value={this.state.value || ''}
            onChange={this.onChange}
        />;
        return <FormGroup {...size}
                          className={classNames(styles.editableField, {[this.props.className]: this.props.className})}
                          validationState={this.props.validateError ? 'error' : null}>
            {this.props.label && <ControlLabel className={styles.fieldLabel}>
                {this.props.label}
            </ControlLabel>}
            {this.props.icon ? <InputGroup>
                <InputGroup.Addon>{this.props.icon}</InputGroup.Addon>
                {formInput}
            </InputGroup> : formInput}

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