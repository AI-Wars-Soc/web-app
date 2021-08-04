import React from "react";
import { Modal, Button } from "react-bootstrap"
import {GoogleLoginButton} from "./googleLoginButton";
import {UserData} from "../user";

type LoginModalProps = {
    handleClose: React.MouseEventHandler<HTMLElement>
    show: boolean,
    static: boolean,
    userData: UserData,
    updateUser: () => unknown
}

export default class LoginModal extends React.Component<LoginModalProps> {
    constructor(props: LoginModalProps) {
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
                    <Modal.Title>Sign in</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        By logging in you agree to the rules on the about page,
                        as well as allowing us to store your name and and email address.
                        You can delete your account at any time.
                    </p>
                    <GoogleLoginButton userData={this.props.userData} updateUser={this.props.updateUser}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.props.handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
    }
}