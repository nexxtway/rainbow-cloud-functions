import Ajv, { Options, AnySchema, KeywordDefinition } from 'ajv';
import addFormats from 'ajv-formats';
import { CallableMiddleware, CallableFunction } from 'callables/src/types';
import { EventContext, logger, https } from 'firebase-functions';

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

/**
 * ## Description
 *
 * isValidData is a middleware generator. It allows you to validate the data object param of a callable function using JSON Schema Validator(Ajv).
 *
 * ## Usage
 *
 * ```typescript
 * import { isValidData } from '@rainbow-cloud-functions/callables';
 *
 * const callableFunctionFoo = (data, context) => {
 *      // callable function code here.
 * };
 * const schema = {
 *      type: 'object',
 *      properties: {
 *          name: { type: 'string' },
 *      },
 *      required: ['name'],
 * };
 * exports.callableFunctionFoo = isValidData({ schema })(callableFunctionFoo);
 * ```
 * ## Usage with custom keywords
 *
 * ```typescript
 * import { isValidData } from '@rainbow-cloud-functions/callables';
 *
 * const callableFunctionFoo = (data, context) => {
 *      // callable function code here.
 * };
 *
 * const keywords = [
 *      {
 *          keyword: "isUppercase",
 *          validate: (schema, data) => data.toUpperCase() === data,
 *      }
 * ]
 *
 * const schema = {
 *      type: 'object',
 *      properties: {
 *          name: {
 *              type: 'string',
 *              isUppercase: true,
 *          },
 *      },
 *      required: ['name'],
 * };
 *
 */
const isValidData = (params: AjvMiddlewareParams): CallableMiddleware => {
    const { schema, keywords, ...rest } = params;
    const ajv = new Ajv({
        useDefaults: true,
        ...rest,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addFormats(ajv as any);

    keywords?.forEach((keywordDef) => {
        ajv.addKeyword(keywordDef);
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
