import { Controller, Get, OnModuleInit, Param, Post } from '@nestjs/common';
import { Post as BlogPost } from './model.js';

const getService = async () => {
  const blogLib = await import('@ttweb/blog');
  const postService = new blogLib.FileBlogServer();

  return postService;
};

@Controller('blog')
export class PostController implements OnModuleInit {
  private postService!: Awaited<ReturnType<typeof getService>>;

  async onModuleInit() {
    const blogLib = await import('@ttweb/blog');
    this.postService = new blogLib.FileBlogServer();
    await this.postService.pullPosts();
  }

  @Get()
  async get() {
    return this.postService.getPublishedPosts();
  }

  @Get(':id')
  async getPost(@Param('id') id: string): Promise<BlogPost> {
    return this.postService.getPost(id);
  }

  @Post('repull')
  async repullPosts() {
    await this.postService.pullPosts();
  }
}
