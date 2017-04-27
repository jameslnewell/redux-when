import { Middleware } from "redux";

export type Condition<S> = (state: S, action: any) => boolean;
export type CreateAction = (action: any) => any;

export function once<S>(condition: Condition<S>, createAction: CreateAction): any;
export function when<S>(condition: Condition<S>, createAction: CreateAction): any;
export function cancel(token: number): any;

declare const reduxWhen: Middleware;

export default reduxWhen;