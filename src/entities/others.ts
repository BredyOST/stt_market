
export type ForFunc<T, U> = (arg: T) => U;


export interface SwapOptionsFrom {value:string, label:string, icon:string}
export interface SwapOptionsTo {
    'stt': SwapOptionsFrom[],
    'usdt': SwapOptionsFrom[],
}
