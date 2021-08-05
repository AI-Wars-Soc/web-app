import React from "react";
import {Chart, ChartConfiguration, ChartData, ChartDataset, registerables} from "chart.js";
import {User} from "../user";
import {ApiBoundComponent} from "../apiBoundComponent";
import {isA} from "ts-type-checked";

Chart.register(...registerables);

type LeaderboardOverTimeGraphData = {
    users: { [userId: string]: { is_you: boolean, is_bot: boolean, display_name: string } }
    deltas: { user_id: number, "time": number, "delta": number }[]
    initial_score: number
}

function gcd_two(a: number, b: number): number {
    if (b === 0)
        return a;
    return gcd_two(b, a % b);
}

function gcd(...arr: number[]) {
    let ans = arr[0];

    for (let i = 1; i < arr.length; i++) {
        ans = gcd_two(arr[i], ans);
    }

    return ans;
}

function convert_date(unix: number) {
    const date = new Date(unix * 1000);

    const day = date.getDate();
    const month = date.getMonth();
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();

    return day + "/" + month + " " + hours + ':' + minutes.substr(-2);
}

function get_graph_data(data: LeaderboardOverTimeGraphData): ChartData<'line'> {
    const {users, deltas, initial_score} = data;

    // Get all sampled time steps
    const timestamp_set: Set<number> = new Set();
    for (let i = 0; i < deltas.length; i++) {
        const delta = deltas[i];
        timestamp_set.add(delta.time);
    }
    const referenced_timestamps = Array.from(timestamp_set);
    const timestep = gcd(...referenced_timestamps);
    const timestamp_min = Math.min(...referenced_timestamps) - timestep;
    const timestamp_max = Math.max(...referenced_timestamps);

    // Fill in blanks
    const timestamps = [];
    const labels = [];
    let timestamp = timestamp_min;
    while (timestamp <= timestamp_max) {
        timestamps.push(timestamp);
        labels.push(convert_date(timestamp));
        timestamp += timestep;
    }

    // Make user data
    const user_id_points = new Map();
    const user_ids = Array.from(Object.keys(users));
    for (let i = 0; i < user_ids.length; i++) {
        const user_id = user_ids[i];
        const points = new Array(timestamps.length);
        points.fill(NaN);
        user_id_points.set(user_id, points);
    }

    // Populate user data
    // TODO: This can be done in O(n) in two passes by storing diffs then sweeping rather than O(n^2)
    for (let i = 0; i < deltas.length; i++) {
        const this_delta = deltas[i];
        const timestamp_i = Math.round((this_delta.time - timestamp_min) / timestep);
        const points = user_id_points.get("" + this_delta.user_id);

        if (timestamp_i > 0 && isNaN(points[timestamp_i - 1])) {
            points[timestamp_i - 1] = initial_score;
        }
        for (let j = timestamp_i; j < points.length; j++) {
            if (isNaN(points[j])) {
                points[j] = initial_score;
            }
            points[j] += this_delta.delta;
        }
    }

    // Make full data array
    const datasets: ChartDataset<'line'>[] = [];
    for (let i = 0; i < user_ids.length; i++) {
        const user_id = user_ids[i];
        const user = users[user_id]

        let color = "#676767";
        if (user.is_you) {
            color = "#2D7DD2";
        } else if (user.is_bot) {
            color = "#90001C";
        }

        datasets.push({
            label: user.display_name,
            data: user_id_points.get(user_id),
            fill: false,
            pointRadius: 1,
            pointHitRadius: 3,
            pointHoverRadius: 6,
            borderColor: color,
            cubicInterpolationMode: 'monotone',
            tension: 0.4
        });
    }
    return {
        labels: labels,
        datasets: datasets
    };
}

function get_graph_config(data: LeaderboardOverTimeGraphData): ChartConfiguration<'line'> {
    return {
        type: 'line',
        data: get_graph_data(data),
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: false,
                    text: 'Leaderboard'
                },
            },
            interaction: {
                intersect: false,
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Score'
                    },
                }
            }
        },
    }
}

type LeaderboardOverTimeGraphProps = {
    user: User
}

type LeaderboardOverTimeGraphState = {
    error: boolean,
    data: LeaderboardOverTimeGraphData | null
}

export default class LeaderboardOverTimeGraph
    extends ApiBoundComponent<LeaderboardOverTimeGraphProps, LeaderboardOverTimeGraphData, LeaderboardOverTimeGraphState>
{
    constructor(props: LeaderboardOverTimeGraphProps) {
        super("get_leaderboard_over_time", props);

        this.state = {
            error: false,
            data: null
        };
    }

    renderError(): JSX.Element {
        return <>Error loading graph</>;
    }

    renderLoading(): JSX.Element {
        return <></>;
    }

    private static drawChart(canvasElement: HTMLCanvasElement | null, data: LeaderboardOverTimeGraphData): void {
        if (canvasElement === null) {
            return;
        }

        const ctx = canvasElement.getContext('2d');
        if (ctx === null) {
            console.error("Null canvas context");
            return;
        }
        const config = get_graph_config(data);
        new Chart(ctx, config);
    }

    renderLoaded(data: LeaderboardOverTimeGraphData): JSX.Element {
        return <canvas ref={c => LeaderboardOverTimeGraph.drawChart(c, data)} id="overTimeChart"/>;
    }

    protected typeCheck(data: unknown): data is LeaderboardOverTimeGraphData {
        return isA<LeaderboardOverTimeGraphData>(data);
    }
}