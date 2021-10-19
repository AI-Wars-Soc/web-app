import React from "react";
import { Modal, Button } from "react-bootstrap"
import {GoogleLoginButton} from "./googleLoginButton";
import {User} from "../user";

type LoginModalProps = {
    handleClose: () => void,
    show: boolean,
    static: boolean,
    user: User,
    updateUser: () => unknown
}

export default class LoginModal extends React.Component<LoginModalProps> {
    constructor(props: LoginModalProps) {
        super(props);
    }

    render(): JSX.Element {
        const loginButton = <GoogleLoginButton user={this.props.user} updateUser={this.props.updateUser}/>;
        const hiddenLoginButton = <div className="d-none">{loginButton}</div>; // Preload for a better UX

        return <>
            <Modal
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
                    {loginButton}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.props.handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            {hiddenLoginButton}
        </>
    }
}