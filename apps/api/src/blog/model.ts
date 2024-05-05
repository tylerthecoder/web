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
  isPublic: boolean;
  isPublished: boolean;
  publishedDate: Date;
};
