// src/routes/recalculate/dto/recalculate-route.dto.ts
import { IsNumber, ValidateNested, IsDefined } from 'class-validator';
import { Type } from 'class-transformer';

class CoordinatesDto {
  @IsDefined()
  @IsNumber()
  lat: number;

  @IsDefined()
  @IsNumber()
  lng: number;
}

export class RecalculateRouteDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => CoordinatesDto)
  start: CoordinatesDto;

  @IsDefined()
  @ValidateNested()
  @Type(() => CoordinatesDto)
  end: CoordinatesDto;

  @IsDefined()
  @ValidateNested()
  @Type(() => CoordinatesDto)
  incident: CoordinatesDto;
}
