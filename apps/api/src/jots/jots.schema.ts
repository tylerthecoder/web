import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type JotDocument = Jot & Document;


@Schema({
	collection: 'jots',
})
export class Jot {
	@Prop()
	time!: number;

	@Prop()
	text!: string;

	@Prop()
	tags!: JotTag[];

	@Prop()
	diffs!: JotDiff[];

	@Prop()
	tagDiffs!: JotTagDiff[];
}

export class JotTag {
	@Prop()
	time!: number;

	@Prop()
	text!: string;
}

export class JotChange {
	@Prop()
	count?: number;
	@Prop()
	value!: string;
	@Prop()
	added?: boolean;
	@Prop()
	removed?: boolean;
}

export class JotDiff {
	@Prop()
	time!: number;
	@Prop()
	changes!: JotChange[];
}

export class JotTagDiff {
	@Prop()
	text!: string;
	@Prop()
	added!: boolean;
	@Prop()
	time!: number;
}

export type ISmallJot = Pick<Jot, "tags" | "diffs" | "tagDiffs">;
export type ISmallDiff = Pick<JotDiff, "time">;

export type IGetAllJotsResponse = ISmallJot[];

// TODO find out how to make this based upon the IJot interface
export interface IGetJotResponse {
	time: number;
	text: string;
	tags: JotTag[];
	diffs: ISmallDiff[];
	tagDiffs: JotTagDiff[];
}

export type IGetJotDiffResponse = JotChange[];


export const JotSchema = SchemaFactory.createForClass(Jot);