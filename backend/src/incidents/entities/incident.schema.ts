import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true }) // active createdAt et updatedAt
export class Incident {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  type: string;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
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

  @Prop({ default: 'pending', enum: ['pending', 'validated', 'invalidated'] })
  status: string;

  @Prop({ enum: ['low', 'moderate', 'high'], default: 'moderate' })
  severity: string;

  @Prop({ default: 'user' })
  source: string;
}

export type IncidentDocument = Incident &
  Document & {
    createdAt: Date;
    updatedAt?: Date; // facultatif mais utile
  };

export const IncidentSchema = SchemaFactory.createForClass(Incident);
IncidentSchema.index({ location: '2dsphere' }); // pour recherche géospatiale
