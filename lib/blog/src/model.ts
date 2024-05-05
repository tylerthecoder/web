export type PostMetadata = {
  title: string;
  slug: string;
  filename: string;
};

export type Post = {
  slug: string;
  title: string;
  markdown: string;
  html: string;
  isPublished: boolean;
  isPublic: boolean;
  publishedDate: Date;
};
