import { MigrationInterface, QueryRunner } from 'typeorm';

export class MIGRATION1715085677031 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const columnExists = await queryRunner.hasColumn(
      'brands',
      'productGroupId',
    );
    if (!columnExists) {
      await queryRunner.query(
        `ALTER TABLE "brands" ADD COLUMN "productGroupId" UUID NULL`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const columnExists = await queryRunner.hasColumn(
      'brands',
      'productGroupId',
    );
    // if (!columnExists) {
    //   await queryRunner.query(
    //     `ALTER TABLE "brands" DROP COLUMN "productGroupId"`,
    //   );
    // }
    // if (columnExists) {
    //   await queryRunner.query(
    //     `ALTER TABLE "brands" DROP COLUMN "productGroupId"`,
    //   );
    // }
  }
}
