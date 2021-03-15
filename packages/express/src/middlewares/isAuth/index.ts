import { app } from 'firebase-admin';
import { Request, Response } from 'express';
export interface IsAuthOpts {
    admin: app.App;
}

type AuthorizedRequest = Request & {
    user?: unknown;
};

const isAuth = (opts: IsAuthOpts) => async (
    req: AuthorizedRequest,
    res: Response,
    next: () => void,
): Promise<unknown> => {
    const { admin } = opts;
    const { authorization } = req.headers;
    if (authorization && authorization.startsWith('Bearer ')) {
        const token = authorization.split('Bearer ')[1];
        try {
            const decodedIdToken = await admin.auth().verifyIdToken(token);
            req.user = decodedIdToken;
            return next();
            // eslint-disable-next-line no-empty
        } catch (err) {}
    }
    return res.status(403).send({
        code: 'unauthenticated',
        message: 'The request does not have valid authentication credentials for the operation.',
    });
};

export default isAuth;
