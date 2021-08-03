import React, {CSSProperties} from "react";
import {Game} from "../game";
import Chessboard, {Piece} from "chessboardjsx";
import Chess, {ChessInstance, Move, Square} from "chess.js";

type SquareStyles = { [square in Square]?: CSSProperties };

export type ChessGameProps = {

}

type ChessGameState = {
    maxWidth: number,
    maxHeight: number,
    selectedSquare: Square | null,
    hoveredSquare: Square | null,
    history: Move[] // A move history, kept to redraw the board after each move
};

export default class ChessGame extends Game<ChessGameProps, ChessGameState> {
    private game: ChessInstance | null = null;

    constructor(props: ChessGameProps) {
        super(props);

        this.state = {
            maxWidth: 0,
            maxHeight: 0,
            selectedSquare: null,
            hoveredSquare: null,
            history: []
        }

        this.playMove = this.playMove.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.onMouseOutSquare = this.onMouseOutSquare.bind(this);
        this.onMouseOverSquare = this.onMouseOverSquare.bind(this);
        this.onSquareClick = this.onSquareClick.bind(this);
    }

    componentDidMount(): void {
        this.game = new Chess();
    }

    private playMove(sourceSquare: Square, targetSquare: Square): void {
        if (this.game === null) {
            return;
        }

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

        const history = this.state.history;
        history.push(move);
        this.setState({
            history: history
        });

        // Send move to server
    }

    private selectSquare(square: Square | null): void {
        if (this.game === null) {
            return;
        }

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
        if (this.game === null) {
            return;
        }

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

    private static highlightSquares(squaresToHighlight: Square[], intensity = 0.4): SquareStyles {
        const highlightStyles: SquareStyles = {};
        squaresToHighlight.forEach((square: Square) => {
            highlightStyles[square] = {
                background: "radial-gradient(circle, #fffc00 36%, transparent " + (intensity * 100) + "%)",
                borderRadius: "50%"
            };
        });

        return highlightStyles;
    }

    renderBoard(maxWidth: number, maxHeight: number): JSX.Element {
        if (this.game === null) {
            return <></>
        }

        let squareStyles: SquareStyles = {};
        if (this.state.selectedSquare !== null) {
            const options = this.game.moves({verbose: true, square: this.state.selectedSquare});
            squareStyles = ChessGame.highlightSquares(options.map(m => m.to));
        } else if (this.state.hoveredSquare !== null) {
            const options = this.game.moves({verbose: true, square: this.state.hoveredSquare});
            squareStyles = ChessGame.highlightSquares(options.map(m => m.to), 0.2);
        }

        return <>
            <Chessboard
                width={Math.min(maxWidth, maxHeight)}
                position={this.game.fen()}
                squareStyles={squareStyles}

                onSquareClick={this.onSquareClick}
                onDrop={this.onDrop}
                onMouseOverSquare={this.onMouseOverSquare}
                onMouseOutSquare={this.onMouseOutSquare}
            />
        </>;
    }
}