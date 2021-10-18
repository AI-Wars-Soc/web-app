import React, {useCallback} from "react";

import {useDropzone} from 'react-dropzone'
import {CenterDiv} from "./centreDiv";

type MyDropzoneProps = {
    onFilesAdded: (f: File[]) => unknown
    files: File[]
}

type FileTileProps = {
    file: File
}

const fileTileStyle: React.CSSProperties = {
    padding: '10px',
    margin: '5px',
    borderWidth: "2px",
    borderRadius: "2px",
    borderColor: '#eeeeee',
    borderStyle: 'solid',
    backgroundColor: '#fafafa',
    color: '#000000',
    outline: 'none',
    position: "relative",
    overflow: "hidden",
    width: "100%"
};

function FileTile(props: FileTileProps): JSX.Element {
    return <div style={fileTileStyle}>{props.file.name}</div>;
}

const dropzoneStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out',
    flexWrap: "wrap"
};

export default function MyDropzone(props: MyDropzoneProps): JSX.Element {
    const {onFilesAdded, files} = props;
    const onDrop = useCallback((acceptedFiles: File[]) => {
        onFilesAdded(acceptedFiles);
    }, [onFilesAdded])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    const disp = isDragActive ?
        <p>Drop the files here ...</p> :
        <p>Drag & drop some files here, or click to select files</p>;

    return <>
        <div {...getRootProps()} style={dropzoneStyle}>
            <input {...getInputProps()} />
            <CenterDiv>{disp}</CenterDiv>
        </div>
        {files.map((f, i) => <FileTile key={f.name + i} file={f}/>)}
    </>;
}