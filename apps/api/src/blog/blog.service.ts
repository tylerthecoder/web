import { Injectable, OnModuleInit } from "@nestjs/common";
import { Blog } from "./blog.model";
import { BLOGS } from "./blogs.data";






@Injectable()
export class BlogService implements OnModuleInit {

	private blogs: { [id: string]: Blog } = {}

	async onModuleInit() {

		const blogs = await Promise.all(BLOGS.map(Blog.loadFromFile))

		console.log(blogs);

		for (const blog of blogs) {
			this.blogs[blog.id] = blog;
		}


	}

	getBlog(id: string): Blog | null {
		return this.blogs[id] ?? null;
	}

	getAll(): Blog[] {
		return Object.values(this.blogs);
	}
}