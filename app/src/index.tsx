import React from 'react';
import {render} from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './style.scss';
import {MyNavbar} from "./navbar"
import {MyFooter} from "./footer"

function App(): JSX.Element {
    return (
        <>
            <Router>
                <MyNavbar/>
                <div className="content mx-lg-2 px-xl-5">
                    <div className="d-flex flex-column mx-md-3 p-2 p-sm-5">
                        <Switch>
                            <Route path="/about">
                                About
                            </Route>
                            <Route path="/users">
                                Users
                            </Route>
                            <Route path="/">
                                Home
                            </Route>
                        </Switch>
                    </div>
                </div>
            </Router>

            <MyFooter/>
        </>
    );
}

render(<App/>, document.getElementById('body'));
