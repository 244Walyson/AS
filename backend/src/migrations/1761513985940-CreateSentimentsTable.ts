import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSentimentsTable1761513985940 implements MigrationInterface {
    name = 'CreateSentimentsTable1761513985940'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "comment_entities" ("id" SERIAL NOT NULL, "entity_name" character varying(100) NOT NULL, "sentiment_id" uuid, CONSTRAINT "PK_5c46447da5098b1b5d1aac53051" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "comment_hashtags" ("id" SERIAL NOT NULL, "hashtag" character varying(100) NOT NULL, "sentiment_id" uuid, CONSTRAINT "PK_554dbb6e3af35df910efa06c567" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "comment_sentiments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sentiment" character varying(20) NOT NULL, "intensity" character varying(20), "emotion" character varying(20), "sentiment_value" numeric(3,2), "motivation" text, "interaction_type" character varying(20), "impact" character varying(10), "feedback" text, "tone" character varying(20), "sarcasm" boolean, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "comment_id" character varying, CONSTRAINT "PK_f43ae1a03c8fcb3676f8c2f5606" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "comment_entities" ADD CONSTRAINT "FK_7554c72f4148722b5cb45e6143a" FOREIGN KEY ("sentiment_id") REFERENCES "comment_sentiments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment_hashtags" ADD CONSTRAINT "FK_11d1e7613b35bc6a26acf86a742" FOREIGN KEY ("sentiment_id") REFERENCES "comment_sentiments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment_sentiments" ADD CONSTRAINT "FK_ce66e8239ba00ff31a8987046a1" FOREIGN KEY ("comment_id") REFERENCES "social_comments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment_sentiments" DROP CONSTRAINT "FK_ce66e8239ba00ff31a8987046a1"`);
        await queryRunner.query(`ALTER TABLE "comment_hashtags" DROP CONSTRAINT "FK_11d1e7613b35bc6a26acf86a742"`);
        await queryRunner.query(`ALTER TABLE "comment_entities" DROP CONSTRAINT "FK_7554c72f4148722b5cb45e6143a"`);
        await queryRunner.query(`DROP TABLE "comment_sentiments"`);
        await queryRunner.query(`DROP TABLE "comment_hashtags"`);
        await queryRunner.query(`DROP TABLE "comment_entities"`);
    }

}
