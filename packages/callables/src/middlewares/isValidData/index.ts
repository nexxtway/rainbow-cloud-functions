import Ajv, { Options, FuncKeywordDefinition, AnySchema } from 'ajv';
import { CallableMiddleware, CallableFunction } from 'callables/src/types';
import { EventContext, logger, https } from 'firebase-functions';

export interface KeywordDefinition extends FuncKeywordDefinition {
    name: string;
}

export interface AjvMiddlewareParams extends Options {
    schema: AnySchema;
    keywords?: KeywordDefinition[];
}

const handleError = (errors) => {
    logger.error('callable function validation error', {
        ...errors,
    });
    const message = (errors && errors[0] && errors[0].message) || 'Invalid data.';
    throw new https.HttpsError('invalid-argument', message);
};

const isValidData = (params: AjvMiddlewareParams): CallableMiddleware => {
    const { schema, keywords, ...rest } = params;
    const ajv = new Ajv(rest);

    keywords?.forEach((keyword) => {
        const { name, ...restKeyword } = keyword;
        ajv.addKeyword(name, restKeyword);
    });
    const validate = ajv.compile(schema);
    return (next: CallableFunction): CallableFunction => {
        return async (data: unknown, context: EventContext) => {
            let validData;
            try {
                validData = await validate(data);
            } catch (error) {
                return handleError(error.errors);
            }
            if (validData) {
                const nextData = typeof validData === 'boolean' ? data : validData;
                return next(nextData, context);
            }
            return handleError(validate.errors);
        };
    };
};

export default isValidData;
