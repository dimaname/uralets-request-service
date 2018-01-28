import * as React from 'react';
import {connect} from 'react-redux'
import {ButtonToolbar, Button, Table, FormGroup, FormControl, Glyphicon, Checkbox, Alert} from 'react-bootstrap';
import {toggleLightbox, updateSelectedPupils, removeFromSelectedPupils, sendRequestToServer} from '../reducers/requestReducer'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import LightboxForAddingComponent from '../lightboxes/lightboxForAdding'
import CategorySelector from '../categorySelector/categorySelector'
import moment from 'moment'

const styles = require('./requestList.css');


export class RequestListComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showValidationMessage: false,
            sendWithEmptyButtonDisabled: true,
        };

        this.handleAddBtnClick = this.handleAddBtnClick.bind(this);
        this.primaryButtonHandler = this.primaryButtonHandler.bind(this);
    }

    render() {
        const selectedPupils = this.props.requestState.selectedPupils;
        const listIsEmpty = selectedPupils.length === 0;
        const showValidationMessage = this.state.showValidationMessage;
        const sendWithEmptyButtonDisabled = this.state.sendWithEmptyButtonDisabled;
        return (
            <div className={styles.root}>
                <ButtonToolbar className={styles.toolbar}>
                    <Button bsStyle="primary" onClick={this.handleAddBtnClick} className={styles.toolbarBtn}>Добавить
                        участников</Button>
                    <Button bsStyle="success" onClick={this.primaryButtonHandler} disabled={listIsEmpty}>Отправить
                        заявку</Button>
                </ButtonToolbar>
                <LightboxForAddingComponent/>
                {showValidationMessage && <Alert bsStyle="danger" onDismiss={this.handleDismiss}>
                    <h4>Ошибка валидации!</h4>
                    <p>
                        Некоторые поля остались незаполненными. Заполните все пустые поля и повторите отправку.
                    </p>
                    <p>
                        <Checkbox inline  checked={!sendWithEmptyButtonDisabled} onChange={this.confirmEmptySend.bind(this)}>или подтвердите отправку незаполненной формы</Checkbox>
                        <Button bsStyle="danger" disabled={sendWithEmptyButtonDisabled} className={styles.emptySendBtn}>Отправить незаполненной</Button>
                    </p>
                </Alert>}
                <Table striped className={styles.table}>
                    <thead>
                    {this.getHeader()}
                    </thead>
                    <ReactCSSTransitionGroup
                        transitionName="fade"
                        transitionEnterTimeout={500}
                        transitionLeaveTimeout={300}
                        component="tbody"
                    >
                        {listIsEmpty && <tr>
                            <td colSpan='7' className={styles.emptyMessage}>Добавьте учатников соревнования чтобы
                                сформировать заявочный лист
                            </td>
                        </tr>}
                        {selectedPupils.map((item, i) => {
                            return this.getTableRow(item, i);
                        })}
                    </ReactCSSTransitionGroup>
                </Table>

            </div>
        )
    }

    getHeader() {
        return <tr>
            <th className={styles.firstColumn}>№</th>
            <th className={styles.fioColumn}>Ф.И.О.</th>
            <th className={styles.birthdayColumn}>Дата рождения</th>
            <th className={styles.weightColumn}>Весовая категория</th>
            <th className={styles.levelColumn}>Разряд</th>
            <th className={styles.departColumn}>Ведомство</th>
            <th className={styles.trainerColumn}>Тренер</th>
            <th className={styles.toolsColumn}></th>
        </tr>
    }

    getTableRow(item, i) {
        const momemtBirthday = moment(item.birthday);
        const birthday = momemtBirthday.isValid() ? momemtBirthday.format("DD.MM.YYYY") : '';

        return <tr key={item.frontId}>
            <td>{i + 1}.</td>
            <td>{item.fio}</td>
            <td>{birthday}</td>
            <td><FormGroup bsSize="small" className={styles.weightForm}
                           validationState={item.weightError && !item.weight ? 'error' : null}>
                <FormControl
                    type="number"
                    value={item.weight || ''}
                    onChange={(event) => {
                        this.updateItem(i, 'weight', event.target.value);
                    }}
                />
            </FormGroup></td>
            <td><CategorySelector error={item.levelError}
                                  value={item.level}
                                  onChange={this.updateItem.bind(this, i, 'level')}/>
            </td>
            <td align="center">МО</td>
            <td>{item.trainer.fio}</td>
            <td>
                <Button bsStyle="link" className={styles.removeBtn}
                        onClick={this.props.removeFromSelectedPupils.bind(null, i)}><Glyphicon glyph="remove"/>
                </Button>
            </td>
        </tr>
    }

    updateItem(index, propName, value) {
        if (!propName) return;

        this.props.updateSelectedPupils({index, props: {[propName]: value}});
    }

    handleAddBtnClick() {
        this.props.toggleLightbox(true);
    }

    confirmEmptySend(event){
        this.setState({
            sendWithEmptyButtonDisabled: !event.target.checked
        });
    }

    primaryButtonHandler() {
        if (!this.validateItems()) {
            this.setState({
                showValidationMessage: true,
                sendWithEmptyButtonDisabled: true
            });
            return;
        }
        this.props.sendRequestToServer();
    }

    validateItems() {
        const selectedPupils = this.props.requestState.selectedPupils;
        let isGood = true;
        selectedPupils.forEach((item, index) => {
            const props = {};
            if (!item.level) {
                props.levelError = true;
                isGood = false;
            }
            if (!item.weight) {
                props.weightError = true;
                isGood = false;
            }

            this.props.updateSelectedPupils({index, props});
        });

        return isGood;
    }

}


export default connect(
    (state) => ({requestState: state.request}),
    {toggleLightbox, updateSelectedPupils, removeFromSelectedPupils, sendRequestToServer}
)(RequestListComponent);

