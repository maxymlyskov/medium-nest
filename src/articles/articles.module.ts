import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesController } from './articles.controller';
import { ArticleEntity } from './articles.entity';
import { ArticlesService } from './articles.service';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity])],
  controllers: [ArticlesController],
  providers: [ArticlesService]
})
export class ArticlesModule { }
