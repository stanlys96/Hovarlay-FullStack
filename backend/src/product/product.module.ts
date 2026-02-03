import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './entity/product.entity';
import { ProductCategory } from './entity/product-category.entity';
import { ProductImage } from './entity/product-image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductCategory, ProductImage]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}