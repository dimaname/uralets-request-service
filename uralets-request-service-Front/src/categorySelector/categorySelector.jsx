import * as React from 'react';
import {SplitButton, MenuItem} from 'react-bootstrap';

const styles = require('./categorySelector.css');


export default class CategorySelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedValue: props.value || '',
            categoriesList: ['б/р', '3ю', '2ю', '1ю', '3', '2', '1', 'КМС', 'МС']
        };
    }


    render() {
        const selectedValue = this.state.selectedValue;
        const categoriesList = this.state.categoriesList;
        const isError = !!this.props.error && !selectedValue;

        return (
            <SplitButton title={selectedValue}
                         className={styles.dd}
                         bsStyle={isError ? 'danger' : 'default'}
                         id="category-dd-selector"
                         bsSize="small">
                {categoriesList.map((item, i) => {
                    return <MenuItem eventKey={i} key={i} onSelect={this.onSelectHandler.bind(this)}>{item}</MenuItem>
                })}
            </SplitButton>);
    }

    onSelectHandler(selectedIndex) {
        const categoriesList = this.state.categoriesList;
        const selectedValue = categoriesList[selectedIndex];
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(selectedValue);
        }
        this.setState({selectedValue});
    }
}
