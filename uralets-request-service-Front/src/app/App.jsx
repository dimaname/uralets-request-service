import React, { Component } from 'react';
import './App.css';
import RequestList from '../requestList/requestList';
import LoginPage from '../loginPage/loginPage';
import ListManagerComponent from '../listManager/listManager';
import Header from '../header/header';
import { Switch, Route, Redirect, HashRouter } from 'react-router-dom'
import { Grid, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux'
import { getApp } from '../reducers/appReducer'

class App extends Component {
  constructor(props) {
    super(props);
      this.state = {
        isLoading: true,        
      };
    }

  async componentWillMount(){
     //var app = await this.props.getApp();
     this.setState({isLoading: false});   
  }

  render() {     
    const isAuth = this.props.user.id !== null;
    const isLoading = this.state.isLoading;

    return <HashRouter>
     <div>
      <Header/> 
       <Grid>      
        <Row className="show-grid">
          <Col sm={12}>
            {!isLoading && 
              <Switch> 
                <Route path="/login" exact component={LoginPage}/>    
                <PrivateRoute path="/db" exact component={ListManagerComponent} isAuth={isAuth}/>
                <PrivateRoute path="/" component={RequestList} isAuth={isAuth}/>    
              </Switch>            
            }                   
          </Col>
        </Row>    
      </Grid>     
      </div> 
    </HashRouter>   
  }
}

const PrivateRoute = ({ component: Component, ...rest }) => {
  console.log(rest.isAuth)
  return <Route {...rest} render={props => (
    rest.isAuth ? (
      <Component {...props}/>
    ) : (
      <Redirect to='/login'/>
    )
  )}/>
}

export default connect(
    (state) => ({user: state.user}),  
    {
      getApp,
    }
  )(App);

