import React, {useCallback} from "react";

import {useDropzone} from 'react-dropzone'
import {Col, Container, Row} from "react-bootstrap";

type MyDropzoneProps = {
    onFileAdded: (f: File) => unknown
    files: File[]
}

type FileTileProps = {
    file: File
}

const fileTileStyle: React.CSSProperties = {
    padding: '20px',
    margin: '10px',
    borderWidth: "2px",
    borderRadius: "20px",
    borderColor: '#4c4c4c',
    borderStyle: 'solid',
    backgroundColor: '#5d5d5d',
    color: '#ffffff',
    outline: 'none',
    transition: 'border .24s ease-in-out',
    position: "relative",
    overflow: "hidden"
};

function FileTile(props: FileTileProps): JSX.Element {
    return <Col style={fileTileStyle}>{props.file.name}</Col>;
}

const dropzoneStyle: React.CSSProperties = {
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

export default function MyDropzone(props: MyDropzoneProps): JSX.Element {
    const {onFileAdded, files} = props;
    const onDrop = useCallback((acceptedFiles: File[]) => {
        acceptedFiles.forEach(f => onFileAdded(f))
    }, [onFileAdded])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    const getFileTiles = useCallback(() => {
        return files.map((f, i) => <FileTile key={f.name + i} file={f}/>);
    }, [files])

    const disp = files.length === 0 ? (
        isDragActive ?
            <p>Drop the files here ...</p> :
            <p>Drag & drop some files here, or click to select files</p>
    ) : (
        <Container><Row xs={3} md={5} lg={7} xl={9}>{getFileTiles()}</Row></Container>
    );

    return (
        <div {...getRootProps()} style={dropzoneStyle}>
            <input {...getInputProps()} />
            { disp }
        </div>
    );
}