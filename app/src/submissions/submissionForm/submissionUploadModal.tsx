import React, {useState} from "react";
import {Modal, Button} from "react-bootstrap"
import {LoadingSuspense} from "../../loadingSuspense";
const Dropzone = React.lazy(() => import("../../dropzone"));

type SubmissionUploadModalProps = {
    handleClose: React.MouseEventHandler<HTMLElement>,
    handleSubmissionUpload: (f: File[]) => unknown,
    show: boolean,
}

export default function SubmissionUploadModal(props: SubmissionUploadModalProps): JSX.Element {
    const [files, setFiles] = useState([] as File[]);

    const addFiles = (newFiles: File[]) => {
        setFiles([...files, ...newFiles]);
    };

    const handleClose = (e: React.MouseEvent<HTMLElement>) => {
        props.handleClose(e);
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
            <Button variant="primary" onClick={e => {props.handleSubmissionUpload(files); handleClose(e);}}>
                Upload
            </Button>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
        </Modal.Footer>
    </Modal>;
}