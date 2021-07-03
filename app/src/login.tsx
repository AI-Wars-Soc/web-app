import {GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline} from 'react-google-login';
import React from "react";

type LoginModalState = {
    error: string,
    isLoaded: boolean,
    lockedOpen: boolean,
    modal: {
        clientId: string
        hostedDomain: string | null
    }
}

export class LoginModal extends React.Component<Record<string, never>, LoginModalState> {
    constructor(props: Record<string, never>) {
        super(props);
        this.state = {
            error: "",
            isLoaded: false,
            lockedOpen: false,
            modal: {clientId: "", hostedDomain: null}
        };
    }

    componentDidMount(): void {
        const requestOptions = {
            method: 'POST'
        };
        fetch("/api/get_login_modal_data", requestOptions)
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
                    this.setState({
                        isLoaded: true,
                        modal: result
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
        let loginButton = <></>

        if (this.state.isLoaded) {
            const loginProps = {
                hostedDomain: this.state.modal.hostedDomain === null ? undefined : this.state.modal.hostedDomain,
                clientId: this.state.modal.clientId,
                buttonText: "Login with Google",
                onSuccess: this.onLoginSuccess,
                onFailure: this.onLoginFail,
                cookiePolicy: 'single_host_origin',
            }
            loginButton = <GoogleLogin theme='light' {...loginProps}/>
        }

        let xButton = <button id="modalButtonXClose" type="button" className="close" data-dismiss="modal"
                              aria-label="Close"><span aria-hidden="true">&times;</span></button>
        let bottomButton = <button id="modalButtonClose" type="button" className="btn btn-secondary"
                                   data-dismiss="modal">Close</button>

        if (this.state.lockedOpen) {
            xButton = <button id="modalButtonXBack" type="button" className="close"
                              onClick={() => templates.setWindowLoc('/')} aria-label="Back">
                <span aria-hidden="true">&times;</span></button>
            bottomButton = <button id="modalButtonBack" type="button" className="btn btn-primary"
                                   onClick={() => templates.setWindowLoc('/')}>Back</button>
        }

        const errorMessage = this.state.error === "" ? <></> :
            <div id="login-error-msg" className="p-2 bg-danger text-white text-center border border-danger rounded">
                Something went wrong. Please try again or let someone know. {this.state.error}
            </div>

        return <div className="modal fade" id="loginModal" role="dialog" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="loginModalLabel">Login</h5>
                        {xButton}
                    </div>
                    <div className="modal-body">
                        <h4 className="card-title mb-4 mt-1">Sign in</h4>
                        <div className="d-grid gap-3">
                            <p>
                                By logging in you agree to the rules on the about page,
                                as well as allowing us to store your name and and email address.
                                You can delete your account at any time.
                            </p>
                            {loginButton}
                            <div className="d-flex justify-content-center">
                                <div className="g-signin2" data-width="300" data-height="50" data-longtitle="true"
                                     data-onsuccess="onGoogleSignIn" data-onfailure="onGoogleFail"
                                     data-theme="light">
                                </div>
                            </div>
                            {errorMessage}
                        </div>
                    </div>
                    <div className="modal-footer">
                        {bottomButton}
                    </div>
                </div>
            </div>
        </div>
    }
}