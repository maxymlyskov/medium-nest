import { UserEntity } from '@app/users/users.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleEntity } from './articles.entity';
import { CreateArticleDto } from './dto/create-article.dto';

@Injectable()
export class ArticlesService {
    constructor(@InjectRepository(ArticleEntity) private readonly articleRepository: Repository<ArticleEntity>) { }

    async createArticle(user: UserEntity, createArticleDto: CreateArticleDto): Promise<any> {
        const newArticle = new ArticleEntity();
        Object.assign(newArticle, createArticleDto);

        if (!newArticle.tagList)
            newArticle.tagList = [];

        newArticle.author = user;

        newArticle.slug = newArticle.title.toLowerCase().replace(/ /g, '-');

        return await this.articleRepository.save(newArticle)
    }
}
