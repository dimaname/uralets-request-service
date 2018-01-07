import * as React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { logout } from '../reducers/userReducer'
class Header extends React.Component{
    render() {
      const isAuth = this.props.user.id !== null;

      return (   
		<Navbar inverse fixedTop>
		    <Navbar.Header>
		      <Navbar.Brand>
		         <Link to='/'>«Уралец»</Link>
		      </Navbar.Brand>
		      <Navbar.Toggle />
		    </Navbar.Header>
		     
		      <Navbar.Collapse>
			      {isAuth &&
			      <Nav>
			        <NavItem href="/#/">Заявка</NavItem>
			        <NavItem href="/#/db">База</NavItem>			        
			      </Nav>}
			      <Nav pullRight>
			        {isAuth && <NavItem onClick={ this.logout.bind(this) }>Выйти</NavItem>}
			        {!isAuth && <NavItem href="/#/login">Войти</NavItem>}
			      </Nav>
		      </Navbar.Collapse>
		  </Navbar>      	
      )
    }

    logout(){
    	this.props.logout();
    }
  
}

export default connect(
		(state) => ({user: state.user}),
		{logout}
	)(Header);

