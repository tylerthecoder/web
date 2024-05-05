import { revalidateTag } from "next/cache";

export default async function Page() {
  async function revalidate() {
    "use server";
    console.log("Revalidating blogs");
    revalidateTag("blog");
  }

  return (
    <form action={revalidate}>
      <button type="submit"> Revalidate Blogs </button>;
    </form>
  );
}
