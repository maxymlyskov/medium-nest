import { ArgumentMetadata, HttpException, PipeTransform } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { ValidationError, validate } from "class-validator";

export class BackendValidationPipe implements PipeTransform {
    async transform(value: any, metadata: ArgumentMetadata) {
        const object = plainToClass(metadata.metatype, value);
        const errors = await validate(object);

        if (errors.length === 0) {
            return value;
        }

        throw new HttpException({ errors: this.buildError(errors) }, 422);
    }

    buildError(errors: ValidationError[]) {
        return errors.reduce((acc, error) => {
            acc[error.property] = Object.values(error.constraints);
            return acc;
        }, {});
    }
}