import React from "react";
import {Modal, Button} from "react-bootstrap"
import {LoadingSuspense} from "../../loadingSuspense";
const Dropzone = React.lazy(() => import("react-dropzone"));

type SubmissionUploadModalProps = {
    handleClose: React.MouseEventHandler<HTMLElement>,
    handleSubmissionUpload: (f: File[]) => unknown,
    show: boolean,
}

type SubmissionUploadModalState = {
    files: File[]
}

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

export default class SubmissionUploadModal extends React.Component<SubmissionUploadModalProps, SubmissionUploadModalState> {
    constructor(props: SubmissionUploadModalProps) {
        super(props);

        this.state = {
            files: []
        }
    }

    render(): JSX.Element {
        return <Modal
            show={this.props.show}
            onHide={this.props.handleClose}
            backdrop={true}
            keyboard={true}
        >
            <Modal.Header closeButton>
                <Modal.Title>{"Upload Your AI"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <LoadingSuspense>
                    <Dropzone onDrop={acceptedFiles => console.log(acceptedFiles)}>
                        {({getRootProps, getInputProps}: {getRootProps: () => never, getInputProps: () => never}) => (
                            <div style={{...dropzoneStyle, cursor: "hand"}} {...getRootProps()}>
                                <input {...getInputProps()} />
                                <p>Drag &apos;n&apos; drop some files here, or click to select files</p>
                            </div>
                        )}
                    </Dropzone>
                </LoadingSuspense>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={e => {this.props.handleSubmissionUpload(this.state.files); this.props.handleClose(e);}}>
                    Upload
                </Button>
                <Button variant="secondary" onClick={this.props.handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    }
}