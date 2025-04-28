import { IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CoordinatesDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}

class OptionsDto {
  @IsOptional()
  avoidTolls?: boolean;
}

export class CalculateRouteDto {
  @ValidateNested()
  @Type(() => CoordinatesDto)
  start: CoordinatesDto;

  @ValidateNested()
  @Type(() => CoordinatesDto)
  end: CoordinatesDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => OptionsDto)
  options?: OptionsDto;
}
