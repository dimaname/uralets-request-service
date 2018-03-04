import * as React from 'react';
import {ControlLabel, FormControl, FormGroup, Nav, NavItem} from "react-bootstrap";
import {connect} from 'react-redux'
import {getPupilList, getTrainerList} from "../reducers/requestReducer";

const styles = require('./listManager.css');

const TABS = {sportsman: 0, trainer: 1};

export class ListManagerComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: TABS.sportsman,
        };
    }

    componentDidMount() {
        this.getTabData(TABS.sportsman);
    }

    render() {
        const activeTab = this.state.activeTab;

        return (
            <div className={styles.root}>
                <Nav bsStyle="tabs" activeKey={activeTab} onSelect={this.getTabData}>
                    <NavItem eventKey={TABS.sportsman}>
                        Список спортсменов
                    </NavItem>
                    <NavItem eventKey={TABS.trainer}>
                        Список тренеров
                    </NavItem>
                </Nav>
                <AddRecordComponent/>

            </div>
        )
    }

    getTabData = (tab) => {
        const {isTrainerListReady, isPupilListReady} = this.props.requestState;
        if (tab === TABS.sportsman && !isPupilListReady) {
            this.props.getPupilList();
        } else if (tab === TABS.trainer && !isTrainerListReady) {
            this.props.getTrainerList();
        }

        this.setState({activeTab: tab});
    };

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
