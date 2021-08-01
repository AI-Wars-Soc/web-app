import React, { Suspense } from "react";
import {Post} from "../apiBoundComponent";
import {Button} from "react-bootstrap";

const ConfirmModal = React.lazy(() => import("../confirmModal"))

type DeleteAccountButtonProps = {
    onDeleteAccount: () => unknown
}

type DeleteAccountButtonState = {
    showConfirm: boolean
}

export class DeleteAccountButton extends React.Component<DeleteAccountButtonProps, DeleteAccountButtonState> {
    constructor(props: DeleteAccountButtonProps) {
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

        Post("remove_user")
            .then(
                () => {
                    this.props.onDeleteAccount();
                })
            .catch(
                (error) => {
                    console.error(error);
                }
            );
    }

    render(): JSX.Element {
        return <>
            <Button variant={'danger'} onClick={this.onClick}>Delete Account</Button>
            <Suspense fallback={<div/>}>
                <ConfirmModal handleClose={this.onClose} handleConfirm={this.onConfirm} show={this.state.showConfirm}>
                    Are you sure you want to delete your account?
                    This will remove all of your submissions, and wipe all of your progress on the leaderboard.
                </ConfirmModal>
            </Suspense>
        </>;
    }
}