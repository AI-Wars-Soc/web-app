import React, {ChangeEvent, Suspense} from "react";
import {Accordion, Card} from "react-bootstrap";
const SubmissionWinLossGraph = React.lazy(() => import("./submissionGraph"));

export type SubmissionData = {
    submission_id: number,
    index: number,
    submission_date: string,
    healthy: boolean,
    tested: boolean,
    active: boolean,
    selected: boolean,
    crash_reason: string,
    crash_reason_long: string,
    prints: string
};
export type SubmissionEntryProps = {
    refreshSubmissions: () => unknown
} & SubmissionData;

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
                    this.props.refreshSubmissions();
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
                           id={"enabledSwitch" + this.props.submission_id}
                           {...{checked: (this.props.active ? true : undefined)}}
                           onChange={this.submissionEnabledSwitch}/>
                    <label className="custom-control-label"
                           htmlFor={"enabledSwitch" + this.props.submission_id}>{this.props.active ? "Enabled" : "Disabled"}</label>

                </div>
            </div>;
            winLossGraph = <Suspense fallback={<div>Loading Graph...</div>}>
                <SubmissionWinLossGraph submission_id={this.props.submission_id}/>
            </Suspense>;
        }

        const crashed = this.props.tested && !this.props.healthy;
        let crashedDiv = <></>;
        if (crashed) {
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

        let status = "";
        if (this.props.selected) {
            status = "Selected";
        } else if (!this.props.tested) {
            status = "Testing";
        } else if (crashed) {
            status = "Invalid";
        }

        const class_names = ["max-width-center", "submission-entry"];
        if (this.props.active) {
            class_names.push('submission-entry-active');
        }
        if (crashed) {
            class_names.push('invalid-stripes');
        }
        if (this.props.tested) {
            class_names.push('testing-stripes');
        }
        if (this.props.selected) {
            class_names.push('submission-entry-selected');
        }
        const div_class = class_names.join(" ");

        let subdiv_class = "submission-rounded";
        if (!this.props.tested) {
            subdiv_class += ' submission-entry-testing';
        } else if (!this.props.healthy) {
            subdiv_class += ' submission-entry-invalid';
        }

        return <Card className={div_class}>
                <Card.Header className={subdiv_class} >
                    <div className="mb-0 panel-title">
                        <span className="h5">
                            Submission {this.props.index}
                        </span>
                        <span className="h6 font-weight-bold mx-1 mx-md-3">
                            {status}
                        </span>
                    </div>
                </Card.Header>

                <Accordion.Collapse eventKey={"" + this.props.index}>
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
                </Accordion.Collapse>
            </Card>;
    }
}