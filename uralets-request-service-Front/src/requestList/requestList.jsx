import * as React from 'react';
import {connect} from 'react-redux'
import {ButtonToolbar, Button, Table, FormGroup, FormControl, Glyphicon} from 'react-bootstrap';
import {toggleLightbox, updateSelectedPupils, removeFromSelectedPupils} from '../reducers/requestReducer'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import LightboxForAddingComponent from '../lightboxes/lightboxForAdding'
import CategorySelector from '../categorySelector/categorySelector'
import * as moment from 'moment';

const styles = require('./requestList.css');


export class RequestListComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.handleAddBtnClick = this.handleAddBtnClick.bind(this);
        this.primaryButtonHandler = this.primaryButtonHandler.bind(this);
    }

    render() {
        const selectedPupils = this.props.requestState.selectedPupils;
        const listIsEmpty = selectedPupils.length === 0;
        return (
            <div className={styles.root}>
                <ButtonToolbar className={styles.toolbar}>
                    <Button bsStyle="primary" onClick={this.handleAddBtnClick} className={styles.toolbarBtn}>Добавить
                        участников</Button>
                    <Button bsStyle="success" onClick={this.primaryButtonHandler} disabled={listIsEmpty}>Отправить
                        заявку</Button>
                </ButtonToolbar>
                <LightboxForAddingComponent/>
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
            <td>{i + 1}.{item.frontId}</td>
            <td>{item.fio}</td>
            <td>{birthday}</td>
            <td><FormGroup bsSize="small" className={styles.weightForm}
                           validationState={item.weightError && !item.weight ? 'error' : null}>
                <FormControl
                    type="text"
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

    primaryButtonHandler() {
        if (!this.validateItems()) {
            return;
        }
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
    {toggleLightbox, updateSelectedPupils, removeFromSelectedPupils}
)(RequestListComponent);

