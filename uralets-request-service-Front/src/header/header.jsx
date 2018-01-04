import * as React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import { checkUserAuth } from '../utils/auth';
import { connect } from 'react-redux'


function mapStateToProps(state) {
  return {
    user: state.user,
  }
}


class Header extends React.Component{
    render() {
      const isAuth = checkUserAuth(this.props.user);

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

export default connect(mapStateToProps)(Header);