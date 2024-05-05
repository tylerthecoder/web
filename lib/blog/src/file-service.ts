import { glob } from "glob";
import path from "path";
import fs from "fs/promises";
import { Post } from "./model.js";
import { rawFileToPost } from "./converter.js";

const getDocsFolder = () => {
  const docs = process.env.DOCS_FOLDER;
  if (!docs) {
    throw new Error("DOCS_FOLDER not set");
  }
  return docs;
};

const fileNameToPost = async (fileName: string) => {
  const file = await fs.readFile(fileName);
  const stats = await fs.stat(fileName);

  const baseName = path.basename(fileName);

  return rawFileToPost(baseName, new Date(stats.mtimeMs), file.toString());
};

export class PostsService {
  private posts: Post[] | null = null;

  public async pullPosts() {
    console.log("Pulling posts");

    const docsFolder = getDocsFolder();

    const files = await glob(`${docsFolder}/**/*.md`);

    const postsPromises = files.map(fileNameToPost);

    const posts = await Promise.all(postsPromises);

    const publicPosts = posts.filter(post => post.isPublic);

    console.log(
      "Loaded Posts: ",
      publicPosts.map(post => post.slug)
    );

    this.posts = publicPosts;
  }

  public getPosts() {
    if (this.posts === null) {
      throw new Error("Posts not loaded");
    }
    return this.posts;
  }

  public getPost(slug: string) {
    const post = this.posts?.find(post => post.slug === slug);

    if (!post) {
      throw new Error(`Post ${slug} not found`);
    }

    return post;
  }

  public getPublishedPosts() {
    if (this.posts === null) {
      throw new Error("Posts not loaded");
    }
    return this.posts.filter(post => post.isPublished);
  }
}
