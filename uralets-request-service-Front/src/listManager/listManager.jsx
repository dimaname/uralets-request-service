import * as React from 'react';
import {
    FormControl,
    FormGroup,
    Nav,
    NavItem,
    Table,
    Button,
    Alert,
    Glyphicon,
    DropdownButton,
    MenuItem
} from "react-bootstrap";
import {connect} from 'react-redux'
import {getPupilList, getTrainerList, matchPupilAndTrainer, updateSportsmenItem, updateTrainerItem} from "../reducers/requestReducer";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import moment from 'moment'
import DatePicker from "react-16-bootstrap-date-picker";
import {DATE_FORMAT, DAYS, MONTHS} from "../statics/calendar";

const classNames = require('classnames');
const styles = require('./listManager.css');

const TABS = {sportsmen: 0, trainer: 1};

export class ListManagerComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: TABS.sportsmen,
            componentPupilsList: [],
            componentTrainersList: [],
        };
        if (!props.requestState.isPupilListReady) {
            props.getPupilList();
        } else {
            this.state.componentPupilsList = matchPupilAndTrainer(props.requestState.pupilList, props.requestState.trainerList);
        }
        if (!props.requestState.isTrainerListReady) {
            props.getTrainerList();
        } else {
            this.state.componentTrainersList = props.requestState.trainerList;
        }
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.requestState.isPupilListReady && nextProps.requestState.isTrainerListReady) {
            const componentPupilsList = matchPupilAndTrainer(nextProps.requestState.pupilList, nextProps.requestState.trainerList);
            const componentTrainersList = nextProps.requestState.trainerList;
            this.setState({componentPupilsList, componentTrainersList});

        }
    }

    render() {
        const activeTab = this.state.activeTab;
        const alertHeader = this.state.alertHeader;
        const alertBody = this.state.alertBody;
        const isShowAlert = alertHeader && alertBody;
        return (
            <div className={styles.root}>
                {isShowAlert && <Alert bsStyle="danger" onDismiss={this.closeAlert}>
                    <h4>{alertHeader}</h4>
                    <p>
                        {alertBody}
                    </p>
                </Alert>}
                <Nav bsStyle="tabs" activeKey={activeTab} onSelect={this.setActiveTab}>
                    <NavItem eventKey={TABS.sportsmen}>
                        Список спортсменов
                    </NavItem>
                    <NavItem eventKey={TABS.trainer}>
                        Список тренеров
                    </NavItem>
                </Nav>

                {this.renderTabDataList()}

            </div>
        )
    }

    setActiveTab = (tab) => {
        this.closeAlert();
        this.clearEditModeInAllRowsOfActiveTab();
        this.setState({activeTab: tab});
    };

    clearEditModeInAllRowsOfActiveTab() {
        const tabData = this.getTabData();
        const tabDataField = this.getTabDataField();
        const updatedList = tabData.map(item => {
            const newItem = {
                ...item,
                editMode: false,
            };
            delete newItem.tempFio;
            delete newItem.tempBirthday;
            delete newItem.tempTrainer;
            return newItem;
        });
        this.setState({
            [tabDataField]: updatedList
        });
    }

    renderTabDataList() {
        const activeTab = this.state.activeTab;

        const isPupilListLoading = this.props.requestState.isPupilListLoading;
        const isTrainerListLoading = this.props.requestState.isTrainerListLoading;
        const isLoading = isTrainerListLoading || isPupilListLoading;
        const tabData = this.getTabData();
        const listIsEmpty = !isLoading && tabData && tabData.length === 0;

        return (
            <div>{isLoading && <div className='loader-wrapper'>
                <div className='loader'></div>
            </div>}
                <Table striped className={styles.table}>
                    <thead>
                    {this.getTabTableHeader()}
                    </thead>
                    <ReactCSSTransitionGroup
                        transitionName="fade"
                        transitionLeaveTimeout={300}
                        transitionEnterTimeout={500}
                        transitionEnter={false}
                        transitionLeave={false}
                        component="tbody"
                    >
                        {listIsEmpty && <tr>
                            <td colSpan='7' className={styles.emptyMessage}>
                                Список пуст. Добавьте новых
                                {activeTab === TABS.sportsmen ? 'спортсменов' : 'тренеров'}
                            </td>
                        </tr>}
                        {this.getTabTableRows()}
                    </ReactCSSTransitionGroup>
                </Table></div>)

    }

    getTabData() {
        const activeTab = this.state.activeTab;
        if (activeTab === TABS.sportsmen && this.props.requestState.isPupilListReady) {
            return this.state.componentPupilsList;
        }
        if (activeTab === TABS.trainer && this.props.requestState.isTrainerListReady) {
            return this.state.componentTrainersList;
        }
        return [];
    }

    getTabDataField() {
        const activeTab = this.state.activeTab;
        if (activeTab === TABS.sportsmen && this.props.requestState.isPupilListReady) {
            return 'componentPupilsList';
        }
        if (activeTab === TABS.trainer && this.props.requestState.isTrainerListReady) {
            return 'componentTrainersList';
        }
        return '';
    }

    getTabTableHeader() {
        const activeTab = this.state.activeTab;
        if (activeTab === TABS.sportsmen) {
            return <tr>
                <th className={styles.fioColumn}>Ф.И.О.</th>
                <th className={styles.datetimeColumn}>Дата рождения</th>
                <th className={styles.trainerColumn}>Тренер</th>
                <th className={styles.toolsColumn}></th>
            </tr>
        }
        if (activeTab === TABS.trainer) {
            return <tr>
                <th className={styles.fioColumn}>Ф.И.О.</th>
                <th className={styles.toolsColumn}></th>
            </tr>
        }
        return null;
    }

    getTabTableRows() {
        const activeTab = this.state.activeTab;
        const tabData = this.getTabData();

        return tabData.map((item, i) => {
            const editMode = item.editMode === true;
            let tableRows = [];
            if (activeTab === TABS.sportsmen)
                if (editMode)
                    tableRows = this.getEditableSportsmenRow(item, i);
                else
                    tableRows = this.getSportsmenRow(item, i);
            if (activeTab === TABS.trainer)
                if (editMode)
                    tableRows = this.getEditableTrainerRow(item, i);
                else
                    tableRows = this.getTrainerRow(item, i);
            return tableRows;
        });

    }

    getSportsmenRow(sportsmen, index) {
        const momentBirthday = moment.utc(sportsmen.birthday);
        const birthday = momentBirthday.isValid() ? momentBirthday.format("DD.MM.YYYY") : '';

        return <tr key={sportsmen.id}>
            <td>{sportsmen.fio}</td>
            <td>{birthday}</td>
            <td>{sportsmen.trainer.fio}</td>
            {this.getControlsColumn(index)}
        </tr>
    }

    getEditableSportsmenRow(sportsmen, index) {
        const trainersListForDD = this.state.componentTrainersList.map(item => {
            return {id: item.id, value: item.fio}
        });
        const momentBirthday = moment.utc(sportsmen.birthday);
        const birthday = momentBirthday.isValid() ? momentBirthday.toISOString() : '';
        const trainerFio = sportsmen.trainer && sportsmen.trainer.fio ? sportsmen.trainer.fio : 'Выберите тренера';
        return <tr key={sportsmen.id}>
            <td>
                <EditableField initialValue={sportsmen.fio} validateError={sportsmen.fioError}
                               disabled={sportsmen.isSaving} onChange={value => {
                    this.updateTabDataByIndex(index, {'tempFio': value});
                }}/>
            </td>
            <td>
                <EditableDatetimeField initialValue={birthday} validateError={sportsmen.birthdayError}
                                       disabled={sportsmen.isSaving}
                                       onChange={value => {
                                           this.updateTabDataByIndex(index, {'tempBirthday': value});
                                       }}/>
            </td>
            <td>
                <EditableDropdownField valueList={trainersListForDD} initialValue={trainerFio}
                                       validateError={sportsmen.trainerError} disabled={sportsmen.isSaving}
                                       onChange={selectedItem => {
                                           this.updateTabDataByIndex(index, {'tempTrainer': selectedItem});
                                       }}/>
            </td>
            {this.getEditModeControlsColumn(index, sportsmen.isSaving)}
        </tr>
    }

    getTrainerRow(trainer, index) {
        return <tr key={trainer.id}>
            <td>{trainer.fio}</td>
            {this.getControlsColumn(index)}
        </tr>
    }

    getEditableTrainerRow(trainer, index) {
        return <tr key={trainer.id}>
            <td>
                <EditableField initialValue={trainer.fio} validateError={trainer.fioError}
                               onChange={value => {
                                   this.updateTabDataByIndex(index, {'tempFio': value});
                               }}/>
            </td>
            {this.getEditModeControlsColumn(index)}
        </tr>
    }

    getControlsColumn(index) {
        return <td>
            <div className={styles.buttonsContainer}>
                <Button bsStyle="link" className={styles.editBtn} title="Редактировать"
                        onClick={this.onClickEditBtnHandler.bind(this, index)}><Glyphicon glyph="edit"/>
                </Button>
                <Button bsStyle="link" className={styles.removeBtn} title="Удалить"
                        onClick={this.onClickRemoveBtnHandler.bind(this, index)}><Glyphicon glyph="remove"/>
                </Button>
            </div>
        </td>
    }

    getEditModeControlsColumn(index, disabled = false) {
        return <td>
            <div className={styles.buttonsContainer}>
                <Button bsStyle="link" className={styles.editBtn} title="Сохранить" disabled={disabled}
                        onClick={this.onClickSaveBtnHandler.bind(this, index)}><Glyphicon glyph="floppy-disk"/>
                </Button>
                <Button bsStyle="link" className={styles.removeBtn} title="Отмена" disabled={disabled}
                        onClick={this.onClickCancelBtnHandler.bind(this, index)}><Glyphicon glyph="remove"/>
                </Button>
            </div>
        </td>
    }

    closeAlert = () => {
        this.setState({
            alertHeader: '',
            alertBody: '',
        });
    };
    onClickEditBtnHandler = (index) => {
        const activeTab = this.state.activeTab;
        const tabData = this.getTabData();
        const fields = {
            editMode: true
        };
        if (activeTab === TABS.sportsmen) {
            const sportsmen = tabData[index];
            fields.tempFio = sportsmen.fio;
            fields.tempBirthday = sportsmen.birthday;
            fields.tempTrainer = sportsmen.trainer;
        } else if (activeTab === TABS.trainer) {
            const trainer = tabData[index];
            fields.tempFio = trainer.fio;
        }
        this.updateTabDataByIndex(index, fields);
    };

    onClickRemoveBtnHandler = (index) => {
    };

    onClickSaveBtnHandler = async (index) => {
        const activeTab = this.state.activeTab;
        const tabData = this.getTabData();

        if (activeTab === TABS.sportsmen && this.validateSportsmenFields(index)) {
            const sportsmen = tabData[index];
            const sportsmenData = {
                id: sportsmen.id,
                ...sportsmen.tempFio !== sportsmen.fio && {fio: sportsmen.tempFio},
                ...sportsmen.tempBirthday !== sportsmen.birthday && {birthday: sportsmen.tempBirthday},
                ...sportsmen.tempTrainer.id !== sportsmen.trainer.id && {trainer: sportsmen.tempTrainer.id}
            };
            if (Object.keys(sportsmenData).length > 1) {
                this.updateTabDataByIndex(index, {isSaving: true});
                try {
                    await this.props.updateSportsmenItem(sportsmenData);
                    this.closeAlert();
                } catch (e) {
                    this.setState({
                        alertHeader: 'Ошибка при сохранении',
                        alertBody: 'Не удалось сохранить обновленную запись. Попробуйте сохранить ещё раз или обратитесь к администратору сервиса.',
                    });
                } finally {
                    this.updateTabDataByIndex(index, {isSaving: false});
                }
            } else {
                this.updateTabDataByIndex(index, {editMode: false});
            }
        } else if (activeTab === TABS.trainer && this.validateTrainerFields(index)) {
            const trainer = tabData[index];
            const trainerData = {
                id: trainer.id,
                ...trainer.tempFio !== trainer.fio && {fio: trainer.tempFio},
            };
            if (Object.keys(trainerData).length > 1) {
                this.updateTabDataByIndex(index, {isSaving: true});
                try {
                    await this.props.updateTrainerItem(trainerData);
                    this.closeAlert();
                } catch (e) {
                    this.setState({
                        alertHeader: 'Ошибка при сохранении',
                        alertBody: 'Не удалось сохранить обновленную запись. Попробуйте сохранить ещё раз или обратитесь к администратору сервиса.',
                    });
                } finally {
                    this.updateTabDataByIndex(index, {isSaving: false});
                }
            } else {
                this.updateTabDataByIndex(index, {editMode: false});
            }
        }



    };

    onClickCancelBtnHandler = (index) => {
        const activeTab = this.state.activeTab;
        const fields = {
            editMode: false
        };
        if (activeTab === TABS.sportsmen) {
            fields.tempFio = '';
            fields.tempBirthday = '';
            fields.tempTrainer = null;
        } else if (activeTab === TABS.trainer) {
            fields.tempFio = '';
        }
        this.updateTabDataByIndex(index, fields);
    };

    validateSportsmenFields(index) {
        const sportsmenList = this.state.componentPupilsList || [];
        const sportsmen = sportsmenList[index];
        let result = true;
        if (!sportsmen.tempFio || !sportsmen.tempBirthday || !sportsmen.tempTrainer) {
            result = false;
        }
        return result;
    };
    validateTrainerFields(index) {
        const trainerList = this.state.componentTrainersList || [];
        const trainer = trainerList[index];
        let result = true;
        if (!trainer.tempFio) {
            result = false;
        }
        return result;
    };


    updateTabDataByIndex = (index, fields) => {
        const tabData = this.getTabData();
        const tabDataField = this.getTabDataField();
        const updatedItem = {...tabData[index], ...fields};
        this.setState({
            [tabDataField]: [
                ...tabData.slice(0, index),
                updatedItem,
                ...tabData.slice(index + 1)
            ]
        });
    }


}


