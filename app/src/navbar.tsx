import React from "react";

import {
    NavLink
} from "react-router-dom";

import { Navbar } from "react-bootstrap"


type NavItemProps = {
    active: boolean,
    data_toggle: string,
    link: string,
    text: string,
    icon: string
}

class NavItem extends React.Component<NavItemProps> {
    render(): JSX.Element {
        const {link, text, icon, data_toggle} = this.props;
        const active = (link === window.location.pathname);
        return <li className={ "nav-item" + (active ? " active" : "")}>
            <a className="nav-link" href={link} data-toggle={data_toggle}>{text}&nbsp;
                {icon !== null && <i className={icon}/>}</a>
        </li>;
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
        fetch("http://lvh.me/api/get_navbar", requestOptions)
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
            error_div = <i className="bi bi-cloud-slash"/>;
        }

        return <Navbar bg="dark" variant="dark" expand="md">
            <div className="navbar-collapse collapse w-100 order-1 order-md-0 dual-collapse2">
                <ul className="navbar-nav mr-auto">
                    {l_nav}
                </ul>
            </div>
            <Navbar.Brand href="/" className="mx-auto">{ navbar.soc_name } { error_div }</Navbar.Brand>
            <div className="collapse navbar-collapse w-100 order-3 dual-collapse2">
                <ul className="navbar-nav ml-auto">
                    {r_nav}
                </ul>
            </div>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target=".dual-collapse2">
                <span className="navbar-toggler-icon"/>
            </button>
        </Navbar>;
    }
}
