// src/incidents/dto/create-incident.dto.ts
import { IsNotEmpty, IsString, IsNumber, IsArray } from 'class-validator';

export class CreateIncidentDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}
