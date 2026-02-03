import { Controller, Get, Query, ParseIntPipe, DefaultValuePipe, Param, HttpStatus } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './entity/product.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @ApiOperation({ summary: 'Get all products, along with search options' })
    @Get('search')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns the products data',
    })
    async search(
        @Query('q') q?: string,
        @Query('category') category?: string,
        @Query('minPrice') minPrice?: number,
        @Query('maxPrice') maxPrice?: number,
        @Query('inStock') inStock?: boolean,
        @Query('sort') sort?: 'relevance' | 'price' | 'created_at' | 'rating',
        @Query('method') method?: 'asc' | 'desc',
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
        @Query('pageSize', new DefaultValuePipe(20), ParseIntPipe) pageSize?: number,
    ) {
        const categories = typeof category === "string" ? [category] : category;

        const inStockBool =
            inStock === undefined
                ? undefined
                : inStock?.toString() === 'true' || inStock === true;

        return this.productService.findWithFilters({
            q,
            categories,
            minPrice,
            maxPrice,
            inStock: inStockBool,
            sort,
            method,
            page,
            pageSize,
        });
    }

    @ApiOperation({ summary: 'Get all products, along with search options' })
    @Get(':id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Returns the products data',
    })
    async getProduct(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<Product> {
        return this.productService.findOne(id);
    }
}
