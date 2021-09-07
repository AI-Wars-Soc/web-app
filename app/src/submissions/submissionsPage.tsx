import React from "react";
import {SubmissionForm} from "./submissionForm/submissionForm";
import {User} from "../user";
import {Accordion} from "react-bootstrap";
import {SubmissionEntry, SubmissionData} from "./submissionEntry/submissionEntry";
import {ApiBoundComponent} from "../apiBoundComponent";
import {isA} from "ts-type-checked";

type SubmissionsPageData = {
    submissions: SubmissionData[]
};

type SubmissionsPageProps = {
    user: User
};

type SubmissionsPageState = {
    error: boolean,
    data: SubmissionsPageData | null
}

export default class SubmissionsPage extends ApiBoundComponent<SubmissionsPageProps, SubmissionsPageData, SubmissionsPageState> {
    constructor(props: SubmissionsPageProps) {
        super("get_submissions", props);
        this.state = {
            error: false,
            data: null
        }
    }

    private getPage(submissions: JSX.Element): JSX.Element {
        return <>
            <div className="d-flex justify-content-start">
                <h1>Submissions</h1>
            </div>
            <div className="px-3 d-none d-sm-block">
                <p className="lead">
                    Here you can see your previous submissions and make new ones.
                </p>
            </div>
            <div className="my-2 my-md-4 d-flex flex-row">
                <div className="d-flex justify-content-center w-100 w-lg-50">
                    <div className="d-flex flex-column mx-lg-4 flex-grow-1" id="submissions">
                        <SubmissionForm refreshSubmissions={this.fetch}/>
                        <div className="p-1 p-md-2">
                            <div className="d-flex justify-content-center w-100 flex-row p-1 p-md-2 px-lg-5">
                                {submissions}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>;
    }

    protected renderLoading(): JSX.Element {
        return this.getPage(<div/>);
    }

    protected renderError(): JSX.Element {
        return this.getPage(<div>Your submissions could not be loaded</div>);
    }

    protected renderLoaded(data: SubmissionsPageData): JSX.Element {
        let submissions;
        if (data.submissions.length == 0) {
            submissions = <div className="d-flex my-3 justify-content-center">
                <div className="p-2 text-center border border-info rounded">
                    To begin, clone the <a href="https://github.com/AI-Wars-Soc/chess-ai">Github
                    Repository</a> for
                    the signatures of the method that you need to implement.
                </div>
            </div>
        } else {
            submissions =  <Accordion className="max-width-center">
                {data.submissions.map((v, i) =>
                    <SubmissionEntry key={i} user={this.props.user} refreshSubmissions={this.fetch} {...v}/>)}
            </Accordion>
        }

        return this.getPage(submissions);
    }

    protected typeCheck(data: unknown): data is SubmissionsPageData {
        return isA<SubmissionsPageData>(data);
    }
}