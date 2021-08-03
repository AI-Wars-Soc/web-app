import React, {CSSProperties} from "react";
import {Game} from "../game";
import Chessboard from "chessboardjsx";
import Chess, {ChessInstance, Square} from "chess.js";

export type ChessGameProps = {

};

type ChessGameState = {
    maxWidth: number,
    maxHeight: number,
    selectedSquare: string,
    history: string[],
    squareStyles: { [square in Square]?: CSSProperties }
};

export default class ChessGame extends Game<ChessGameProps, ChessGameState> {
    private game: ChessInstance | null = null;

    constructor(props: ChessGameProps) {
        super(props);

        this.state = {
            maxWidth: 0,
            maxHeight: 0,
            selectedSquare: "",
            history: [],
            squareStyles: {},
        }
    }

    componentDidMount(): void {
        this.game = new Chess();
    }

    /**private highlightSquares(squaresToHighlight: Square[]): void {
        const highlightStyles: { [square in Square]?: CSSProperties } = {};
        squaresToHighlight.forEach((square: Square) => {
            highlightStyles[square] = {
                background: "radial-gradient(circle, #fffc00 36%, transparent 40%)",
                borderRadius: "50%"
            };
        });

        this.setState({
            squareStyles: highlightStyles
        });
    }*/

    renderBoard(maxWidth: number, maxHeight: number): JSX.Element {
        if (this.game === null) {
            return <></>
        }

        return <>
            <Chessboard width={Math.min(maxWidth, maxHeight)} position={this.game.fen()} squareStyles={this.state.squareStyles}/>
        </>;
    }
}