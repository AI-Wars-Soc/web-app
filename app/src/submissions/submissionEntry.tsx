import React, {ChangeEvent, Suspense} from "react";
import {Accordion, Card} from "react-bootstrap";
import {ChevronDown} from "react-bootstrap-icons";

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

export type SubmissionEntryState = {
    winLossGraph: JSX.Element | null
}

export class SubmissionEntry extends React.Component<SubmissionEntryProps, SubmissionEntryState> {
    private testingCheckInterval: NodeJS.Timeout | null;
    constructor(props: SubmissionEntryProps) {
        super(props);
        this.state = {
            winLossGraph: null,
        };
        this.testingCheckInterval = null;

        this.submissionEnabledSwitch = this.submissionEnabledSwitch.bind(this);
        this.toggleGraph = this.toggleGraph.bind(this);
        this.checkStillTesting = this.checkStillTesting.bind(this);
    }

    private toggleGraph(): void {
        if (this.state.winLossGraph !== null || !this.props.healthy || !this.props.tested) {
            return;
        }

        this.setState({
            winLossGraph: <Suspense fallback={<div>Loading Graph...</div>}>
                <SubmissionWinLossGraph submission_id={this.props.submission_id}/>
            </Suspense>
        });
    }

    private submissionEnabledSwitch(e: ChangeEvent<HTMLInputElement>) {
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

    private checkStillTesting(): void {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                submission_id: this.props.submission_id
            })
        };
        fetch("/api/is_submission_testing", requestOptions)
            .then(res => res.json())
            .then(
                (result) => {
                    if (result === false) {
                        this.props.refreshSubmissions();
                    }
                },
                (error) => {
                    console.error(error);
                    this.clearIntervals();
                }
            );
    }

    private clearIntervals(): void {
        if (this.testingCheckInterval !== null) {
            clearInterval(this.testingCheckInterval);
            this.testingCheckInterval = null
        }
    }

    componentWillUnmount(): void {
        this.clearIntervals();
    }

    render(): JSX.Element {
        let activeSwitch = <></>;
        if (this.props.healthy) {
            activeSwitch = <div className="p-1 submission-active-switch">
                <div className="custom-control custom-switch">
                    <input type="checkbox" className="custom-control-input"
                           id={"enabledSwitch" + this.props.submission_id}
                           checked={this.props.active}
                           onChange={this.submissionEnabledSwitch}/>
                    <label className="custom-control-label"
                           htmlFor={"enabledSwitch" + this.props.submission_id}>{this.props.active ? "Enabled" : "Disabled"}</label>

                </div>
            </div>;
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

        // Ping every 2s when testing
        this.clearIntervals();
        if (!this.props.tested) {
            this.testingCheckInterval = setInterval(this.checkStillTesting, 2000);
        }

        let status = "";
        if (this.props.selected) {
            status = "Selected";
        } else if (!this.props.tested) {
            status = "Testing";
        } else if (crashed) {
            status = "Invalid";
        }

        const class_names = ["submission-entry"];
        const subdiv_class_names = ["submission-rounded", "w-100"];
        if (this.props.active) {
            class_names.push('submission-entry-active');
        }
        if (crashed) {
            class_names.push('invalid-stripes');
            subdiv_class_names.push("submission-entry-invalid");
        }
        if (!this.props.tested) {
            class_names.push('testing-stripes');
            subdiv_class_names.push("submission-entry-testing");
        }
        if (this.props.selected) {
            class_names.push('submission-entry-selected');
        }
        const div_class = class_names.join(" ");
        const subdiv_class = subdiv_class_names.join(" ");

        return <Card className={"border-0"}>
            <div className={div_class}>
                <Accordion.Toggle as={Card.Header} variant="link" eventKey={"" + this.props.index}
                                  className={subdiv_class} onClick={this.toggleGraph}>
                    <span className="h5">
                        Submission {this.props.index}
                    </span>
                    <span className="h6 font-weight-bold mx-1 mx-md-3">
                        {status}
                    </span>
                    <ChevronDown size={21} style={{float: "right"}}/>
                </Accordion.Toggle>

                <Accordion.Collapse eventKey={"" + this.props.index}>
                    <Card.Body>
                        <div className="container">
                            <div className="row justify-content-center">
                                <div className="col-11 col-md-6">
                                    <div className="p-1 submission-date">
                                        {this.props.submission_date}
                                    </div>
                                    {activeSwitch}
                                </div>
                                <div className="col-11 col-md-6">
                                    {this.state.winLossGraph}
                                    {crashedDiv}
                                </div>
                            </div>
                        </div>
                    </Card.Body>
                </Accordion.Collapse>
            </div>
        </Card>;
    }
}