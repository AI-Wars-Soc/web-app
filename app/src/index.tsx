import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import MyNavbar from "./navbar"
import Footer from "./footer"
require('bootstrap-icons/font/bootstrap-icons.css');

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

            <Footer/>
        </>
    );
}

ReactDOM.render(<App/>, document.getElementById('app'));
