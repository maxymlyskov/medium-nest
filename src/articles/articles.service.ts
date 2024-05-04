import { UserEntity } from '@app/users/users.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { ArticleEntity } from './articles.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleResponseInterface } from './types/article-response.interface';
import { ArticlesResponseInterface } from './types/articles-response.interface';

@Injectable()
export class ArticlesService {
    constructor(
        @InjectRepository(ArticleEntity) private readonly articleRepository: Repository<ArticleEntity>,
        @InjectRepository(UserEntity) private readonly userRespository: Repository<UserEntity>,
        private dataSource: DataSource) { }

    async findAll(currentUserId: number, query: any): Promise<ArticlesResponseInterface> {
        const queryBuilder = this.dataSource.getRepository(ArticleEntity)
            .createQueryBuilder('articles')
            .leftJoinAndSelect('articles.author', 'author');

        queryBuilder.orderBy('articles.createdAt', 'DESC');

        const articlesCount = await queryBuilder.getCount();

        if (query.tag) {
            queryBuilder.andWhere('articles.tagList LIKE :tag', { tag: `%${query.tag}%` });
        }

        if (query.author) {
            const author = await this.userRespository.findOne({ where: { username: query.author } });
            queryBuilder.andWhere('articles.authorId = :id', { id: author.id });
        }

        if (query.limit) {
            queryBuilder.limit(query.limit);
        }

        if (query.offset) {
            queryBuilder.offset(query.offset);
        }

        const articles = await queryBuilder.getMany();

        return { articles, articlesCount };

    }

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
        const article = await this.getArticleBySlug(slug);

        if (!article) {
            throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
        }

        if (article.author.id !== currentUserId) {
            throw new HttpException('You are not the author of this article', HttpStatus.FORBIDDEN);
        }

        return await this.articleRepository.delete({ slug: article.slug });

    }


    async updateArticle(slug: string, currentUserId: number, updateArticleDto: UpdateArticleDto): Promise<ArticleEntity> {
        const article = await this.getArticleBySlug(slug);

        if (!article) {
            throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
        }

        if (article.author.id !== currentUserId) {
            throw new HttpException('You are not the author of this article', HttpStatus.FORBIDDEN);
        }

        Object.assign(article, updateArticleDto);

        return await this.articleRepository.save(article);
    }

    buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
        return { article }
    }

    private getSlug(title: string): string {
        return slugify(title, { lower: true }) + ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
    }
}
