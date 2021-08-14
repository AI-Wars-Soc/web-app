import React from "react";

type GameTimerProps = {
    startTime: number,
    countDown: boolean
    onTimeout: () => unknown
};

type GameTimerState = {
    timeRemaining: number
};

export class GameTimer extends React.Component<GameTimerProps, GameTimerState>
{
    private timer: NodeJS.Timeout | null = null;
    constructor(props: GameTimerProps) {
        super(props);

        this.state = {
            timeRemaining: this.props.startTime
        }
    }

    componentDidMount(): void {
        this.timer = setTimeout(() => {
            if (!this.props.countDown || this.state.timeRemaining < 0) {
                return;
            }

            this.setState({
                timeRemaining: this.state.timeRemaining - 0.01,
            });

            if (this.state.timeRemaining < 0) {
                this.props.onTimeout();
            }
        }, 10);
    }

    componentWillUnmount(): void {
        if (this.timer !== null) {
            clearTimeout(this.timer);
        }
    }

    render(): JSX.Element {
        const milis = Math.floor((this.state.timeRemaining % 1) * 1000);
        const totalSeconds = Math.floor(this.state.timeRemaining);
        const seconds = totalSeconds % 60;
        const minutes = Math.floor(totalSeconds / 60);
        return <div>Time remaining: {minutes + ":" + String(seconds).padStart(2, '0') + "." + String(milis).padStart(3, '0')}</div>;
    }
}