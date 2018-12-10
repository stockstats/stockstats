import * as React from 'react';
import {Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis} from 'recharts';

export type SavingsPlan = {
    monthlyInvestment: number;
    interestRate: number;
    durationInYears: number;
};

type BarEntry = {return: number; investment: number; year: string};
const range = (a: number, b: number): number[] => {
    const result: number[] = [];
    for (let i = a; i < b; i++) {
        result.push(i);
    }
    return result;
};

const calculateBarEntries = ({
    monthlyInvestment,
    interestRate,
    durationInYears,
}: SavingsPlan): BarEntry[] => {
    const r: number = Math.pow(1 + interestRate / 100, 1.0 / 12);
    const a: number = monthlyInvestment;
    return range(1, durationInYears + 1).map((year) => {
        const months = year * 12;
        const investment = a * months;
        return {
            year: year.toString(),
            investment,
            return: a * ((1 - Math.pow(r, 1 + months)) / (1 - r)) - investment,
        };
    });
};

export class CompoundInterestChart extends React.Component<SavingsPlan> {
    public render() {
        const data: BarEntry[] = calculateBarEntries(this.props);
        return (
            <div>
                <BarChart
                    width={600}
                    height={300}
                    data={data}
                    margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="investment" stackId="a" fill="#8884d8" />
                    <Bar dataKey="return" stackId="b" fill="#82ca9d" />
                </BarChart>
            </div>
        );
    }
}
