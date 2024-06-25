import { createSlug } from '../utils/generate-slug';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSlugToProductTypes1635448394163 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Kiểm tra xem cột 'slug' đã tồn tại trong 'product-types' chưa
    const columnExists = await queryRunner.hasColumn('product-types', 'slug');

    // Nếu cột 'slug' không tồn tại, thêm cột và cập nhật giá trị cho nó
    if (!columnExists) {
      await queryRunner.query(
        'ALTER TABLE "product-types" ADD COLUMN "slug" VARCHAR(255) NULL',
      );

      const productTypesWithoutSlugs = await queryRunner.query(
        'SELECT * FROM "product-types" WHERE "slug" IS NULL',
      );
      for (const productType of productTypesWithoutSlugs) {
        const slug = createSlug(productType.name);
        await queryRunner.query(
          `UPDATE "product-types" SET "slug" = '${slug}' WHERE "id" = '${productType.id}'`,
        );
      }

      await queryRunner.query(
        'UPDATE "product-types" SET "slug" = code WHERE "slug" IS NULL',
      );
      await queryRunner.query(
        'ALTER TABLE "product-types" ALTER COLUMN "slug" SET NOT NULL',
      );
    }
    // Nếu cột 'slug' đã tồn tại, không làm gì thêm
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const columnExists = await queryRunner.hasColumn('product-types', 'slug');
    // if (columnExists) {
    //   await queryRunner.query('ALTER TABLE "product-types" DROP COLUMN "slug"');
    // }
    // if (!columnExists) {
    //   await queryRunner.query('ALTER TABLE "product-types" DROP COLUMN "slug"');
    // }
  }
}
