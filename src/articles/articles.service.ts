import { UserEntity } from '@app/users/users.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { DeleteResult, Repository } from 'typeorm';
import { ArticleEntity } from './articles.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticleResponseInterface } from './types/article-response.interface';

@Injectable()
export class ArticlesService {
    constructor(@InjectRepository(ArticleEntity) private readonly articleRepository: Repository<ArticleEntity>) { }

    async createArticle(user: UserEntity, createArticleDto: CreateArticleDto): Promise<ArticleEntity> {
        const newArticle = new ArticleEntity();
        Object.assign(newArticle, createArticleDto);

        if (!newArticle.tagList)
            newArticle.tagList = [];

        newArticle.author = user;

        newArticle.slug = this.getSlug(newArticle.title);

        return await this.articleRepository.save(newArticle)
    }

    async getArticleBySlug(slug: string): Promise<ArticleEntity> {
        return await this.articleRepository.findOne({ where: { slug } });
    }

    async deleteArticle(slug: string, currentUserId: number): Promise<DeleteResult> {
        const article = await this.articleRepository.findOne({ where: { slug } });

        if (!article) {
            throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
        }

        if (article.author.id !== currentUserId) {
            throw new HttpException('You are not the author of this article', HttpStatus.FORBIDDEN);
        }

        return await this.articleRepository.delete({ slug: article.slug });

    }

    buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
        return { article }
    }

    private getSlug(title: string): string {
        return slugify(title, { lower: true }) + ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
    }
}
