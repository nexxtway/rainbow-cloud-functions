import { CallableFunction } from 'callables/src/types';
import { EventContext } from 'firebase-functions';
import hasOneOfRoles from '../index';

const authAdminContext: EventContext = {
    eventId: 'e123',
    eventType: 't123',
    params: {},
    timestamp: Date.now().toString(),
    resource: { service: 's123', name: 'n123' },
    auth: { uid: 'u123', token: { roles: ['admin'] } },
};

const authNoRolesContext: EventContext = {
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
        const res = hasOneOfRoles(['admin'])(cloudFunction)({}, authAdminContext);
        expect(res).toBe('foo');
    });
    it('should throw permission-denied when no roles', () => {
        try {
            hasOneOfRoles(['admin'])(cloudFunction)({}, authNoRolesContext);
        } catch (err) {
            expect(err.code).toBe('permission-denied');
        }
        expect.assertions(1);
    });
});
