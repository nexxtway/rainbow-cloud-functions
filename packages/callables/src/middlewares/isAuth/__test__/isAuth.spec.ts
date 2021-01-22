import { CallableFunction, ErrorHandler } from 'callables/src/types';
import { EventContext } from 'firebase-functions';
import { HttpsError } from 'firebase-functions/lib/providers/https';
import isAuth from '../index';

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

const cloudFunction: CallableFunction = () => 'foo';

describe('isAuth()', () => {
    describe('when no user data was not provided in the context', () => {
        it('should throw Unauthorized', () => {
            expect(() => {
                isAuth()(cloudFunction)({}, unAuthContext);
            }).toThrow(/Unauthorized/);
        });
        it('should throw custom error', () => {
            const errorHandler: ErrorHandler = () => {
                throw new HttpsError('unauthenticated', 'foo');
            };
            expect(() => {
                isAuth(errorHandler)(cloudFunction)({}, unAuthContext);
            }).toThrow(/foo/);
        });
    });
    it('should execute cloud function', () => {
        const res = isAuth()(cloudFunction)({}, authContext);
        expect(res).toBe('foo');
    });
});
