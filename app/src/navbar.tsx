import React from "react";

import { Navbar, Nav } from "react-bootstrap"


type NavItemProps = {
    data_toggle?: string,
    link: string,
    text: string,
    icon?: string
}

class NavItem extends React.Component<NavItemProps> {
    render(): JSX.Element {
        const {link, text, icon, data_toggle} = this.props;
        const active = (link === window.location.pathname);
        return <Nav.Link href={link} data-toggle={data_toggle} active={active}>{text}&nbsp;
                {icon !== undefined && <i className={"bi bi-" + icon}/>}</Nav.Link>;
    }
}

const lNavItems: [string, JSX.Element][] = [
    ['about', <NavItem link={'/about'} text={'About'} key={"navbar-about"}/>],
];
const rNavItems: [string, JSX.Element][] = [
    ['login', <NavItem link={'#loginModal'} text={'Login'} icon={'box-arrow-in-right'} key={"navbar-login"}/>],
];


type NavbarState = {
    error: boolean,
    isLoaded: boolean,
    navbar: {
        accessible: string[],
        soc_name: string
    }
}

export class MyNavbar extends React.Component<Record<string, never>, NavbarState> {
    constructor(props: Record<string, never>) {
        super(props);
        this.state = {
            error: false,
            isLoaded: false,
            navbar: {accessible: [], soc_name: ""}
        };
    }

    componentDidMount(): void {
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
                        navbar: result
                    });
                },
                (error) => {
                    console.log(error);
                    this.setState({
                        isLoaded: true,
                        error: true
                    });
                }
            );
    }

    private static filter(map: [string, JSX.Element][], accessible: string[]) {
        return map.filter(([k, ]) => accessible.includes(k)).map(([, v]) => v);
    }

    render(): JSX.Element {
        const {error, navbar} = this.state;
        const {accessible, soc_name} = navbar;

        const l_nav = MyNavbar.filter(lNavItems, accessible);
        const r_nav = MyNavbar.filter(rNavItems, accessible);

        let error_div = <></>;
        if (error) {
            error_div = <i className="bi bi-cloud-slash" role="img" aria-label="Network Error"/>;
        }

        return <Navbar bg="dark" variant="dark" expand="md">
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    {l_nav}
                </Nav>
            </Navbar.Collapse>
            <Navbar.Brand href="/" className="mx-auto">{ soc_name } { error_div }</Navbar.Brand>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                    {r_nav}
                </Nav>
            </Navbar.Collapse>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        </Navbar>;
    }
}
