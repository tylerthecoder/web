import yaml from "js-yaml";
import { Post } from "./index.js";
import markdownToHtml from "./markdownToHtml.js";

export const rawFileToPost = async (
  fileName: string,
  lastModified: Date,
  fileContents: string
): Promise<Post> => {
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

  const markdown = (() => {
    if (match) {
      return fileContents.replace(match[0], "");
    }
    return fileContents;
  })();

  const title = (() => {
    if ("title" in frontMatter && typeof frontMatter.title === "string") {
      return frontMatter.title;
    }

    return fileName.split(".")[0];
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

    return lastModified;
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

  const html = await markdownToHtml(markdown);

  console.log("Pulled", title, slug, isPublished, frontMatter);

  return {
    html,
    markdown,
    title,
    slug,
    publishedDate,
    isPublished
  };
};
