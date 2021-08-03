import React, {Suspense} from "react";
import {UserData} from "../user";
import {ApiBoundComponent} from "../apiBoundComponent";
import {isA} from "ts-type-checked";
import {ChessGameProps} from "./chess/chessGame";

type GamesPageProps = {
    user: UserData,
    submission_id: number
};

type GamesPageData = {
    allowed: boolean,
    gamemode: {
        id: string,
        options: Record<string, unknown>
    }
};

type GamesPageState = {
    error: boolean,
    data: GamesPageData | null
};

export default class GamesPage extends ApiBoundComponent<GamesPageProps, GamesPageData, GamesPageState> {
    constructor(props: GamesPageProps) {
        super("get_game_data", props);

        this.state = {
            error: false,
            data: null
        }
    }

    getDataToSend(): Record<string, unknown> {
        return {submission_id: this.props.submission_id};
    }

    protected typeCheck(data: unknown): data is GamesPageData {
        return isA<GamesPageData>(data);
    }

    protected renderLoading(): JSX.Element {
        return <>
            <div>Setting up your game...</div>
        </>;
    }

    protected renderError(): JSX.Element {
        return <>
            <div>Could not initialise game. Please try again later</div>
        </>;
    }

    protected renderLoaded(data: GamesPageData): JSX.Element {
        if (!data.allowed) {
            return <>
                <div>Submission not found.</div>
            </>;
        }

        let lazyElement: JSX.Element;

        switch (data.gamemode.id) {
            case "chess":
                const ChessGame = React.lazy(() => import("./chess/chessGame"));
                if (!isA<ChessGameProps>(data.gamemode.options)) {
                    return this.renderError();
                }
                lazyElement = <Suspense fallback={this.renderLoading()}>
                    <ChessGame {...data.gamemode.options}/>
                </Suspense>
                break;
            default:
                return <div>Unknown game ID</div>;
        }

        return <>
            Playing {data.gamemode.id}
            {lazyElement}
        </>
    }
}