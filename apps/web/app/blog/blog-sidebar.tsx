import Link from "next/link";
import { blogService } from "./service";

export default async function BlogSidebar() {
  const blogs = await blogService.getPublishedPosts();

  if ("data" in blogs) {
    return (
      <div className="mt-10 text-white px-5 py-2 border-t-4 border-black m-r-4 h-auto min-w-[250px] flex flex-col gap-2">
        <h3 className="text-xl"> Other Posts </h3>
        {blogs.data.map(blog => (
          <div key={blog.slug}>
            <Link href="/blog/[id]" as={`/blog/${blog.slug}`}>
              - {blog.title}
            </Link>
          </div>
        ))}
      </div>
    );
  }

  return <div>Error getting blogs</div>;
}
