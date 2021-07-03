import React from "react";

import { Navbar, Nav } from "react-bootstrap"


type NavItemProps = {
    active: boolean,
    data_toggle: string | undefined,
    link: string,
    text: string,
    icon: string
}

class NavItem extends React.Component<NavItemProps> {
    render(): JSX.Element {
        const {link, text, icon, data_toggle} = this.props;
        const active = (link === window.location.pathname);
        return <Nav.Link href={link} data-toggle={data_toggle} active={active}>{text}&nbsp;
                {icon !== null && <i className={"bi bi-" + icon}/>}</Nav.Link>;
    }
}


type NavbarState = {
    error: boolean,
    isLoaded: boolean,
    navbar: {
        l_nav: NavItemProps[],
        r_nav: NavItemProps[],
        soc_name: string
    }
}

export class MyNavbar extends React.Component<Record<string, never>, NavbarState> {
    constructor(props: Record<string, never>) {
        super(props);
        this.state = {
            error: false,
            isLoaded: false,
            navbar: {l_nav: [], r_nav: [], soc_name: ""}
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

    render(): JSX.Element {
        const {error, navbar} = this.state;

        const l_nav = navbar.l_nav.map(i => <NavItem {...i} key={i.link} />);
        const r_nav = navbar.r_nav.map(i => <NavItem {...i} key={i.link} />);

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
            <Navbar.Brand href="/" className="mx-auto">{ navbar.soc_name } { error_div }</Navbar.Brand>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                    {r_nav}
                </Nav>
            </Navbar.Collapse>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        </Navbar>;
    }
}
