import * as React from 'react';
import { Link } from 'react-router-dom'
const styles = require('./listManager.css');



export class ListManagerComponent extends React.Component{
    componentDidMount() {
       
    }

    render() {
      return (
        <div className={styles.root}>
         ListManagerComponent
         <Link to='/login'>Login</Link>
        </div>
      )
    }
  
}
export default ListManagerComponent;