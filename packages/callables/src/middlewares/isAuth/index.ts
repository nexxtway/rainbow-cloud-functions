import { ErrorHandler, CallableFunction } from '../../types';
import * as functions from 'firebase-functions';
import { EventContext } from 'firebase-functions';

/**
 * ## isAuth is a middleware generator. It allows to customize the Error throw when the user is not authenticated.
 *
 * ## Usage
 *
 * ```typescript
 * import { isAuth } from '@rainbow-cloud-functions/callables';
 *
 * const callableFunctionFoo = (data, context) => {
 *      // callable function code here.
 * };
 *
 * exports.callableFunctionFoo = isAuth()(callableFunctionFoo);
 * ```
 *
 * ### Throw you custom Error
 *
 * ```typescript
 * import { isAuth } from '@rainbow-cloud-functions/callables';
 *
 * const callableFunctionFoo = (data, context) => {
 *      // callable function code here.
 * };
 *
 * const customError = () => throw new HttpsError('unauthenticated', 'foo');
 * exports.callableFunctionFoo = isAuth(customError)(callableFunctionFoo);
 * ```
 *
 * @param errorHandler Allows the customization of the Error thrown.
 */
const isAuth = (errorHandler?: ErrorHandler) => (next: CallableFunction) => (
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
    throw new functions.https.HttpsError('unauthenticated', 'Unauthorized');
};

export default isAuth;
