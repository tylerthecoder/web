import { WebDAVClient, createClient } from "webdav";
import { Post } from "./model.js";
import { rawFileToPost } from "./converter.js";
import { Err, Ok, Result, isErr } from "./utils.js";

export const makeClient = (username: string, password: string) => {
  return createClient(
    "https://cloud.tylertracy.com/remote.php/dav/files/tyler",
    {
      username,
      password
    }
  );
};

export const pullAllPosts = async (client: WebDAVClient) => {
  console.log("Pulling all blogposts");

  const items = await client.getDirectoryContents("/mind/blog");
  const files = "data" in items ? items.data : items;

  console.log("Found", files.length, "files");

  const filePromises = files.map(async file => {
    const fileContents = await client.getFileContents(file.filename);

    return rawFileToPost(
      file.basename,
      new Date(file.lastmod),
      fileContents.toString()
    );
  });

  return await Promise.all(filePromises);
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
