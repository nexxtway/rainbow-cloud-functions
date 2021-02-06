import * as functions from 'firebase-functions';
import { EventContext } from 'firebase-functions';
import Ajv, { SchemaObject, FuncKeywordDefinition } from 'ajv';

interface Keywords extends FuncKeywordDefinition {
    name: string;
}

// TODO: fix this type
// interface Params extends Ajv {
//     schema: SchemaObject;
//     keywords?: Keywords[];
// }

export interface Params {
    schema: SchemaObject;
    keywords?: Keywords[];
    [key: string]: unknown;
}

const handleError = (errors) => {
    functions.logger.error('Data validation failed', errors);
    const message = (errors && errors[0] && errors[0].message) || 'Invalid data';
    throw new functions.https.HttpsError('invalid-argument', message);
};

/**
 * ## isValidData is a middleware generator that verifies all the data passed in the request and throws an error when some data does not comply with the schema passed.
 *
 * ## Usage
 *
 * ```typescript
 * import { isValidData } from '@rainbow-cloud-functions/callables';
 *
 * const callableFunctionFoo = (data, context) => {
 *      // callable function code here.
 * };
 *
 * exports.callableFunctionFoo = isValidData(schema, keywords)(callableFunctionFoo);
 * ```
 */
const isValidData = (params: Params) => (next: CallableFunction) => async (
    data: unknown,
    context: EventContext,
): Promise<unknown> => {
    const { schema, keywords = [], ...rest } = params;
    const ajv = new Ajv(rest);

    keywords.forEach((keyword) => {
        const { name, ...restKeyword } = keyword;
        ajv.addKeyword(name, restKeyword);
    });

    const validate = ajv.compile(schema);
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

export default isValidData;
