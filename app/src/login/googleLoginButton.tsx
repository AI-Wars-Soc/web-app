import React from "react";
import {GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline} from "react-google-login";
import {Alert} from "react-bootstrap";

type GoogleLoginProps = {
    updateUser: () => unknown
}

type GoogleLoginState = {
    error: string,
    isLoaded: boolean,
    data: {
        clientId: string
        hostedDomain: string | null
    },
}

export class GoogleLoginButton extends React.Component<GoogleLoginProps, GoogleLoginState> {
    tokenTimeout: NodeJS.Timeout | null;

    constructor(props: GoogleLoginProps) {
        super(props);
        this.state = {
            error: "",
            isLoaded: false,
            data: {clientId: "", hostedDomain: null}
        };
        this.tokenTimeout = null;

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
                    this.setState({
                        isLoaded: true,
                        data: result
                    });
                },
                (error) => {
                    console.error(error);
                    this.setState({
                        isLoaded: true,
                        error: error
                    });
                }
            );
    }

    private onLoginFail(error: GoogleLoginResponse | GoogleLoginResponseOffline) {
        console.error("Could not sign in");
        console.error(error);

        this.setState({
            error: "Could not sign in. Please try again later."
        });
    }

    private onLoginSuccess(googleUser: GoogleLoginResponse | GoogleLoginResponseOffline) {
        if (!("getAuthResponse" in googleUser)) {
            console.error("Got offline response - could not sign in");
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
                () => {
                    this.props.updateUser();
                },
                (error) => {
                    console.error(error);
                    this.setState({
                        error: error
                    });
                }
            );
    }

    componentWillUnmount(): void {
        if (this.tokenTimeout !== null) {
            clearTimeout(this.tokenTimeout);
        }
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

        return <div className="d-flex justify-content-center">
            <GoogleLogin {...loginProps}/>
        {errorMessage}
        </div>
    }
}