import React from "react";

type SubmissionUploadFormProps = {
    refreshSubmissions: () => unknown
    setError: (error: string | null) => unknown
};

type SubmissionUploadFormState = {
    loading: boolean
    error: boolean

    downloaded: boolean
};

export default class SubmissionUploadForm extends React.Component<SubmissionUploadFormProps, SubmissionUploadFormState> {
    constructor(props: SubmissionUploadFormProps) {
        super(props);
        this.state = {
            loading: false,
            error: false,
            downloaded: localStorage.getItem("downloaded-base-ai") === "true"
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
        this.props.setError("Not Implemented");

        this.setDownloaded();
    }

    render(): JSX.Element {
        const downloaded = this.state.downloaded;

        return <>
            <div className="col-5">
                <a href={SubmissionUploadForm.getURL()} download={"base-ai.zip"}
                   className={"btn float-right " + (downloaded ? "btn-secondary" : "btn-primary")}
                   onClick={this.setDownloaded}>Download base AI</a>
            </div>
            <div className="col-5">
                <button type="submit"
                        className={"btn " + (downloaded ? "btn-primary" : "btn-secondary")}
                        onClick={this.onSubmit}>
                    {this.state.loading ?
                        <span className="spinner-border spinner-border-sm" role="status"
                              id="submit-spinner"/> : <>Upload your new AI</>}
                </button>
            </div>
        </>;
    }
}