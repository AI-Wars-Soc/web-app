import React, {Suspense} from "react";
import {Spinner} from "react-bootstrap";

export function LoadingSuspense(props: {children: JSX.Element}): JSX.Element {
    return <Suspense fallback={<Spinner animation="grow" role="status"/>}>{props.children}</Suspense>;
}