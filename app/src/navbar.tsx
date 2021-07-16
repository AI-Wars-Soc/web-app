import React from "react";

import {Navbar, Nav} from "react-bootstrap"
import {
    Link, withRouter, match, Redirect
} from "react-router-dom";
import {LoginModal} from "./login";
import {UserData} from "./user";
import { BoxArrowInRight, BoxArrowRight, CloudSlash } from 'react-bootstrap-icons';
import { History as RouteHistory, Location as RouteLocation, LocationState } from "history";


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
    history: RouteHistory<LocationState>,
    location: RouteLocation<LocationState>,
    match: match<Record<string, never>>,
    user: UserData,
    updateUser: () => unknown
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

class MyRoutableNavbar extends React.Component<NavbarProps, NavbarState> {
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
        fetch("/api/get_accessible_navbar", requestOptions)
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
        console.log("Logout selected")
        this.props.updateUser();
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
            const pageName = this.props.location.pathname.split('/')[1];
            const pageAllowed = accessible.includes(pageName);
            const pageKnowable = ["", "leaderboard", "submissions", "about", "me"].includes(pageName);

            if (!pageAllowed && !pageKnowable) {
                return <Redirect to={"/"}/>;
            }

            const forceShow = (!pageAllowed) && pageKnowable;

            const onModalClose = () => {
                if (forceShow) {
                    this.props.history.goBack();
                }
                this.closeModal()
            };

            const lNavItems: [string, JSX.Element][] = [
                ['leaderboard', <NavItem link={'/leaderboard'} text={'Leaderboard'} key={"navbar-leaderboard"}/>],
                ['submissions', <NavItem link={'/submissions'} text={'Submissions'} key={"navbar-submissions"}/>],
                ['about', <NavItem link={'/about'} text={'About'} key={"navbar-about"}/>],
            ];
            const rNavItems: [string, JSX.Element][] = [
                ['admin', <NavItem link={'/admin'} text={'Admin'} key={"navbar-admin"}/>],
                ['me', <NavItem link={'/me'} text={'Me'} key={"navbar-me"}/>],
                ['login', <React.Fragment key={"navbar-login"}>
                    <Nav.Link href={'#loginModal'} onSelect={this.onLoginSelect}>
                        Login&nbsp;
                        <BoxArrowInRight size={21}/>
                    </Nav.Link>
                    <LoginModal show={this.state.loginModalShow || forceShow}
                                handleClose={onModalClose}
                                static={forceShow} updateUser={this.props.updateUser}/>
                </React.Fragment>],
                ['logout', <Nav.Link href={'#logout'} key={"navbar-logout"} onSelect={this.onLogoutSelect}>
                    Logout&nbsp;
                    <BoxArrowRight size={21}/>
                </Nav.Link>],
            ];

            lNav = MyRoutableNavbar.filter(lNavItems, accessible);
            rNav = MyRoutableNavbar.filter(rNavItems, accessible);
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

export const MyNavbar = withRouter(MyRoutableNavbar);
