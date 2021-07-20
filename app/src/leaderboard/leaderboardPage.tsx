import React from "react";
import {UserData} from "../user";
import {Leaderboard} from "./leaderboard";


type LeaderboardPageProps = {
    user: UserData
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

            </div>
            <div className="d-flex justify-content-center">
                <Leaderboard user={this.props.user}/>
            </div>
        </>;
    }
}