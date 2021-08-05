import React from "react";
import {Chart, ChartConfiguration, LegendItem, registerables} from "chart.js";
import {ApiBoundComponent} from "../apiBoundComponent";
import {User} from "../user";
import {isA} from "ts-type-checked";

Chart.register(...registerables);

type SubmissionWinLossGraphData = {
    wins: number,
    losses: number,
    draws: number,
    wins_healthy: number,
    losses_healthy: number,
    draws_healthy: number,
}

type SubmissionWinLossGraphProps = {
    user: User,
    submission_id: number
}

type SubmissionWinLossGraphState = {
    error: boolean,
    centre_hidden: boolean,
    data: SubmissionWinLossGraphData | null
}

export default class SubmissionWinLossGraph
    extends ApiBoundComponent<SubmissionWinLossGraphProps, SubmissionWinLossGraphData, SubmissionWinLossGraphState>
{
    constructor(props: SubmissionWinLossGraphProps) {
        super("get_submission_win_loss_data", props);
        this.state = {
            error: false,
            centre_hidden: true,
            data: null
        };

        this.activateDraw = this.activateDraw.bind(this);
        this.parseData = this.parseData.bind(this);
        this.drawData = this.drawData.bind(this);
    }

    getDataToSend(): {submission_id: number} {
        return {submission_id: this.props.submission_id};
    }

    private activateDraw(canvas: HTMLCanvasElement | null, data: SubmissionWinLossGraphData): void {
        if (canvas === null) {
            return;
        }

        const ctx = canvas.getContext('2d');
        if (ctx === null) {
            console.error("Null canvas context");
            return;
        }

        this.drawData(ctx, data);
    }

    private parseData(response: SubmissionWinLossGraphData) {
        const color_healthy = "#36e5eb";
        const color_crash = "#b536eb";
        const colors = ["#73eb37", color_healthy, color_crash, "#eb3636", color_healthy, color_crash, "#718579", color_healthy, color_crash, color_healthy, color_crash];
        return {
            labels: ['Wins', 'Wins (Healthy)', 'Wins (Crashed)',
                'Losses', 'Losses (Healthy)', 'Losses (Crashed)',
                'Draws', 'Draws (Healthy)', 'Draws (Crashed)',
                'Healthy', 'Crashed'],
            datasets: [
                {
                    label: 'Wins & Losses',
                    data: [response.wins, 0, 0, response.losses, 0, 0, response.draws, 0, 0, 0, 0],
                    backgroundColor: colors,
                },
                {
                    label: 'Healthy & Not',
                    data: [0, response.wins_healthy, response.wins - response.wins_healthy,
                        0, response.losses_healthy, response.losses - response.losses_healthy,
                        0, response.draws_healthy, response.draws - response.draws_healthy,
                        0, 0],
                    backgroundColor: colors,
                    hidden: this.state.centre_hidden,
                }
            ]
        };
    }

    private drawData(ctx: CanvasRenderingContext2D, response: SubmissionWinLossGraphData): void {
        let chart: Chart<"pie"> | null = null;

        const data = this.parseData(response);
        const config: ChartConfiguration<"pie"> = {
            type: "pie",
            data: data,
            options: {
                cutout: "33%",
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            filter: (legendItem: LegendItem) => {
                                return !legendItem.text.includes("Healthy") && !legendItem.text.includes("Crashed");
                            },
                        },
                        onClick: () => {
                            if (chart === null) {
                                return;
                            }
                            if (chart.isDatasetVisible(1)) {
                                chart.options.cutout = "50%";
                                this.setState({centre_hidden: true});
                                chart.hide(1);
                            } else {
                                chart.options.cutout = "33%";
                                this.setState({centre_hidden: false});
                                chart.show(1);
                            }
                        },
                    },
                    title: {
                        display: true,
                        text: 'Battle Breakdown'
                    }
                }
            },
        };
        chart = new Chart(ctx, config);
    }

    protected renderLoaded(data: SubmissionWinLossGraphData): JSX.Element {
        return <canvas ref={c => this.activateDraw(c, data)} width="100" height="100" className="w-100"/>;
    }

    protected typeCheck(data: unknown): data is SubmissionWinLossGraphData {
        return isA<SubmissionWinLossGraphData>(data);
    }
}