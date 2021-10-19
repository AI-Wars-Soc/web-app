import React from "react";
import {User} from "../user";
import RealNameSwitch from "./realNameSwitch";
import {DeleteAccountButton} from "./deleteAccountButton";
import {PageInfo, PageTitle} from "../pageTitleAndInfo";
import {Container, Row} from "react-bootstrap";

type MePageProps = {
    user: User,
    updateUser: () => unknown,
    logOut: () => unknown
};

type MePageState = {

}

export default class MePage extends React.Component<MePageProps, MePageState> {
    constructor(props: MePageProps) {
        super(props);
    }

    private static getPage(realName = "", nickname = "", controls: JSX.Element[] = []): JSX.Element {
        return <>
            <PageTitle>{realName}</PageTitle>
            <PageInfo>({nickname})</PageInfo>
            <Container className="px-3 m-lg-3">
                {controls.map((c, i) => <Row className={""} key={"userControl" + i}>{c}</Row>)}
            </Container>
        </>;
    }

    render(): JSX.Element {
        const user = this.props.user.getUserOrNull();

        if (user === null) {
            return <>Please log in to see this page</>;
        }

        return MePage.getPage(user.real_name, user.nickname, [
            <RealNameSwitch key={"displayRealNameSwitch"} active={user.display_real_name} updateUser={this.props.updateUser}/>,
            <DeleteAccountButton key={"deleteAccountButton"} onDeleteAccount={this.props.logOut}/>
        ]);
    }
}