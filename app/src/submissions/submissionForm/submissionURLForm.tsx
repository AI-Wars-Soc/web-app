import React, {FormEvent} from "react";
import {Post} from "../../apiBoundComponent";

type SubmissionURLFormProps = {
    refreshSubmissions: () => unknown
};

type SubmissionURLFormState = {
    loading: boolean
    error: boolean
};

export class SubmissionURLForm extends React.Component<SubmissionURLFormProps, SubmissionURLFormState> {
    private urlNode: HTMLInputElement | null;

    constructor(props: SubmissionURLFormProps) {
        super(props);
        this.state = {
            loading: false,
            error: false
        }
        this.urlNode = null;

        this.onSubmit = this.onSubmit.bind(this);
    }

    private onSubmit(e: FormEvent<HTMLFormElement>): void {
        e.preventDefault();
        const url = this.urlNode?.value;
        if (url === undefined) {
            return;
        }
        this.setState({loading: true});

        Post("add_submission", {url: url})
            .then(
                () => {
                    this.setState({
                        loading: false,
                        error: false
                    });
                    this.props.refreshSubmissions();
                })
            .catch(
                (error) => {
                    console.error(error);
                    this.setState({
                        loading: false,
                        error: true
                    });
                }
            )
    }

    render(): JSX.Element {
        return <div className="p-1">
            <form action="#" id="submission-form" method="GET" onSubmit={this.onSubmit}>
                <div className="d-flex justify-content-center w-100">
                    <div className="d-flex max-width-center row">
                        <div className="col-md-2 d-none d-md-block my-auto">
                            <label htmlFor="repo" className="my-auto text-right">Repository URL:</label>
                        </div>
                        <div className="col-12 col-md-8 my-auto">
                            <input type="url" className="form-control" id="repo" ref={node => (this.urlNode = node)}
                                   placeholder="https://github.com/your/repo" required/>
                        </div>
                        <div className="col-12 col-md-2 my-auto py-2 py-sm-3 py-md-0">
                            <div
                                className="d-flex w-100 justify-content-center justify-content-md-left">
                                <button type="submit"
                                        className="btn btn-primary submission-submit-button">
                                    {this.state.loading ?
                                        <span className="spinner-border spinner-border-sm" role="status"
                                              id="submit-spinner"/> : <>Submit</>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            {
                this.state.error ?
                    <div className="justify-content-start justify-content-sm-center d-flex">
                        <div id="submission-error-msg"
                             className="m-1 m-sm-3 p-2 bg-danger text-white text-center border border-danger rounded"
                             style={{display: "none"}}>
                            Something went wrong.
                        </div>
                    </div>
                    : <></>
            }
        </div>;
    }
}