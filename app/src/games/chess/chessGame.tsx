import React, {CSSProperties, Suspense} from "react";
import {Game} from "../game";
import Chessboard, {Piece} from "chessboardjsx";
import Chess, {ChessInstance, Square} from "chess.js";
import {ChessConnection} from "./chessConnection";

const GameResultModal = React.lazy(() => import("../gameResultModal"));

type SquareStyles = { [square in Square]?: CSSProperties };

export type ChessGameOptions = {

};

type ChessGameProps = {
    submissionID: number,
    restartCallback: () => unknown
} & ChessGameOptions;

type ChessGameState = {
    maxWidth: number,
    maxHeight: number,
    selectedSquare: Square | null,
    hoveredSquare: Square | null,
    moveCount: number, // A move history, kept to redraw the board after each move
    finishedSetup: boolean,
    gameResult: null | "win" | "loss" | "draw",
    showResultModal: boolean,
};

export default class ChessGame extends Game<ChessGameProps, ChessGameState> {
    private readonly game: ChessInstance;
    private readonly connection: ChessConnection;

    constructor(props: ChessGameProps) {
        super(props);

        this.state = {
            maxWidth: 0,
            maxHeight: 0,
            selectedSquare: null,
            hoveredSquare: null,
            moveCount: 0,
            finishedSetup: false,
            gameResult: null,
            showResultModal: false
        }

        this.game = new Chess("8/8/8/8/8/8/8/8 w - - 0 1");
        this.connection = new ChessConnection(props.submissionID, (fen) => {
            this.game.load(fen);
            this.setState({
                moveCount: this.state.moveCount + 1,
                finishedSetup: true
            });
        }, (result) => {
            this.setState({
                gameResult: result,
                showResultModal: true
            });
        });

        this.playMove = this.playMove.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.onMouseOutSquare = this.onMouseOutSquare.bind(this);
        this.onMouseOverSquare = this.onMouseOverSquare.bind(this);
        this.onSquareClick = this.onSquareClick.bind(this);
    }

    private playMove(sourceSquare: Square, targetSquare: Square): void {
        this.setState({
            selectedSquare: null
        });

        const move = this.game.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: "q"
        })

        if (!move) {
            return;
        }

        this.setState({
            moveCount: this.state.moveCount + 1
        });

        // Send move to server
        this.connection.makeMove(move);
    }

    private selectSquare(square: Square | null): void {
        if (square === null) {
            this.setState({
                selectedSquare: null
            });
            return;
        }

        const piece = this.game.get(square);
        if (piece !== null) {
            this.setState({
                selectedSquare: square
            });
        }
    }

    private onSquareClick(square: Square): void {
        if (square === this.state.selectedSquare) {
            this.selectSquare(null);
            return;
        }

        if (this.state.selectedSquare !== null) {
            const moves = this.game.moves({verbose: true, square: this.state.selectedSquare});

            if (moves.map(m => m.to).includes(square)) {
                this.playMove(this.state.selectedSquare, square);
                return;
            }
        }

        this.selectSquare(square);
    }

    private onDrop(obj: {sourceSquare: Square, targetSquare: Square, piece: Piece}): void {
        this.playMove(obj.sourceSquare, obj.targetSquare);
    }

    private onMouseOverSquare(square: Square): void {
        this.setState({
            hoveredSquare: square
        });
    }

    private onMouseOutSquare(square: Square): void {
        if (this.state.hoveredSquare === square) {
            this.setState({
                hoveredSquare: null
            });
        }
    }

    private static highlightSquares(squaresToHighlight: Square[], intensity: number, width: number): SquareStyles {
        const shadow = "inset 0 0 " + width + "px #f5d742";
        const highlightStyles: SquareStyles = {};
        squaresToHighlight.forEach((square: Square) => {
            let s = shadow;
            for (let i = 1; i < intensity; i++) {
                s += ", " + shadow;
            }

            highlightStyles[square] = {
                boxShadow: s
            };
        });

        return highlightStyles;
    }

    renderBoard(maxWidth: number, maxHeight: number): JSX.Element {
        const size = Math.min(maxWidth, maxHeight);
        const cellSize = size / 8;

        if (!this.state.finishedSetup) {
            return <div>Initiating AI...</div>;
        }

        let square = null;
        let intensity = 2;
        if (this.state.selectedSquare !== null) {
            square = this.state.selectedSquare;
            intensity = 4;
        } else if (this.state.hoveredSquare !== null) {
            square = this.state.hoveredSquare;
            intensity = 2;
        }

        let squareStyles: SquareStyles = {};
        if (square !== null) {
            const options = this.game.moves({verbose: true, square: square});
            squareStyles = ChessGame.highlightSquares(options.map(m => m.to), intensity, cellSize / 4);
        }

        return <>
            <Chessboard
                width={size}
                position={this.game.fen()}
                squareStyles={squareStyles}

                onSquareClick={this.onSquareClick}
                onDrop={this.onDrop}
                onMouseOverSquare={this.onMouseOverSquare}
                onMouseOutSquare={this.onMouseOutSquare}
            />
            <Suspense fallback={<></>}>
                <GameResultModal show={this.state.showResultModal}
                                 handleClose={() => this.setState({showResultModal: false})}
                                 handleRestart={this.props.restartCallback}
                                 result={this.state.gameResult ?? "win"}
                />
            </Suspense>
        </>;
    }
}