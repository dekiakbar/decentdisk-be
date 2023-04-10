import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { UserResponseDto } from '../dto/user/user-response.dto';

export const ApiUserResponse = () => {
  return applyDecorators(
    ApiExtraModels(UserResponseDto),
    ApiOkResponse({
      description: 'Successfully received user data',
      schema: {
        allOf: [{ $ref: getSchemaPath(UserResponseDto) }],
      },
    }),
  );
};
