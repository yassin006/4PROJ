import { IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CoordinatesDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}

export class RecalculateRouteDto {
  @ValidateNested()
  @Type(() => CoordinatesDto)
  start: CoordinatesDto;

  @ValidateNested()
  @Type(() => CoordinatesDto)
  end: CoordinatesDto;

  @ValidateNested()
  @Type(() => CoordinatesDto)
  incident: CoordinatesDto;
}
