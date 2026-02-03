import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity('product_categories')
export class ProductCategory {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;

    @ManyToOne(() => Product, (product) => product.categories, {
        onDelete: 'CASCADE',
    })
    product: Product;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}