import * as React from 'react';
import {connect} from 'react-redux'
import {Button, Form, Glyphicon} from "react-bootstrap";
import {EditableField} from "./editableField";
import {EditableDatetimeField} from "./editableDatetimeField";
import {EditableDropdownField} from "./editableDropdownField";
import {addSportsmenItem} from "../reducers/requestReducer";

const styles = require('./listManager.css');

class AddNewSportsmen extends React.Component {
    _fioField = null;
    _birthdayField = null;
    _trainerField = null;

    constructor(props) {
        super(props);

        this.updateField = this.updateField.bind(this);
        this.clearAllFields = this.clearAllFields.bind(this);
        this.onClickAddNewBtnHandler = this.onClickAddNewBtnHandler.bind(this);

        const trainersList = props.requestState.trainerList.map(item => {
            return {id: item.id, value: item.fio}
        });


        this.state = {
            fio: '',
            fioError: false,
            birthday: '',
            birthdayError: false,
            trainer: '',
            trainerError: false,
            trainersList,
            isSaving: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.requestState.isPupilListReady && nextProps.requestState.isTrainerListReady) {
            const trainersList = nextProps.requestState.trainerList.map(item => {
                return {id: item.id, value: item.fio}
            });
            this.setState({trainersList});
        }
    }


    render() {
        const {trainersList, fioError, birthdayError, trainerError, isSaving} = this.state;
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
                        <EditableDatetimeField label="Дата рождения" className={styles.editableFieldAddNewBlock}
                                               validateError={birthdayError} disabled={isSaving}
                                               ref={(child) => {
                                                   this._birthdayField = child;
                                               }}
                                               onChange={this.updateField.bind(this, 'birthday')}/>
                        <EditableDropdownField valueList={trainersList} placeholder='Выберите тренера'
                                               validateError={trainerError} disabled={isSaving}
                                               ref={(child) => {
                                                   this._trainerField = child;
                                               }}
                                               label="Тренер" className={styles.editableFieldAddNewBlock}
                                               onChange={this.updateField.bind(this, 'trainer')}/>
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
        const {fio, birthday, trainer} = this.state;
        if (!this.validateFields()) {
            return;
        }
        this.setState({isSaving: true});
        this.props.addSportsmenItem({
            fio, birthday, trainer: trainer.id,
        }).then(() => {
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
        this._birthdayField.setValue('');
        this._trainerField.setValue('');
        this.setState({
            fio: '',
            fioError: false,
            birthday: '',
            birthdayError: false,
            trainer: '',
            trainerError: false,
        });
    };

    validateFields() {
        const {fio, birthday} = this.state;
        let result = true;
        const errorsFields = {
            fioError: false,
            birthdayError: false,
        };
        if (!fio) {
            errorsFields.fioError = true;
            result = false;
        }
        if (!birthday) {
            errorsFields.birthdayError = true;
            result = false;
        }
        this.setState(errorsFields);
        return result;
    };

}


export default connect(
    (state) => ({requestState: state.request}),
    {addSportsmenItem}
)(AddNewSportsmen);
