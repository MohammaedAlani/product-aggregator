import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty({ required: false, default: 1 })
  page: number = 1;

  @ApiProperty({ required: false, default: 10 })
  limit: number = 10;
}

export class ProductFilterDto extends PaginationDto {
  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  minPrice?: number;

  @ApiProperty({ required: false })
  maxPrice?: number;

  @ApiProperty({ required: false })
  availability?: boolean;

  @ApiProperty({ required: false })
  provider?: string;
}
