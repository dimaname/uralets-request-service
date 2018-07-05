import * as React from 'react';
import {Navbar, Nav, NavItem} from 'react-bootstrap';
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {logout} from '../reducers/userReducer'
import {LinkContainer} from "react-router-bootstrap";
import { withRouter } from 'react-router'

class Header extends React.Component {

    render() {
        const isAuth = this.props.user.id !== null;

        return (
            <Navbar inverse fixedTop>
                <Navbar.Header>
                    <Navbar.Brand>
                        <Link to='/'>«Уралец»</Link>
                    </Navbar.Brand>
                    <Navbar.Toggle/>
                </Navbar.Header>

                <Navbar.Collapse>
                    {isAuth &&
                    <Nav>
                        <LinkContainer exact to="/">
                            <NavItem>Заявка</NavItem>
                        </LinkContainer>
                        <LinkContainer exact to="/db">
                            <NavItem>База</NavItem>
                        </LinkContainer>
                    </Nav>}
                    <Nav pullRight>
                        {isAuth && <NavItem onClick={this.logout.bind(this)}>Выйти</NavItem>}
                        {!isAuth && <LinkContainer to="login"><NavItem>Войти</NavItem></LinkContainer>}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }

    logout() {
        this.props.logout();
    }

}

export default withRouter(connect(
    (state) => ({user: state.user}),
    {logout}
)(Header));

