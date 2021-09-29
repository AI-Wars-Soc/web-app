import React, {FormEvent} from "react";
import {ApiBoundComponent, Post} from "../apiBoundComponent";
import {User} from "../user";
import {isA} from "ts-type-checked";
import {Button, Col, FormControl, Row} from "react-bootstrap";
import {SubmissionButton} from "../submissions/submissionButton";

type AdminBotsPageProps = {
    user: User
};

type AdminBotsPageData = {
    bots: { "id": number, "name": string, "date": unknown }[]
};

type AdminBotsPageState = {
    data: AdminBotsPageData | null,
    error: boolean,
    loading: boolean
}

export default class AdminBotsPage extends ApiBoundComponent<AdminBotsPageProps, AdminBotsPageData, AdminBotsPageState> {
    private nameNode: HTMLInputElement | null = null;
    private urlNode: HTMLInputElement | null = null;

    constructor(props: AdminBotsPageProps) {
        super("get_bots", props, true);

        this.state = {
            data: null,
            error: false,
            loading: false
        };

        this.deleteBot = this.deleteBot.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    private deleteBot(id: number): void {
        Post("remove_bot", {"bot_id": id})
            .then(() => {
                if (this.state.data === null) {
                    return;
                }

                this.fetch();
            });
    }

    private onSubmit(e: FormEvent<HTMLFormElement>): void {
        e.preventDefault();
        const url = this.urlNode?.value;
        if (url === undefined) {
            return;
        }
        const name = this.nameNode?.value;
        if (name === undefined) {
            return;
        }
        this.setState({loading: true});

        Post("add_bot", {name: name, url: url})
            .then(
                () => {
                    this.setState({
                        loading: false
                    });

                    this.fetch();
                })
            .catch(
                (error) => {
                    console.error(error);
                    this.setState({
                        loading: false
                    });
                }
            )
    }

    protected renderLoaded(data: AdminBotsPageData): JSX.Element {
        let botsList;
        if (data.bots.length > 0) {
            botsList = <>
                Bots:
                <ul>
                    {data.bots.map(({id, name, date}) =>
                        <li key={id}>
                            {name}, submitted {date}.
                            <Button variant={'danger'} onClick={() => this.deleteBot(id)}>Delete</Button>
                        </li>)}
                </ul>
            </>;
        } else {
            botsList = <>No bots!</>;
        }

        const submissionForm = <form action="#" id="bot-form" method="GET" onSubmit={this.onSubmit}>
            <Row style={{width: "100%", maxWidth: "1000px"}}>
                <Col xs={2} className="text-right my-auto">
                    <label htmlFor="name">Bot Name:</label>
                </Col>
                <Col xs={10}>
                    <FormControl type="text" id="name" ref={(node: HTMLInputElement) => (this.nameNode = node)}
                           placeholder={"Bot " + (data.bots.length + 1)} required/>
                </Col>
                <Col xs={2} className="text-right my-auto">
                    <label htmlFor="repo">Repository URL:</label>
                </Col>
                <Col xs={10}>
                    <FormControl type="url" id="repo" ref={(node: HTMLInputElement) => (this.urlNode = node)}
                           placeholder="https://github.com/your/repo" required/>
                </Col>
                <Col xs={12}>
                    <SubmissionButton loading={this.state.loading}>
                        Submit
                    </SubmissionButton>
                </Col>
            </Row>
        </form>;

        return <>
            {submissionForm}
            {botsList}
        </>
    }

    protected typeCheck(data: unknown): data is AdminBotsPageData {
        return isA<AdminBotsPageData>(data);
    }
}