import { WebDAVClient } from "webdav";
import { Err, isErr, Ok, Result } from "./utils.js";
import { makeClient, pullAllPosts } from "./webdav.js";

export type PostMetadata = {
  title: string;
  slug: string;
  filename: string;
};

export type Post = {
  slug: string;
  title: string;
  markdown: string;
  html: string;
  isPublished: boolean;
  publishedDate: Date;
};

export class BlogService {
  private client: WebDAVClient;

  private posts: Post[] | null = null;

  constructor(username: string, password: string) {
    this.client = makeClient(username, password);
  }

  public async pullPosts() {
    this.posts = await pullAllPosts(this.client);
    return this.posts;
  }

  public async getAllPosts(): Promise<Result<Post[]>> {
    if (this.posts !== null) {
      return Ok(this.posts);
    }

    const posts = await this.pullPosts();

    return Ok(posts);
  }

  public async getPublishedPosts(): Promise<Result<Post[]>> {
    const posts = await this.getAllPosts();
    if (isErr(posts)) {
      return posts;
    }

    const published = posts.data
      .filter(post => post.isPublished)
      .sort((a, b) => {
        return a.publishedDate.getTime() - b.publishedDate.getTime();
      });

    return Ok(published);
  }

  public async getPost(slug: string): Promise<Result<Post>> {
    const posts = await this.getAllPosts();

    if (isErr(posts)) {
      return posts;
    }

    const post = posts.data.find(post => post.slug === slug);

    if (!post) {
      return Err(new Error("Post not found"));
    }

    return Ok(post);
  }
}
