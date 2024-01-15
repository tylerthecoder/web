import { blogService } from "../service";
import { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: { id: string };
};

export async function generateMetadata(
  { params }: Props,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const blog = await blogService.getPost(params.id);

  if ("error" in blog) {
    return {
      title: "Blog not found"
    };
  }

  return {
    title: blog.data.title
  };
}

export default async function Page({ params }: Props) {
  console.log("params", params);
  const blogResponse = await blogService.getPost(params.id);

  if ("error" in blogResponse) {
    return <p>Failed to load blog</p>;
  }

  const blog = blogResponse.data;

  return (
    <div className="w-full flex justify-center">
      <div className="math math-display">
        <h2 className="text-4xl mb-10 text-white"> {blog.title} </h2>
        <article
          className="text-white prose prose-stone prose-invert"
          dangerouslySetInnerHTML={{ __html: blog.html }}
        />
      </div>
    </div>
  );
}
