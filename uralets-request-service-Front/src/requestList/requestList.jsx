import * as React from 'react';
import {connect} from 'react-redux'
import {
    ButtonToolbar,
    Button,
    Table,
    Form,
    FormGroup,
    FormControl,
    Glyphicon,
    Checkbox,
    Alert,
    ControlLabel,
    Col
} from 'react-bootstrap';
import MaskedFormControl from 'react-bootstrap-maskedinput'

import {
    toggleLightbox,
    updateSelectedPupils,
    removeFromSelectedPupils,
    setCompetitionTitle,
    sendRequestToServer
} from '../reducers/requestReducer'
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
            isSending: false,
            isSuccessSendingMessage: false,
            isErrorSendingMessage: false,
            competitionTitleError: false,
            sendingErrorText: '',
        };

        this.handleAddBtnClick = this.handleAddBtnClick.bind(this);
        this.primaryButtonHandler = this.primaryButtonHandler.bind(this);
        this.emptySendButtonHandler = this.emptySendButtonHandler.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const {selectedPupils} = nextProps.requestState;
        if (selectedPupils.length === 0) {
            this.setState({
                isErrorSendingMessage: false,
                isSuccessSendingMessage: false,
                competitionTitleError: false,
                showValidationMessage: false,
                sendingErrorText: '',
            });
        }
    }

    render() {
        const {selectedPupils, isOpenLightboxForAdding} = this.props.requestState;
        const listIsEmpty = selectedPupils.length === 0;
        const isSending = this.state.isSending;

        return (
            <div className={styles.root}>
                {isOpenLightboxForAdding && <LightboxForAddingComponent/>}
                {isSending && <div className='loader-wrapper'>
                    <div className='loader'/>
                </div>}
                <ButtonToolbar className={styles.toolbar}>
                    <Button bsStyle="primary" onClick={this.handleAddBtnClick} className={styles.toolbarBtn}>Добавить
                        участников</Button>
                    <Button bsStyle="success" onClick={this.primaryButtonHandler} disabled={listIsEmpty}>Отправить
                        заявку</Button>
                </ButtonToolbar>
                {this.showAlerts()}
                {this.renderCompetitionTitle()}

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
                            <td colSpan='7' className={styles.emptyMessage}>Добавьте участников соревнования чтобы
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

    renderCompetitionTitle() {
        const {competitionTitle} = this.props.requestState;
        const competitionTitleError = this.state.competitionTitleError;

        return <Form horizontal>
            <Col componentClass={ControlLabel} sm={5} md={4}>
                Краткое название соревнования
            </Col>
            <Col sm={7} md={8}>
                <FormGroup bsSize="small" validationState={competitionTitleError ? 'error' : null}>
                    <FormControl
                        type="text"
                        maxLength="150"
                        value={competitionTitle}
                        onChange={this.competitionTitleHandler}
                    />
                </FormGroup>
            </Col>
        </Form>
    }

    showAlerts() {
        const showValidationMessage = this.state.showValidationMessage;
        const sendWithEmptyButtonDisabled = this.state.sendWithEmptyButtonDisabled;
        const isSuccessSendingMessage = this.state.isSuccessSendingMessage;
        const isErrorSendingMessage = this.state.isErrorSendingMessage;
        const sendingErrorText = this.state.sendingErrorText;

        return (<div>
                {isSuccessSendingMessage && <Alert bsStyle="success">
                    <strong>Заявка успешно отправлена!</strong>
                </Alert>}
                {isErrorSendingMessage && <Alert bsStyle="danger">
                    <strong><Glyphicon glyph="exclamation-sign"/> Внимание! </strong>
                    Произошла ошибка при отправке заявки. Попробуйте ещё раз или обратитесь к администратору сервиса.
                    {sendingErrorText && <div>
                        <h5>Текст ошибки:</h5>
                        <code>{sendingErrorText}</code>
                    </div>}
                </Alert>}
                {showValidationMessage && <Alert bsStyle="danger">
                    <h4>Ошибка валидации!</h4>
                    <p>
                        Некоторые поля остались незаполненными. Заполните все пустые поля и повторите отправку.
                    </p>
                    <p>
                        <Checkbox inline checked={!sendWithEmptyButtonDisabled}
                                  onChange={this.confirmEmptySend.bind(this)}>или подтвердите отправку незаполненной
                            формы</Checkbox>
                        <Button bsStyle="danger" disabled={sendWithEmptyButtonDisabled} className={styles.emptySendBtn}
                                onClick={this.emptySendButtonHandler}>Отправить незаполненной</Button>
                    </p>
                </Alert>}
            </div>
        );
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
        const momemtBirthday = moment.utc(item.birthday);
        const birthday = momemtBirthday.isValid() ? momemtBirthday.format("DD.MM.YYYY") : '';
        const rules = {
            '+': {
                validate: function (char) {
                    return /[0-9+]/.test(char)
                },
            }
        };
        return <tr key={item.frontId}>
            <td>{i + 1}.</td>
            <td>{item.fio}</td>
            <td>{birthday}</td>
            <td><FormGroup bsSize="small" className={styles.weightForm}
                           validationState={item.weightError && !item.weight ? 'error' : null}>
                <MaskedFormControl type='text' name='weight' mask='+111' placeholder="+___"
                                   formatCharacters={rules} className={styles.weightInput}
                                   onChange={(event) => {
                                       const weight = event.target.value.replace(/([^0-9a-z+]|'_')/gi, '')
                                       this.updateItem(i, 'weight', weight);
                                   }}/>
            </FormGroup></td>
            <td><CategorySelector error={item.levelError}
                                  value={item.level}
                                  onChange={this.updateItem.bind(this, i, 'level')}/>
            </td>
            <td align="center">МО</td>
            <td>{item.trainer.fio}</td>
            <td>
                <Button bsStyle="link" className={styles.removeBtn}
                        onClick={() => this.removeItem(i)}><Glyphicon glyph="remove"/>
                </Button>
            </td>
        </tr>
    }

    removeItem = (index) => {
        this.props.removeFromSelectedPupils(index);
    };

    updateItem(index, propName, value) {
        if (!propName) return;

        this.props.updateSelectedPupils({index, props: {[propName]: value}});
    }

    competitionTitleHandler = (event) => {
        const competitionTitleError = this.state.competitionTitleError;
        if (competitionTitleError) {
            this.setState({competitionTitleError: false});
        }
        this.props.setCompetitionTitle(event.target.value);
    };

    handleAddBtnClick() {
        this.props.toggleLightbox(true);
    }

    confirmEmptySend(event) {
        this.setState({
            sendWithEmptyButtonDisabled: !event.target.checked
        });
    }

    primaryButtonHandler() {
        if (!this.validateFormFields()) {
            this.setState({
                showValidationMessage: true,
                sendWithEmptyButtonDisabled: true,
                isSuccessSendingMessage: false,
                isErrorSendingMessage: false,
                sendingErrorText: '',
            });
            return;
        } else {
            this.setState({
                showValidationMessage: false,
                isSending: true,
            });
        }
        this.sendRequestList();
    }

    emptySendButtonHandler() {
        this.setState({
            showValidationMessage: false,
            sendWithEmptyButtonDisabled: true,
            isSending: true,
        });

        this.sendRequestList();
    }

    async sendRequestList() {
        this.setState({isSuccessSendingMessage: false, isErrorSendingMessage: false, sendingErrorText: ''});
        const newState = {};
        try {
            await this.props.sendRequestToServer();
            this.clearItemsErrors();
            this.clearCompetitionTitleError();
            newState.isSending = false;
            newState.isSuccessSendingMessage = true;

        } catch (e) {
            newState.isSending = false;
            newState.isErrorSendingMessage = true;
            newState.sendingErrorText = e.message;
        }
        this.setState(newState);

    }

    validateFormFields() {
        const {selectedPupils, competitionTitle} = this.props.requestState;
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

        if (competitionTitle.length === 0) {
            this.setState({competitionTitleError: true});
            isGood = false;
        }

        return isGood;
    }

    clearItemsErrors() {
        const selectedPupils = this.props.requestState.selectedPupils;
        let isGood = true;
        selectedPupils.forEach((item, index) => {
            const props = {
                levelError: false,
                weightError: false,
            };

            this.props.updateSelectedPupils({index, props});
        });
    }
    clearCompetitionTitleError() {
        this.setState({competitionTitleError: false});
    }
}


export default connect(
    (state) => ({requestState: state.request}),
    {toggleLightbox, updateSelectedPupils, removeFromSelectedPupils, sendRequestToServer, setCompetitionTitle}
)(RequestListComponent);

