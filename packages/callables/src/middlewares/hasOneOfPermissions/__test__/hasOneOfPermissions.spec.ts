import { CallableFunction } from 'callables/src/types';
import { EventContext } from 'firebase-functions';
import hasOneOfPermissions from '../index';

const authReadBookPermContext: EventContext = {
    eventId: 'e123',
    eventType: 't123',
    params: {},
    timestamp: Date.now().toString(),
    resource: { service: 's123', name: 'n123' },
    auth: { uid: 'u123', token: { permissions: ['read:book'] } },
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

describe('hasOneOfRoles()', () => {
    it('should execute cloud function', () => {
        const res = hasOneOfPermissions(['read:book'])(cloudFunction)({}, authReadBookPermContext);
        expect(res).toBe('foo');
    });
    it('should throw permission-denied when no roles', () => {
        try {
            hasOneOfPermissions(['read:book'])(cloudFunction)({}, authContext);
        } catch (err) {
            expect(err.code).toBe('permission-denied');
        }
        expect.assertions(1);
    });
});
