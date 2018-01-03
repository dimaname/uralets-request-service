import React, { Component } from 'react';
import './App.css';
import RequestList from '../requestList/requestList';
import LoginPage from '../loginPage/loginPage';
import { Switch, Route } from 'react-router-dom'

class App extends Component {
  render() {
    return (
      <div>
       <Switch>
        <Route path="/" exact component={RequestList}/>
        <Route path="/login" exact component={LoginPage}/>        
       </Switch>     
      </div>
    );
  }
}

export default App;
