import { User } from '@app/users/decorators/user.decorator';
import { AuthGuard } from '@app/users/guards/auth.guard';
import { UserEntity } from '@app/users/users.entity';
import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';

@Controller('articles')
export class ArticlesController {
    constructor(private readonly articlesService: ArticlesService) { }

    @Post()
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe())
    async createArticle(@User() user: UserEntity, @Body('article') createArticleDto: CreateArticleDto): Promise<any> {
        return await this.articlesService.createArticle(user, createArticleDto);
    }
}
