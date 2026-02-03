import { DataSource } from 'typeorm';
import { Product } from '../../product/entity/product.entity';
import { ProductImage } from '../../product/entity/product-image.entity';
import { ProductCategory } from '../../product/entity/product-category.entity';

const sampleCategories = [
  'Electronics', 'Computers', 'Accessories', 'Smart Home', 'Gaming',
  'Health', 'Fitness', 'Outdoors', 'Fashion', 'Toys',
];

const sampleAdjectives = [
  'Smart', 'Ultra', 'Pro', 'Advanced', 'Portable', 'Wireless',
  'Premium', 'Compact', 'Eco', 'Classic', 'Modern', 'Lite',
];

const sampleProducts = [
  'Headphones', 'Speaker', 'Laptop', 'Keyboard', 'Mouse',
  'Monitor', 'Smartwatch', 'Camera', 'Router', 'Microphone',
  'Backpack', 'Power Bank', 'Tablet', 'SSD', 'Hard Drive',
];

const sampleModels = ['X', 'S', 'Z', 'One', 'Prime', 'Neo', 'Air', 'Edge', 'Core'];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals = 2): number {
  const val = Math.random() * (max - min) + min;
  return parseFloat(val.toFixed(decimals));
}

function randomImageUrl(): string {
  return `https://picsum.photos/seed/${Math.random()}/400/400`;
}

export async function seedProducts(dataSource: DataSource) {
  const productRepo = dataSource.getRepository(Product);

  const products: Product[] = [];

  for (let i = 1; i <= 1000; i++) {
    const adj = sampleAdjectives[randomInt(0, sampleAdjectives.length - 1)];
    const prod = sampleProducts[randomInt(0, sampleProducts.length - 1)];
    const model = sampleModels[randomInt(0, sampleModels.length - 1)];

    const product = productRepo.create({
      name: `${adj} ${prod} ${model}-${i}`,
      price: randomFloat(50, 1000),
      description: `High quality ${adj.toLowerCase()} ${prod.toLowerCase()} designed for everyday use.`,
      rating: randomFloat(3, 5, 1),
      inStock: Math.random() > 0.2,
      images: [],
      categories: [],
    });

    const imageCount = randomInt(2, 5);
    for (let j = 0; j < imageCount; j++) {
      const image = new ProductImage();
      image.url = randomImageUrl();
      image.order = j;
      image.isPrimary = j === 0; // first image is primary
      product.images.push(image);
    }

    const categoryCount = randomInt(2, 3);
    const usedIndices = new Set<number>();
    for (let j = 0; j < categoryCount; j++) {
      let idx: number;
      do {
        idx = randomInt(0, sampleCategories.length - 1);
      } while (usedIndices.has(idx));
      usedIndices.add(idx);

      const category = new ProductCategory();
      category.name = sampleCategories[idx];
      product.categories.push(category);
    }

    products.push(product);
  }

  await productRepo.save(products, { chunk: 50 });
  console.log('✅ Seeded 1000 products with images and categories');
}
