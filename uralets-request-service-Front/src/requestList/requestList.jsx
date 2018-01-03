import * as React from 'react';
import { Link } from 'react-router-dom'
const styles = require('./requestList.css');



export class RequestListComponent extends React.Component{
    componentDidMount() {
       
    }

    render() {
      return (
        <div className={styles.root}>
         RequestListComponent
         <Link to='/login'>Login</Link>
        </div>
      )
    }
  
}
export default RequestListComponent;