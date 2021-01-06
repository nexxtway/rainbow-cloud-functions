import { CallableFunction, CallableMiddleware } from '../../types';

const compose = (...fns: CallableMiddleware[]): CallableFunction => {
    return fns.reduceRight((seed: CallableMiddleware, fn: CallableMiddleware) => fn(seed));
};

export default compose;
