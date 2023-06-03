import { Controller, Get, Param } from "@nestjs/common";
import { BlogService } from "./blog.service";



@Controller("blog")
export class BlogController {

	constructor(
		private blogService: BlogService,
	) {}

	@Get()
	async getAll() {
		return this.blogService.getAll();
	}

	@Get(":id")
	async get(@Param('id') id: string) {
		return this.blogService.getBlog(id);
	}

}

