import React, {useState} from "react";
import {Modal, Button} from "react-bootstrap"
import {LoadingSuspense} from "../../loadingSuspense";
const Dropzone = React.lazy(() => import("../../dropzone"));

type SubmissionUploadModalProps = {
    handleClose: () => void,
    handleSubmissionUpload: (f: File[]) => unknown,
    show: boolean,
}

export default function SubmissionUploadModal(props: SubmissionUploadModalProps): JSX.Element {
    const [files, setFiles] = useState([] as File[]);

    const addFiles = (newFiles: File[]) => {
        setFiles([...files, ...newFiles]);
    };

    const handleClose = () => {
        props.handleClose();
        setFiles([]);
    };

    return <Modal
        show={props.show}
        onHide={handleClose}
        backdrop={true}
        keyboard={true}
    >
        <Modal.Header closeButton>
            <Modal.Title>{"Upload Your AI"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <LoadingSuspense>
                <Dropzone files={files} onFilesAdded={addFiles}/>
            </LoadingSuspense>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="primary" onClick={() => {props.handleSubmissionUpload(files); handleClose();}}>
                Upload
            </Button>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
        </Modal.Footer>
    </Modal>;
}