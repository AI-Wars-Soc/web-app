import React from "react";

import {
    NavLink
} from "react-router-dom";


type NavItemProps = {
    active: boolean,
    data_toggle: string,
    link: string,
    text: string,
    icon: string
}

class NavItem extends React.Component<NavItemProps> {
    constructor(props: NavItemProps) {
        super(props);
    }

    render() {
        return <li className="nav-item">
            <NavLink to={this.props.link} data-toggle={this.props.data_toggle}>{this.props.text}&nbsp;
                {this.props.icon !== null && <i className={this.props.icon}/>}</NavLink>
        </li>;
    }
}


type NavbarState = {
    error?: any,
    isLoaded: boolean,
    navbar: {
        l_nav: NavItemProps[],
        r_nav: NavItemProps[],
        soc_name: string
    }
}

export default class Navbar extends React.Component<any, NavbarState> {
    constructor(props: any) {
        super(props);
        this.state = {
            isLoaded: false,
            navbar: {l_nav: [], r_nav: [], soc_name: ""}
        };
    }

    componentDidMount() {
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
                        error: error
                    });
                }
            );
    }

    render() {
        let {error, navbar} = this.state;

        if (error) {
            return <div>Error: {error.message}</div>;
        }

        const l_nav = navbar.l_nav.map(i => <NavItem {...i} />);
        const r_nav = navbar.r_nav.map(i => <NavItem {...i} />);

        return <nav className="navbar navbar-expand-md navbar-dark bg-primary">
            <div className="navbar-collapse collapse w-100 order-1 order-md-0 dual-collapse2">
                <ul className="navbar-nav mr-auto">
                    {l_nav}
                </ul>
            </div>
            <div className="mx-auto order-0">
                <a className="navbar-brand mx-auto" href="/">{navbar.soc_name}</a>
            </div>
            <div className="collapse navbar-collapse w-100 order-3 dual-collapse2">
                <ul className="navbar-nav ml-auto">
                    {r_nav}
                </ul>
            </div>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target=".dual-collapse2">
                <span className="navbar-toggler-icon"/>
            </button>
        </nav>;
    }
}
