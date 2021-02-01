import { CallableMiddleware, CallableFunction } from '../../types';

/**
 * ## Description
 * The ```compose``` function is a middleware generator. This allows you to compose several simple callable middleware to make up a heavier one. Use ```compose``` to integrate various functionalities into a more complex one.
 *
 * ## Usage
 * ```typescript
 * import { compose, isAuth, hasResourceAccess } from '@rainbow-cloud-functions/callables';
 *
 * const callableFunctionFoo = (data, context) => {
 *      // callable function code here.
 * };
 *
 * exports.callableFunctionFoo = compose(isAuth(), hasResourceAccess('users'))(callableFunctionFoo);
 * ```
 *
 * @param fns Middlewares that you want to compose
 */
function compose(...fns: CallableMiddleware[]): CallableMiddleware {
    return fns.reduceRight(
        (seed: CallableMiddleware, fn: CallableMiddleware): CallableMiddleware => {
            return (next: CallableFunction): CallableFunction => {
                return fn(seed(next));
            };
        },
    );
}

export default compose;
