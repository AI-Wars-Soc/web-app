import {Spinner} from "react-bootstrap";
import React from "react";

export function LoadingOrText(props: {children: string, loading: boolean}): JSX.Element {
    return props.loading ? <Spinner animation="border" role="status"/> : <>{props.children}</>
}