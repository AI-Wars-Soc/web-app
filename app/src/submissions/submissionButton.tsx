import {LoadingOrText} from "../loadingOrText";
import {Button} from "react-bootstrap";
import React from "react";
import {CenterDiv} from "../centreDiv";

export function SubmissionButton(props: {loading: boolean, secondary?: boolean, children: string}): JSX.Element {
    return <CenterDiv>
            <Button type="submit"
                    variant={props.secondary ? "secondary" : "primary"}
                    style={{maxWidth: "100px", width: "100%"}}>
            <LoadingOrText loading={props.loading}>
                {props.children}
            </LoadingOrText>
        </Button>
    </CenterDiv>;
}