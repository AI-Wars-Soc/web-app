import React from "react";
import {CenterDiv} from "../../centreDiv";

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
                    <CenterDiv>
                        <div className="m-1 m-sm-3 p-2 bg-danger text-white text-center border border-danger rounded">
                            {this.props.error}
                        </div>
                    </CenterDiv>
                    : <></>
            }
        </>;
    }
}