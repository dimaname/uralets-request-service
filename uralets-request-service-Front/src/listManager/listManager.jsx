import * as React from 'react';
import {
    Nav,
    NavItem,
    Table,
    Button,
    Alert,
    Glyphicon,
    Modal,
} from "react-bootstrap";
import {connect} from 'react-redux'
import {
    deleteSportsmenItem, deleteTrainerItem, getPupilList, getTrainerList, matchPupilAndTrainer, updateSportsmenItem,
    updateTrainerItem
} from "../reducers/requestReducer";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import moment from 'moment'
import AddNewSportsmen from "./addNewSportsmen";
import AddNewTrainer from "./addNewTrainer";
import {EditableField} from "./editableField";
import {EditableDatetimeField} from "./editableDatetimeField";
import {EditableDropdownField} from "./editableDropdownField";


const styles = require('./listManager.css');

const TABS = {sportsmen: 0, trainer: 1};

export class ListManagerComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: TABS.sportsmen,
            componentPupilsList: [],
            componentTrainersList: [],
            showConfirmDelete: false,
            deleteItemData: null,
            alertHeader: '',
            alertBody: '',
            newPupilData: null,
            newTrainerData: null,
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

        return (
            <div className={styles.root}>
                {this.renderAlerts()}

                <Nav bsStyle="tabs" activeKey={activeTab} onSelect={this.setActiveTab}>
                    <NavItem eventKey={TABS.sportsmen}>
                        Список спортсменов
                    </NavItem>
                    <NavItem eventKey={TABS.trainer}>
                        Список тренеров
                    </NavItem>
                </Nav>
                {this.renderAddNewBlock()}
                {this.renderTabDataList()}
                {this.renderConfirmModal()}
            </div>
        )
    }

    closeConfirm = () => {
        this.setState({showConfirmDelete: false});
    };

    approveConfirm = () => {
        this.deleteTabDataItem();
        this.setState({showConfirmDelete: false});
    };

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

    renderAddNewBlock() {
        const activeTab = this.state.activeTab;
        if (activeTab === TABS.sportsmen) {
            return <AddNewSportsmen onAddError={this.showAddingErrorAlert} onAddSuccess={this.closeAlert}/>
        } else if (activeTab === TABS.trainer) {
            return <AddNewTrainer onAddError={this.showAddingErrorAlert} onAddSuccess={this.closeAlert}/>
        }

    }

    renderAlerts() {
        const {alertHeader, alertBody} = this.state;
        const isShowAlert = alertHeader && alertBody;
        if (!isShowAlert) return null;
        return (
            <Alert bsStyle="danger" onDismiss={this.closeAlert}>
                <h4>{alertHeader}</h4>
                <p>
                    {alertBody}
                </p>
            </Alert>

        )
    }

    renderConfirmModal() {
        const activeTab = this.state.activeTab;
        const showConfirmDelete = this.state.showConfirmDelete;
        const deleteItemData = this.state.deleteItemData;
        const confirmFio = deleteItemData && deleteItemData.fio ? deleteItemData.fio : '';
        let hasRelatedSportsmans = false;
        if (activeTab === TABS.trainer) {
            const trainerId = deleteItemData && deleteItemData.id;
            hasRelatedSportsmans = this.checkRelatedSportsmans(trainerId);
        }
        return (
            <Modal show={showConfirmDelete} onHide={this.closeConfirm} animation={false} backdrop='static'
                   dialogClassName={styles.confirmModal}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Точно удалить запись {confirmFio}?</Modal.Title>
                </Modal.Header>
                {hasRelatedSportsmans && <Modal.Body>
                    На данного тренера ссылаются некоторые записи о спортсменах. При его удалении, информация о ссылках
                    будет утрачена.
                </Modal.Body>}
                <Modal.Footer>
                    <Button bsStyle="danger" onClick={this.approveConfirm}>Удалить</Button>
                    <Button bsStyle="primary" onClick={this.closeConfirm}>Отменить</Button>
                </Modal.Footer>
            </Modal>
        )
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
                <Table hover striped className={styles.table}>
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
                                Список пуст. Добавьте новых&nbsp;
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
        const trStyle = sportsmen.isSaving ? styles.trDisabled : '';
        return <tr key={sportsmen.id} className={trStyle}>
            <td>{sportsmen.fio}</td>
            <td>{birthday}</td>
            <td>{sportsmen.trainer.fio}</td>
            {this.getControlsColumn(index, sportsmen.isSaving)}
        </tr>
    }

    getEditableSportsmenRow(sportsmen, index) {
        const trainersListForDD = this.getTrainersDropdownList();
        const momentBirthday = moment.utc(sportsmen.birthday);
        const birthday = momentBirthday.isValid() ? momentBirthday.toISOString() : '';
        const trainerFio = sportsmen.trainer && sportsmen.trainer.fio ? sportsmen.trainer.fio : null;
        const trStyle = sportsmen.isSaving ? styles.trDisabled : '';
        return <tr key={sportsmen.id} className={trStyle}>
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
                                       placeholder='Выберите тренера'
                                       validateError={sportsmen.trainerError} disabled={sportsmen.isSaving}
                                       onChange={selectedItem => {
                                           this.updateTabDataByIndex(index, {'tempTrainer': selectedItem});
                                       }}/>
            </td>
            {this.getEditModeControlsColumn(index, sportsmen.isSaving)}
        </tr>
    }

    getTrainersDropdownList() {
        return this.state.componentTrainersList.map(item => {
            return {id: item.id, value: item.fio}
        });
    }

    getTrainerRow(trainer, index) {
        const trStyle = trainer.isSaving ? styles.trDisabled : '';
        return <tr key={trainer.id} className={trStyle}>
            <td>{trainer.fio}</td>
            {this.getControlsColumn(index, trainer.isSaving)}
        </tr>
    }

    getEditableTrainerRow(trainer, index) {
        const trStyle = trainer.isSaving ? styles.trDisabled : '';
        return <tr key={trainer.id} className={trStyle}>
            <td>
                <EditableField initialValue={trainer.fio} validateError={trainer.fioError}
                               onChange={value => {
                                   this.updateTabDataByIndex(index, {'tempFio': value});
                               }}/>
            </td>
            {this.getEditModeControlsColumn(index)}
        </tr>
    }

    getControlsColumn(index, disabled = false) {
        return <td>
            <div className={styles.buttonsContainer}>
                <Button bsStyle="link" className={styles.editBtn} title="Редактировать" disabled={disabled}
                        onClick={this.onClickEditBtnHandler.bind(this, index)}><Glyphicon glyph="edit"/>
                </Button>
                <Button bsStyle="link" className={styles.removeBtn} title="Удалить" disabled={disabled}
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

    checkRelatedSportsmans(trainerId) {
        const pupilsList = this.state.componentPupilsList;
        return !!pupilsList.find(item => item.trainer.id === trainerId);
    }

    closeAlert = () => {
        this.setState({
            alertHeader: '',
            alertBody: '',
        });
    };

    showSavingErrorAlert = () => {
        this.setState({
            alertHeader: 'Ошибка при сохранении',
            alertBody: 'Не удалось сохранить обновленную запись. Попробуйте сохранить ещё раз или обратитесь к администратору сервиса.',
        });
    };

    showAddingErrorAlert = () => {
        this.setState({
            alertHeader: 'Ошибка при добавлении',
            alertBody: 'Не удалось добавить новую запись. Попробуйте ещё раз или обратитесь к администратору сервиса.',
        });
    };

    showDeletingErrorAlert = () => {
        this.setState({
            alertHeader: 'Ошибка при удалении',
            alertBody: 'Не удалось удалить запись. Попробуйте удалить ещё раз или обратитесь к администратору сервиса.',
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
        const activeTab = this.state.activeTab;
        const tabData = this.getTabData();

        if (activeTab === TABS.sportsmen) {
            const sportsmen = tabData[index];
            this.setState({showConfirmDelete: true, deleteItemData: {id: sportsmen.id, fio: sportsmen.fio, index}});
        } else if (activeTab === TABS.trainer) {
            const trainer = tabData[index];
            this.setState({showConfirmDelete: true, deleteItemData: {id: trainer.id, fio: trainer.fio, index}});
        }
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
                    this.showSavingErrorAlert();
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
                    this.showSavingErrorAlert();
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
            fields.fioError = false;
            fields.birthdayError = false;
        } else if (activeTab === TABS.trainer) {
            fields.tempFio = '';
            fields.fioError = false;
        }
        this.updateTabDataByIndex(index, fields);
    };

    validateSportsmenFields(index) {
        const sportsmenList = this.state.componentPupilsList || [];
        const sportsmen = sportsmenList[index];
        let result = true;
        const errorsFields = {
            fioError: false,
            birthdayError: false,
        };
        if (!sportsmen.tempFio) {
            errorsFields.fioError = true;
            result = false;
        }
        if (!sportsmen.tempBirthday) {
            errorsFields.birthdayError = true;
            result = false;
        }
        this.updateTabDataByIndex(index, errorsFields);
        return result;
    };

    validateTrainerFields(index) {
        const trainerList = this.state.componentTrainersList || [];
        const trainer = trainerList[index];
        let result = true;
        const errorsFields = {
            fioError: false
        };
        if (!trainer.tempFio) {
            errorsFields.fioError = true;
            result = false;
        }
        this.updateTabDataByIndex(index, errorsFields);
        return result;
    };

    async deleteTabDataItem() {
        const {id, index} = this.state.deleteItemData;
        const activeTab = this.state.activeTab;
        let deleteAction;
        if (activeTab === TABS.sportsmen) {
            deleteAction = this.props.deleteSportsmenItem;
        } else if (activeTab === TABS.trainer) {
            deleteAction = this.props.deleteTrainerItem;
        }
        if (!deleteAction) return;
        this.updateTabDataByIndex(index, {isSaving: true});
        try {
            await deleteAction(id);
            this.closeAlert();
        } catch (e) {
            this.updateTabDataByIndex(index, {isSaving: false});
            this.showDeletingErrorAlert();
        } finally {
            this.setState({deleteItemData: null});
        }
    }

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


export default connect(
    (state) => ({requestState: state.request}),
    {getTrainerList, getPupilList, updateSportsmenItem, updateTrainerItem, deleteSportsmenItem, deleteTrainerItem}
)(ListManagerComponent);


