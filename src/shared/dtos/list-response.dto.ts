import { ApiProperty } from "@nestjs/swagger";

export class ListResponseDto<T> {
  @ApiProperty()
  items: T[];

  @ApiProperty()
  quantityItems: number;

  @ApiProperty()
  totalItems: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  currentPage: number;

  @ApiProperty()
  hasNext: boolean;

  @ApiProperty()
  isEmpty: boolean;

  constructor(
    items: T[],
    totalItems: number,
    currentPage: number,
    quantityPerPage: number,
  ) {
    this.quantityItems = items.length;
    this.totalItems = totalItems;
    this.currentPage = currentPage;

    this.totalPages = this.totalItems / quantityPerPage;
    this.isEmpty = this.quantityItems === 0;
    this.hasNext = this.currentPage === this.totalPages;
  }
}
