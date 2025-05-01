import { IsString, IsOptional, IsIn, ValidateNested, IsArray, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class LocationDto {
  @IsString()
  type: string;

  @IsArray()
  @IsNumber({}, { each: true })
  coordinates: number[];
}

export class CreateIncidentDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  type: string;

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @IsOptional()
  @IsIn(['pending', 'validated', 'invalidated'])
  status?: string;

  @IsOptional()
  @IsIn(['low', 'moderate', 'high'])
  severity?: string;

  @IsOptional()
  @IsString()
  source?: string;
}
