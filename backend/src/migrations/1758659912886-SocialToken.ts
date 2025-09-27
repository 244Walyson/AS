import { MigrationInterface, QueryRunner } from "typeorm";

export class SocialToken1758659912886 implements MigrationInterface {
    name = 'SocialToken1758659912886'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "social_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "userSocialId" character varying(50) NOT NULL, "provider" character varying(50) NOT NULL, "accessToken" text NOT NULL, "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_ab14847deed75854e0578c3d2d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_ee868fb0b15bfab1bfecfa8f1a" ON "social_tokens" ("userId", "provider") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_ee868fb0b15bfab1bfecfa8f1a"`);
        await queryRunner.query(`DROP TABLE "social_tokens"`);
    }

}
