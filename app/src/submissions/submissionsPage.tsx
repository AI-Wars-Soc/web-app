import React from "react";
import {SubmissionForm} from "./submissionForm/submissionForm";
import {User} from "../user";
import {Accordion} from "react-bootstrap";
import {SubmissionEntry, SubmissionData} from "./submissionEntry/submissionEntry";
import {ApiBoundComponent} from "../apiBoundComponent";
import {isA} from "ts-type-checked";
import {PageInfo, PageTitle} from "../pageTitleAndInfo";
import {CenterDiv} from "../centreDiv";

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
            <PageTitle>Submissions</PageTitle>
            <PageInfo>Here you can see your previous submissions and make new ones.</PageInfo>
            <CenterDiv>
                <div className="my-2 my-md-4 mx-lg-4 w-100" style={{maxWidth: "1000px"}}>
                    <SubmissionForm refreshSubmissions={this.fetch}/>
                    <div className="p-2 p-md-4 px-lg-5">
                        {submissions}
                    </div>
                </div>
            </CenterDiv>
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
            submissions = <CenterDiv>
                <div className="my-3 p-2 text-center border border-info rounded">
                    To begin, download the Base AI for
                    the signatures of the method that you need to implement.
                </div>
            </CenterDiv>
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