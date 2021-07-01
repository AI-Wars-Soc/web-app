import React from "react";


type LeaderboardEntryProps = {
    position: string,
    name: string,
    is_real_name: boolean,
    nickname: string,
    wins: string,
    losses: string,
    draws: string,
    score: string,
    boarder_style: string
}


class LeaderboardEntry extends React.Component<LeaderboardEntryProps> {
    render() {
        const {position, name, is_real_name, nickname, wins, losses, draws, score, boarder_style} = this.props;
        return <div className="p-1 px-md-3 text-nowrap" id={"leaderboard-entry-" + position}>
            <div className="px-lg-5 d-flex justify-content-center">
                <div
                    className={"max-width-center d-flex w-100 flex-row p-2 p-md-3 leaderboard-submission " + boarder_style}>
                    <div className="leaderboard-position">
                        {position}
                    </div>
                    <div className="leaderboard-name flex-column">
                        <div className="row">
                            <div className="p-0 col-auto">
                                {name}
                            </div>
                            {is_real_name &&
                            <div className="col-6 d-none d-lg-block nickname-text">
                                ({nickname})
                            </div>
                            }
                        </div>
                    </div>
                    <div className="leaderboard-wins d-none d-md-block">
                        {wins}
                    </div>
                    <div className="leaderboard-losses d-none d-md-block">
                        {losses}
                    </div>
                    <div className="leaderboard-draws d-none d-md-block">
                        {draws}
                    </div>
                    <div className="leaderboard-spacer d-none d-lg-block">
                    </div>
                    <div className="leaderboard-score">
                        {score}
                    </div>
                </div>
            </div>
        </div>;
    }
}


class Leaderboard extends React.Component<any, any> {
    render() {
        return <div className="d-flex flex-column py-2 flex-grow-1" id="leaderboard">
            <LeaderboardEntry position="Position" name="Name" is_real_name={false} nickname="" wins="Wins" losses="Losses" draws="Draws" score="Score" boarder_style="border-bottom"/>
            <div className="text-center">Loading the leaderboard...</div>
        </div>;
    }
}


export class LeaderboardPage extends React.Component<any, any> {
    render() {
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
                <Leaderboard/>
            </div>
        </>;
    }
}