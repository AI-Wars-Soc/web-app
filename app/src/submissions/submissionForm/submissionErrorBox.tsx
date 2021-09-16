import React from "react";

type SubmissionErrorBoxProps = {
    error: string | null
};

export class SubmissionErrorBox extends React.Component<SubmissionErrorBoxProps> {
    constructor(props: SubmissionErrorBoxProps) {
        super(props);
    }

    render(): JSX.Element {
        return <>
            {
                this.props.error ?
                    <div className="justify-content-start justify-content-sm-center d-flex">
                        <div id="submission-error-msg"
                             className="m-1 m-sm-3 p-2 bg-danger text-white text-center border border-danger rounded">
                            {this.props.error}
                        </div>
                    </div>
                    : <></>
            }
        </>;
    }
}