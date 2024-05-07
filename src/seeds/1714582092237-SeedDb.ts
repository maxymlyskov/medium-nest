import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedDb1714582092237 implements MigrationInterface {
    name = 'SeedDb1714582092237'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `INSERT INTO "tags" (name) VALUES ('tag1'), ('tag2'), ('tag3')`
        );
        // password - 123
        await queryRunner.query(
            `INSERT INTO "users" (username, email, password) VALUES ('foo', 'foo@gmail.com', '$2b$10$U7NGxxHv9m4arglTEMcHa.PqlScXqpNQ1he0OIoqsFgMmPv1sv1uO')`
        );

        await queryRunner.query(
            `INSERT INTO "articles" (slug, title, description, body, "tagList", "authorId") VALUES ('first-article', 'First article', 'First article description', 'First article body', 'tag1,tag2', 1)`
        );
        await queryRunner.query(
            `INSERT INTO "articles" (slug, title, description, body, "tagList", "authorId") VALUES ('second-article', 'second article', 'second article description', 'second article body', 'tag1,tag2', 1)`
        );
    }

    public async down(): Promise<void> {
    }

}
