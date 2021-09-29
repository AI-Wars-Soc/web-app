import React from "react";

export function PageTitle(props: {children: string}): JSX.Element {
    return <div className="flex-column justify-content-center justify-content-sm-start">
            <h1>{props.children}</h1>
        </div>;
}

export function PageInfo(props: {children: string}): JSX.Element {
    return <div className="px-3 d-none d-sm-block">
        <p className="lead">
            {props.children}
        </p>
    </div>;
}