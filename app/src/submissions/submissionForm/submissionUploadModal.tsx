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

    const addFile = (file: File) => {
        const newFiles = files;

        newFiles.push(file);

        setFiles(newFiles);
    };

    const handleClose = (e: React.MouseEvent<HTMLElement>) => {
        props.handleClose(e);
        setFiles([]);
    }

    return <Modal
        show={props.show}
        onHide={props.handleClose}
        backdrop={true}
        keyboard={true}
    >
        <Modal.Header closeButton>
            <Modal.Title>{"Upload Your AI"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <LoadingSuspense>
                <Dropzone files={files} onFileAdded={addFile}/>
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
    </Modal>
}