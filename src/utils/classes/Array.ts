import { FixedLengthArray } from '../interfaces/Array';

export class TrueArray<T> extends Array<T> implements FixedLengthArray<number, T> {
    TrueArray(limit: number) {
        this.length = limit;
    }
}