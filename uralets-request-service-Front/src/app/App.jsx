import React, { Component } from 'react';
import './App.css';
import RequestList from '../requestList/requestList';
import LoginPage from '../loginPage/loginPage';
import Header from '../header/header';
import { Switch, Route } from 'react-router-dom'

class App extends Component {
  render() {
    return (
      <div>
       <Header/>
       <Switch>       
        <Route path="/login" exact component={LoginPage}/>    
        <Route path="/" component={RequestList}/>    
       </Switch>     
      </div>
    );
  }
}

export default App;
