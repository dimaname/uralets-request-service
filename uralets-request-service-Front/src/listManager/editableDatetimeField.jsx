import * as React from 'react';
import {ControlLabel, FormGroup} from "react-bootstrap";
import DatePicker from "react-16-bootstrap-date-picker";
import {DATE_FORMAT, DAYS, MONTHS} from "../statics/calendar";

const classNames = require('classnames');
const styles = require('./listManager.css');

export class EditableDatetimeField extends React.Component {
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

            <DatePicker
                style={{display: 'inline-block'}}
                dayLabels={DAYS} monthLabels={MONTHS} weekStartsOn={1}
                dateFormat={DATE_FORMAT}
                className={classNames(styles.editableFieldInput, styles.editableDatetimeField)}
                value={this.state.value} disabled={this.props.disabled} onChange={this.onChange}
                showClearButton={false}/>


        </FormGroup>
    }
    setValue = (value) => {
        this.setState({value});
    };


    onChange = (value) => {
        this.setState({
            value
        });
        if (this.props.onChange) {
            this.props.onChange(value);
        }
    }
}