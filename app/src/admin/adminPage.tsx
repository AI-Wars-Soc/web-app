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
        const AdminServicePage = React.lazy(() => import("./adminServicePage"));

        return <>
            <Switch>
                <Route path="/admin/bots">
                    <Suspense fallback={<div>Loading Bots...</div>}>
                        <AdminBotsPage/>
                    </Suspense>
                </Route>
                <Route path="/admin/status">
                    <Suspense fallback={<div>Loading Service Status...</div>}>
                        <AdminServicePage user={this.props.user}/>
                    </Suspense>
                </Route>
                <Route path="/admin">
                    <div className="flex-column justify-content-center justify-content-sm-start">
                        <h1>Admin Index Page</h1>
                    </div>
                    <div className="px-3 d-none d-sm-block">
                        <p className="lead">
                            For all your administration needs
                        </p>
                    </div>

                    <ul className="flex-column mb-auto">
                        <li>
                            <Link to="/admin/bots">Bots</Link>
                        </li>
                        <li>
                            <Link to="/admin/status">Service Status</Link>
                        </li>
                    </ul>
                </Route>
            </Switch>
        </>;
    }
}