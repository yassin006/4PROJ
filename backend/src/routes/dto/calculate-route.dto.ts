import { IsNumber, IsOptional, ValidateNested, IsDefined } from 'class-validator';
import { Type } from 'class-transformer';

class CoordinatesDto {
  @IsDefined()
  @IsNumber()
  lat: number;

  @IsDefined()
  @IsNumber()
  lng: number;
}

class OptionsDto {
  @IsOptional()
  avoidTolls?: boolean;
}

export class CalculateRouteDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => CoordinatesDto)
  start: CoordinatesDto;

  @IsDefined()
  @ValidateNested()
  @Type(() => CoordinatesDto)
  end: CoordinatesDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => OptionsDto)
  options?: OptionsDto;
}
