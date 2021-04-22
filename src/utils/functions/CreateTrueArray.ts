import { TrueArray } from '../classes/Array';

export default <T>( limit: number, fill: T = null ) => {
    const newArray = new TrueArray<T>(limit);
    const filledArray = newArray.fill( fill as T );

    return filledArray;
}