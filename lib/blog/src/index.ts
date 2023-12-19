import { createClient, FileStat, WebDAVClient } from "webdav";
import { Err, isErr, Ok, Result } from "./utils.js";
import yaml from "js-yaml";

export type PostMetadata = {
  title: string;
  slug: string;
  filename: string;
};

export type Post = {
  slug: string;
  title: string;
  content: string;
  isPublished: boolean;
  publishedDate: Date;
};

export class BlogService {
  private client: WebDAVClient;

  private posts: Post[] | null = null;

  constructor(username: string, password: string) {
    this.client = createClient(
      "https://cloud.tylertracy.com/remote.php/dav/files/tyler",
      {
        username,
        password
      }
    );
  }

  private async getPostDataFromFileStat(fileStat: FileStat): Promise<Post> {
    const fileContents = (
      await this.client.getFileContents(fileStat.filename)
    ).toString();

    // parse the front-mattter
    const match = fileContents.match(/^---\s*[\s\S]+?---/); // Regex to extract front matter

    const frontMatter = (() => {
      if (match) {
        try {
          const parsedYml = yaml.load(match[0].replace(/---/g, ""));

          if (parsedYml == null || typeof parsedYml !== "object") {
            return {};
          }

          Object.keys(parsedYml).forEach(key => {
            const obj = parsedYml as any;
            const value = obj[key];
            delete obj[key];
            obj[key.toLocaleLowerCase()] = value;
          });

          return parsedYml;
        } catch (err) {
          console.error(err);
          return {};
        }
      }
      return {};
    })();

    const content = (() => {
      if (match) {
        return fileContents.replace(match[0], "");
      }
      return fileContents;
    })();

    const title = (() => {
      if ("title" in frontMatter && typeof frontMatter.title === "string") {
        return frontMatter.title;
      }

      return fileStat.basename.split(".")[0];
    })();

    const slug = title
      // remove special charcters
      .replace(/[^\w\s]/gi, "")
      // replace spaces with dashes
      .replace(new RegExp("\\s", "g"), "-")
      .toLocaleLowerCase();

    const publishedDate = (() => {
      if ("date" in frontMatter && typeof frontMatter.date === "string") {
        return new Date(frontMatter.date);
      }

      return new Date(fileStat.lastmod);
    })();

    const isPublished = (() => {
      if (
        "published" in frontMatter &&
        typeof frontMatter.published === "boolean"
      ) {
        return frontMatter.published;
      }
      return false;
    })();

    return {
      content,
      title,
      slug,
      publishedDate,
      isPublished
    };
  }

  public async pullPosts() {
    const items = await this.client.getDirectoryContents("/mind/blog");
    const files = "data" in items ? items.data : items;
    const filePromises = files.map(this.getPostDataFromFileStat.bind(this));
    const allFiles = await Promise.all(filePromises);
    this.posts = allFiles;
  }

  public async getAllPosts(): Promise<Result<Post[]>> {
    if (this.posts !== null) {
      return Ok(this.posts);
    }

    await this.pullPosts();

    if (this.posts === null) {
      return Err(new Error("Failed to pull posts"));
    }

    return Ok(this.posts);
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
