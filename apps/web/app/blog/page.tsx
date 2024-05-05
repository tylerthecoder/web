import Link from "next/link";
import { BlogService } from "./service";

export default async function Page() {
  const blogs = await BlogService.getBlogs();

  console.log("Recieved blogs: ", blogs);

  console.log("This many blogs: ", blogs.length);

  return (
    <div className="prose prose-stone prose-invert">
      <h1> All Blog Posts </h1>
      <p> I write about AI and random philosphy </p>
      {blogs.map(blog => (
        <div key={blog.slug}>
          <Link
            href="/blog/[id]"
            as={`/blog/${blog.slug}`}
            className="text-white"
          >
            - {blog.title}
          </Link>
        </div>
      ))}
    </div>
  );
}
