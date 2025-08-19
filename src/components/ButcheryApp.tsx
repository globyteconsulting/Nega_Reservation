
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { Product, Order } from '@/types';
import CustomerView from '@/components/CustomerView';
import AdminView from '@/components/AdminView';
import { Button } from '@/components/ui/button';
import Logo from './Logo';

export default function ButcheryApp() {
  const [currentView, setCurrentView] = useState('customer');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const { toast } = useToast();

  const showMessage = useCallback((title: string, description: string = "") => {
    toast({ title, description });
  }, [toast]);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
      showMessage('Error', 'Could not load products.');
    }
  }, [showMessage]);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await fetch('/api/orders');
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error(error);
      showMessage('Error', 'Could not load orders.');
    }
  }, [showMessage]);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, [fetchProducts, fetchOrders]);
  
  const handleToggleStock = async (productId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isOutOfStock: !currentStatus }),
      });
      if (!response.ok) throw new Error('Failed to update stock');
      await fetchProducts(); // Refresh products list
      showMessage(`Product stock status updated!`);
    } catch (e) {
      console.error("Error updating stock status:", e);
      showMessage("Error updating stock status.", "Please try again.");
    }
  };

  const handleAcceptOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'accepted' }),
      });
      if (!response.ok) throw new Error('Failed to accept order');
      await fetchOrders(); // Refresh orders list
      showMessage("Order accepted!");
    } catch (e) {
      console.error("Error accepting order:", e);
      showMessage("Error accepting order.", "Please try again.");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-card rounded-xl shadow-lg p-6 w-full text-center mb-6 flex flex-col items-center">
        <Logo className="h-20 w-auto mb-4" />
        <p className="text-lg text-muted-foreground mb-4">Online Order Reservation System</p>
        <div className="flex justify-center space-x-4">
          <Button
            onClick={() => setCurrentView('customer')}
            variant={currentView === 'customer' ? 'default' : 'secondary'}
            size="lg"
            className="rounded-full transition-all duration-300"
          >
            Customer View
          </Button>
          <Button
            onClick={() => setCurrentView('admin')}
            variant={currentView === 'admin' ? 'default' : 'secondary'}
            size="lg"
            className="rounded-full transition-all duration-300"
          >
            Admin View
          </Button>
        </div>
      </div>

      <div className="w-full">
        {currentView === 'customer' ? (
          <CustomerView
            products={products}
            showMessage={showMessage}
            onReservationMade={fetchOrders}
          />
        ) : (
          <AdminView
            products={products}
            orders={orders}
            handleToggleStock={handleToggleStock}
            handleAcceptOrder={handleAcceptOrder}
          />
        )}
      </div>
    </div>
  );
}
