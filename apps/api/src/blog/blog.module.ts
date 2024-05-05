import { Module } from '@nestjs/common';
import { PostController } from './blog.controller';

@Module({
  imports: [],
  controllers: [PostController],
})
export class PostsModule {}
