import * as React from 'react';
import moment, {Moment} from 'moment';
import {Time, TimeSeries, timeSeries} from 'pondjs';

interface StockPrice {
    date: string;
    price: number;
}

interface StockPrice2 {
    date: Moment;
    price: number;
}

const MSCI: StockPrice[] = require('../rates/MSCIWorldNet.json');
const MSCI2: Array<{date: Moment; price: number}> = MSCI.map((stockPrice) => ({
    price: stockPrice.price,
    date: moment(stockPrice.date),
}));
type X = [Moment, StockPrice2[]];

const MSCITemp: () => StockPrice2[] = () => {
    const result: StockPrice2[] = [];
    const date: Moment = MSCI2[0].date.clone();
    MSCI2.forEach((v) => {
        if (v.date.isSameOrAfter(date)) {
            result.push(v);
            date.add(1, 'M');
        }
    });
    return result;
};

const MSCITemp2: StockPrice2[] = MSCITemp().slice(0, 400);

const MSCIMonthly: Array<{date: number; price: number}> = MSCITemp2.map((x) => ({
    date: x.date.valueOf(),
    price: x.price,
}));

const data: TimeSeries<Time> = timeSeries({
    name: 'msci world net return',
    columns: ['time', 'price'],
    points: MSCI.map((v) => [moment(v.date).valueOf(), v.price]),
});

const save = (begin: Moment, n: number, amount: number): number => {
    let shares = 0;
    const currentDate = begin.clone();
    for (let i = 0; i < n; i++) {
        const timeEvent = data.atTime(currentDate.toDate());
        const price: number = timeEvent.get('price');
        shares += amount / price;
        currentDate.add(1, 'M');
    }
    currentDate.subtract(1, 'M');
    return shares * data.atTime(currentDate.toDate()).get('price');
};

const priceAt = (x: Moment): number => {
    return data.atTime(x.toDate()).get('price');
};

const saveList = (numberOfMonths: number, amount: number): Array<[string, number, number, number]> => {
    let shares = 0;
    const currentDate = moment(data.begin().getMilliseconds());
    for (let i = 0; i < numberOfMonths; i++) {
        shares += amount / priceAt(currentDate);
        currentDate.add(1, 'M');
    }

    const startDate = currentDate.clone().subtract(numberOfMonths+1, 'M');
    const result: Array<[string, number, number, number]> = [];
    const end = data.end();
    while (currentDate.isSameOrBefore(end)) {
        result.push([startDate.format('YYYY-MM-DD'), shares * priceAt(currentDate), shares, priceAt(currentDate)]);

        shares -= amount / priceAt(startDate);
        shares += amount / priceAt(currentDate);

        startDate.add(1, 'M');
        currentDate.add(1, 'M');
    }
    return result;
};

export class MSCIWorld extends React.Component<{}, {}> {
    public render() {
        const saveList1 = saveList(12, 1);
        const rows = saveList1.map(v => (
            <div>
                {v[0]}: {v[1]} ({v[2]}, {v[3]})
            </div>
        ));
        return (
            <div>
                <h1>Hello, world!</h1>
                <div>Saved: {save(moment('2017-01-01'), 12, 300)}</div>
                <div>Saved: {rows}</div>
            </div>
        );
    }
}
