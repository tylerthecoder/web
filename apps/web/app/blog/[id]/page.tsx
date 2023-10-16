import Head from "next/head";
import API from "../../../services/api";
import markdownToHtml from "./markdownToHtml";


export default async function Page({ params }: { params: { id: string } }) {
	const blog = await API.getBlog(params.id);
	const html = await markdownToHtml(blog.content);

	return (
		<div className="w-full flex justify-center">
			<div className="max-w-[800px]">
				<div className="math math-display">
                    <h2 className="text-4xl mb-10 text-white"> {blog.title} </h2>
					<span className="text-left indent-10 text-white">
						<article
                            className="text-white prose prose-slate prose-lg"
							dangerouslySetInnerHTML={{ __html: html }}
						/>
					</span>
				</div>
			</div>
		</div>
	)
}
