import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Change } from "diff";
import { Model } from "mongoose";
import { IGetAllJotsResponse, IGetJotDiffResponse, IGetJotResponse, Jot, JotDocument } from "./jots.schema";


@Injectable()
export class JotService {
	private password: string;
	constructor(
		private configService: ConfigService,
		@InjectModel(Jot.name) private jotModel: Model<JotDocument>,
	) {
		const password = this.configService.get("JOTS_PASSWORD");
		if (!password) {
			throw new Error("JOTS_PASSWORD not set");
		}
		this.password = password;
	}

	private validatePassword(pwd: string) {
		return pwd === this.password;
	}

	async getJot(id: string) {
		const jot = await (this.jotModel.findById(id, ["time", "text", "tags", "diffs.time", "tagDiffs"]) as unknown as Promise<IGetJotResponse | null>);
		if (!jot) throw new Error("Not Found");
		return jot;
	}

	async getAllJots() {
		const jots = await (this.jotModel.find({}, ["time", "text", "tags.text"]) as unknown as Promise<IGetAllJotsResponse>);
		return jots;
	}

	async getJotDiff(id: string, diffIndex: number) {
		const projection = "diffs." + diffIndex;
		const jot = await (this.jotModel.findById(id, projection) as unknown as Promise<IGetJotDiffResponse | null>);
		return jot;
	}

	async getBookJots() {
		return this.jotModel.find({ "tags.text": { $in: ["book"] } });
	}

	async editJot(jotId: string, textDiff: Change[]): Promise<void> {
		const currentText = textDiff
			.filter(diff => diff.value && !diff.removed)
			.reduce((text, diff) => text + diff.value, "");

		await this.jotModel.findByIdAndUpdate(jotId, {
			$set: {
				text: currentText,
			},
			$push: {
				diffs: {
					time: Date.now(),
					diff: textDiff,
				},
			}
		})
	}



}