import * as React from 'react';
import { Form, FormGroup,FormControl, Col, Button, ControlLabel } from 'react-bootstrap';
const styles = require('./loginPage.css');



export class LoginPageComponent extends React.Component{
    componentDidMount() {
       
    }
    
    render() {	debugger;
      return (
      
	    <Form horizontal>
		    <FormGroup controlId="formHorizontalLogin">
		    	<Col componentClass={styles['controlLabel']} sm={3}>
		       		Пользователь
		      	</Col>
			    <Col sm={9}>
			      <FormControl type="text" placeholder="Имя пользователя" />
			    </Col>
		    </FormGroup>

		    <FormGroup controlId="formHorizontalPassword">
		      <Col componentClass={styles['controlLabel']} sm={3}>
		        Пароль
		      </Col>
		      <Col sm={9}>
		        <FormControl type="password" placeholder="Пароль" />
		      </Col>
		    </FormGroup>


		    <FormGroup>
		      <Col smOffset={2} sm={10}>
		        <Button type="submit">
		          Войти
		        </Button>
		      </Col>
		    </FormGroup>
		</Form>
      )
    }
  
}
export default LoginPageComponent;