import { createClient, WebDAVClient } from "webdav";

export type PostMetadata = {
  title: string;
  slug: string;
  filename: string;
};

export type Post = {
  slug: string;
  title: string;
  content: string;
};

type SucessResult<T> = {
  data: T;
};

type ErrorResult = {
  error: Error;
};

type Result<T> = SucessResult<T> | ErrorResult;

export class BlogService {
  private client: WebDAVClient;

  constructor(username: string, password: string) {
    this.client = createClient(
      "https://cloud.tylertracy.com/remote.php/dav/files/tyler",
      {
        username,
        password
      }
    );
  }

  public async getAllPosts(): Promise<Result<PostMetadata[]>> {
    const items = await this.client.getDirectoryContents("/mind/blog");
    const files = "data" in items ? items.data : items;
    console.log("Got all files", files);
    const fileMetadata = files.map(file => {
      const title = file.basename.split(".")[0];
      const slug = title
        // remove special charcters
        .replace(/[^\w\s]/gi, "")
        // replace spaces with dashes
        .replace(new RegExp("\\s", "g"), "-")
        .toLocaleLowerCase();

      return {
        title,
        slug,
        filename: file.filename
      };
    });

    console.log(fileMetadata);

    return {
      data: fileMetadata
    };
  }

  public async getPost(postSlug: string): Promise<Result<Post>> {
    const postsResponse = await this.getAllPosts();

    if ("error" in postsResponse) {
      return postsResponse;
    }

    const posts = postsResponse.data;

    const post = posts.find(post => post.slug === postSlug);

    if (!post) {
      return {
        error: new Error("can not find file")
      };
    }

    const fileContents = await this.client.getFileContents(post.filename);

    return {
      data: {
        content: fileContents.toString(),
        title: post.title,
        slug: post.slug
      }
    };
  }
}
