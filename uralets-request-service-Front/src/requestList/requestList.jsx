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
        this.handleOnHideLightbox = this.handleOnHideLightbox.bind(this);
    }


    componentDidMount() {

    }

    render() {
        const isLightboxOpened = this.props.requestState.isOpenLightboxForAdding;
        return (
            <div className={styles.root}>
                <ButtonToolbar>
                    <Button bsStyle="primary" onClick={this.handleAddBtnClick}>Добавить участника</Button>
                    <LightboxForAddingComponent show={isLightboxOpened} onHide={this.handleOnHideLightbox} />
                </ButtonToolbar>
                RequestListComponent
                <Link to='/login'>Login</Link>
            </div>
        )
    }

    handleAddBtnClick() {
        this.props.toggleLightbox(true);
    }
    handleOnHideLightbox() {
        this.props.toggleLightbox(false);
    }

}

export default connect(
    (state) => ({requestState: state.request}),
    { toggleLightbox }
)(RequestListComponent);

