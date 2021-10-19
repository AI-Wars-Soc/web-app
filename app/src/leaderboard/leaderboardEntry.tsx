import React from "react";
import {CenterDiv} from "../centreDiv";
import {Col, Row} from "react-bootstrap";

export type LeaderboardEntryProps = {
    position: number | string,
    name: string,
    is_real_name: boolean,
    nickname: string,
    wins: number | string,
    losses: number | string,
    draws: number | string,
    score: number | string,
    is_bot: boolean,
    is_you: boolean
}


const leaderboardTitleStyle = {
    borderWidth: "0px 0px 1px",
    borderStyle: "solid",
    borderColor: "#7a7a7a",
}

const leaderboardEntryStyle = {
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "transparent",
    borderRadius: "20px",
    margin: "5px",
}

const leaderboardUserSubmission = {
    borderWidth: "6px",
    borderStyle: "double",
    borderColor: "#2D7DD2",
    margin: 0
}

const leaderboardBotSubmission = {
    borderWidth: "3px",
    borderStyle: "solid",
    borderColor: "#90001C",
    margin: "3px !important",
}

const leaderboardOtherSubmission = {
    borderColor: "#8d8d8d"
}

function LeaderboardItem(props: {width: number, align?: "left" | "center" | "right", hideBefore?: "sm" | "md" | "lg", children?: React.ReactNode}): JSX.Element {
    const style = {width: props.width + "px", maxWidth: props.width + "px", textAlign: props.align || "center"};
    const className = props.hideBefore === undefined ? "" : "d-none d-" + props.hideBefore + "-block";
    return <Col style={style} className={className}>
        {props.children}
    </Col>
}

export class LeaderboardEntry extends React.Component<LeaderboardEntryProps> {
    render(): JSX.Element {
        const {position, name, is_real_name, nickname, wins, losses, draws, score, is_bot, is_you} = this.props;

        let boarderStyle: React.CSSProperties;
        if (is_bot && is_you) {  // Use impossible state for title. Hacky!
            boarderStyle = leaderboardTitleStyle;
        } else {
            boarderStyle = is_bot ? leaderboardBotSubmission
                    : is_you ? leaderboardUserSubmission
                    : leaderboardOtherSubmission;
        }
        const style = {...leaderboardEntryStyle, ...boarderStyle}

        return <Row className="p-1 px-md-3 px-lg-5 text-nowrap">
            <CenterDiv>
                <Row style={style} className={"p-2 p-md-3 w-100"}>
                    <LeaderboardItem width={100}>
                        {position}
                    </LeaderboardItem>
                    <Col style={{flexGrow: 1}} className="flex-column">
                        <Row>
                            <Col xs="auto" className="p-0">
                                {name}
                            </Col>
                            {is_real_name &&
                            <Col xs="auto" style={{color: "#6C757D"}} className="d-none d-lg-block">
                                ({nickname})
                            </Col>
                            }
                        </Row>
                    </Col>
                    <LeaderboardItem width={80} hideBefore={"md"}>
                        {wins}
                    </LeaderboardItem>
                    <LeaderboardItem width={80} hideBefore={"md"}>
                        {losses}
                    </LeaderboardItem>
                    <LeaderboardItem width={80} hideBefore={"md"}>
                        {draws}
                    </LeaderboardItem>
                    <LeaderboardItem width={30} hideBefore={"lg"}/>
                    <LeaderboardItem width={100} align={"right"}>
                        {score}
                    </LeaderboardItem>
                </Row>
            </CenterDiv>
        </Row>;
    }
}