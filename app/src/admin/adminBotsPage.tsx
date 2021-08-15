import React, {FormEvent} from "react";
import {ApiBoundComponent, Post} from "../apiBoundComponent";
import {User} from "../user";
import {isA} from "ts-type-checked";
import {Button} from "react-bootstrap";

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
            <div className="d-flex justify-content-center w-100">
                <div className="d-flex max-width-center row">
                    <div className="col-2 my-auto">
                        <label htmlFor="name" className="my-auto text-right">Bot Name:</label>
                    </div>
                    <div className="col-10 my-auto">
                        <input type="text" className="form-control" id="name" ref={node => (this.nameNode = node)}
                               placeholder={"Bot " + (data.bots.length + 1)} required/>
                    </div>
                    <div className="col-2 my-auto">
                        <label htmlFor="repo" className="my-auto text-right">Repository URL:</label>
                    </div>
                    <div className="col-10 my-auto">
                        <input type="url" className="form-control" id="repo" ref={node => (this.urlNode = node)}
                               placeholder="https://github.com/your/repo" required/>
                    </div>
                    <div className="col-4 my-auto py-2 py-sm-3 py-md-0">
                        <div
                            className="d-flex w-100 justify-content-center justify-content-md-left">
                            <button type="submit"
                                    className="btn btn-primary submission-submit-button">
                                {this.state.loading ?
                                    <span className="spinner-border spinner-border-sm" role="status"
                                          id="submit-spinner"/> : <>Submit</>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
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