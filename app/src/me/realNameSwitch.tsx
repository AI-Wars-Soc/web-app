import React, {ChangeEvent} from "react";
import {Post} from "../apiBoundComponent";

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
        return <div className="p-1 submission-active-switch">
            <div className="custom-control custom-switch">
                <input type="checkbox" className="custom-control-input"
                       id="displayRealNameSwitch"
                       checked={this.props.active}
                       onChange={this.onSwitch}/>
                <label className="custom-control-label"
                       htmlFor="displayRealNameSwitch">Display your real name on the
                    leaderboard</label>
            </div>
        </div>;
    }
}