import { ErrorCauses } from "./info.js";

export default class CustomError {
    static createError({ statusCode = 500, causeKey, message }) {
        const errorMessage = ErrorTypes[statusCode] || 'Unknown Error';
        const error = new Error(`${errorMessage}: ${message}`);
        error.name = 'CustomError';
        error.statusCode = statusCode;
        error.cause = ErrorCauses[causeKey] || 'Unknown cause';
        throw error;
    }
}