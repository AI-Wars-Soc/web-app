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

type MessageData = {
    status: "debug" | "error" | "message",
    data: string
}

type Callback = (fen: string, chess960: boolean, time_remaining: number) => unknown;

export class ChessConnection {
    private readonly socket: WebSocket;
    private readonly callback: Callback;

    constructor(submissionID: number, callback: Callback) {
        this.callback = callback;
        this.socket = new WebSocket("ws://" + location.hostname + "/wsapi/ws/play_game");

        // Connection opened
        this.socket.addEventListener('open', () => {
            this.socket.send(JSON.stringify({submission_ids: [submissionID]}));
        });

        // Listen for messages
        this.socket.addEventListener('message', (event) => {
            const data: MessageData = JSON.parse(event.data);

            if (!isA<MessageData>(data)) {
                console.error('Invalid data from server: ', data);
                this.stop();
                return;
            }

            switch (data.status) {
                case "debug":
                    console.log('Debug data from server: ', data.data);
                    return;
                case "error":
                    console.error('Game error: ', data.data);
                    this.stop();
                    return;
                case "message":
                    console.log('Message from server: ', data.data);
                    const message: MessageType = JSON.parse(data.data);
                    if (!isA<MessageType>(message)) {
                        console.error('Invalid message format from server: ', message);
                        this.stop();
                        return;
                    }
                    this.processMessage(message);
                    return;
                default:
                    console.error('Unknown data from server: ', data.status);
                    return;
            }
        });
    }

    makeMove(move: Move): void {
        this.socket.send(move.from + move.to + (move.promotion ?? ""));
    }

    private processMessage(message: MessageType): void {
        switch (message.type) {
            case "ping":
                this.socket.send("pong");
                return;
            case "call":
                this.callback(message.kwargs.board.fen, message.kwargs.board.chess960, message.kwargs.time_remaining);
                return;
            default:
                console.error('Unknown message from server: ', message.type);
                return;
        }
    }

    stop(): void {
        this.socket.close();
    }
}