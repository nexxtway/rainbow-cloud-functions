
import { EventContext } from 'firebase-functions';
import { HttpsError } from 'firebase-functions/lib/providers/https';

export type CallableFunction = ((input: unknown, context?: EventContext) => PromiseLike<unknown> | unknown);

export type CallableMiddleware = (next: CallableFunction) => CallableFunction;

export type errorHandler = (input: unknown, context?: EventContext) => HttpsError | HttpsError;