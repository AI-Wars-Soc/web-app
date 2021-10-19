import React, {ChangeEvent} from "react";
import {Post} from "../../apiBoundComponent";
import Switch from "react-bootstrap/Switch";

type SubmissionEnabledSwitchProps = {
    submission_id: number,
    active: boolean,
    refreshSubmissions: () => unknown
}

export default class SubmissionEnabledSwitch extends React.Component<SubmissionEnabledSwitchProps> {
    constructor(props: SubmissionEnabledSwitchProps) {
        super(props);

        this.onSwitch = this.onSwitch.bind(this);
    }

    private onSwitch(e: ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        const v = e.target.checked;

        Post("set_submission_active", {
            submission_id: this.props.submission_id,
            enabled: v
        })
            .then(
                () => {
                    this.props.refreshSubmissions();
                })
            .catch(
                (error) => {
                    console.error(error);
                    e.target.checked = !e.target.checked;
                }
            );
    }

    render(): JSX.Element {
        return <div className="p-1">
            <Switch
                onChange={this.onSwitch}
                id={"enabledSwitch" + this.props.submission_id}
                label={this.props.active ? "Enabled" : "Disabled"}
                checked={this.props.active}
            />
        </div>;
    }
}