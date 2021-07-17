import React from "react";
import {SubmissionField} from "./submissionField";
import {UserData} from "../user";

type SubmissionsPageProps = {
    user: UserData
};

export class SubmissionsPage extends React.Component<SubmissionsPageProps> {
    render(): JSX.Element {
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
                        <SubmissionField/>
                        <div className="p-1 p-md-2">
                            <div id="submissions-accordion">
                                <div className="text-center">Loading your submissions...</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>;
    }
}