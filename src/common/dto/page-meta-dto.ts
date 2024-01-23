import { ApiProperty } from '@nestjs/swagger';
import { PageMetaDtoParameters } from '../interface/user/page-meta-dto-parameters.interface';

class DisplayedItem {
  @ApiProperty()
  public from: number;

  @ApiProperty()
  public to: number;

  constructor({ pageOptionsDto, itemCount }: PageMetaDtoParameters) {
    this.from =
      pageOptionsDto.page == 1
        ? 1
        : (pageOptionsDto.page - 1) * pageOptionsDto.limit + 1;
    this.to =
      pageOptionsDto.page == Math.ceil(itemCount / pageOptionsDto.limit)
        ? itemCount
        : pageOptionsDto.page * pageOptionsDto.limit;
  }
}

export class PageMetaDto {
  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly limit: number;

  @ApiProperty()
  readonly displayedItem: DisplayedItem;

  @ApiProperty()
  readonly itemCount: number;

  @ApiProperty()
  readonly pageCount: number;

  @ApiProperty()
  readonly hasPreviousPage: boolean;

  @ApiProperty()
  readonly hasNextPage: boolean;

  constructor({ pageOptionsDto, itemCount }: PageMetaDtoParameters) {
    this.page = pageOptionsDto.page;
    this.limit = pageOptionsDto.limit;
    this.displayedItem = new DisplayedItem({ pageOptionsDto, itemCount });
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.limit);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
