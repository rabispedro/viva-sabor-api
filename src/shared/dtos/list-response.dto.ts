import { ApiProperty } from '@nestjs/swagger';

export class ListResponseDto<T> {
  @ApiProperty()
  items: T[];

  @ApiProperty()
  quantityItems: number;

  @ApiProperty()
  quantityPerPage: number;

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
    this.items = items;
    this.quantityItems = this.items.length;
    this.quantityPerPage = quantityPerPage;
    this.currentPage = currentPage;
    this.totalItems = totalItems;
    this.totalPages = this.totalItems / quantityPerPage - 1;
    this.isEmpty = this.quantityItems === 0;
    this.hasNext = this.currentPage < this.totalPages;
  }
}
