import * as React from 'react';
import {
    ControlLabel,
    FormControl,
    FormGroup,
    Nav,
    NavItem,
    Table,
    Button,
    Glyphicon,
    DropdownButton,
    MenuItem
} from "react-bootstrap";
import {connect} from 'react-redux'
import {getPupilList, getTrainerList, matchPupilAndTrainer} from "../reducers/requestReducer";
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

        return (
            <div className={styles.root}>
                <Nav bsStyle="tabs" activeKey={activeTab} onSelect={this.setActiveTab}>
                    <NavItem eventKey={TABS.sportsmen}>
                        Список спортсменов
                    </NavItem>
                    <NavItem eventKey={TABS.trainer}>
                        Список тренеров
                    </NavItem>
                </Nav>
                <AddRecordComponent/>
                {this.renderTabDataList()}

            </div>
        )
    }

    setActiveTab = (tab) => {
        this.setState({activeTab: tab});
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
            if (activeTab === TABS.sportsmen)
                if (editMode)
                    return this.getEditableSportsmenRow(item, i);
                else return this.getSportsmenRow(item, i);
            if (activeTab === TABS.trainer)
                if (editMode)
                    return this.getEditableTrainerRow(item, i);
                else
                    return this.getTrainerRow(item, i);
        })

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
        return <tr key={sportsmen.id}>
            <td>
                <EditableField initialValue={sportsmen.fio} validateError={sportsmen.fioError} onChange={value => {
                    this.updateTabDataByIndex(index, {'tempFio': value});
                }}/>
            </td>
            <td>
                <EditableDatetimeField initialValue={birthday} validateError={sportsmen.birthdayError}
                                       onChange={value => {
                                           this.updateTabDataByIndex(index, {'tempBirthday': value});
                                       }}/>
            </td>
            <td>
                <EditableDropdownField valueList={trainersListForDD} initialValue={sportsmen.trainer.fio}
                                       validateError={sportsmen.trainerError}
                                       onChange={selectedItem => {
                                           this.updateTabDataByIndex(index, {'tempTrainer': selectedItem});
                                       }}/>
            </td>
            {this.getEditModeControlsColumn(index)}
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

    getEditModeControlsColumn(index) {
        return <td>
            <div className={styles.buttonsContainer}>
                <Button bsStyle="link" className={styles.editBtn} title="Сохранить"
                        onClick={this.onClickSaveBtnHandler.bind(this, index)}><Glyphicon glyph="floppy-disk"/>
                </Button>
                <Button bsStyle="link" className={styles.removeBtn} title="Отмена"
                        onClick={this.onClickCancelBtnHandler.bind(this, index)}><Glyphicon glyph="remove"/>
                </Button>
            </div>
        </td>
    }

    onClickEditBtnHandler = (index) => {
        this.updateTabDataByIndex(index, {editMode: true});
    };

    onClickRemoveBtnHandler = (index) => {
    };
    onClickSaveBtnHandler = (index) => {

    };

    onClickCancelBtnHandler = (index) => {
        this.updateTabDataByIndex(index, {editMode: false});
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
                        value={this.state.value} onChange={this.onChange} showClearButton={false}/>
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
    {getTrainerList, getPupilList}
)(ListManagerComponent);


class AddRecordComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <FormGroup controlId="newFields">
                    <ControlLabel>Textarea</ControlLabel>
                    <FormControl componentClass="textarea" placeholder="textarea"/>
                </FormGroup>
            </div>
        )
    }


}
