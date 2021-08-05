import React from "react";
import {GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline} from "react-google-login";
import {Alert} from "react-bootstrap";
import {ApiBoundComponent, Post} from "../apiBoundComponent";
import {User} from "../user";
import {isA} from "ts-type-checked";

type GoogleLoginData = {
    clientId: string
    hostedDomain: string | null
}

type GoogleLoginProps = {
    user: User
    updateUser: () => unknown
}

type GoogleLoginState = {
    error: boolean,
    loginErrorString: string | null;
    data: GoogleLoginData | null,
}

export class GoogleLoginButton extends ApiBoundComponent<GoogleLoginProps, GoogleLoginData, GoogleLoginState> {
    constructor(props: GoogleLoginProps) {
        super("get_google_login_data", props, false);
        this.state = {
            error: false,
            loginErrorString: null,
            data: null
        };

        this.onLoginFail = this.onLoginFail.bind(this);
        this.onLoginSuccess = this.onLoginSuccess.bind(this);
    }

    private onLoginFail(error: GoogleLoginResponse | GoogleLoginResponseOffline) {
        console.error("Could not sign in");
        console.error(error);

        this.setState({
            loginErrorString: "Could not sign in. Please try again later."
        });
    }

    private onLoginSuccess(googleUser: GoogleLoginResponse | GoogleLoginResponseOffline) {
        if (!("getAuthResponse" in googleUser)) {
            console.error("Got offline response - could not sign in");
            return;
        }

        const id_token = googleUser.getAuthResponse().id_token;

        Post("exchange_google_token", {google_token: id_token})
            .then(
                () => {
                    this.props.updateUser();
                })
            .catch(
                (error) => {
                    console.error(error);
                    this.setState({
                        error: error
                    });
                }
            );
    }

    protected renderLoaded(data: GoogleLoginData): JSX.Element {
        let errorMessage = <></>;
        if (this.state.loginErrorString !== null){
            errorMessage = <Alert variant={"danger"}>
                Something went wrong. Please try again or let someone know. {this.state.error}
            </Alert>
        }

        const loginProps = {
            hostedDomain: data.hostedDomain === null ? undefined : data.hostedDomain,
            clientId: data.clientId,
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

    protected typeCheck(data: unknown): data is GoogleLoginData {
        return isA<GoogleLoginData>(data);
    }
}