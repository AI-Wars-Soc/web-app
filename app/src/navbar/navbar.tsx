import React, {Suspense} from "react";

import {Navbar, Nav} from "react-bootstrap"
import {
    withRouter, match, Redirect
} from "react-router-dom";
import {UserData} from "../user";
import { BoxArrowInRight, BoxArrowRight, CloudSlash } from 'react-bootstrap-icons';
import { History as RouteHistory, Location as RouteLocation, LocationState } from "history";
import {NavItem} from "./navItem";
import {ApiBoundComponent} from "../apiBoundComponent";

const LoginModal = React.lazy(() => import("../login/loginModal"));

type NavbarData = {
    accessible: string[],
    soc_name: string
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
    data: NavbarData | null
}

class MyRoutableNavbar extends ApiBoundComponent<NavbarProps, NavbarData, NavbarState> {
    constructor(props: NavbarProps) {
        super("get_accessible_navbar", props);
        this.state = {
            error: false,
            isLoaded: false,
            loginModalShow: false,
            data: null
        };

        this.onLoginSelect = this.onLoginSelect.bind(this);
        this.onLogoutSelect = this.onLogoutSelect.bind(this);
        this.closeModal = this.closeModal.bind(this);
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
        this.props.updateUser();
    }

    private closeModal(): void {
        this.setState({loginModalShow: false});
    }

    private static renderNavbar(error: boolean, soc_name = ".", lNav: JSX.Element[] = [], rNav: JSX.Element[] = []): JSX.Element {
        let errorDiv = <></>;
        if (error) {
            errorDiv = <CloudSlash size={40}/>
        }

        return <>
            <Navbar bg="dark" variant="dark" expand="md">
                <Navbar.Collapse id="basic-navbar-nav" style={{flexGrow: 0}} className="order-1 order-md-0">
                    <Nav className="mr-auto">
                        {lNav}
                    </Nav>
                </Navbar.Collapse>
                <Navbar.Brand href="/" className="mx-auto order-0">{soc_name} {errorDiv}</Navbar.Brand>
                <Navbar.Collapse id="basic-navbar-nav" style={{flexGrow: 0}} className="order-3">
                    <Nav className="ml-auto">
                        {rNav}
                    </Nav>
                </Navbar.Collapse>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            </Navbar>
        </>;
    }

    protected renderLoading(): JSX.Element {
        return MyRoutableNavbar.renderNavbar(false);
    }

    protected renderError(): JSX.Element {
        return MyRoutableNavbar.renderNavbar(true);
    }

    protected renderLoaded(data: NavbarData): JSX.Element {
        const {accessible, soc_name} = data;

        const pageName = this.props.location.pathname.split('/')[1];
        const pageAllowed = accessible.includes(pageName);
        const pageKnowable = ["", "leaderboard", "submissions", "about", "me"].includes(pageName);

        if (!pageAllowed && !pageKnowable) {
            return <Redirect to={"/"}/>;
        }

        const forceShow = (!pageAllowed) && pageKnowable;

        const onModalClose = () => {
            if (forceShow) {
                this.props.history.push("/");
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
                    <BoxArrowInRight size={19}/>
                </Nav.Link>

                <Suspense fallback={<></>}>
                    <LoginModal show={this.state.loginModalShow || forceShow}
                                user={this.props.user}
                                handleClose={onModalClose}
                                static={forceShow} updateUser={this.props.updateUser}/>
                </Suspense>
            </React.Fragment>],
            ['logout', <Nav.Link href={'#logout'} key={"navbar-logout"} onSelect={this.onLogoutSelect}>
                Logout&nbsp;
                <BoxArrowRight size={19}/>
            </Nav.Link>],
        ];

        const lNav = MyRoutableNavbar.filter(lNavItems, accessible);
        const rNav = MyRoutableNavbar.filter(rNavItems, accessible);

        return MyRoutableNavbar.renderNavbar(false, soc_name, lNav, rNav);
    }
}

export const MyNavbar = withRouter(MyRoutableNavbar);
