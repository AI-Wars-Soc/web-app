import React from "react";
import {Game} from "./game";
import Chessboard from "chessboardjsx";


export type ChessGameProps = {

};

type ChessGameState = {
    maxWidth: number,
    maxHeight: number
};

export default class ChessGame extends Game<ChessGameProps, ChessGameState> {
    constructor(props: ChessGameProps) {
        super(props);

        this.state = {
            maxWidth: 0,
            maxHeight: 0
        }
    }

    renderBoard(maxWidth: number, maxHeight: number): JSX.Element {
        return <>
            <Chessboard width={Math.min(maxWidth, maxHeight)}/>
        </>;
    }
}