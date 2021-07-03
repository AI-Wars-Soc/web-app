import {GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline} from 'react-google-login';
import React from "react";
import { Modal, Button, Alert } from "react-bootstrap"

type GoogleLoginState = {
    error: string,
    isLoaded: boolean,
    data: {
        clientId: string
        hostedDomain: string | null
    }
}

class GoogleLoginButton extends React.Component<Record<string, never>, GoogleLoginState> {
    constructor(props: Record<string, never>) {
        super(props);
        this.state = {
            error: "",
            isLoaded: false,
            data: {clientId: "", hostedDomain: null}
        };
    }

    componentDidMount(): void {
        const requestOptions = {
            method: 'POST'
        };
        fetch("/api/get_google_login_data", requestOptions)
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
                    this.setState({
                        isLoaded: true,
                        data: result
                    });
                },
                (error) => {
                    console.log(error);
                    this.setState({
                        isLoaded: true,
                        error: error
                    });
                }
            );
    }
    
    private onLoginFail(error: GoogleLoginResponse | GoogleLoginResponseOffline) {
        console.log("Could not sign in");
        console.log(error);

        this.setState({
            error: "Could not sign in. Please try again later."
        });
    }

    private onLoginSuccess(googleUser: GoogleLoginResponse | GoogleLoginResponseOffline) {
        if (!("getAuthResponse" in googleUser)) {
            console.log("Got offline response - could not sign in");
            return;
        }

        const id_token = googleUser.getAuthResponse().id_token;

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({google_token: id_token})
        };
        fetch('/api/exchange_google_token', requestOptions)
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
                },
                (error) => {
                    console.log(error);
                    this.setState({
                        error: error
                    });
                }
            );
    }

    render(): JSX.Element {
        if (!this.state.isLoaded) {
            return <></>;
        }

        let errorMessage = <></>;
        if (this.state.error !== ""){
            errorMessage = <Alert variant={"danger"}>
                Something went wrong. Please try again or let someone know. {this.state.error}
            </Alert>
        }

        const loginProps = {
            hostedDomain: this.state.data.hostedDomain === null ? undefined : this.state.data.hostedDomain,
            clientId: this.state.data.clientId,
            buttonText: "Login with Google",
            onSuccess: this.onLoginSuccess,
            onFailure: this.onLoginFail,
            cookiePolicy: 'single_host_origin',
        }

        return <>
            <GoogleLogin theme='light' {...loginProps}/>
            {errorMessage}
        </>
    }
}

type LoginModalProps = {
    handleClose?: React.MouseEventHandler<HTMLElement>
}

type LoginModalState = {
    show: boolean,
    handleClose: React.MouseEventHandler<HTMLElement>
}

export class LoginModal extends React.Component<LoginModalProps, LoginModalState> {
    constructor(props: LoginModalProps) {
        super(props);
        this.state = {
            show: true,
            handleClose: props.handleClose === undefined ? () => this.setState({show: false}) : props.handleClose
        };
    }

    render(): JSX.Element {
        return <Modal
                show={this.state.show}
                onHide={this.state.handleClose}
                backdrop="static"
                keyboard={false}
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
                    <GoogleLoginButton/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.props.handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
    }
}