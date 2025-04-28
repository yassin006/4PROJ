import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Incident {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  type: string;

  @Prop({
    type: { type: String, enum: ['Point'] },
    coordinates: { type: [Number] },
  })
  location: { type: string; coordinates: number[] };

  @Prop({ required: true })
  createdBy: string;

  @Prop({ default: 0 })
  validations: number;

  @Prop({ default: 0 })
  invalidations: number;

  @Prop()
  image: string;
}

export type IncidentDocument = Incident & Document;
export const IncidentSchema = SchemaFactory.createForClass(Incident);
