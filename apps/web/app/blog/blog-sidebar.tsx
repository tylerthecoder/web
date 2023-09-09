import Link from "next/link";
import API from "../../services/api";


export default async function BlogSidebar() {
	const data = await API.getAllBlogs();

	return <div className="text-white px-5 py-2 border-r-4 border-black m-r-4 h-auto min-w-[250px] flex flex-col gap-2">
		<h3 className="text-xl"> Other Posts </h3>
		{data.map((blog) => (
			<div key={blog.id}>
				<Link href="/blog/[id]" as={`/blog/${blog.id}`}>
					- {blog.title}
				</Link>
			</div>
		))}
	</div>
}
