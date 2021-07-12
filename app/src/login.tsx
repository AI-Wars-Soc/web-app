import {GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline} from 'react-google-login';
import React, {Dispatch, SetStateAction} from "react";
import { Modal, Button, Alert } from "react-bootstrap"
import {UserData} from "./user";

type GoogleLoginProps = {
    setUser: Dispatch<SetStateAction<UserData>>
}

type GoogleLoginState = {
    error: string,
    isLoaded: boolean,
    data: {
        clientId: string
        hostedDomain: string | null
    },
}

class GoogleLoginButton extends React.Component<GoogleLoginProps, GoogleLoginState> {
    constructor(props: GoogleLoginProps) {
        super(props);
        this.state = {
            error: "",
            isLoaded: false,
            data: {clientId: "", hostedDomain: null}
        };

        this.onLoginFail = this.onLoginFail.bind(this);
        this.onLoginSuccess = this.onLoginSuccess.bind(this);
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
                    console.log("Key exchange result: ");
                    console.log(result);
                    this.props.setUser(result.user);
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
    handleClose: React.MouseEventHandler<HTMLElement>
    show: boolean,
    static: boolean,
    setUser: Dispatch<SetStateAction<UserData>>
}

export class LoginModal extends React.Component<LoginModalProps> {
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
                    <GoogleLoginButton setUser={this.props.setUser}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.props.handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
    }
}