import React from "react";
import { Modal, Button } from "react-bootstrap"

type ConfirmModalProps = {
    title?: string,
    handleClose: React.MouseEventHandler<HTMLElement>,
    handleConfirm: React.MouseEventHandler<HTMLElement>,
    show: boolean,
    static?: boolean,
    children: React.ReactNode
}

export default class ConfirmModal extends React.Component<ConfirmModalProps> {
    constructor(props: ConfirmModalProps) {
        super(props);
    }

    render(): JSX.Element {
        return <Modal
            show={this.props.show}
            onHide={this.props.handleClose}
            backdrop={this.props.static ? "static" : true}
            keyboard={!this.props.static}
        >
            <Modal.Header closeButton>
                <Modal.Title>{this.props.title || "Confirm Action"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    { this.props.children }
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={this.props.handleConfirm}>
                    Confirm
                </Button>
                <Button variant="secondary" onClick={this.props.handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    }
}