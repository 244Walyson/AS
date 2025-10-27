import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserPostRelation1761525585713 implements MigrationInterface {
    name = 'AddUserPostRelation1761525585713'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "social_posts" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "social_posts" ADD CONSTRAINT "FK_0437a58152209125b4edf53ed7a" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "social_posts" DROP CONSTRAINT "FK_0437a58152209125b4edf53ed7a"`);
        await queryRunner.query(`ALTER TABLE "social_posts" DROP COLUMN "userId"`);
    }

}
