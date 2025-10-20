import { IsArray, IsInt, Min } from 'class-validator';

export class CreateOrderDto {
  @IsInt()
  @Min(1)
  userId: number;

  @IsArray()
  items: any[];
}
