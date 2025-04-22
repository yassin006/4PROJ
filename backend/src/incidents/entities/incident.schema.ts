// src/incidents/schemas/incident.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IncidentDocument = Incident & Document;

@Schema({ timestamps: true })
export class Incident {
  @Prop({ required: true })
  type: string;

  @Prop()
  status: string;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  })
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
}

export const IncidentSchema = SchemaFactory.createForClass(Incident);

// 🔥 Important : index géospatial
IncidentSchema.index({ location: '2dsphere' });
