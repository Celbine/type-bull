import {ErrorObject} from "ajv";
import {ValidationError} from "class-validator";

type ValidatorDetails = ErrorObject[] | ValidationError[];

export class TypeBullValidationError extends Error {
    details: ValidatorDetails;

    constructor(message, details: ValidatorDetails) {
        super(message);
        this.name = "TypeBullValidationError";
        this.details = details;
    }
}