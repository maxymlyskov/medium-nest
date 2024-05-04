import { ArticleEntity } from "../articles.entity";

export interface ArticlesResponseInterface {
    articles: ArticleEntity[];
    articlesCount: number;
}