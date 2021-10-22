import React, {useState} from 'react';
import {render} from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect, withRouter,
} from "react-router-dom";
import './style.scss';
import {getUser, User} from "./user"
import {LoadingSuspense} from "./loadingSuspense";
import {History as RouteHistory, Location as RouteLocation, LocationState} from "history";

const MyNavbar = React.lazy(() => import("./navbar/navbar"));
const AboutPage = React.lazy(() => import("./aboutPage"));
const SubmissionsPage = React.lazy(() => import("./submissions/submissionsPage"));
const LeaderboardPage = React.lazy(() => import("./leaderboard/leaderboardPage"));
const GamesPage = React.lazy(() => import("./games/gamesPage"));
const MePage = React.lazy(() => import("./me/mePage"));
const AdminPage = React.lazy(() => import("./admin/adminPage"));
const MyFooter = React.lazy(() => import("./footer"));


function AppFn(props: { location: RouteLocation<LocationState>, history: RouteHistory<LocationState> }): JSX.Element {
    const [user, setUser] = useState(new User(null));
    const updateUser = () => getUser(user, setUser);
    updateUser();

    const logOut = () => {
        document.cookie = "log_out=true; SameSite=Strict; Path=/";
        updateUser();
        props.history.push("/");
    };

    const GamesPageWrapper = (props: { match: { params: { submissionId: number } } }) => {
        return <LoadingSuspense>
            <GamesPage user={user} submission_id={props.match.params.submissionId}/>
        </LoadingSuspense>
    };

    return (
        <>
            <LoadingSuspense>
                <MyNavbar user={user} updateUser={updateUser} logOut={logOut}/>
            </LoadingSuspense>
            <div className="d-flex content mx-lg-2 px-xl-5">
                <div className="fill flex-column mx-md-3 p-2 p-sm-5">
                    <Switch>
                        <Route path="/about">
                            <LoadingSuspense>
                                <AboutPage/>
                            </LoadingSuspense>
                        </Route>
                        <Route path="/leaderboard">
                            <LoadingSuspense>
                                <LeaderboardPage user={user}/>
                            </LoadingSuspense>
                        </Route>
                        <Route path="/submissions">
                            <LoadingSuspense>
                                <SubmissionsPage user={user}/>
                            </LoadingSuspense>
                        </Route>
                        <Route path="/admin">
                            <LoadingSuspense>
                                <AdminPage user={user}/>
                            </LoadingSuspense>
                        </Route>
                        <Route path="/play/:submissionId" component={GamesPageWrapper}/>
                        <Route path="/me">
                            <LoadingSuspense>
                                <MePage user={user} logOut={logOut} updateUser={updateUser}/>
                            </LoadingSuspense>
                        </Route>
                        <Route path="/">
                            <Redirect to={"/about"}/>
                        </Route>
                    </Switch>
                </div>
            </div>

            <LoadingSuspense>
                <MyFooter/>
            </LoadingSuspense>
        </>
    );
}

const App = withRouter(AppFn);
render(<Router><App/></Router>, document.getElementById('react-root'));
