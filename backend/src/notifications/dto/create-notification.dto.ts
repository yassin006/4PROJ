import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsMongoId,
  ValidateNested,
  IsArray,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

class LocationDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['Point'])
  type: string; // 'Point'

  @IsArray()
  coordinates: number[]; // [lng, lat]
}

export class CreateNotificationDto {
  @IsMongoId()
  userId: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;
}
