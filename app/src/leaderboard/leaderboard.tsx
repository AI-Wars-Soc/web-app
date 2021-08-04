import {UserData} from "../user";
import {LeaderboardEntry, LeaderboardEntryProps} from "./leaderboardEntry";
import React from "react";
import {ApiBoundComponent} from "../apiBoundComponent";
import {isA} from "ts-type-checked";


type LeaderboardData = {
    entries: LeaderboardEntryProps[]
};

type LeaderboardProps = {
    userData: UserData
}

type LeaderboardState = {
    error: boolean,
    data: LeaderboardData | null
}


export class Leaderboard extends ApiBoundComponent<LeaderboardProps, LeaderboardData, LeaderboardState> {
    constructor(props: LeaderboardProps) {
        super("get_leaderboard", props);
        this.state = {
            error: false,
            data: null
        };
    }

    protected renderLoaded(data: LeaderboardData): JSX.Element {
        const entryDivs = data.entries.map(e => <LeaderboardEntry key={e.position} {...e}/>)

        return <div className="d-flex flex-column py-2 flex-grow-1" id="leaderboard">
            <LeaderboardEntry position="Position" name="Name" is_real_name={false} nickname=""
                              wins="Wins" losses="Losses" draws="Draws" score="Score" boarder_style="border-bottom"/>
            {entryDivs}
        </div>;
    }

    protected typeCheck(data: unknown): data is LeaderboardData {
        return isA<LeaderboardData>(data);
    }
}