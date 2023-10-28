import { BlogService } from "@ttweb/blog";

const username = process.env.CLOUD_USERNAME;
const password = process.env.CLOUD_PASSWORD;

if (!username || !password) {
  throw new Error("CLOUD_USERNAME and CLOUD_PASSWORD must be set");
}

export const blogService = new BlogService(username, password);
