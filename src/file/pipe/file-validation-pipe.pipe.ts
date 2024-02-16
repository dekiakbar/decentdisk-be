import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { HelperService } from 'src/common/service/helper.service';

@Injectable()
export class FileValidationPipePipe implements PipeTransform {
  constructor(private helperService: HelperService) {}
  async transform(value: any, metadata: ArgumentMetadata) {
    /** TODO: Move config to DB */
    const maxFileSize = this.helperService.convertToBytes(53, 'mb');
    value.map((file) => {
      if (file.size > maxFileSize) {
        throw new BadRequestException(
          `File: ${
            file.originalname
          } exceeded size limit. Max file size: ${this.helperService.convertBytesToAutoUnit(
            maxFileSize,
          )}`,
        );
      }
    });
    return value;
  }
}
