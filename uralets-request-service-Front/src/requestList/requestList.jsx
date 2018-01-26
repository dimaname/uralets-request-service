import * as React from 'react';
import {Link} from 'react-router-dom'
import { connect } from 'react-redux'
import {ButtonToolbar, Button} from 'react-bootstrap';
import { toggleLightbox } from '../reducers/requestReducer'
import LightboxForAddingComponent from '../lightboxes/lightboxForAdding'
const styles = require('./requestList.css');


export class RequestListComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};


        this.handleAddBtnClick = this.handleAddBtnClick.bind(this);

    }


    render() {
        const selectedPupils = this.props.selectedPupils;

        return (
            <div className={styles.root}>
                <ButtonToolbar>
                    <Button bsStyle="primary" onClick={this.handleAddBtnClick}>Добавить участников</Button>
                    <LightboxForAddingComponent />
                </ButtonToolbar>
                RequestListComponent
                <Link to='/login'>Login</Link>
            </div>
        )
    }

    handleAddBtnClick() {
        this.props.toggleLightbox(true);
    }


}

export default connect(
    (state) => ({requestState: state.request}),
    { toggleLightbox }
)(RequestListComponent);

