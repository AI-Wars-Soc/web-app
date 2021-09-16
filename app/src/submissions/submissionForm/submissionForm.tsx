import React from "react";
import {isA} from "ts-type-checked";
import {SubmissionErrorBox} from "./submissionErrorBox";
const SubmissionURLForm = React.lazy(() => import("./submissionURLForm"));
const SubmissionUploadForm = React.lazy(() => import("./submissionUploadForm"));

type SubmissionFormProps = {
    refreshSubmissions: () => unknown
}

type SubmissionMethod = "upload" | "git-url";

type SubmissionFormState = {
    selectedSubmissionMethod: SubmissionMethod,
    error: string | null
}

export class SubmissionForm extends React.Component<SubmissionFormProps, SubmissionFormState> {
    constructor(props: SubmissionFormProps) {
        super(props);

        let submissionMethod = localStorage.getItem("selected-submission-method");
        if (!isA<SubmissionMethod>(submissionMethod) || !submissionMethod) {
            submissionMethod = "upload";
        }

        this.state = {
            selectedSubmissionMethod: submissionMethod as SubmissionMethod,
            error: null
        }
    }

    componentDidUpdate(_: Readonly<SubmissionFormProps>, prevState: Readonly<SubmissionFormState>): void {
        if (prevState.selectedSubmissionMethod != this.state.selectedSubmissionMethod) {
            localStorage.setItem("selected-submission-method", this.state.selectedSubmissionMethod)
        }
    }

    private renderForm(): JSX.Element {
        const setError = (error: string | null) => this.setState({error: error});
        switch (this.state.selectedSubmissionMethod) {
            case "upload":
                return <SubmissionUploadForm refreshSubmissions={this.props.refreshSubmissions} setError={setError}/>
            case "git-url":
                return <SubmissionURLForm refreshSubmissions={this.props.refreshSubmissions} setError={setError}/>
            default:
                this.setState({
                    selectedSubmissionMethod: "upload"
                });
                return this.renderForm();
        }
    }

    render(): JSX.Element {
        const options: SubmissionMethod[] = ["upload", "git-url"];
        const iCurrent = options.indexOf(this.state.selectedSubmissionMethod);
        const iNext = (iCurrent + 1) % options.length;
        const next = options[iNext];
        return <div className="container">
            <div className="row justify-content-center">
                {this.renderForm()}
            </div>
            <div className="w-100 m-3"/>
            <div className="row justify-content-center">
                <a className="text-secondary" href={"#"} onClick={() => this.setState({
                    selectedSubmissionMethod: next
                })}>Or {["Upload your files Online", "Provide a Git Link"][iNext]}</a>
            </div>
            <div className="row justify-content-center">
                <SubmissionErrorBox error={this.state.error}/>
            </div>
        </div>
    }
}