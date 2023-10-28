import { redirect } from "next/navigation";
import { blogService } from "./service";

export default async function Page() {
  const blogs = await blogService.getAllPosts();

  if ("data" in blogs) {
    const randomBlog =
      blogs.data[Math.floor(Math.random() * blogs.data.length)];
    redirect(`/blog/${randomBlog.slug}`);
  } else {
    return <p>Failed to load blogs</p>;
  }
}
