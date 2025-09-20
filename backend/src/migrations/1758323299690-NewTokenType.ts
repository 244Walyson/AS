import { MigrationInterface, QueryRunner } from "typeorm";

export class NewTokenType1758323299690 implements MigrationInterface {
    name = 'NewTokenType1758323299690'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."tokens_tokentype_enum" RENAME TO "tokens_tokentype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."tokens_tokentype_enum" AS ENUM('refresh', 'email_verification', 'password_reset')`);
        await queryRunner.query(`ALTER TABLE "tokens" ALTER COLUMN "tokenType" TYPE "public"."tokens_tokentype_enum" USING "tokenType"::"text"::"public"."tokens_tokentype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."tokens_tokentype_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."tokens_tokentype_enum_old" AS ENUM('refresh', 'password_reset')`);
        await queryRunner.query(`ALTER TABLE "tokens" ALTER COLUMN "tokenType" TYPE "public"."tokens_tokentype_enum_old" USING "tokenType"::"text"::"public"."tokens_tokentype_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."tokens_tokentype_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."tokens_tokentype_enum_old" RENAME TO "tokens_tokentype_enum"`);
    }

}
