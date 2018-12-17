import {slide, sliding, IntegerGroup, Group} from './Rates';
import * as jsc from 'jsverify';
import {Arbitrary} from "jsverify";

describe('sliding', () => {
    it('returns all windows of given size', () => {
        expect(sliding([1, 2, 3, 4, 5], 3)).toEqual([[1, 2, 3], [2, 3, 4], [3, 4, 5]]);
    });
    it('handles short lists', () => {
        expect(sliding([1, 2], 3)).toEqual([]);
    });
});

describe('slide', () => {
    it('calculates results over sliding windows for group operations', () => {
        const xs = [1, 2, 3, 4, 5];
        expect(slide(xs, 3, IntegerGroup)).toEqual([6, 9, 12]);
    });
});

const GroupLaws = <T, G extends Group<T>>(g: G, arb: Arbitrary<T>) => {
    jsc.property('identity: plus(x, zero) === x', arb,
        (x) => g.plus(x, g.zero) === x);
    jsc.property('symmetry: plus(x, y) === plus(y, x)', arb, arb,
        (x, y) => g.plus(x, y) === g.plus(y, x));
    jsc.property('associativity: plus(x, plus(y, z)) === plus(plus(x, y), z)', arb, arb, arb,
        (x, y, z) => g.plus(x, g.plus(y, z)) === g.plus(g.plus(x, y), z));
    jsc.property('negation: plus(x, negate(x)) === zero', arb,
        (x) => g.plus(x, g.negate(x)) === g.zero);
};

describe('integer group laws', () => GroupLaws(IntegerGroup, jsc.integer));
