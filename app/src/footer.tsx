import React from "react";

export default class MyFooter extends React.Component {
    render(): JSX.Element {
        return <div className="footer">
            <nav className="navbar navbar-light bg-secondary">
                <div className="mx-auto order-0">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            &copy; 2020-2021 Joe O&apos;Connor
                        </li>
                        <li className="nav-item text-center">
                            Join our <a href="https://discord.gg/mtpmA2MH5u" className="footer-link">Discord</a>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    }
}