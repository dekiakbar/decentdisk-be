import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { AdminDashboardResponseDto } from '../dto/admin-dashboard-response.dto';
import { UserResponseDto } from 'src/user/dto/user/user-response.dto';
import { FileResponseDto } from 'src/file/dto/file-response.dto';
export const AdminDashboardResponse = () => {
  return applyDecorators(
    ApiExtraModels(AdminDashboardResponseDto),
    ApiExtraModels(UserResponseDto),
    ApiExtraModels(FileResponseDto),
    ApiOkResponse({
      description: 'Successfully received data list',
      schema: {
        allOf: [
          { $ref: getSchemaPath(AdminDashboardResponseDto) },
          {
            properties: {
              latestUsers: {
                type: 'array',
                items: { $ref: getSchemaPath(UserResponseDto) },
              },
              latestFiles: {
                type: 'array',
                items: { $ref: getSchemaPath(FileResponseDto) },
              },
            },
          },
        ],
      },
    }),
  );
};
