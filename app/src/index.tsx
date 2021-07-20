import React, {Suspense, useState} from 'react';
import {render} from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import './style.scss';
import {MyNavbar} from "./navbar"
import {MyFooter} from "./footer"
import {getUser, NULL_USER} from "./user"

const SubmissionsPage = React.lazy(() => import("./submissions/submissionsPage"));
const LeaderboardPage = React.lazy(() => import("./leaderboard/leaderboardPage"));


function App(): JSX.Element {
    const [user, setUser] = useState(NULL_USER);
    const updateUser = () => getUser(user, setUser);
    updateUser();

    return (
        <>
            <Router>
                <MyNavbar user={user} updateUser={updateUser}/>
                <div className="content mx-lg-2 px-xl-5">
                    <div className="d-flex flex-column mx-md-3 p-2 p-sm-5">
                        <Switch>
                            <Route path="/about">
                                About
                            </Route>
                            <Route path="/leaderboard">
                                <Suspense fallback={<div>Loading Leaderboard...</div>}>
                                    <LeaderboardPage user={user}/>
                                </Suspense>
                            </Route>
                            <Route path="/submissions">
                                <Suspense fallback={<div>Loading Submissions...</div>}>
                                    <SubmissionsPage user={user}/>
                                </Suspense>
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

render(<App/>, document.getElementById('react-root'));
