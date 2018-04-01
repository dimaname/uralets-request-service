import * as React from 'react';
import {ControlLabel, FormControl, FormGroup, Nav, NavItem, Table, Button, Glyphicon} from "react-bootstrap";
import {connect} from 'react-redux'
import {getPupilList, getTrainerList, matchPupilAndTrainer} from "../reducers/requestReducer";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import moment from 'moment'

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
        }
        if (!props.requestState.isTrainerListReady) {
            props.getTrainerList();
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

    renderTabDataList(){
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

    getTabData(){
        const activeTab = this.state.activeTab;
        if (activeTab === TABS.sportsmen && this.props.requestState.isPupilListReady) {
            return this.state.componentPupilsList;
        }
        if (activeTab === TABS.trainer && this.props.requestState.isTrainerListReady) {
            return this.state.componentTrainersList;
        }
        return [];
    }   
    getTabDataField(){
        const activeTab = this.state.activeTab;
        if (activeTab === TABS.sportsmen && this.props.requestState.isPupilListReady) {
            return 'componentPupilsList';
        }
        if (activeTab === TABS.trainer && this.props.requestState.isTrainerListReady) {
            return 'componentTrainersList';
        }
        return '';
    } 
    getTabTableHeader(){
        const activeTab = this.state.activeTab;
        if(activeTab === TABS.sportsmen){
             return <tr>
                <th className={styles.fioColumn}>Ф.И.О.</th>
                <th>Дата рождения</th>
                <th className={styles.trainerColumn}>Тренер</th>
                <th className={styles.toolsColumn}> </th>
            </tr>
        }
        if(activeTab === TABS.trainer){
             return <tr>
                <th className={styles.fioColumn}>Ф.И.О.</th>
                <th className={styles.toolsColumn}> </th>
            </tr>
        }
        return null;
    }

    getTabTableRows(){
        const activeTab = this.state.activeTab;
        const tabData = this.getTabData();
        return tabData.map( (item, i) => {
            if(activeTab === TABS.sportsmen)
                return this.getSportsmenRow(item, i);
            if(activeTab === TABS.trainer)
                return this.getTrainerRow(item, i);
        })

    }
    getSportsmenRow(sportsmen, index){
        const momemtBirthday = moment(sportsmen.birthday);
        const birthday = momemtBirthday.isValid() ? momemtBirthday.format("DD.MM.YYYY") : '';
        const editMode = sportsmen.editMode === true;

        return <tr key={sportsmen.id} >
            <td>{editMode ? sportsmen.fio : 'AAAA'}</td>
            <td>{birthday}</td>
            <td>{sportsmen.trainer.fio}</td>
            {this.getControlsColumn(index)}     
        </tr>
    }  
    getTrainerRow(trainer, index){
        return <tr key={trainer.id} >
            <td>{trainer.fio}</td>   
            {this.getControlsColumn(index)}     
        </tr>
    }

    getControlsColumn(index){
       return  <td>
       <div className={styles.buttonsContainer}>
           <Button bsStyle="link" className={styles.editBtn}
                    onClick={this.onClickEditBtnHandler.bind(this, index)}><Glyphicon glyph="edit"/>
            </Button>
            <Button bsStyle="link" className={styles.removeBtn}
                    onClick={this.onClickRemoveBtnHandler.bind(this, index)}><Glyphicon glyph="remove"/>
            </Button>
        </div>
        </td>
    }

    onClickEditBtnHandler = (index) => {
        this.updateTabDataByIndex (index, {editMode : true});
    }

    onClickRemoveBtnHandler = (index) => {}

    updateTabDataByIndex = (index, fields) => {
        const tabData = this.getTabData();
        const tabDataField = this.getTabDataField();
        const updatedItem = {...tabData[index], ...fields};
        this.setState({[tabDataField]: [
            ...tabData.slice(0, index),
            updatedItem,
            ...tabData.slice(index + 1)
        ] });   
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
