import * as React from 'react';
import {ControlLabel, DropdownButton, FormGroup, MenuItem} from "react-bootstrap";
const classNames = require('classnames');
const styles = require('./listManager.css');

export class EditableDropdownField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.initialValue || '',
        }
    }

    render() {
        const valueList = this.props.valueList;
        const title = this.state.value ? this.state.value : this.props.placeholder;
        return (
            <FormGroup bsSize="small" validationState={this.props.validateError ? 'error' : null}
                       className={classNames(styles.editableField, {[this.props.className]: this.props.className})}
            >
                {this.props.label && <ControlLabel className={styles.fieldLabel}>
                    {this.props.label}
                </ControlLabel>}

                <DropdownButton
                    title={title}
                    disabled={this.props.disabled}
                    bsStyle={this.props.validateError ? 'danger' : 'default'}
                    className={styles.editableFieldInput}
                    id="trainer-dd-selector"
                    bsSize="small"
                >
                    {valueList.map((item, i) => {
                        return <MenuItem eventKey={i} key={item.id} onSelect={this.onSelect}>{item.value}</MenuItem>
                    })}
                </DropdownButton>

            </FormGroup>)
    }

    setValue = (value) => {
        this.setState({value});
    };

    onSelect = (selectedIndex) => {
        const selectedItem = this.props.valueList[selectedIndex];
        this.setState({
            value: selectedItem.value
        });
        if (this.props.onChange) {
            this.props.onChange(selectedItem);
        }
    }
}