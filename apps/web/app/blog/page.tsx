import { blogService } from "./service";
import Link from "next/link";

export default async function Page() {
  const blogs = await blogService.getPublishedPosts();

  console.log("PUBLISHED BLOG POSTS: ", Object.keys(blogs));

  if ("data" in blogs) {
    return (
      <div className="prose prose-stone prose-invert">
        <h1> All Blog Posts </h1>
        <p> I write about AI and random philosphy </p>
        {blogs.data.map(blog => (
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
  } else {
    return <p>Failed to load blogs</p>;
  }
}
