import React, {Suspense} from "react";
import {Accordion, Card, Container, Row, Col} from "react-bootstrap";
import {ChevronDown} from "react-bootstrap-icons";
import {User} from "../../user";
import {Post} from "../../apiBoundComponent";

const SubmissionWinLossGraph = React.lazy(() => import("./submissionWinLossGraph"));
const SubmissionEnabledSwitch = React.lazy(() => import("./submissionEnabledSwitch"));
const SubmissionDeleteButton = React.lazy(() => import("./submissionDeleteButton"));

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

type SubmissionEntryProps = {
    user: User,
    refreshSubmissions: () => unknown
} & SubmissionData;

export type SubmissionEntryState = {
    winLossGraph: JSX.Element | null
};

const crashedDivStyle = {
    background: "rgba(255, 255, 255, 0.5)",
    borderRadius: "20px"
};

const entryStyle = {
    borderRadius: "15px",
    borderWidth: "2px",
    borderStyle: "solid",
    margin: "4px",
    opacity: 0.5,
};

const entryActiveStyle = {
    opacity: 1.0
};

const invalidStripesStyle = {
    background: "repeating-linear-gradient(45deg," +
        "rgba(235, 54, 54, 0.1)," +
        "rgba(235, 54, 54, 0.1) 10px," +
        "rgba(235, 54, 54, 0.4) 10px," +
        "rgba(235, 54, 54, 0.4) 20px)"
};

const testingStripesStyle = {
    background: "repeating-linear-gradient(35deg, " +
        "rgba(54, 126, 235, 0.1), " +
        "rgba(54, 126, 235, 0.1) 10px, " +
        "rgba(54, 126, 235, 0.4) 10px, " +
        "rgba(54, 126, 235, 0.4) 20px)",
    backgroundSize: "200% 200%",
    animation: "barberpole 5s linear infinite"
};

const entrySelectedStyle = {
    borderRadius: "20px",
    borderWidth: "6px",
    borderStyle: "double",
    margin: "0px"
};

export class SubmissionEntry extends React.Component<SubmissionEntryProps, SubmissionEntryState> {
    private testingCheckInterval: NodeJS.Timeout | null;
    constructor(props: SubmissionEntryProps) {
        super(props);
        this.state = {
            winLossGraph: null,
        };
        this.testingCheckInterval = null;

        this.toggleGraph = this.toggleGraph.bind(this);
        this.checkStillTesting = this.checkStillTesting.bind(this);
    }

    private toggleGraph(): void {
        if (this.state.winLossGraph !== null || !this.props.healthy || !this.props.tested) {
            return;
        }

        this.setState({
            winLossGraph: <Suspense fallback={<div>Loading Graph...</div>}>
                <SubmissionWinLossGraph user={this.props.user} submission_id={this.props.submission_id}/>
            </Suspense>
        });
    }

    private checkStillTesting(): void {
        Post<{is_testing: boolean}>("/is_submission_testing", {
            submission_id: this.props.submission_id
        })
            .then(
                (result) => {
                    if (result === undefined || !result.is_testing) {
                        this.clearIntervals();
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
        const crashed = this.props.tested && !this.props.healthy;

        let activeSwitch = <></>;
        if (this.props.healthy) {
            activeSwitch = <Suspense fallback={<div/>}>
                    <SubmissionEnabledSwitch {...this.props} />
                </Suspense>;
        }

        let crashedDiv = <></>;
        if (crashed) {
            crashedDiv = <div style={crashedDivStyle} className="p-1 px-3">
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

        // Ping when testing
        this.clearIntervals();
        if (!this.props.tested) {
            this.testingCheckInterval = setInterval(this.checkStillTesting, 5000);
        }

        let status = "";
        if (this.props.selected) {
            status = "Selected";
        } else if (!this.props.tested) {
            status = "Testing";
        } else if (crashed) {
            status = "Invalid";
        }

        let submissionStyle = entryStyle;
        const headerStyle = {
            borderRadius: "14px !important",
            borderWidth: "0px",
            background: "inherit"
        }
        if (this.props.active) {
            submissionStyle = {...submissionStyle, ...entryActiveStyle};
        }
        if (crashed) {
            submissionStyle = {...submissionStyle, ...invalidStripesStyle};
            headerStyle.background = "rgba(235, 54, 54, 0.3)";
        }
        if (!this.props.tested) {
            submissionStyle = {...submissionStyle, ...testingStripesStyle};
            headerStyle.background = "rgba(54, 126, 235, 0.3)";
        }
        if (this.props.selected) {
            submissionStyle = {...submissionStyle, ...entrySelectedStyle};
        }

        return <Card className={"border-0"}>
            <div style={submissionStyle}>
                <Accordion.Toggle as={Card.Header} variant="link" eventKey={"" + this.props.index} style={headerStyle}
                                  className="w-100" onClick={this.toggleGraph}>
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
                        <Container>
                            <Row>
                                <Col xs={12} md={6}>
                                    <Row className="h-100">
                                        <Col xs={6} md={12}>
                                            <div className="p-1">
                                                {this.props.submission_date}
                                            </div>
                                            {activeSwitch}
                                        </Col>

                                        <Col xs={6} md={12}>
                                            <div style={{cursor: "pointer"}}>
                                                <div className="d-md-none float-right">
                                                    <Suspense fallback={<div/>}>
                                                        <SubmissionDeleteButton {...this.props}/>
                                                    </Suspense>
                                                </div>
                                                <div className="d-none d-md-block" style={{position: "absolute", bottom: 0}}>
                                                    <Suspense fallback={<div/>}>
                                                        <SubmissionDeleteButton {...this.props}/>
                                                    </Suspense>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={12} md={6}>
                                    {this.state.winLossGraph}
                                    {crashedDiv}
                                </Col>
                            </Row>
                        </Container>
                    </Card.Body>
                </Accordion.Collapse>
            </div>
        </Card>;
    }
}