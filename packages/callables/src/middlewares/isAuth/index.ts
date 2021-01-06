import { errorHandler, CallableFunction } from '../../types';
import * as functions from 'firebase-functions';
import { EventContext } from 'firebase-functions';

const isAuth = (errorHandler?: errorHandler) => (next: CallableFunction) => (
    data: unknown,
    context: EventContext,
): unknown => {
    if (context.auth && context.auth.uid) {
        return next(data, context);
    }
    if (errorHandler) {
        if (typeof errorHandler === 'function') {
            return errorHandler(data, context);
        }
        return errorHandler;
    }
    return new functions.https.HttpsError('unauthenticated', 'Unauthorized');
};

export default isAuth;
