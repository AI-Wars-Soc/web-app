import React, {Suspense} from "react";
import {Button, Col} from "react-bootstrap";
import {LoadingOrText} from "../../loadingOrText";
import {Post} from "../../apiBoundComponent";

const SubmissionUploadModal = React.lazy(() => import("./submissionUploadModal"));

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
        this.onOpenUploadDialogue = this.onOpenUploadDialogue.bind(this);
        this.onFilesOpened = this.onFilesOpened.bind(this);
    }

    private static getURL(): string {
        const extension = (!navigator.platform || navigator.platform.startsWith("Win")) ? "zip" : "tar";
        return "/api/get_default_submission?extension=" + extension;
    }

    private setDownloaded(): void {
        this.setState({downloaded: true});

        localStorage.setItem("downloaded-base-ai", "true");
    }

    private onFilesOpened(files: File[]): void {
        let error: null | string = null;
        const datas: {fileName: string, data: string}[] = [];

        const onReadAll = () => {
            this.props.setError(error);
            if (error !== null) {
                return;
            }

            Post<{submission_id: number}>("add_submission_raw_files", {files: datas})
                .then(() => {
                    this.props.setError(null);
                    this.props.refreshSubmissions();
                })
                .catch(
                    (error) => {
                        console.error(error);
                        if (error.message) {
                            this.props.setError(error.message);
                        } else {
                            this.props.setError("Unknown error!");
                        }
                    }
                )
        };

        files.forEach((file) => {
            const reader = new FileReader()

            reader.onabort = () => { error = "File " + file.name + " read was aborted"; };
            reader.onerror = () => { error = "File " + file.name + " read error"; };
            reader.onload = () => {
                const binaryStr = reader.result as string;

                datas.push({fileName: file.name, data: binaryStr});

                if (datas.length === files.length) {
                    onReadAll();
                }
            }

            reader.readAsBinaryString(file);
        });
    }

    private onOpenUploadDialogue(): void {
        this.setState({uploadModalOpen: true});

        this.setDownloaded();
    }

    render(): JSX.Element {
        const downloaded = this.state.downloaded;

        return <>
            <Suspense fallback={<></>}>
                <SubmissionUploadModal handleClose={() => this.setState({uploadModalOpen: false})}
                                       handleSubmissionUpload={acceptedFiles => this.onFilesOpened(acceptedFiles)}
                                       show={this.state.uploadModalOpen}/>
            </Suspense>
            <Col xs={6}>
                <a href={SubmissionUploadForm.getURL()} download={"base-ai.zip"}
                   className={"btn float-right h-100 " + (downloaded ? "btn-secondary" : "btn-primary")}
                   onClick={this.setDownloaded}>Download base AI</a>
            </Col>
            <Col xs={6}>
                <Button type="submit" variant={downloaded ? "primary" : "secondary"}
                        onClick={this.onOpenUploadDialogue} className="h-100">
                    <LoadingOrText loading={this.state.loading}>Upload your new AI</LoadingOrText>
                </Button>
            </Col>
        </>;
    }
}