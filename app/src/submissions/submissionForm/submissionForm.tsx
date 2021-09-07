import React from "react";
import {isA} from "ts-type-checked";
import {SubmissionURLForm} from "./submissionURLForm";

type SubmissionFormProps = {
    refreshSubmissions: () => unknown
}

type SubmissionMethod = "upload" | "git-url";

type SubmissionFormState = {
    selectedSubmissionMethod: SubmissionMethod
}

export class SubmissionForm extends React.Component<SubmissionFormProps, SubmissionFormState> {
    constructor(props: SubmissionFormProps) {
        super(props);

        let submissionMethod = localStorage.getItem("selected-submission-method");
        if (!isA<SubmissionMethod>(submissionMethod) || !submissionMethod) {
            submissionMethod = "upload";
        }

        this.state = {
            selectedSubmissionMethod: submissionMethod as SubmissionMethod
        }
    }

    componentDidUpdate(_: Readonly<SubmissionFormProps>, prevState: Readonly<SubmissionFormState>): void {
        if (prevState.selectedSubmissionMethod != this.state.selectedSubmissionMethod) {
            localStorage.setItem("selected-submission-method", this.state.selectedSubmissionMethod)
        }
    }

    private renderForm(): JSX.Element
    {
        switch (this.state.selectedSubmissionMethod) {
            case "upload":
                const extension = navigator.platform.startsWith("Win") ? "zip" : "tar";
                const url = "/api/get_default_submission?extension=" + extension;
                return <a download={true} href={url}>Download Base</a>
            case "git-url":
                return <SubmissionURLForm refreshSubmissions={this.props.refreshSubmissions}/>
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
        return <>
            {this.renderForm()}
            <a href={"#"} onClick={() => this.setState({
                selectedSubmissionMethod: next
            })}>Or {["Upload your files Online", "Provide a Git Link"][iNext]}</a>
        </>
    }
}