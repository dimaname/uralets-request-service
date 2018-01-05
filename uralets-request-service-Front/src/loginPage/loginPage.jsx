import * as React from 'react';
import { Form, FormGroup,FormControl, Col, Button, ControlLabel } from 'react-bootstrap';
import { Redirect } from 'react-router-dom'
import { checkUserAuth } from '../utils/auth';
import { getUserTokenFromApi } from '../reducers/userReducer'
import { connect } from 'react-redux'
import '../app/App.css'
const styles = require('./loginPage.css');

export class LoginPageComponent extends React.Component{
    constructor(props) {
		super(props);
	    this.state = {
	      isLoading: false,
	      loginValid: null,
	      passwordValid: null,
	      login: '',
	      password: ''
	    };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    render() {
    	const isAuth = checkUserAuth(this.props.user);
        const isLoading = this.state.isLoading;
		
		if(isAuth){
		 	return (<Redirect to={'/'}/>)
		} 

        return ( <div style={{width:'100%'}}> 
        {isLoading && <div className='loader-wrapper'><div className='loader'></div></div>}		     	
	    <Form horizontal className={styles['form']}>
	       <FormGroup controlId="formHorizontalLogin" validationState={this.state.loginValid} >
		    	<Col componentClass={ControlLabel} sm={4}>
		       		Пользователь
		      	</Col>
			    <Col sm={4}>
			      <FormControl 
			      type="text" 
			      name="login"	  
			      placeholder="Имя пользователя"
			      value={this.state.login}			     
		       	  onChange={this.handleChange} 
		         />
			    </Col>
		    </FormGroup>

		    <FormGroup controlId="formHorizontalPassword" validationState={this.state.passwordValid}>
		      <Col componentClass={ControlLabel} sm={4}>
		        Пароль
		      </Col>
		      <Col sm={4}>
		        <FormControl 
		        type="password"	
		        name="password"	        
		        placeholder="Пароль" 
		        value={this.state.password} 		       
		        onChange={this.handleChange} 
		        />
		      </Col>
		    </FormGroup>


		    <FormGroup>
		      <Col smOffset={4} sm={8}>
		        <Button type="submit"  onClick={this.handleSubmit}>
		          Войти
		        </Button>
		      </Col>
		    </FormGroup>
		</Form></div>
      )
    }

    handleChange(event){
    	const target = event.target;   
	    const name = target.name;

	    this.setState({
	      [name]: target.value
	    });
    }

    handleSubmit(event){
    	event.preventDefault();
    	const login = this.state.login;
		const password = this.state.password;
		const fieldsIsGood = this.fieldValidation();
		
		if(!fieldsIsGood){
			return; 
		}else{
			this.setState({isLoading: true});
			const token = this.props.getUserTokenFromApi(login, password);
			debugger;
		}
    }

    fieldValidation(){
    	const login = this.state.login;
		const password = this.state.password;
		const changeState = {};
		let result = true;

		if( login === '' ){
			changeState.loginValid = 'error';
			result = false;
		}else{
			changeState.loginValid = null;
		}
		if( password === '' ){
			changeState.passwordValid = 'error';
			result = false;
		}else{
			changeState.passwordValid = null;
		}
		this.setState(changeState);
		return result;
    }
  
}

export default connect(
		(state) => ({user: state.user}),
		{ getUserTokenFromApi }
	)(LoginPageComponent);
