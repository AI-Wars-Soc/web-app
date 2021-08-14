import React, {Suspense} from "react";
import {User} from "../user";
import {Route, Switch, Link} from "react-router-dom";

type AdminPageProps = {
    user: User,
};

type AdminPageState = {

}

export default class AdminPage extends React.Component<AdminPageProps, AdminPageState> {
    constructor(props: AdminPageProps) {
        super(props);
    }

    render(): JSX.Element {
        if (!this.props.user.getUserOrNull()?.is_admin) {
            return <>You&apos;re not an admin! Get out of here!</>
        }

        const AdminBotsPage = React.lazy(() => import("./adminBotsPage"));

        return <>
            <nav id="sidebar">
                <div className="sidebar-header">
                    <h3>Admin Tools</h3>
                </div>

                <ul className="list-unstyled components">
                    <p>Links</p>
                    <li>
                        <Link to={"/admin"}>Admin Home</Link>
                    </li>
                    <li>
                        <Link to={"/admin/bots"}>Bots</Link>
                    </li>
                </ul>
            </nav>
            <Switch>
                <Route path="/admin">
                    <div className="flex-column justify-content-center justify-content-sm-start">
                        <h1>Admin Index Page</h1>
                    </div>
                    <div className="px-3 d-none d-sm-block">
                        <p className="lead">
                            For all your administration needs
                        </p>
                    </div>
                </Route>
                <Route path="/admin/bots">
                    <Suspense fallback={<div>Loading Bots...</div>}>
                        <AdminBotsPage/>
                    </Suspense>
                </Route>
            </Switch>
        </>;
    }
}