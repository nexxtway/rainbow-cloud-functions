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
 * hasOneOfRoles is a middleware generator. It allows you to check on roles attached in customClaims.
 *
 * ## Usage
 *
 * ```typescript
 * import { isAuth, hasOneOfRoles, composeMiddlewares } from '@rainbow-cloud-functions/callables';
 *
 * const callableFunctionFoo = (data, context) => {
 *      // callable function code here.
 * };
 *
 * exports.callableFunctionFoo = composeMiddlewares(
 *     isAuth(),
 *     hasOneOfRoles(['admin', 'reseller'])
 * )(callableFunctionFoo);
 * ```
 * ## What do you need to know:
 * - roles should be an array of string e.g. { roles: ['admin'] }
 * - it will throw an error with code: 'permission-denied'
 */
const hasOneOfRoles = (roles: string[], errorHandler?: ErrorHandler) => (next: CallableFunction) => (
    data: unknown,
    context: EventContext,
): unknown => {
    const token = _.get(context, 'auth.token');
    if (token && Array.isArray(token.roles) && thereIsOneMatch(roles, token.roles)) {
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

export default hasOneOfRoles;
