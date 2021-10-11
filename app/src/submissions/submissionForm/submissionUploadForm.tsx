import React from "react";
import {Button, Col} from "react-bootstrap";
import {LoadingOrText} from "../../loadingOrText";
import SubmissionUploadModal from "./submissionUploadModal";

type SubmissionUploadFormProps = {
    refreshSubmissions: () => unknown
    setError: (error: string | null) => unknown
};

type SubmissionUploadFormState = {
    loading: boolean
    error: boolean
    downloaded: boolean
    uploadModalOpen: boolean
};

export default class SubmissionUploadForm extends React.Component<SubmissionUploadFormProps, SubmissionUploadFormState> {
    constructor(props: SubmissionUploadFormProps) {
        super(props);
        this.state = {
            loading: false,
            error: false,
            downloaded: localStorage.getItem("downloaded-base-ai") === "true",
            uploadModalOpen: false
        }

        this.setDownloaded = this.setDownloaded.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    private static getURL(): string {
        const extension = navigator.platform.startsWith("Win") ? "zip" : "tar";
        return  "/api/get_default_submission?extension=" + extension;
    }

    private setDownloaded(): void {
        this.setState({downloaded: true});

        localStorage.setItem("downloaded-base-ai", "true");
    }

    private onSubmit(): void {
        this.setState({uploadModalOpen: true});

        this.setDownloaded();
    }

    render(): JSX.Element {
        const downloaded = this.state.downloaded;

        return <>
            <SubmissionUploadModal handleClose={() => this.setState({uploadModalOpen: false})}
                                   handleSubmissionUpload={acceptedFiles => console.log(acceptedFiles)}
                                   show={this.state.uploadModalOpen}/>
            <Col xs={6}>
                <a href={SubmissionUploadForm.getURL()} download={"base-ai.zip"}
                   className={"btn float-right " + (downloaded ? "btn-secondary" : "btn-primary")}
                   onClick={this.setDownloaded}>Download base AI</a>
            </Col>
            <Col xs={6}>
                <Button type="submit" variant={downloaded ? "primary" : "secondary"}
                        onClick={this.onSubmit}>
                    <LoadingOrText loading={this.state.loading}>Upload your new AI</LoadingOrText>
                </Button>
            </Col>
        </>;
    }
}