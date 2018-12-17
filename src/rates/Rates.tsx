import {List} from 'immutable';

interface StockPriceRaw {
    date: string;
    price: number;
}

interface StockPrice {
    date: number;
    price: number;
}

export interface Group<T> {
    zero: T;
    plus: (x: T, y: T) => T;
    negate: (x: T) => T;
}

export const IntegerGroup: Group<number> = {
    zero: 0,
    plus: (x, y) => x + y,
    negate: (x) => -x,
};

export const MSCI = (): StockPrice[] => {
    const raw: StockPriceRaw[] = require('../rates/MSCIWorldNet.json');
    const rawToTimestamped = (x: StockPriceRaw): StockPrice => ({
        ...x,
        date: new Date(x.date).getMilliseconds(),
    });
    return raw.map(rawToTimestamped);
};

export const sliding = <T extends {}>(xs: T[], windowSize: number): T[][] => {
    if (windowSize > xs.length) {
        return [];
    }

    const zs = List(xs);
    const init: List<T> = zs.slice(0, windowSize).reduce((ws, w) => ws.push(w), List());

    const reduction = zs.slice(windowSize).reduce<[List<List<T>>, List<T>]>(
        ([ys, y], add) => {
            const u = y.shift().push(add);
            return [ys.push(u), u];
        },
        [List.of(init), init]
    );

    return reduction[0].map((x) => x.toArray()).toArray();
};

export const slide = <T, G extends Group<T>>(xs: T[], windowSize: number, g: G): T[] => {
    const zs = List(xs);
    if (windowSize > zs.size) {
        return [];
    }

    const init: T = zs.slice(0, windowSize).reduce(g.plus, g.zero);

    const reduction = zs.zip(zs.slice(windowSize)).reduce<[List<T>, T]>(
        ([ys, y], [remove, add]) => {
            const u = g.plus(g.plus(y, g.negate(remove)), add);
            return [ys.push(u), u];
        },
        [List.of(init), init]
    );
    return reduction[0].toArray();
};
