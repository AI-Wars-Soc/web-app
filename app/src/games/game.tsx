import React from "react";

type GameState = {
    maxWidth: number,
    maxHeight: number
}

export abstract class Game<P, S extends GameState> extends React.Component<P, S> {
    protected constructor(props: P) {
        super(props);

        this.useResize = this.useResize.bind(this);
    }

    useResize(myRef: HTMLDivElement | null): void {
        const handleResize = () => {
            if (myRef === null) {
                return;
            }

            const { innerHeight: height } = window;

            this.setState({
                maxWidth: myRef.offsetWidth,
                maxHeight: height - 300
            });
        };

        if (myRef === null) {
            window.removeEventListener('resize', handleResize);
        } else {
            window.addEventListener('resize', handleResize);
            handleResize();
        }
    }

    render(): JSX.Element {
        return <div ref={this.useResize} className={"fill"}>
            {this.renderBoard(this.state.maxWidth, this.state.maxHeight)}
        </div>;
    }

    protected abstract renderBoard(maxWidth: number, maxHeight: number): JSX.Element;
}
