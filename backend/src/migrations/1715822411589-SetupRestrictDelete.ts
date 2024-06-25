import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetupRestrictDelete1715822411589 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Thêm ràng buộc cho mối quan hệ giữa Brand và ProductGroup
    // Tên của bảng trung gian và foreign key sẽ khác nhau dựa trên cài đặt của bạn
    await queryRunner.query(`
            ALTER TABLE "brands_product_groups_product-groups" 
            ADD CONSTRAINT "FK_restrict_brand_deletion" 
                FOREIGN KEY ("brandsId") REFERENCES "brands"("id") 
                ON DELETE RESTRICT
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Loại bỏ ràng buộc khi rollback
    // await queryRunner.query(`
    //     ALTER TABLE "product_group_brands_brand"
    //     DROP CONSTRAINT "FK_restrict_brand_deletion"
    // `);
  }
}
