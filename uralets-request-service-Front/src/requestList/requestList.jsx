import * as React from 'react';
import {connect} from 'react-redux'
import {ButtonToolbar, Button, Table, DropdownButton, MenuItem} from 'react-bootstrap';
import {toggleLightbox, updateSelectedPupils} from '../reducers/requestReducer'
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
                    <tbody>
                    {listIsEmpty && <tr>
                        <td colSpan='7' className={styles.emptyMessage}>Добавьте учатников соревнования чтобы
                            сформировать заявочный лист
                        </td>
                    </tr>}
                    {selectedPupils.map((item, i) => {
                        return this.getTableRow(item, i);
                    })}

                    </tbody>
                </Table>

            </div>
        )
    }

    getHeader() {
        return <tr>
            <th className={styles.firstColumn}>№п/п</th>
            <th className={styles.fioColumn}>Ф.И.О.</th>
            <th className={styles.birthdayColumn}>Дата рождения</th>
            <th className={styles.weightColumn}>Весовая категория</th>
            <th className={styles.levelColumn}>Разряд</th>
            <th className={styles.departColumn}>Ведомство</th>
            <th className={styles.trainerColumn}>Тренер</th>
        </tr>
    }

    getTableRow(item, i) {
        const momemtBirthday = moment(item.birthday);
        const birthday = momemtBirthday.isValid() ? momemtBirthday.format("DD.MM.YYYY") : '';

        return <tr key={i}>
            <td>{i + 1}.</td>
            <td>{item.fio}</td>
            <td>{birthday}</td>
            <td></td>
            <td><CategorySelector error={item.levelError} value={item.level} onChange={this.updateItem.bind(this, i, 'level')}/>
            </td>
            <td align="center">МО</td>
            <td>{item.trainer.fio}</td>
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
            if(!item.level){
                this.props.updateSelectedPupils({index, props: {'levelError': true}});
                isGood = false;
            }
        });

        return isGood;
    }

}


export default connect(
    (state) => ({requestState: state.request}),
    {toggleLightbox, updateSelectedPupils}
)(RequestListComponent);

