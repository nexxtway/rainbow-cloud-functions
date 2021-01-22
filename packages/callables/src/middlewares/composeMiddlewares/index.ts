import { CallableMiddleware, CallableFunction } from '../../types';

const compose = (...fns: CallableMiddleware[]): CallableMiddleware => {
    return fns.reduceRight(
        (seed: CallableMiddleware, fn: CallableMiddleware): CallableMiddleware => {
            return (next: CallableFunction): CallableFunction => {
                return fn(seed(next));
            };
        },
    );
};

export default compose;
