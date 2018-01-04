import React, { Component } from 'react';
import './App.css';
import RequestList from '../requestList/requestList';
import LoginPage from '../loginPage/loginPage';
import Header from '../header/header';
import { checkUserAuth } from '../utils/auth';
import { Switch, Route, Redirect } from 'react-router-dom'
import { Grid, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux'
import { getSavedUserToken } from '../reducers/userReducer'

function mapStateToProps(state) {
  return {
    user: state.user,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getSavedUserToken: getSavedUserToken(dispatch),
  }
}

class App extends Component {
  componentWillMount(){
    this.props.getSavedUserToken();
  }

  render() {     
    const isAuth = checkUserAuth(this.props.user);

    return <div> 
      <Header/> 
       <Grid>      
        <Row className="show-grid">
          <Col sm={9} sm-offset={3} >
            <Switch>       
             <Route path="/login" exact component={LoginPage}/>    
             <Route path="/" render={props => (isAuth ? 
              (<RequestList/>) : 
              (<Redirect to='/login'/>) )}/>    
            </Switch>
          </Col>
        </Row>    
      </Grid>      
    </div>   
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
