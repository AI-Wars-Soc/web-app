import {Move} from "chess.js";
import {isA} from "ts-type-checked";

type MessageType = {
    type: "ping"
} | {
    "type": "call",
    "name": "make_move",
    "kwargs": {
        "board": {
            "__custom_type": "chessboard",
            "fen": string,
            "chess960": boolean
        },
        "time_remaining": number
    }
} | {
    "type": "result",
    "result": {
        "recording": {
            "initial_board": string
        },
        "submission_results": [
            { "outcome": 1 | 2 | 3, "healthy": boolean, "player_id": "white" | "black", "result_code": string, "printed": string },
            { "outcome": 1 | 2 | 3, "healthy": boolean, "player_id": "white" | "black", "result_code": string, "printed": string }
        ]
    }
}

type MoveCallback = (fen: string, chess960: boolean, time_remaining: number) => unknown;

type EndCallback = (result: "win" | "loss" | "draw", result_code: string) => unknown;

export class ChessConnection {
    private readonly socket: WebSocket;
    private readonly moveCallback: MoveCallback;
    private readonly endCallback: EndCallback;

    constructor(submissionID: number, moveCallback: MoveCallback, endCallback: EndCallback) {
        this.moveCallback = moveCallback;
        this.endCallback = endCallback;
        this.socket = new WebSocket("ws://" + location.hostname + "/wsapi/ws/play_game");

        // Connection opened
        this.socket.addEventListener('open', () => {
            this.socket.send(JSON.stringify({submission_ids: [submissionID]}));
        });

        // Listen for messages
        this.socket.addEventListener('message', (event) => {
            const data: MessageType = JSON.parse(event.data);

            if (!isA<MessageType>(data)) {
                console.error('Invalid data from server: ', data);
                this.stop();
                return;
            }

            this.processMessage(data);
        });
    }

    makeMove(move: Move): void {
        this.socket.send(JSON.stringify({value: move.from + move.to + (move.promotion ?? "")}));
    }

    private processMessage(message: MessageType): void {
        switch (message.type) {
            case "ping":
                this.socket.send(JSON.stringify({value: "pong"}));
                return;
            case "call":
                this.moveCallback(message.kwargs.board.fen, message.kwargs.board.chess960, message.kwargs.time_remaining);
                return;
            case "result":
                const result = ["win", "loss", "draw"][message.result.submission_results[0].outcome - 1]
                this.endCallback(result as "win" | "loss" | "draw", message.result.submission_results[0].result_code)
                return;
            default:
                console.error('Unknown message from server: ', message);
                return;
        }
    }

    stop(): void {
        this.socket.close();
    }
}