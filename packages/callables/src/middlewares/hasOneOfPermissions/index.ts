import * as _ from 'lodash';
import { ErrorHandler, CallableFunction } from '../../types';
import * as functions from 'firebase-functions';
import { EventContext } from 'firebase-functions';

const thereIsOneMatch = (roles: string[], userRoles: string[]): boolean => {
    return userRoles.some((role) => roles.indexOf(role) !== -1);
};
/**
 * ## Description
 *
 * hasOneOfPermissions is a middleware generator. It allows you to check on permissions attached in customClaims.
 *
 * ## Usage
 *
 * ```typescript
 * import { isAuth, hasOneOfPermissions, composeMiddlewares } from '@rainbow-cloud-functions/callables';
 *
 * const callableFunctionFoo = (data, context) => {
 *      // callable function code here.
 * };
 *
 * exports.callableFunctionFoo = composeMiddlewares(
 *     isAuth(),
 *     hasOneOfPermissions(['read:book', 'write:book'])
 * )(callableFunctionFoo);
 * ```
 * ## What do you need to know:
 * - permissions should be an array of string e.g. { permissions: ['read:book'] }
 * - it will throw an error with code: 'permission-denied'
 */
const hasOneOfPermissions = (permissions: string[], errorHandler?: ErrorHandler) => (next: CallableFunction) => (
    data: unknown,
    context: EventContext,
): unknown => {
    const token = _.get(context, 'auth.token');
    if (token && Array.isArray(token.permissions) && thereIsOneMatch(permissions, token.permissions)) {
        return next(data, context);
    }
    if (errorHandler) {
        if (typeof errorHandler === 'function') {
            return errorHandler(data, context);
        }
        return errorHandler;
    }
    throw new functions.https.HttpsError(
        'permission-denied',
        'The caller does not have permission to execute the specified operation.',
    );
};

export default hasOneOfPermissions;
