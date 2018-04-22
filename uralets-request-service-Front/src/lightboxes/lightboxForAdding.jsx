import * as React from 'react';
import {Modal, Button, Table, Checkbox} from 'react-bootstrap';
import {connect} from 'react-redux'
import {toggleLightbox, getPupilList, getTrainerList, addSelectedPupils} from '../reducers/requestReducer'
import moment from 'moment'

const styles = require('./lightboxForAdding.css');


export class LightboxForAddingComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            matchedPupilList: []
        };

        this.handleOnHideLightbox = this.handleOnHideLightbox.bind(this);
        this.handlePrimaryButton = this.handlePrimaryButton.bind(this);
        this.onModalOpen = this.onModalOpen.bind(this);

    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.requestState.isPupilListReady && nextProps.requestState.isTrainerListReady) {
            const matchedPupilList = this.matchPupilAndTrainer(nextProps.requestState.pupilList, nextProps.requestState.trainerList);
            this.setState({matchedPupilList});
        }
    }

    render() {
        const isLightboxOpened = this.props.requestState.isOpenLightboxForAdding;
        const isPupilListLoading = this.props.requestState.isPupilListLoading;
        const isTrainerListLoading = this.props.requestState.isTrainerListLoading;

        const matchedPupilList = this.state.matchedPupilList;
        const isLoading = isTrainerListLoading || isPupilListLoading;

        return (
            <Modal
                show={isLightboxOpened}
                onEntered={this.onModalOpen}
                onHide={this.handleOnHideLightbox}
                bsSize="large"
                aria-labelledby="contained-modal-title-lg">
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-lg">Выберите участников</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className={styles.userList}>
                        {isLoading && <div className='loader-wrapper'>
                            <div className='loader'></div>
                        </div>}
                        <Table striped hover className={styles.table}>
                            <thead>
                            {this.getHeader()}
                            </thead>
                            <tbody>
                            {matchedPupilList.map((item, i) => {
                                return this.getListItem(item, i);
                            })}
                            </tbody>
                        </Table>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.handlePrimaryButton} bsStyle="primary">Добавить участников</Button>
                    <Button onClick={this.handleOnHideLightbox}>Отмена</Button>
                </Modal.Footer>
            </Modal>
        )
    }

    getHeader() {
        return <tr>
            <th className={styles.firstColumn}></th>
            <th>Ф.И.О.</th>
            <th>Дата рождения</th>
            <th>Тренер</th>
        </tr>
    }

    getListItem(item, i) {
        const momemtBirthday = moment.utc(item.birthday);
        const birthday = momemtBirthday.isValid() ? momemtBirthday.format("DD.MM.YYYY") : '';

        return <tr key={i} onClick={this.updateMatchedPupilList.bind(this, item, i)}>
            <td><Checkbox className={styles.checkbox} readOnly checked={!!item.checked}
                          onClick={event => {
                              this.updateMatchedPupilList(item, i, event.target.checked);
                          }}
            /></td>
            <td>{item.fio}</td>
            <td>{birthday}</td>
            <td>{item.trainer.fio}</td>
        </tr>
    }

    matchPupilAndTrainer(pupilList = [], treainerList = []) {
        const trainerByIds = treainerList.reduce((result, trainer) => {
            result[trainer.id] = trainer;
            return result;
        }, {});

        return pupilList.map(pupil => {
            const trainerObj = trainerByIds[pupil.trainer] || {};
            return {...pupil, trainer: trainerObj};
        })
    }

    onModalOpen() {
        if (!this.props.requestState.isPupilListReady) {
            this.props.getPupilList();
        }
        if (!this.props.requestState.isTrainerListReady) {
            this.props.getTrainerList();
        }
    }

    handleOnHideLightbox() {
        this.props.toggleLightbox(false);
    }

    updateMatchedPupilList(pupil, index) {
        const matchedPupilList = this.state.matchedPupilList;
        const updatedMatchedPupilList = [
            ...matchedPupilList.slice(0, index),
            {...pupil, checked: !pupil.checked},
            ...matchedPupilList.slice(index + 1)
        ];

        this.setState({
            matchedPupilList: updatedMatchedPupilList
        });
    }

    handlePrimaryButton() {
        const selectedPupils = this.state.matchedPupilList.filter(item => item.checked);
        this.props.addSelectedPupils(selectedPupils);
        this.props.toggleLightbox(false);
    }
}

export default connect(
    (state) => ({requestState: state.request}),
    {toggleLightbox, getPupilList, getTrainerList, addSelectedPupils}
)(LightboxForAddingComponent);
