import React from 'react';
import { render } from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './style.scss';
import { MyNavbar } from "./navbar"
import { MyFooter } from "./footer"

function App() {
    return (
        <>
            <Router>
                <div>
                    <MyNavbar/>

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
            </Router>

            <MyFooter/>
        </>
    );
}

render(<App/>, document.getElementById('app'));
