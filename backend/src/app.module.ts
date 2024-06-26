import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ProductTypeModule } from './app/product-type/product-type.module';
import { ProductTypeEntity } from './app/product-type/product-type.entity';
import { AuthModule } from './app/auth/auth.module';
import { UserEntity } from './app/auth/user.entity';
import { ConfigModule } from '@nestjs/config';
import { RefreshToken } from './app/auth/refresh-token.entity';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { HealthModule } from './app/health/health.module';
import { SizesModule } from './app/sizes/sizes.module';
import DatabaseLogger from './logger/database-logger';
import { SizeEntity } from './app/sizes/entities/size.entity';
import { SurfaceModule } from './app/surface/surface.module';
import { SurfaceEntity } from './app/surface/entities/surface.entity';
import { BrandsModule } from './app/brands/brands.module';
import { BrandEntity } from './app/brands/entities/brand.entity';
import { ProductGroupsModule } from './app/product-groups/product-groups.module';
import { ProductGroupEntity } from './app/product-groups/entities/product-group.entity';
import { UnitsModule } from './units/units.module';
import { UnitEntity } from './units/entities/unit.entity';
import { UploadFilesModule } from './app/upload-files/upload-files.module';
import { FileUploadEntity } from './app/upload-files/entities/file-upload.entity';
import { ProductEntity } from './app/product/product.entity';
import { ProductModule } from './app/product/product.module';

config();

@Module({
  // controllers: [],
  // providers: [AppService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        console.log('processssss', process.env.NODE_ENV);
        // const nodeEnv = configService.get<string>('NODE_ENV');
        const url: string = configService.get<string>('POSTGRES_URL');

        console.log('url:', url);
        return {
          type: 'postgres',
          url,
          entities: [
            ProductEntity,
            ProductTypeEntity,
            UserEntity,
            RefreshToken,
            SizeEntity,
            SurfaceEntity,
            BrandEntity,
            ProductGroupEntity,
            UnitEntity,
            FileUploadEntity,
          ],
          synchronize: true,
          logger: new DatabaseLogger(),
        };
      },
    }),
    ProductTypeModule,
    ProductModule,
    AuthModule,
    HealthModule,
    SizesModule,
    SurfaceModule,
    BrandsModule,
    ProductGroupsModule,
    UnitsModule,
    UploadFilesModule,
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
