import { User } from '@app/users/decorators/user.decorator';
import { AuthGuard } from '@app/users/guards/auth.guard';
import { UserEntity } from '@app/users/users.entity';
import { Body, Controller, Delete, Get, Param, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticleResponseInterface } from './types/article-response.interface';

@Controller('articles')
export class ArticlesController {
    constructor(private readonly articlesService: ArticlesService) { }

    @Post()
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe())
    async createArticle(@User() user: UserEntity, @Body('article') createArticleDto: CreateArticleDto): Promise<ArticleResponseInterface> {
        const article = await this.articlesService.createArticle(user, createArticleDto);
        return this.articlesService.buildArticleResponse(article);
    }

    @Get(':slug')
    async getArticleBySlug(@Param('slug') slug: string): Promise<ArticleResponseInterface> {
        const article = await this.articlesService.getArticleBySlug(slug);
        return this.articlesService.buildArticleResponse(article);
    }

    @Delete(':slug')
    @UseGuards(AuthGuard)
    async deleteArticle(@User('id') currentUserId: number, @Param('slug') slug: string): Promise<DeleteResult> {
        return await this.articlesService.deleteArticle(slug, currentUserId);

    }
}
