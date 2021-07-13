import React, {useState} from 'react';
import {render} from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './style.scss';
import {MyNavbar} from "./navbar"
import {MyFooter} from "./footer"
import {LeaderboardPage} from "./leaderboard"
import {nullUser} from "./user"

function App(): JSX.Element {
    const [user, setUser] = useState(nullUser);

    return (
        <>
            <Router>
                <MyNavbar user={user} setUser={setUser}/>
                <div className="content mx-lg-2 px-xl-5">
                    <div className="d-flex flex-column mx-md-3 p-2 p-sm-5">
                        <Switch>
                            <Route path="/about">
                                About
                            </Route>
                            <Route path="/leaderboard">
                                <LeaderboardPage/>
                            </Route>
                            <Route path="/submissions">
                                Submissions
                            </Route>
                            <Route path="/">
                                <Redirect to={"/about"}/>
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
