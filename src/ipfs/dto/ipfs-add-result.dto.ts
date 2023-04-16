import { PartialType } from '@nestjs/swagger';
import { FileResponseDto } from 'src/file/dto/file-response.dto';

export class IpfsAddResultDto extends PartialType(FileResponseDto) {
  constructor(file: Express.Multer.File, cid: string) {
    super();
    this.name = file.originalname;
    this.mimeType = file.mimetype;
    this.size = file.size;
    this.cid = cid;
  }
}
