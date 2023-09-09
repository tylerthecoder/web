import API from "../../../services/api";
import markdownToHtml from "./markdownToHtml";


export default async function Page({ params }: { params: { id: string } }) {
	const blog = await API.getBlog(params.id);
	const html = await markdownToHtml(blog.content);

	return (
		<div className="w-full flex justify-center">
			<div className="max-w-[800px]">
				<h2 className="text-2xl mb-10"> {blog.title} </h2>
				<div className="math math-display">
					<span className="text-left indent-10 text-white">
						<div
                            className="text-white"
							dangerouslySetInnerHTML={{ __html: html }}
						/>
					</span>
				</div>
			</div>
		</div>
	)
}
