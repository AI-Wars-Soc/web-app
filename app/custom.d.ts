import {ChessInstance} from "chess.js";

declare module "*.svg" {
    const content: any;
    export default content;
}

declare module "chess.js" {
    import {ChessInstance} from "chess.js";
    const Chess: {
        (fen?: string): ChessInstance
        new(fen?: string): ChessInstance;
    };
    export default Chess;
}