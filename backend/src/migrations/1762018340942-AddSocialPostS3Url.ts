import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSocialPostS3Url1762018340942 implements MigrationInterface {
    name = 'AddSocialPostS3Url1762018340942'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "social_posts" ADD "s3_media_url" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "social_posts" DROP COLUMN "s3_media_url"`);
    }

}
