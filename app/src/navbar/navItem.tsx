import React from "react";
import {Link} from "react-router-dom";

type NavItemProps = {
    link: string,
    text: string
}

export class NavItem extends React.Component<NavItemProps> {
    render(): JSX.Element {
        const {link, text} = this.props;
        const active = (link === window.location.pathname);
        return <Link to={link} className={"nav-link" + (active ? " active" : "")}>{text}</Link>;
    }
}
