import * as React from 'react';
import {connect} from 'react-redux'
import {Button, Form, Glyphicon} from "react-bootstrap";
import {EditableField} from "./editableField";
import {addTrainerItem} from "../reducers/requestReducer";

const styles = require('./listManager.css');

class AddNewSportsmen extends React.Component {
    _fioField = null;

    constructor(props) {
        super(props);
        this.state = {
            fio: '',
            fioError: false,
            isSaving: false,
        };
        this.updateField = this.updateField.bind(this);
        this.clearAllFields = this.clearAllFields.bind(this);
        this.onClickAddNewBtnHandler = this.onClickAddNewBtnHandler.bind(this);

    }

    render() {
        const {fioError, isSaving} = this.state;
        return (
            <div className={styles.addNewRowBlock}>
                <h4 className={styles.addNewRowBlockHeader}>Добавить нового</h4>

                <Form inline className={styles.addNewRowBlockForm}>
                    <div>
                        <EditableField placeholder='Ф.И.О.' label="Введите Ф.И.О." validateError={fioError}
                                       disabled={isSaving} ref={(child) => {
                            this._fioField = child;
                        }}
                                       className={styles.editableFieldAddNewBlock}
                                       onChange={this.updateField.bind(this, 'fio')}/>
                    </div>
                    <div className={styles.buttonsContainer}>
                        <Button bsStyle="link" className={styles.editBtn} title="Добавить"
                                onClick={this.onClickAddNewBtnHandler}>
                            <Glyphicon glyph="plus"/>
                        </Button>
                        <Button bsStyle="link" className={styles.removeBtn} title="Очистить"
                                onClick={this.clearAllFields}>
                            <Glyphicon glyph="remove"/>
                        </Button>
                    </div>
                </Form>
            </div>
        )
    }

    updateField(fieldName, value) {
        this.setState({
            [fieldName]: value,
        });
    };

    onClickAddNewBtnHandler() {
        const {fio} = this.state;
        if (!this.validateFields()) {
            return;
        }
        this.setState({isSaving: true});
        this.props.addTrainerItem({fio}).then(() => {
            this.setState({isSaving: false});
            this.clearAllFields();
            if (typeof this.props.onAddSuccess === "function") {
                this.props.onAddSuccess();
            }
        }).catch(() => {
            if (typeof this.props.onAddError === "function") {
                this.props.onAddError();
            }
            this.setState({isSaving: false});
        });
    };

    clearAllFields() {
        this._fioField.setValue('');
        this.setState({
            fio: '',
            fioError: false,
        });
    };

    validateFields() {
        const {fio} = this.state;
        let result = true;
        const errorsFields = {
            fioError: false
        };
        if (!fio) {
            errorsFields.fioError = true;
            result = false;
        }
        this.setState(errorsFields);
        return result;
    };

}


export default connect(
    (state) => ({}),
    {addTrainerItem}
)(AddNewSportsmen);
