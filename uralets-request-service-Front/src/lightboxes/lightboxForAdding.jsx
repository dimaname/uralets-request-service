import * as React from 'react';
import {Modal, Button, Table, Checkbox, Glyphicon} from 'react-bootstrap';
import {connect} from 'react-redux'
import {toggleLightbox, getPupilList, getTrainerList, addSelectedPupils} from '../reducers/requestReducer'
import moment from 'moment'
import {EditableField} from "../listManager/editableField";

const styles = require('./lightboxForAdding.css');


export class LightboxForAddingComponent extends React.Component {
    constructor(props) {
        super(props);

        this.handleOnHideLightbox = this.handleOnHideLightbox.bind(this);
        this.handlePrimaryButton = this.handlePrimaryButton.bind(this);
        this.onModalOpen = this.onModalOpen.bind(this);
        let matchedPupilList = [];
        if (props.requestState.isPupilListReady && props.requestState.isTrainerListReady) {
            matchedPupilList = this.matchPupilAndTrainer(props.requestState.pupilList, props.requestState.trainerList);

        }
        this.state = {
            matchedPupilList,
            filterValue: '',
            isDisabledAddButton: true,
        };

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.requestState.isPupilListReady && nextProps.requestState.isTrainerListReady) {
            const matchedPupilList = this.matchPupilAndTrainer(nextProps.requestState.pupilList, nextProps.requestState.trainerList);
            this.setState({matchedPupilList});
        }
    }

    render() {
        const isPupilListLoading = this.props.requestState.isPupilListLoading;
        const isTrainerListLoading = this.props.requestState.isTrainerListLoading;
        const isLoading = isTrainerListLoading || isPupilListLoading;
        const filteredPupilList = this.getFilteredPupilList();
        const isDisabledAddButton = this.state.isDisabledAddButton;
        return (
            <Modal
                onEntered={this.onModalOpen}
                onHide={this.handleOnHideLightbox}
                bsSize="large"
                dialogClassName={styles.modalClass}
                show
                aria-labelledby="contained-modal-title-lg">
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-lg">Выберите участников</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className={styles.controlPanel}>
                        <EditableField placeholder='Введите имя спортсмена, дату рождения или имя тренера'
                                       icon={<Glyphicon glyph="search"/>}
                                       className={styles.filterField} middleSize onChange={this.filterHandler}/>
                        <Button onClick={this.handlePrimaryButton} bsStyle="primary" disabled={isDisabledAddButton}>Добавить
                            участников</Button>
                    </div>
                    <div className={styles.userList}>
                        {isLoading && <div className='loader-wrapper'>
                            <div className='loader'></div>
                        </div>}
                        <Table striped hover className={styles.table}>
                            <thead>
                            {this.getHeader()}
                            </thead>
                            <tbody>
                            {filteredPupilList.map((item) => {
                                return this.getListItem(item);
                            })}
                            </tbody>
                        </Table>
                    </div>
                </Modal.Body>
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

    getFilteredPupilList() {
        const filterValue = this.state.filterValue.trim().toLowerCase();
        const matchedPupilList = this.state.matchedPupilList || [];
        return matchedPupilList.filter(item => {
            const momentBirthday = moment.utc(item.birthday);
            const birthday = momentBirthday.isValid() ? momentBirthday.format("DD.MM.YYYY") : '';
            const searchString = (item.fio + birthday + (item.trainer.fio || '')).toLowerCase();
            return searchString.includes(filterValue);
        });
    }

    filterHandler = (filterValue) => {
        this.setState({filterValue});
    };

    getListItem(item) {
        const momemtBirthday = moment.utc(item.birthday);
        const birthday = momemtBirthday.isValid() ? momemtBirthday.format("DD.MM.YYYY") : '';

        return <tr key={item.id} onClick={this.toggleCheckOnPupil.bind(this, item)}>
            <td><Checkbox className={styles.checkbox} readOnly checked={!!item.checked}

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

    toggleCheckOnPupil(pupil) {
        const matchedPupilList = this.state.matchedPupilList;
        const index = matchedPupilList.findIndex(item => item.id === pupil.id);
        const updatedMatchedPupilList = [
            ...matchedPupilList.slice(0, index),
            {...pupil, checked: !pupil.checked},
            ...matchedPupilList.slice(index + 1)
        ];
        const isDisabledAddButton = updatedMatchedPupilList.every(item=>!item.checked);
        this.setState({
            matchedPupilList: updatedMatchedPupilList,
            isDisabledAddButton
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
