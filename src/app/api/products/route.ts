
import {NextResponse} from 'next/server';
import fs from 'fs';
import path from 'path';
import type {Product} from '@/types';

const productsFilePath = path.join(process.cwd(), 'src', 'data', 'products.json');

const readProductsFromFile = (): Product[] => {
  try {
    const fileContent = fs.readFileSync(productsFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    // If the file doesn't exist or is empty, return initial products
    const initialProducts: Product[] = [
      { id: '1', name: 'Beef', isOutOfStock: false, imageUrl: 'https://placehold.co/150x150.png' },
      { id: '2', name: 'Pork', isOutOfStock: false, imageUrl: 'https://placehold.co/150x150.png' },
      { id: '3', name: 'Lamb', isOutOfStock: false, imageUrl: 'https://placehold.co/150x150.png' },
    ];
    writeProductsToFile(initialProducts);
    return initialProducts;
  }
};

const writeProductsToFile = (products: Product[]) => {
  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
};

export async function GET() {
  const products = readProductsFromFile();
  return NextResponse.json(products);
}
