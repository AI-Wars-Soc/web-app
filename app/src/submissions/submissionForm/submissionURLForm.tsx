import React from "react";
import {Post} from "../../apiBoundComponent";

type SubmissionURLFormProps = {
    refreshSubmissions: () => unknown
    setError: (error: string | null) => unknown
};

type SubmissionURLFormState = {
    loading: boolean
};

export default class SubmissionURLForm extends React.Component<SubmissionURLFormProps, SubmissionURLFormState> {
    private urlNode: HTMLInputElement | null;

    constructor(props: SubmissionURLFormProps) {
        super(props);
        this.state = {
            loading: false,
        }
        this.urlNode = null;

        this.onSubmit = this.onSubmit.bind(this);
    }

    private onSubmit(): void {
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
                    });
                    this.props.setError(null);
                    this.props.refreshSubmissions();
                })
            .catch(
                (error) => {
                    console.error(error);
                    this.setState({
                        loading: false,
                    });
                    this.props.setError(error);
                }
            )
    }

    render(): JSX.Element {
        return <>
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
                            className="btn btn-primary submission-submit-button"
                            onClick={this.onSubmit}>
                        {this.state.loading ?
                            <span className="spinner-border spinner-border-sm" role="status"
                                  id="submit-spinner"/> : <>Submit</>}
                    </button>
                </div>
            </div>
        </>;
    }
}