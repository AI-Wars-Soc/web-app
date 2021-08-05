import {Move} from "chess.js";


export class ChessConnection {
    private socket: WebSocket;

    constructor(submissionID: number) {
        this.socket = new WebSocket("ws://" + location.hostname + "/wsapi/ws/play_game");

        // Connection opened
        this.socket.addEventListener('open', () => {
            this.socket.send(JSON.stringify({submission_ids: [submissionID]}));
        });

        // Listen for messages
        this.socket.addEventListener('message', (event) => {
            console.log('Message from server ', event.data);
        });
        /**this.socket = io("/api/play_game_socket", {
            transports: ["polling"], // use WebSocket first, if available
            path: "/api/play_game_websocket"
        });

        this.socket.on("message", (data) => {
            data = JSON.parse(data);
            console.log(data);

            switch (data["type"]) {
                case "ping":
                    this.socket.emit("respond", "pong");
                    break;
            }
        });

        this.socket.emit("start_game", JSON.stringify({submissions: [submissionHash]}));*/
    }

    makeMove(move: Move): void {
        this.socket.send(JSON.stringify({
            '__custom_type': 'chess_move',
            'uci': move.from + move.to + (move.promotion ?? "")
        }));
    }
}