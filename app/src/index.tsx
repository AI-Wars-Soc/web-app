import React, {Suspense, useState} from 'react';
import {render} from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import './style.scss';
import {MyNavbar} from "./navbar/navbar"
import {getUser, UserData} from "./user"

const SubmissionsPage = React.lazy(() => import("./submissions/submissionsPage"));
const LeaderboardPage = React.lazy(() => import("./leaderboard/leaderboardPage"));
const MePage = React.lazy(() => import("./me/mePage"));
const MyFooter = React.lazy(() => import("./footer"));


function App(): JSX.Element {
    const [user, setUser] = useState(null as UserData);
    const updateUser = () => getUser(user, setUser);
    updateUser();

    const logOut = () => {
        document.cookie = "log_out=true; SameSite=Strict";
        updateUser();
    };

    return (
        <>
            <Router>
                <MyNavbar user={user} updateUser={updateUser} logOut={logOut}/>
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
                            <Route path="/me">
                                <Suspense fallback={<div>Loading Your Page...</div>}>
                                    <MePage user={user} logOut={logOut}/>
                                </Suspense>
                            </Route>
                            <Route path="/">
                                <Redirect to={"/about"}/>
                            </Route>
                        </Switch>
                    </div>
                </div>
            </Router>

            <Suspense fallback={<></>}>
                <MyFooter/>
            </Suspense>
        </>
    );
}

render(<App/>, document.getElementById('react-root'));
