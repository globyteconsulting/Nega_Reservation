'use client';

import type { Product, Order } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import OrderCard from '@/components/OrderCard';

interface AdminViewProps {
  products: Product[];
  orders: Order[];
  handleToggleStock: (productId: string, currentStatus: boolean) => void;
  handleAcceptOrder: (orderId: string) => void;
}

export default function AdminView({ products, orders, handleToggleStock, handleAcceptOrder }: AdminViewProps) {
  const sortedOrders = [...orders].sort((a, b) => new Date(b.order.timestamp).getTime() - new Date(a.order.timestamp).getTime());

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Admin Dashboard 🛠️</CardTitle>
          <CardDescription>Manage products and process reservations.</CardDescription>
        </CardHeader>
        <CardContent>
          <h3 className="text-xl font-semibold text-foreground mb-2">Product Management</h3>
          <p className="text-muted-foreground mb-4">Toggle "Out of Stock" status for each product.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product.id} className="p-4 bg-secondary rounded-lg flex flex-col items-center text-center">
                  <p className="font-semibold text-secondary-foreground">{product.name}</p>
                  <p className={`text-sm font-bold ${product.isOutOfStock ? 'text-destructive' : 'text-green-600'}`}>
                    {product.isOutOfStock ? 'OUT OF STOCK' : 'IN STOCK'}
                  </p>
                  <Button
                    onClick={() => handleToggleStock(product.id, product.isOutOfStock)}
                    variant={product.isOutOfStock ? 'default' : 'destructive'}
                    className="mt-2 w-full"
                  >
                    {product.isOutOfStock ? 'Mark as In Stock' : 'Mark as Out of Stock'}
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No products found.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Current Reservations 📋</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedOrders.length > 0 ? (
            <div className="space-y-4">
              {sortedOrders.map((order) => (
                <OrderCard key={order.id} order={order} onAcceptOrder={handleAcceptOrder} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No pending reservations at this time.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
