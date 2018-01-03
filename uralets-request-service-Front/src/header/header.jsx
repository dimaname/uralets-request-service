import * as React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { Link } from 'react-router-dom'

export class Header extends React.Component{
    componentDidMount() {
       
    }
    
    render() {
      return (   
		<Navbar inverse fixedTop>
		    <Navbar.Header>
		      <Navbar.Brand>
		         <Link to='/'>«Уралец»</Link>
		      </Navbar.Brand>
		      <Navbar.Toggle />
		    </Navbar.Header>
		    <Navbar.Collapse>
		      <Nav>
		        <NavItem href="/#/">Заявка</NavItem>
		        <NavItem href="/#/db">База</NavItem>			        
		      </Nav>
		      <Nav pullRight>			        
		        <NavItem href="/#/logout">Выйти</NavItem>
		      </Nav>
		    </Navbar.Collapse>
		  </Navbar>      	
      )
    }
  
}
export default Header;