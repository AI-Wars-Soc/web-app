import React from "react";
import {TrashFill} from "react-bootstrap-icons";

type SubmissionDeleteButtonProps = {
    submission_id: number,
    refreshSubmissions: () => unknown
}

export default class SubmissionDeleteButton extends React.Component<SubmissionDeleteButtonProps> {
    constructor(props: SubmissionDeleteButtonProps) {
        super(props);

        this.onClick = this.onClick.bind(this);
    }

    private onClick() {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                submission_id: this.props.submission_id,
            })
        };
        fetch("/api/delete_submission", requestOptions)
            .then(res => res.json())
            .then(
                () => {
                    this.props.refreshSubmissions();
                },
                (error) => {
                    console.error(error);
                }
            );
    }

    render(): JSX.Element {
        return <TrashFill color="brown" size={32} onClick={this.onClick} />;
    }
}