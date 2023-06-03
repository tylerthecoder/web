import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CreationDocument = Creation & Document;


@Schema({
	collection: 'creations',
})
export class Creation {
	@Prop()
	name!: string;

	@Prop()
	description!: string;

	@Prop()
	link!: string;

	@Prop()
	type!: string;

	@Prop()
	img!: string;
}

export const CreationSchema = SchemaFactory.createForClass(Creation);