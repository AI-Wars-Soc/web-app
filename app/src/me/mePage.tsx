import React from "react";
import {UserData} from "../user";
import RealNameSwitch from "./realNameSwitch";
import {DeleteAccountButton} from "./deleteAccountButton";

type MePageProps = {
    userData: UserData,
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
            <div className="flex-column justify-content-center justify-content-sm-start">
                <h1>{realName}</h1>
                <h3 className="nickname-text">({nickname})</h3>
            </div>
            <div className="px-3 d-none d-sm-block">
                <p className="lead">
                    This is your settings page
                </p>
            </div>
            <div className="flex-column justify-content-center justify-content-sm-start px-3 m-lg-3">
                {controls.map((c, i) => <div className="flex-row" key={"userControl" + i}>{c}</div>)}
            </div>
        </>;
    }

    render(): JSX.Element {
        const {userData} = this.props;
        if (userData.user === null) {
            return MePage.getPage();
        }

        return MePage.getPage(userData.user.real_name, userData.user.nickname, [
            <RealNameSwitch key={"displayRealNameSwitch"} active={userData.user.display_real_name} updateUser={this.props.updateUser}/>,
            <DeleteAccountButton key={"deleteAccountButton"} onDeleteAccount={this.props.logOut}/>
        ]);
    }
}