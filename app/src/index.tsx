import React, {Suspense, useState} from 'react';
import {render} from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";
import './style.scss';
import {MyNavbar} from "./navbar/navbar"
import {getUser, User} from "./user"

const AboutPage = React.lazy(() => import("./aboutPage"));
const SubmissionsPage = React.lazy(() => import("./submissions/submissionsPage"));
const LeaderboardPage = React.lazy(() => import("./leaderboard/leaderboardPage"));
const GamesPage = React.lazy(() => import("./games/gamesPage"));
const MePage = React.lazy(() => import("./me/mePage"));
const AdminPage = React.lazy(() => import("./admin/adminPage"));
const MyFooter = React.lazy(() => import("./footer"));

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
            console.log('SW registered: ', registration);
        }).catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
        });
    });
}

function App(): JSX.Element {
    const [user, setUser] = useState(new User(null));
    const updateUser = () => getUser(user, setUser);
    updateUser();

    const logOut = () => {
        document.cookie = "log_out=true; SameSite=Strict; Path=/";
        updateUser();
    };

    const GamesPageWrapper = (props: {match: {params: { submissionId: number }}}) => {
        return <Suspense fallback={<div>Loading Game Engine...</div>}>
            <GamesPage user={user} submission_id={props.match.params.submissionId}/>
        </Suspense>
    };

    return (
        <>
            <Router>
                <MyNavbar user={user} updateUser={updateUser} logOut={logOut}/>
                <div className="d-flex content mx-lg-2 px-xl-5">
                    <div className="fill flex-column mx-md-3 p-2 p-sm-5">
                        <Switch>
                            <Route path="/about">
                                <Suspense fallback={<div/>}>
                                    <AboutPage/>
                                </Suspense>
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
                            <Route path="/admin">
                                <Suspense fallback={<div>Loading...</div>}>
                                    <AdminPage user={user}/>
                                </Suspense>
                            </Route>
                            <Route path="/play/:submissionId" component={GamesPageWrapper}/>
                            <Route path="/me">
                                <Suspense fallback={<div>Loading Your Page...</div>}>
                                    <MePage user={user} logOut={logOut} updateUser={updateUser}/>
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
