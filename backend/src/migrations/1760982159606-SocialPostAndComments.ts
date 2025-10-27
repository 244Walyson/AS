import { MigrationInterface, QueryRunner } from "typeorm";

export class SocialPostAndComments1760982159606 implements MigrationInterface {
    name = 'SocialPostAndComments1760982159606'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "social_comments" ("id" character varying NOT NULL, "post_id" character varying NOT NULL, "username" character varying(100), "text" text, "timestamp" TIMESTAMP, "like_count" integer, "metadata" json, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5969df03850043d5d63567eccbe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "social_posts" ("id" character varying NOT NULL, "platform" character varying(50) NOT NULL, "caption" text, "media_type" character varying, "media_url" text, "permalink" text, "timestamp" TIMESTAMP, "metadata" json, CONSTRAINT "PK_2161864ea79f14525b8804bd7ff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "social_comments" ADD CONSTRAINT "FK_96a8f1d2934e7acc55943e516f2" FOREIGN KEY ("post_id") REFERENCES "social_posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "social_comments" DROP CONSTRAINT "FK_96a8f1d2934e7acc55943e516f2"`);
        await queryRunner.query(`DROP TABLE "social_posts"`);
        await queryRunner.query(`DROP TABLE "social_comments"`);
    }

}
