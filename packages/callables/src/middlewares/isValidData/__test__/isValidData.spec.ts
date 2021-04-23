import { AnySchema } from 'ajv';
import isValidData from '../index';
import { EventContext } from 'firebase-functions';

describe('isValidData()', () => {
    it('should validate data based on schema passed', async () => {
        const schema: AnySchema = {
            type: 'object',
            properties: {
                name: {
                    $id: '#/properties/name',
                    type: 'string',
                    nullable: true,
                },
            },
            required: ['name'],
        };
        const func = (data, context) => {
            return [data, context];
        };
        const data = { age: 38 };
        const context: EventContext = {
            eventId: 'id123',
            timestamp: String(Date.now()),
            eventType: 't123',
            resource: {
                service: 's123',
                name: 'n123',
            },
            params: {},
        };
        try {
            await isValidData({
                schema,
            })(func)(data, context);
        } catch (err) {
            expect(err.message).toBe(`should have required property 'name'`);
        }
        expect.assertions(1);
    });
    it('should allow to inject your custom keywords', async () => {
        const schema: AnySchema = {
            type: 'object',
            properties: {
                name: {
                    $id: '#/properties/name',
                    type: 'string',
                    nullable: true,
                },
                age: { type: 'number', isEven: true },
            },
            required: ['name'],
        };
        const isEven = { keyword: 'isEven', validate: (_schema, data) => data % 2 === 0 };
        const func = (data, context) => {
            return [data, context];
        };
        const data = { name: 'Maxx', age: 39 };
        const context: EventContext = {
            eventId: 'id123',
            timestamp: String(Date.now()),
            eventType: 't123',
            resource: {
                service: 's123',
                name: 'n123',
            },
            params: {},
        };
        try {
            await isValidData({
                schema,
                keywords: [isEven],
            })(func)(data, context);
        } catch (err) {
            expect(err.message).toBe(`should pass "isEven" keyword validation`);
        }
        expect.assertions(1);
    });
    it('should set defaults from schema when value is not passed', async () => {
        expect.assertions(1);
        const schema: AnySchema = {
            type: 'object',
            properties: {
                name: { type: 'string' },
                title: { type: 'string', default: 'King Beyond The Wall' },
            },
            required: ['name'],
        };
        const func = jest.fn();
        const data = { name: 'John Snow' };
        const context: EventContext = {
            eventId: 'id123',
            timestamp: String(Date.now()),
            eventType: 't123',
            resource: {
                service: 's123',
                name: 'n123',
            },
            params: {},
        };
        await isValidData({ schema })(func)(data, context);
        expect(func).toHaveBeenCalledWith(
            {
                name: 'John Snow',
                title: 'King Beyond The Wall',
            },
            context,
        );
    });
    it('should validate data using formats', async () => {
        const schema: AnySchema = {
            type: 'object',
            properties: {
                email: {
                    type: 'string',
                    nullable: true,
                    format: 'email',
                },
            },
            required: ['email'],
        };
        const func = (data, context) => {
            return [data, context];
        };
        const data = { email: 'email' };
        const context: EventContext = {
            eventId: 'id123',
            timestamp: String(Date.now()),
            eventType: 't123',
            resource: {
                service: 's123',
                name: 'n123',
            },
            params: {},
        };
        try {
            await isValidData({
                schema,
            })(func)(data, context);
        } catch (err) {
            expect(err.message).toBe(`should match format "email"`);
        }
        expect.assertions(1);
    });
});
