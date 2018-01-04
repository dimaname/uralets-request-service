import * as React from 'react';
import { Form, FormGroup,FormControl, Col, Button, ControlLabel } from 'react-bootstrap';
const styles = require('./loginPage.css');



export class LoginPageComponent extends React.Component{
    componentDidMount() {
       
    }
    
    render() {
      return (
	    <Form horizontal className={styles['form']}>
		    <FormGroup controlId="formHorizontalEmail">
		    	<Col componentClass={ControlLabel} sm={5}>
		       		Пользователь
		      	</Col>
			    <Col sm={7}>
			      <FormControl type="text" placeholder="Имя пользователя" />
			    </Col>
		    </FormGroup>

		    <FormGroup controlId="formHorizontalPassword">
		      <Col componentClass={ControlLabel} sm={5}>
		        Пароль
		      </Col>
		      <Col sm={7}>
		        <FormControl type="password" placeholder="Пароль" />
		      </Col>
		    </FormGroup>


		    <FormGroup>
		      <Col smOffset={5} sm={10}>
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