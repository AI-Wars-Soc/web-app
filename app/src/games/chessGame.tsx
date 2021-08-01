import React from "react";
import {Game} from "./game";

export type ChessGameProps = {

};

type ChessGameState = {

}

export default class ChessGame extends Game<ChessGameProps, ChessGameState> {
    render(): JSX.Element {
        return <div>Chess!!</div>;
    }
}