import { CallableFunction, CallableMiddleware } from 'callables/src/types';
import { EventContext } from 'firebase-functions';
import { HttpsError } from 'firebase-functions/lib/providers/https';
import isAuth from '../../isAuth';
import compose from '../index';

const unAuthContext: EventContext = {
    eventId: 'e123',
    eventType: 't123',
    params: {},
    timestamp: Date.now().toString(),
    resource: { service: 's123', name: 'n123' },
};

const authContext: EventContext = {
    eventId: 'e123',
    eventType: 't123',
    params: {},
    timestamp: Date.now().toString(),
    resource: { service: 's123', name: 'n123' },
    auth: { uid: 'u123', token: {} },
};

const authValidContext: EventContext = {
    eventId: 'e123',
    eventType: 't123',
    params: {},
    timestamp: Date.now().toString(),
    resource: { service: 's123', name: 'n123' },
    auth: { uid: 'valid-u123', token: {} },
};

const cloudFunction: CallableFunction = () => 'foo';

describe('composeMiddlewares()', () => {
    it('should compose the middleware in order', () => {
        const middlewareFoo: CallableMiddleware = (next: CallableFunction) => {
            return (data: unknown, context: EventContext) => {
                if (context.auth.uid === 'u123') {
                    throw new HttpsError('permission-denied', 'foo');
                }
                return next(data, context);
            };
        };
        expect(() => {
            compose(isAuth(), middlewareFoo)(cloudFunction)({}, unAuthContext);
        }).toThrow(/Unauthorized/);
        expect(() => {
            compose(isAuth(), middlewareFoo)(cloudFunction)({}, authContext);
        }).toThrow(/foo/);
        const res = compose(isAuth(), middlewareFoo)(cloudFunction)({}, authValidContext);
        expect(res).toBe('foo');
    });
});
