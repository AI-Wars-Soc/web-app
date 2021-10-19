import React, {ChangeEvent} from "react";
import {Post} from "../apiBoundComponent";
import Switch from "react-bootstrap/Switch";

type RealNameSwitchProps = {
    active: boolean,
    updateUser: () => unknown
}

export default class RealNameSwitch extends React.Component<RealNameSwitchProps> {
    constructor(props: RealNameSwitchProps) {
        super(props);

        this.onSwitch = this.onSwitch.bind(this);
    }

    private onSwitch(e: ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        const v = e.target.checked;

        Post("set_name_visible", { visible: v })
            .then(
                () => {
                    e.target.checked = v;
                    this.props.updateUser();
                })
            .catch(
                (error) => {
                    console.error(error);
                    e.target.checked = !v;
                }
            );
    }

    render(): JSX.Element {
        return <div className="p-1">
            <Switch
                onChange={this.onSwitch}
                id="real-name-switch"
                label="Display your real name on the leaderboard"
                checked={this.props.active}
            />
        </div>;
    }
}