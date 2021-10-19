import React, { Suspense } from "react";
import {TrashFill} from "react-bootstrap-icons";
import {Post} from "../../apiBoundComponent";

const ConfirmModal = React.lazy(() => import("../../confirmModal"))

type SubmissionDeleteButtonProps = {
    submission_id: number,
    index: number,
    refreshSubmissions: () => unknown
}

type SubmissionDeleteButtonState = {
    showConfirm: boolean
}

export default class SubmissionDeleteButton extends React.Component<SubmissionDeleteButtonProps, SubmissionDeleteButtonState> {
    constructor(props: SubmissionDeleteButtonProps) {
        super(props);
        this.state = {
            showConfirm: false
        }

        this.onClick = this.onClick.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
    }

    private onClick() {
        this.setState({
            showConfirm: true
        });
    }

    private onClose() {
        this.setState({
            showConfirm: false
        });
    }

    private onConfirm() {
        this.onClose();

        Post("delete_submission", {submission_id: this.props.submission_id})
            .then(
                () => {
                    this.props.refreshSubmissions();
                })
            .catch(
                (error) => {
                    console.error(error);
                }
            );
    }

    render(): JSX.Element {
        return <>
            <TrashFill color="brown" size={32} onClick={this.onClick}/>
            <Suspense fallback={<div/>}>
                <ConfirmModal title={"Delete Submission"} handleClose={this.onClose} handleConfirm={this.onConfirm} show={this.state.showConfirm}>
                    Are you sure you want to delete Submission {this.props.index}?
                </ConfirmModal>
            </Suspense>
            </>;
    }
}