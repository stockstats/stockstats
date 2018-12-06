import * as React from 'react';
import TextField from '@material-ui/core/TextField';
import {CompoundInterestChart, SavingsPlan} from './CompoundInterestChart';

const initialState: SavingsPlan = {
    monthlyInvestment: 300,
    interestRate: 6.8,
    durationInYears: 20,
};

type InputChange = React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>;

export class CompoundInterest extends React.Component<{}, SavingsPlan> {
    public state = initialState;

    public render() {
        return (
            <div>
                <div>
                    <TextField
                        variant="outlined"
                        defaultValue={initialState.monthlyInvestment}
                        label="Monthly investment"
                        type="number"
                        onChange={this.updateState('monthlyInvestment', parseInt)}
                    />
                    <TextField
                        variant="outlined"
                        defaultValue={initialState.interestRate}
                        label="Interest rate"
                        type="number"
                        onChange={this.updateState('interestRate', parseFloat)}
                    />
                    <TextField
                        variant="outlined"
                        defaultValue={initialState.durationInYears}
                        label="Duration in years"
                        type="number"
                        onChange={this.updateState('durationInYears', parseInt)}
                    />
                </div>
                <CompoundInterestChart
                    monthlyInvestment={this.state.monthlyInvestment}
                    interestRate={this.state.interestRate}
                    durationInYears={this.state.durationInYears}
                />
            </div>
        );
    }

    private updateState<K extends keyof SavingsPlan>(
        key: K,
        parseInput: (input: string) => SavingsPlan[K]
    ): (e: InputChange) => void {
        return (e: InputChange) => {
            if (e.target === null) {
                return;
            }
            const parsed: number = parseInput(e.target.value);
            const newState: SavingsPlan = {...this.state, [key]: parsed};
            this.setState(newState);
        };
    }
}
