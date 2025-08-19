
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

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const { status } = await request.json();

    if (!status) {
        return NextResponse.json({ message: 'Status is required' }, { status: 400 });
    }

    const orders = readOrdersFromFile();
    const orderIndex = orders.findIndex(o => o.id === id);

    if (orderIndex === -1) {
        return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    orders[orderIndex].order.status = status;
    writeOrdersToFile(orders);

    return NextResponse.json(orders[orderIndex]);
}
