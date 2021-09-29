import React from "react";
import {ApiBoundComponent} from "../apiBoundComponent";
import {User} from "../user";
import {isA} from "ts-type-checked";
import {Container, Row} from "react-bootstrap";

type AdminServicePageProps = {
    user: User
};

type AdminServicePageData = {
    "web_api": boolean
};

type AdminServicePageState = {
    data: AdminServicePageData | null,
    error: boolean
}

export default class AdminServicePage extends ApiBoundComponent<AdminServicePageProps, AdminServicePageData, AdminServicePageState> {
    constructor(props: AdminServicePageProps) {
        super("service_status", props, true);

        this.state = {
            data: null,
            error: false
        };
    }

    protected renderLoaded(data: AdminServicePageData): JSX.Element {
        const elms: [string, boolean][] = [["web-api", data.web_api]]
        return <Container>
            {elms.map(([a, b]) => <Row key={a}> {a}: {b ? "&#x2714;" : "&#x2717;"} </Row>)}
            </Container>;
    }

    protected typeCheck(data: unknown): data is AdminServicePageData {
        return isA<AdminServicePageData>(data);
    }
}