class EditableField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.initialValue
        }
    }

    render() {
        return <FormGroup bsSize="small" className={classNames(styles.editableField, styles.editableFioField)}
                          validationState={this.props.validateError || !this.state.value ? 'error' : null}>
            <FormControl
                type="text"
                maxLength="200"
                disabled={this.props.disabled}
                value={this.state.value || ''}
                onChange={this.onChange}
            />
        </FormGroup>
    }

    onChange = (event) => {
        this.setState({
            value: event.target.value
        });
        if (this.props.onChange) {
            this.props.onChange(event.target.value);
        }
    }
}

class EditableDatetimeField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.initialValue
        }
    }

    render() {
        return <FormGroup bsSize="small" className={classNames(styles.editableField, styles.editableDatetimeField)}
                          validationState={this.props.validateError || !this.state.value ? 'error' : null}>
            <DatePicker bsSize="small" dayLabels={DAYS} monthLabels={MONTHS} weekStartsOn={1} dateFormat={DATE_FORMAT}
                        value={this.state.value} disabled={this.props.disabled} onChange={this.onChange}
                        showClearButton={false}/>
        </FormGroup>
    }

    onChange = (value) => {
        this.setState({
            value
        });
        if (this.props.onChange) {
            this.props.onChange(value);
        }
    }
}

class EditableDropdownField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.initialValue,
        }
    }

    render() {
        const valueList = this.props.valueList;
        return <DropdownButton
            title={this.state.value}
            disabled={this.props.disabled}
            bsStyle={this.props.validateError || !this.state.value ? 'danger' : 'default'}
            id="trainer-dd-selector"
            bsSize="small"

        >
            {valueList.map((item, i) => {
                return <MenuItem eventKey={i} key={item.id} onSelect={this.onSelect}>{item.value}</MenuItem>
            })}
        </DropdownButton>
    }

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


export default connect(
    (state) => ({requestState: state.request}),
    {getTrainerList, getPupilList, updateSportsmenItem, updateTrainerItem}
)(ListManagerComponent);


