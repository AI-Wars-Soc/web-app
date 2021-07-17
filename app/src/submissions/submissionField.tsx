import React from "react";

type SubmissionFieldProps = {

};

export class SubmissionField extends React.Component<SubmissionFieldProps> {
    render(): JSX.Element {
        return <div className="p-1">
            <form action="#" id="submission-form" method="GET">
                <div className="d-flex justify-content-center w-100">
                    <div className="d-flex max-width-center row">
                        <div className="col-md-2 d-none d-md-block my-auto">
                            <label htmlFor="repo" className="my-auto text-right">Your Repository
                                URL:</label>
                        </div>
                        <div className="col-12 col-md-8 my-auto">
                            <input type="url" className="form-control" id="repo"
                                   placeholder="https://github.com/your/repo" required/>
                        </div>
                        <div className="col-12 col-md-2 my-auto py-2 py-sm-3 py-md-0">
                            <div
                                className="d-flex w-100 justify-content-center justify-content-md-left">
                                <button type="submit"
                                        className="btn btn-primary submission-submit-button">
                                    Submit
                                    <span className="spinner-border spinner-border-sm" role="status"
                                          id="submit-spinner" style={{display: "none"}}/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <div className="justify-content-start justify-content-sm-center d-flex">
                <div id="submission-error-msg"
                     className="m-1 m-sm-3 p-2 bg-danger text-white text-center border border-danger rounded"
                     style={{display: "none"}}>
                    Something went wrong.
                </div>
            </div>
        </div>;
    }
}