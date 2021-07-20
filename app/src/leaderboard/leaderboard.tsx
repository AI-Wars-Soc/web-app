import {NULL_USER, UserData} from "../user";
import {LeaderboardEntry, LeaderboardEntryProps} from "./leaderboardEntry";
import React from "react";


type LeaderboardProps = {
    user: UserData
}

type LeaderboardState = {
    error: boolean,
    entries: LeaderboardEntryProps[] | null
}


export class Leaderboard extends React.Component<LeaderboardProps, LeaderboardState> {
    constructor(props: LeaderboardProps) {
        super(props);
        this.state = {
            error: false,
            entries: null
        };

        this.updateLeaderboardData = this.updateLeaderboardData.bind(this);
    }

    updateLeaderboardData(): void {
        const requestOptions = {
            method: 'POST'
        };
        fetch("/api/get_leaderboard", requestOptions)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        entries: result.entries
                    });
                },
                (error) => {
                    console.error(error);
                    this.setState({
                        error: true,
                    });
                }
            );
    }

    componentDidMount(): void {
        this.updateLeaderboardData();
    }

    render(): JSX.Element {
        if (this.state.error || this.state.entries === null || this.props.user === NULL_USER) {
            return <></>;
        }

        const entryDivs = this.state.entries.map(e => <LeaderboardEntry key={e.position} {...e}/>)

        return <div className="d-flex flex-column py-2 flex-grow-1" id="leaderboard">
            <LeaderboardEntry position="Position" name="Name" is_real_name={false} nickname=""
                              wins="Wins" losses="Losses" draws="Draws" score="Score" boarder_style="border-bottom"/>
            {entryDivs}
        </div>;
    }
}