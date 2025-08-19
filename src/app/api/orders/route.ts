
import {NextResponse} from 'next/server';
import fs from 'fs';
import path from 'path';
import type {Order} from '@/types';

const ordersFilePath = path.join(process.cwd(), 'src', 'data', 'orders.json');

const readOrdersFromFile = (): Order[] => {
  try {
    const fileContent = fs.readFileSync(ordersFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    return [];
  }
};

const writeOrdersToFile = (orders: Order[]) => {
  fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2));
};

export async function GET() {
  const orders = readOrdersFromFile();
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  const newOrderData = await request.json();
  const orders = readOrdersFromFile();
  const newOrder: Order = {
    id: new Date().getTime().toString(), // Simple unique ID
    ...newOrderData,
    order: {
        ...newOrderData.order,
        status: 'pending',
        timestamp: new Date().toISOString(),
    }
  };
  orders.push(newOrder);
  writeOrdersToFile(orders);
  return NextResponse.json(newOrder, {status: 201});
}
