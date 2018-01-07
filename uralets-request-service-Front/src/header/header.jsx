import * as React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

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
		    {isAuth && 
		      <Navbar.Collapse>
			      <Nav>
			        <NavItem href="/#/">Заявка</NavItem>
			        <NavItem href="/#/db">База</NavItem>			        
			      </Nav>
			      <Nav pullRight>			        
			        <NavItem href="/#/logout">Выйти</NavItem>
			      </Nav>
		      </Navbar.Collapse>
			}
		  </Navbar>      	
      )
    }
  
}

export default connect(
		(state) => ({user: state.user}),
	)(Header);

