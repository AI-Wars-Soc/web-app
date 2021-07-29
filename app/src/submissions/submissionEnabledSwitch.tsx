import React, {ChangeEvent} from "react";
import {Post} from "../apiBoundComponent";

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
        return <div className="p-1 submission-active-switch">
            <div className="custom-control custom-switch">
                <input type="checkbox" className="custom-control-input"
                       id={"enabledSwitch" + this.props.submission_id}
                       checked={this.props.active}
                       onChange={this.onSwitch}/>
                <label className="custom-control-label"
                       htmlFor={"enabledSwitch" + this.props.submission_id}>{this.props.active ? "Enabled" : "Disabled"}</label>

            </div>
        </div>;
    }
}