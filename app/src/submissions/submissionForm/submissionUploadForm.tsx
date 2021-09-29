import React from "react";
import {Button, Col} from "react-bootstrap";
import {LoadingOrText} from "../../loadingOrText";
import {LoadingSuspense} from "../../loadingSuspense";
const Dropzone = React.lazy(() => import("react-dropzone"));

type SubmissionUploadFormProps = {
    refreshSubmissions: () => unknown
    setError: (error: string | null) => unknown
};

type SubmissionUploadFormState = {
    loading: boolean
    error: boolean

    downloaded: boolean
};

const dropzoneStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
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
            <Col xs={12}>
                <LoadingSuspense>
                    <Dropzone>
                        {({getRootProps, getInputProps}: {getRootProps: () => never, getInputProps: () => never}) => (
                            <div style={dropzoneStyle} {...getRootProps()}>
                                <input {...getInputProps()} />
                                <p>Drag &apos;n&apos; drop some files here, or click to select files</p>
                            </div>
                        )}
                    </Dropzone>
                </LoadingSuspense>
            </Col>
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