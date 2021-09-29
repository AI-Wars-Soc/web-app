import React from "react";

export function CenterDiv(props: {maxWidth?: number, children: React.ReactNode}): JSX.Element {
    let children = props.children;
    if (props.maxWidth !== undefined) {
        children = <div style={{maxWidth: props.maxWidth + "px"}} className={"w-100"}>
            {children}
        </div>;
    }

    return <div className="d-flex justify-content-center w-100">
        {children}
    </div>
}