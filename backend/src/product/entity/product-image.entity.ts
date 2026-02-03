import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity('product_images')
export class ProductImage {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    url: string;

    @Column({
        type: 'numeric',
        default: 0,
        transformer: {
            to: (value: number) => value,
            from: (value: string) => parseInt(value),
        },
    })
    order: number;

    @Column({ default: false })
    isPrimary: boolean;

    @ManyToOne(() => Product, (product) => product.images, {
        onDelete: 'CASCADE',
    })
    product: Product;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}