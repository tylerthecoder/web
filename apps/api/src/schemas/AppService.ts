import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AppServiceDocument = AppService & Document;


@Schema({
	collection: 'services',
})
export class AppService {
	@Prop()
	access_token!: string;

	@Prop()
	refresh_token!: string;

	@Prop()
	expires_at!: number;

	@Prop()
	name!: string;
}

export const AppServiceSchema = SchemaFactory.createForClass(AppService);

