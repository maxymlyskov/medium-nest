import { BackendValidationPipe } from '@app/shared/pipes/backend-validation.pipe';
import { User } from '@app/users/decorators/user.decorator';
import { AuthGuard } from '@app/users/guards/auth.guard';
import { UserEntity } from '@app/users/users.entity';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UsePipes } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleResponseInterface } from './types/article-response.interface';
import { ArticlesResponseInterface } from './types/articles-response.interface';

@Controller('articles')
export class ArticlesController {
    constructor(private readonly articlesService: ArticlesService) { }

    @Get()
    async findAll(@User('id') currentUserId: number, @Query() query: any): Promise<ArticlesResponseInterface> {
        return await this.articlesService.findAll(currentUserId, query);
    }

    @Get('feed')
    @UseGuards(AuthGuard)
    async getFeed(@User('id') currentUserId: number, @Query() query: any): Promise<ArticlesResponseInterface> {
        return await this.articlesService.getFeed(currentUserId, query);
    }

    @Post()
    @UseGuards(AuthGuard)
    @UsePipes(new BackendValidationPipe())
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

    @Put(':slug')
    @UseGuards(AuthGuard)
    @UsePipes(new BackendValidationPipe())
    async updateArticle(@User('id') currentUserId: number, @Param('slug') slug: string, @Body('article') updateArticleDto: UpdateArticleDto): Promise<ArticleResponseInterface> {
        const article = await this.articlesService.updateArticle(slug, currentUserId, updateArticleDto);
        return this.articlesService.buildArticleResponse(article);
    }

    @Post(':slug/favorite')
    @UseGuards(AuthGuard)
    async addArticleToFavorites(@User('id') currentUserId: number, @Param('slug') slug: string): Promise<ArticleResponseInterface> {
        const article = await this.articlesService.addArticlesToFavorite(slug, currentUserId);
        return this.articlesService.buildArticleResponse(article);
    }

    @Delete(':slug/favorite')
    @UseGuards(AuthGuard)
    async deleteArticleFromFavorites(@User('id') currentUserId: number, @Param('slug') slug: string): Promise<ArticleResponseInterface> {
        const article = await this.articlesService.deleteArticleFromFavorites(slug, currentUserId);
        return this.articlesService.buildArticleResponse(article);
    }
}
