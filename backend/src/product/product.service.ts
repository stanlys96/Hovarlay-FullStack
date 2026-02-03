import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Product } from './entity/product.entity';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>,
    ) { }

    async findWithFilters(options: {
        q?: string;
        categories?: string[];
        minPrice?: number;
        maxPrice?: number;
        inStock?: boolean;
        sort?: 'relevance' | 'price' | 'created_at' | 'rating';
        method?: 'asc' | 'desc';
        page?: number;
        pageSize?: number;
    }) {
        const page = options.page && options.page > 0 ? options.page : 1;
        const allowedPageSizes = [20, 50, 100];
        const pageSize = allowedPageSizes.includes(options.pageSize || 20) ? options.pageSize : 20;
        const skip = (page - 1) * (pageSize || 20);

        const query = this.productRepo
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.images', 'images')
            .leftJoinAndSelect('product.categories', 'categories');

        if (options.q) {
            query.andWhere(
                new Brackets((qb) => {
                    qb.where('product.name ILIKE :q', { q: `%${options.q}%` }).orWhere(
                        'product.description ILIKE :q',
                        { q: `%${options.q}%` },
                    );
                }),
            );
        }

        if (options.categories && options.categories.length > 0) {
            const categoryCount = options.categories.length;

            // Subquery to find IDs of products that have ALL the requested categories
            const subQuery = this.productRepo
                .createQueryBuilder('p')
                .select('p.id')
                .innerJoin('p.categories', 'c')
                .where('c.name IN (:...categories)', { categories: options.categories })
                .groupBy('p.id')
                // The analytic heart: ensure the product matches the exact number of categories provided
                .having('COUNT(DISTINCT c.name) = :count', { count: categoryCount });

            query.andWhere(`product.id IN (${subQuery.getQuery()})`)
                .setParameters(subQuery.getParameters());
        }

        if (options.minPrice !== undefined) {
            query.andWhere('product.price >= :minPrice', { minPrice: options.minPrice });
        }
        if (options.maxPrice !== undefined) {
            query.andWhere('product.price <= :maxPrice', { maxPrice: options.maxPrice });
        }

        if (options.inStock !== undefined) {
            query.andWhere('product.inStock = :inStock', { inStock: options.inStock });
        }

        let sortField = 'product.created_at';
        let sortOrder: 'ASC' | 'DESC' = 'ASC';

        if (options.sort) {
            switch (options.sort) {
                case 'relevance':
                    if (options.q) {
                        sortField = 'ts_rank_cd(to_tsvector(product.name || \' \' || product.description), plainto_tsquery(:q))';
                        query.setParameter('q', options.q);
                    } else {
                        sortField = 'product.created_at';
                    }
                    break;
                case 'price':
                    sortField = 'product.price';
                    break;
                case 'created_at':
                    sortField = 'product.created_at';
                    break;
                case 'rating':
                    sortField = 'product.rating';
                    break;
            }
        }

        if (options.method) {
            sortOrder = options.method.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        }

        query.orderBy(sortField, sortOrder);

        query.skip(skip).take(pageSize);

        const [data, total] = await query.getManyAndCount();

        return {
            data,
            meta: {
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / (pageSize || 20)),
            },
        };
    }

    async findOne(id: number): Promise<Product> {
        const product = await this.productRepo.findOne({
            where: { id },
            relations: ['images', 'categories'],
        });

        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        return product;
    }
}
