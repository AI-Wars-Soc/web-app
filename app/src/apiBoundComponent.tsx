import {UserData} from "./user";
import React from "react";

interface ApiBoundComponentProps {
    userData: UserData;
}

type ApiBoundComponentState<D> = {
    error: boolean,
    data: D | null
};

export function Post<T>(apiEndpoint: string, sentData: Record<string, unknown> = {}, typeCheck: ((a: unknown) => a is T) | null = null): Promise<T | undefined> {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(sentData)
    };
    return fetch('/api/' + apiEndpoint, requestOptions)
        .then(res => res.json())
        .then((response: { status: string, data: unknown }) => {
            if (response.status == "resent") {
                return;
            }
            if (response.status !== "success") {
                return Promise.reject(response);
            }
            const returnedData = response.data;
            if (typeCheck !== null && !typeCheck(returnedData)) {
                console.error("Endpoint gave wrong data shape");
                return Promise.reject(response);
            }
            return returnedData as T;
        });
}

export abstract class ApiBoundComponent<P extends ApiBoundComponentProps, D, S extends ApiBoundComponentState<D>> extends React.Component<P, S>
{
    private readonly apiEndpoint: string;

    protected constructor(apiEndpoint: string, props: P) {
        super(props);
        this.apiEndpoint = apiEndpoint;

        this.fetch = this.fetch.bind(this);
    }

    getDataToSend(): Record<string, unknown> {
        return {};
    }

    fetch(): void {
        Post<D>(this.apiEndpoint, this.getDataToSend(), this.typeCheck)
            .then((data: D | undefined) => {
                if (data === undefined) {
                    return Promise.reject("Data field not present");
                }
                this.setState({
                    data: data
                });
            })
            .catch((error) => {
                console.error(error);
                this.setState({
                    error: true
                });
            })
    }

    componentDidMount(): void {
        this.setState({
            error: false,
            data: null
        });
        this.fetch();
    }

    componentDidUpdate(prevProps: P): void {
        if (prevProps.userData !== this.props.userData) {
            this.fetch();
        }
    }

    render(): JSX.Element {
        if (this.state.error) {
            return this.renderError();
        }

        if (this.state.data === null) {
            return this.renderLoading();
        }

        return this.renderLoaded(this.state.data as D);
    }

    protected abstract typeCheck(data: unknown): data is D;
    protected renderError(): JSX.Element { return <>Failed to load endpoint {this.apiEndpoint.replace("_", " ")} </>; }
    protected renderLoading(): JSX.Element { return <></>; }
    protected abstract renderLoaded(data: D): JSX.Element;
}