import React, {ChangeEvent} from "react";
import {SubmissionWinLossGraph} from "./submissionGraph";

type SubmissionEntryProps = {
    submission_id: number,
    index: number,
    status: string,
    submission_date: string,
    healthy: boolean,
    active: boolean,
    enabled_status: string,
    crashed: boolean,
    crash_reason: string,
    crash_reason_long: string,
    prints: string
};

export class SubmissionEntry extends React.Component<SubmissionEntryProps> {
    private submissionEnabledSwitch(e: ChangeEvent<HTMLInputElement>) {
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
                (result) => {
                    this.setState({
                        entries: result.entries
                    });
                },
                (error) => {
                    console.error(error);
                    e.target.checked = !e.target.checked;
                }
            );
    }

    render(): JSX.Element {
        let activeSwitch = <></>;
        let winLossGraph = <></>;
        if (this.props.healthy) {
            activeSwitch = <div className="p-1 submission-active-switch">
                <div className="custom-control custom-switch">
                    <input type="checkbox" className="custom-control-input"
                           id="enabledSwitch{{ submission_id }}"
                           {...{checked: (this.props.active ? true : undefined)}}
                           onChange={this.submissionEnabledSwitch}/>
                    <label className="custom-control-label"
                           htmlFor="enabledSwitch{{ submission_id }}">{this.props.enabled_status}</label>

                </div>
            </div>;

            winLossGraph = <SubmissionWinLossGraph/>;
        }

        let crashedDiv = <></>;
        if (this.props.crashed) {
            crashedDiv = <div className="submission-crash-report p-1 px-3">
                <div>
                    <b>Crash Reason:</b>
                    <p className="text-monospace">{this.props.crash_reason}</p>
                </div>
                <p>
                    {this.props.crash_reason_long}
                </p>
                <div>
                    {this.props.prints === ""
                        ? <>Your AI did not print anything.</>
                        : <>Your AI printed the following:
                            <div>
                                <p className="text-monospace">{this.props.prints}</p>
                            </div>
                        </>}
                </div>
            </div>
        }


        return <div className="d-flex justify-content-center w-100 flex-row p-1 p-md-2 px-lg-5">
            <div className="card max-width-center submission-entry {{ div_class }}">
                <div className="{{ subdiv_class }} card-header submission-rounded" id="submission-heading-{{ index }}"
                     data-toggle="collapse"
                     data-target="#submission-collapse-{{ index }}" aria-expanded="false"
                     aria-controls="submission-collapse-{{ index }}">
                    <div className="mb-0 panel-title">
                        <span className="h5">
                            Submission {this.props.index}
                        </span>
                        <span className="h6 font-weight-bold mx-1 mx-md-3">
                            {this.props.status}
                        </span>
                    </div>
                </div>

                <div id="submission-collapse-{{ index }}" className="collapse submission-collapse"
                     aria-labelledby="submission-heading-{{ index }}"
                     aria-expanded="false" data-parent="#submissions-accordion"
                     data-submission-id="{{ submission_id }}">
                    <div className="card-body">
                        <div className="container">
                            <div className="row justify-content-center">
                                <div className="col-11 col-md-6">
                                    <div className="p-1 submission-date">
                                        {this.props.submission_date}
                                    </div>
                                    {activeSwitch}
                                </div>
                                <div className="col-11 col-md-6">
                                    {winLossGraph}
                                    {crashedDiv}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>;
    }
}