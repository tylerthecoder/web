import Head from "next/head";
import API from "../../../services/api";
import markdownToHtml from "./markdownToHtml";
import { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: { id: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const blog = await API.getBlog(params.id);

  return {
    title: blog.title
  };
}

export default async function Page({ params }: Props) {
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
  );
}
