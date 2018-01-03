import React, { Component } from 'react';
import './App.css';
import RequestList from '../requestList/requestList';
import LoginPage from '../loginPage/loginPage';
import Header from '../header/header';
import { Switch, Route, Redirect } from 'react-router-dom'

class App extends Component {
  render() {
     
    const isAuth = false;
      return <div> 
        {isAuth && <Header/> }
        <Switch>       
         <Route path="/login" exact component={LoginPage}/>    
         <Route path="/" render={props => (isAuth ? (<RequestList/>) : (<Redirect to='/login'/>) )}/>    
        </Switch>           
      </div>   
  }
}

export default App;
