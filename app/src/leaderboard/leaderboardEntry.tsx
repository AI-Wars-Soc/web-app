import React from "react";

export type LeaderboardEntryProps = {
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


export class LeaderboardEntry extends React.Component<LeaderboardEntryProps> {
    render(): JSX.Element {
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