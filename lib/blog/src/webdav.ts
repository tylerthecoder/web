import { WebDAVClient, createClient } from "webdav";
import { rawFileToPost } from "./rawFileToJson.js";

const BLOG_DIR = "/blog";

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

  const items = await client.getDirectoryContents(BLOG_DIR);
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
