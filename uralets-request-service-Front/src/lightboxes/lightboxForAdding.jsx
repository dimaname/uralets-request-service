import * as React from 'react';
import {Modal, Button, Col, Row} from 'react-bootstrap';
import {connect} from 'react-redux'
import {toggleLightbox, getPupilList} from '../reducers/requestReducer'
import * as moment from 'moment';

const styles = require('./lightboxForAdding.css');


export class LightboxForAddingComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.props.getPupilList();

        this.handleOnHideLightbox = this.handleOnHideLightbox.bind(this);

    }

    render() {
        const isLightboxOpened = this.props.requestState.isOpenLightboxForAdding;
        const isPupilListLoading = this.props.requestState.isPupilListLoading;
        const pupilList = this.props.requestState.pupilList;
        return (
            <Modal
                show={isLightboxOpened}
                onHide={this.handleOnHideLightbox}
                bsSize="large"
                aria-labelledby="contained-modal-title-lg">
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-lg">Добавить участников</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className={styles.userList}>
                        {isPupilListLoading && <div className='loader-wrapper'>
                            <div className='loader'></div>
                        </div>}
                        {pupilList.map(item => {
                            return this.getListItem(item);
                        })}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="primary">Добавить участников</Button>
                    <Button onClick={this.handleOnHideLightbox}>Отмена</Button>
                </Modal.Footer>
            </Modal>
        )
    }

    getListItem(item) {
        const momemtBirthday = moment(item.birthday);
        const birthday = momemtBirthday.isValid() ? momemtBirthday.format("DD.MM.YYYY") : '';

        return <Row key={item.id}>
            <Col xs={5}>{item.fio}</Col>
            <Col xs={3}>{birthday}</Col>
            <Col xs={4}>{item.trainer}</Col>
        </Row>
    }

    handleOnHideLightbox() {
        this.props.toggleLightbox(false);
    }
}

export default connect(
    (state) => ({requestState: state.request}),
    {toggleLightbox, getPupilList}
)(LightboxForAddingComponent);
