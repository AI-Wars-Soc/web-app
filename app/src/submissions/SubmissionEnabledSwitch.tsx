import React, {ChangeEvent} from "react";

type SubmissionEnabledSwitchProps = {
    submission_id: number,
    active: boolean,
    refreshSubmissions: () => unknown
}

export class SubmissionEnabledSwitch extends React.Component<SubmissionEnabledSwitchProps> {
    constructor(props: SubmissionEnabledSwitchProps) {
        super(props);

        this.onSwitch = this.onSwitch.bind(this);
    }

    private onSwitch(e: ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        const v = e.target.checked;

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                submission_id: this.props.submission_id,
                enabled: v
            })
        };
        fetch("/api/set_submission_active", requestOptions)
            .then(res => res.json())
            .then(
                () => {
                    this.props.refreshSubmissions();
                },
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