
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
    return [];
  }
};

const writeProductsToFile = (products: Product[]) => {
  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
};

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const { isOutOfStock } = await request.json();

    if (isOutOfStock === undefined) {
        return NextResponse.json({ message: 'isOutOfStock is required' }, { status: 400 });
    }

    const products = readProductsFromFile();
    const productIndex = products.findIndex(p => p.id === id);

    if (productIndex === -1) {
        return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    products[productIndex].isOutOfStock = isOutOfStock;
    writeProductsToFile(products);

    return NextResponse.json(products[productIndex]);
}
