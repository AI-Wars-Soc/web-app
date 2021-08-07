import React from "react";
import {Button, Modal} from "react-bootstrap";

type GameResultModalProps = {
    handleClose: () => unknown,
    handleRestart: () => unknown,
    result: "win" | "loss" | "draw"
    children?: JSX.Element[],
    show: boolean,
};

export default class GameResultModal extends React.Component<GameResultModalProps> {
    constructor(props: GameResultModalProps) {
        super(props);
    }

    private static makeTitle(result: "win" | "loss" | "draw"): string {
        switch (result)
        {
            case "win":
                return "You Won!";
            case "loss":
                return "You Lost. :(";
            case "draw":
                return "Draw!";
        }
    }

    render(): JSX.Element {
        return <Modal
            show={this.props.show}
            onHide={this.props.handleClose}
        >
            <Modal.Header closeButton>
                <Modal.Title>{GameResultModal.makeTitle(this.props.result)}</Modal.Title>
            </Modal.Header>
            <Modal.Footer>
                <Button variant="secondary" onClick={this.props.handleRestart}>
                    Rematch
                </Button>
                <Button variant="secondary" onClick={this.props.handleClose}>
                    Return
                </Button>
            </Modal.Footer>
        </Modal>
    }
}