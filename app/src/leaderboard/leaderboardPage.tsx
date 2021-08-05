import React, {Suspense} from "react";
import {User} from "../user";
import {Leaderboard} from "./leaderboard";

const LeaderboardOverTimeGraph = React.lazy(() => import("./leaderboardOverTimeGraph"));


type LeaderboardPageProps = {
    user: User
}

export default class LeaderboardPage extends React.Component<LeaderboardPageProps> {
    render(): JSX.Element {
        return <>
            <div className="d-flex justify-content-center justify-content-sm-start">
                <h1>Leaderboard</h1>
            </div>
            <div className="px-3 d-none d-sm-block">
                <p className="lead">
                    The current standings
                </p>
            </div>

            <div className="d-none d-sm-flex justify-content-center py-3 px-lg-2 mx-lg-3 mx-xl-5"
                 id="overTimeChartContainer">
                <Suspense fallback={<div/>}>
                    <LeaderboardOverTimeGraph user={this.props.user}/>
                </Suspense>
            </div>
            <div className="d-flex justify-content-center">
                <Leaderboard user={this.props.user}/>
            </div>
        </>;
    }
}