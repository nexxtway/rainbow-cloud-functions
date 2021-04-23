import express from 'express';
import request from 'supertest';
import isAuth from '../index';

const app = express();
const verifyIdToken = jest.fn();
const admin = {
    auth() {
        return { verifyIdToken };
    },
};
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
app.use(isAuth({ admin }));
app.get('/', (_req, res) => res.json({ ok: true }));

describe('isAuth', () => {
    it('it should verify the IdToken and attach user with the decodeIdToken', async () => {
        verifyIdToken.mockResolvedValue({ uid: '123' });
        const res = await request(app).get('/').set('authorization', 'Bearer 123');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ ok: true });
    });
    it('it should verify the IdToken a return 403 when invalid token', async () => {
        verifyIdToken.mockRejectedValue({});
        const res = await request(app).get('/').set('authorization', 'Bearer 123');
        expect(res.status).toBe(403);
        expect(res.body).toEqual({
            code: 'unauthenticated',
            message: 'The request does not have valid authentication credentials for the operation.',
        });
    });
});
