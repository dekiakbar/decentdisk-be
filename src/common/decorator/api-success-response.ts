import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiSuccessResponse = <TModel extends Type<any>>(
  model: TModel,
  message: string = null,
) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      description: message,
      schema: {
        allOf: [{ $ref: getSchemaPath(model) }],
      },
    }),
  );
};
