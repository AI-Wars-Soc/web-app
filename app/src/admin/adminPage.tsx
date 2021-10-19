import React, {Suspense} from "react";
import {User} from "../user";
import {Route, Switch, Link} from "react-router-dom";
import {PageTitle, PageInfo} from "../pageTitleAndInfo";
import {Row} from "react-bootstrap";

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
                        <AdminBotsPage user={this.props.user}/>
                    </Suspense>
                </Route>
                <Route path="/admin/status">
                    <Suspense fallback={<div>Loading Service Status...</div>}>
                        <AdminServicePage user={this.props.user}/>
                    </Suspense>
                </Route>
                <Route path="/admin">
                    <PageTitle>Admin Index Page</PageTitle>
                    <PageInfo>For all your administration needs</PageInfo>

                    <Row>
                        <Link to="/admin/bots">Bots</Link>
                    </Row>
                    <Row>
                        <Link to="/admin/status">Service Status</Link>
                    </Row>
                </Route>
            </Switch>
        </>;
    }
}