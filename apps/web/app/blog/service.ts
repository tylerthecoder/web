import { Post } from "@ttweb/blog";
import { Config } from "../config";

export class BlogServiceClass {
  constructor(private apiUrl = Config.apiUrl) {}

  private async get(path: string) {
    const url = `${this.apiUrl}${path}`;
    const res = await fetch(url);

    if (!res.ok) {
      const message = await res.text();
      console.error(`Failed to fetch ${url}. Message: ${message}`);
      throw new Error(`Failed to fetch ${url}`);
    }

    return await res.json();
  }

  async getBlogs() {
    const data = (await this.get("/blog")) as Post[];
    return data;
  }

  async getBlog(id: string) {
    const data = (await this.get(`/blog/${id}`)) as Post;
    return data;
  }
}

export const BlogService = new BlogServiceClass();
