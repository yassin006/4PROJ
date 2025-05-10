import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IncidentDocument = Incident & Document;

@Schema({ timestamps: true })
export class Incident {
  _id?: string; 

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  severity: string;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  })
  location: {
    type: string;
    coordinates: [number, number];
  };

  @Prop({ required: true })
  createdBy: string;

  @Prop({ default: 0 })
  validations: number;

  @Prop({ default: 0 })
  invalidations: number;

  @Prop({ default: 0 })
  validationScore: number;

  @Prop({ default: 'pending' })
  status: string;

  @Prop()
  image: string;

  @Prop({ default: 'user' })
  source: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;

  @Prop({ type: [String], default: [] })
  validatedBy: string[];

  @Prop({ type: [String], default: [] })
  invalidatedBy: string[];
}

export const IncidentSchema = SchemaFactory.createForClass(Incident);

IncidentSchema.index({ location: '2dsphere' });
