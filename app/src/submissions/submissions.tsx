import React from "react";
import {SubmissionField} from "./submissionField";
import {UserData} from "../user";
import {Accordion} from "react-bootstrap";
import {SubmissionEntry, SubmissionData} from "./submissionEntry";

type SubmissionsPageProps = {
    user: UserData
};

type SubmissionsPageState = {
    error: boolean,
    submissions: SubmissionData[] | null
}

export class SubmissionsPage extends React.Component<SubmissionsPageProps, SubmissionsPageState> {
    constructor(props: SubmissionsPageProps) {
        super(props);
        this.state = {
            error: false,
            submissions: null
        }

        this.updateSubmissionsData = this.updateSubmissionsData.bind(this);
    }

    private updateSubmissionsData(): void {
        const requestOptions = {
            method: 'POST'
        };
        fetch("/api/get_submissions", requestOptions)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        submissions: result.submissions
                    });
                },
                (error) => {
                    console.error(error);
                    this.setState({
                        error: true,
                    });
                }
            );
    }

    componentDidMount(): void {
        this.updateSubmissionsData();
    }

    render(): JSX.Element {
        let submissions = <></>
        if (this.state.error) {
            submissions = <div>Your submissions could not be loaded</div>;
        }
        if (this.state.submissions != null) {
            if (this.state.submissions.length == 0) {
                submissions = <div className="d-flex my-3 justify-content-center">
                    <div className="p-2 text-center border border-info rounded">
                        To begin, clone the <a href="https://github.com/AI-Wars-Soc/chess-ai">Github
                        Repository</a> for
                        the signatures of the method that you need to implement.
                    </div>
                </div>
            } else {
                submissions =  <Accordion className="w-100">
                    {this.state.submissions.map((v, i) => <SubmissionEntry key={i} refreshSubmissions={this.updateSubmissionsData} {...v}/>)}
                </Accordion>
            }
        }

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
                        <SubmissionField refreshSubmissions={this.updateSubmissionsData}/>
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
}