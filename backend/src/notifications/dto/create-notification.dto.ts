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
  type: string; 

  @IsArray()
  coordinates: number[]; 
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
