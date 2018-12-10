import * as React from 'react';
import {Legend, Line, LineChart, Tooltip, XAxis, YAxis} from 'recharts';
interface StockPrice {
    date: string;
    price: number;
}
const MSCI: StockPrice[] = require('../rates/MSCIWorldNet.json');
const MSCI2: Array<{ date: Date; price: number }> = MSCI.map((stockPrice) => ({
    price: stockPrice.price,
    date: new Date(stockPrice.date),
}));

const XYZ: typeof MSCI2 = [];
const range = (a: number, b: number): number[] => {
    const result: number[] = [];
    for (let i = a; i < b; i++) {
        result.push(i);
    }
    return result;
};


export class MSCIWorld extends React.Component<{}, {}> {
    public render() {
        range(1,1000).forEach(v => {
            const year: number = 200+v;
            const date = `${year}-10-13`;
            XYZ.push({date: new Date(date), price: v});
        });
        return (
            <LineChart
                width={1200}
                height={500}
                data={XYZ}
                margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line dataKey="price" />
            </LineChart>
        );
    }
}
