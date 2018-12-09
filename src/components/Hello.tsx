import * as React from 'react';

const initialState = {
    clickCount: 1,
    input: '',
};

type State = Readonly<typeof initialState>;

export class HelloState extends React.Component<object, State> {
    public readonly state: State = initialState;

    public render() {
        const {input, clickCount} = this.state;
        return (
            <div>
                <h1>Hello, world!</h1>
                <p>clickCount: {clickCount}</p>
                <p>inputNumber: {input}</p>
                <button onClick={this.modifyCount((x) => x + 1)}>Increment!</button>
                <button onClick={this.modifyCount((x) => x - 1)}>Decrement!</button>
                <input
                    type="number"
                    value={this.state.input}
                    onChange={(e) => this.updateInput(e)}
                />
            </div>
        );
    }

    private updateInput(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target === null) {
            return;
        }
        const value: string = e.target.value;
        this.setState((s) => ({input: value}));
    }

    private modifyCount = (f: (x: number) => number) => () =>
        this.setState((s) => ({clickCount: f(s.clickCount)}));
}
