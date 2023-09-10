import { redirect } from "next/navigation";
import API from "../../services/api";

// Just loads a random blog and show it
export default async function Page() {
	const blogs = await API.getAllBlogs();
    const randomBlog = blogs[Math.floor(Math.random() * blogs.length)];
    redirect(`/blog/${randomBlog.id}`);
    return <div></div>
}
