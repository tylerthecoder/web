import path from "path";
import { promises as fs } from "fs";
import { getConfig } from "src/config";


export class Blog {
	constructor(
	public id: string,
	public title: string,
	public content: string,
	public isVisible: boolean
	) {}

	static async loadFromFile(blogPartialPath: string) {
		const config = getConfig();
		const blogDirectory = config.get("blogDirectory");
		if (!blogDirectory) {
			throw new Error("Blog directory not set");
		}
		const blogPath = path.join(blogDirectory, blogPartialPath);
		const content = await fs.readFile(blogPath, "utf-8");
		const fileBaseName = path.basename(blogPartialPath, ".md");
		const id = fileBaseName.replace(/ /g, "-");

		return new Blog(
			id,
			fileBaseName,
			content,
			true
		);
	}

}