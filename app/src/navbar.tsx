import React, {Dispatch, SetStateAction} from "react";

import { Navbar, Nav } from "react-bootstrap"
import {
    Link
} from "react-router-dom";
import {LoginModal} from "./login";
import {nullUser, UserData} from "./user";


type NavItemProps = {
    link: string,
    text: string
}

class NavItem extends React.Component<NavItemProps> {
    render(): JSX.Element {
        const {link, text} = this.props;
        const active = (link === window.location.pathname);
        return <Link to={link} className={"nav-link" + (active ? " active" : "")}>{text}</Link>;
    }
}

type NavbarProps = {
    user: UserData,
    setUser: Dispatch<SetStateAction<UserData>>
}

type NavbarState = {
    error: boolean,
    isLoaded: boolean,
    loginModalShow: boolean,
    navbar: {
        accessible: string[],
        socName: string
    }
}

export class MyNavbar extends React.Component<NavbarProps, NavbarState> {
    constructor(props: NavbarProps) {
        super(props);
        this.state = {
            error: false,
            isLoaded: false,
            loginModalShow: false,
            navbar: {accessible: [], socName: ""}
        };

        this.onLoginSelect = this.onLoginSelect.bind(this);
        this.onLogoutSelect = this.onLogoutSelect.bind(this);
    }

    updateNavbarItemData(): void {
        const requestOptions = {
            method: 'POST'
        };
        fetch("/api/get_navbar", requestOptions)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        navbar: result,
                        loginModalShow: false
                    });
                },
                (error) => {
                    console.error(error);
                    this.setState({
                        isLoaded: true,
                        error: true,
                        loginModalShow: false
                    });
                }
            );
    }

    componentDidMount(): void {
        this.updateNavbarItemData();
    }

    componentDidUpdate(prevProps: NavbarProps/*, prevState: NavbarState*/): void {
        if (prevProps.user !== this.props.user) {
            this.updateNavbarItemData();
        }
    }

    private static filter(map: [string, JSX.Element][], accessible: string[]) {
        return map.filter(([k, ]) => accessible.includes(k)).map(([, v]) => v);
    }

    private onLoginSelect(_: string | null, e: React.SyntheticEvent<unknown>) {
        e.preventDefault();
        this.setState({loginModalShow: true});
    }

    private onLogoutSelect(_: string | null, e: React.SyntheticEvent<unknown>) {
        e.preventDefault();
        document.cookie = "log_out=true; SameSite=Strict";
        this.props.setUser(nullUser);
    }

    render(): JSX.Element {
        const {error, navbar, isLoaded} = this.state;
        const {accessible, socName} = navbar;

        let errorDiv = <></>;
        if (error) {
            errorDiv = <i className="bi bi-cloud-slash" role="img" aria-label="Network Error"/>;
        }

        let lNav: JSX.Element[] = [];
        let rNav: JSX.Element[] = [];
        if (isLoaded) {
            const lNavItems: [string, JSX.Element][] = [
                ['about', <NavItem link={'/about'} text={'About'} key={"navbar-about"}/>],
            ];
            const rNavItems: [string, JSX.Element][] = [
                ['login', <Nav.Link href={'#loginModal'} key={"navbar-login"} onSelect={this.onLoginSelect}>
                    login&nbsp;<i className={"bi bi-box-arrow-in-right"}/>
                    <LoginModal show={this.state.loginModalShow}
                                handleClose={() => this.setState({loginModalShow: false})}
                                static={false} setUser={this.props.setUser}/>
                </Nav.Link>],
                ['logout', <Nav.Link href={'#logout'} key={"navbar-logout"} onSelect={this.onLogoutSelect}>
                    logout&nbsp;<i className={"bi bi-box-arrow-right"}/>
                </Nav.Link>],
            ];

            lNav = MyNavbar.filter(lNavItems, accessible);
            rNav = MyNavbar.filter(rNavItems, accessible);
        }

        return <>
            <Navbar bg="dark" variant="dark" expand="md">
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        {lNav}
                    </Nav>
                </Navbar.Collapse>
                <Navbar.Brand href="/" className="mx-auto">{ socName } { errorDiv }</Navbar.Brand>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                        {rNav}
                    </Nav>
                </Navbar.Collapse>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            </Navbar>
        </>;
    }
}
