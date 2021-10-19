import React, {Suspense} from "react";
import {User} from "../user";
import {Leaderboard} from "./leaderboard";
import {PageInfo, PageTitle} from "../pageTitleAndInfo";
import {CenterDiv} from "../centreDiv";

const LeaderboardOverTimeGraph = React.lazy(() => import("./leaderboardOverTimeGraph"));


type LeaderboardPageProps = {
    user: User
}

export default class LeaderboardPage extends React.Component<LeaderboardPageProps> {
    render(): JSX.Element {
        return <>
            <PageTitle>Leaderboard</PageTitle>
            <PageInfo>The current standings</PageInfo>

            <div className="d-none d-sm-flex justify-content-center py-3 px-lg-2 mx-lg-3 mx-xl-5">
                <Suspense fallback={<div/>}>
                    <LeaderboardOverTimeGraph user={this.props.user}/>
                </Suspense>
            </div>
            <CenterDiv maxWidth={1000}>
                <Leaderboard user={this.props.user}/>
            </CenterDiv>
        </>;
    }
}