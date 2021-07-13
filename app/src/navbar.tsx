import React, {Dispatch, SetStateAction} from "react";

import {Navbar, Nav} from "react-bootstrap"
import {
    Link
} from "react-router-dom";
import {LoginModal} from "./login";
import {nullUser, UserData} from "./user";
import { BoxArrowInRight, BoxArrowRight, CloudSlash } from 'react-bootstrap-icons';


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
        soc_name: string
    }
}

export class MyNavbar extends React.Component<NavbarProps, NavbarState> {
    constructor(props: NavbarProps) {
        super(props);
        this.state = {
            error: false,
            isLoaded: false,
            loginModalShow: false,
            navbar: {accessible: [], soc_name: ""}
        };

        this.onLoginSelect = this.onLoginSelect.bind(this);
        this.onLogoutSelect = this.onLogoutSelect.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    updateNavbarItemData(): void {
        const requestOptions = {
            method: 'POST'
        };
        fetch("/api/get_navbar", requestOptions)
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
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
        return map.filter(([k,]) => accessible.includes(k)).map(([, v]) => v);
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

    private closeModal(): void {
        this.setState({loginModalShow: false});
    }

    render(): JSX.Element {
        const {error, navbar, isLoaded} = this.state;
        const {accessible, soc_name} = navbar;

        let errorDiv = <></>;
        if (error) {
            errorDiv = <CloudSlash size={40}/>
        }

        let lNav: JSX.Element[] = [];
        let rNav: JSX.Element[] = [];
        if (isLoaded) {
            const lNavItems: [string, JSX.Element][] = [
                ['about', <NavItem link={'/about'} text={'About'} key={"navbar-about"}/>],
            ];
            const rNavItems: [string, JSX.Element][] = [
                ['login', <React.Fragment key={"navbar-login"}>
                    <Nav.Link href={'#loginModal'} onSelect={this.onLoginSelect}>
                        Login&nbsp;
                        <BoxArrowInRight size={21}/>
                    </Nav.Link>
                    <LoginModal show={this.state.loginModalShow}
                                handleClose={this.closeModal}
                                static={false} setUser={this.props.setUser}/>
                </React.Fragment>],
                ['logout', <Nav.Link href={'#logout'} key={"navbar-logout"} onSelect={this.onLogoutSelect}>
                    Logout&nbsp;
                    <BoxArrowRight size={21}/>
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
                <Navbar.Brand href="/" className="mx-auto">{soc_name} {errorDiv}</Navbar.Brand>
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
