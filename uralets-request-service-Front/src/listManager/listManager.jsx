import * as React from 'react';
import {ControlLabel, FormControl, FormGroup, Nav, NavItem, Table} from "react-bootstrap";
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
            matchedPupilList: [],
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
            const matchedPupilList = matchPupilAndTrainer(nextProps.requestState.pupilList, nextProps.requestState.trainerList);
            this.setState({matchedPupilList});
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
            return this.state.matchedPupilList;
        }
        if (activeTab === TABS.trainer && this.props.requestState.isTrainerListReady) {
            return this.props.requestState.trainerList;
        }
        return [];
    } 
    getTabTableHeader(){
        const activeTab = this.state.activeTab;
        if(activeTab === TABS.sportsmen){
             return <tr>
                <th>Ф.И.О.</th>
                <th>Дата рождения</th>
                <th>Тренер</th>
            </tr>
        }
        if(activeTab === TABS.trainer){
             return <tr>
                <th>Ф.И.О.</th>
            </tr>
        }
        return null;
    }

    getTabTableRows(){
        const activeTab = this.state.activeTab;
        const tabData = this.getTabData();
        return tabData.map(item => {
            if(activeTab === TABS.sportsmen)
                return this.getSportsmenRow(item);
            if(activeTab === TABS.trainer)
                return this.getTrainerRow(item);
        })

    }
    getSportsmenRow(sportsmen){
        const momemtBirthday = moment(sportsmen.birthday);
        const birthday = momemtBirthday.isValid() ? momemtBirthday.format("DD.MM.YYYY") : '';

        return <tr key={sportsmen.id} >
            <td>{sportsmen.fio}</td>
            <td>{birthday}</td>
            <td>{sportsmen.trainer.fio}</td>
        </tr>
    }  
    getTrainerRow(trainer){
        return <tr key={trainer.id} >
            <td>{trainer.fio}</td>        
        </tr>
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
