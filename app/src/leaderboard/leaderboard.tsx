import {User} from "../user";
import {LeaderboardEntry, LeaderboardEntryProps} from "./leaderboardEntry";
import React from "react";
import {ApiBoundComponent} from "../apiBoundComponent";
import {isA} from "ts-type-checked";
import {Col} from "react-bootstrap";


type LeaderboardData = {
    entries: LeaderboardEntryProps[]
};

type LeaderboardProps = {
    user: User
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

        return <Col className="py-2">
            <LeaderboardEntry position="Position" name="Name" is_real_name={false} nickname=""
                              wins="Wins" losses="Losses" draws="Draws" score="Score" is_bot={true} is_you={true}/>
            {entryDivs}
        </Col>;
    }

    protected typeCheck(data: unknown): data is LeaderboardData {
        return isA<LeaderboardData>(data);
    }
}