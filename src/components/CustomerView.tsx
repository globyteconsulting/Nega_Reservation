
'use client';

import { useState } from 'react';
import type { Product } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ProductCard from './ProductCard';

interface CustomerViewProps {
  products: Product[];
  showMessage: (title: string, description?: string) => void;
  onReservationMade: () => void;
}

export default function CustomerView({ products, showMessage, onReservationMade }: CustomerViewProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [subName, setSubName] = useState('');
  const [subPhone, setSubPhone] = useState('');
  const [subEmail, setSubEmail] = useState('');

  const handleReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !selectedProduct || quantity < 1) {
      return showMessage("Please fill out all required fields correctly.");
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { name, phone, email },
          order: {
            category: selectedProduct.name,
            quantity,
          }
        }),
      });
      if (!response.ok) throw new Error('Failed to place reservation');
      
      showMessage("Reservation placed successfully!");
      setName(''); setPhone(''); setEmail(''); setQuantity(1); setSelectedProduct(null);
      onReservationMade();
    } catch (error) {
      console.error("Error placing reservation:", error);
      showMessage("Error placing reservation.", "Please try again.");
    }
  };
  
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName || !subPhone || !subEmail) {
      return showMessage("Please provide your name, phone, and email to subscribe.");
    }
    
    try {
      const response = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: subName, phone: subPhone, email: subEmail }),
      });
      if (!response.ok) throw new Error('Subscription failed');

      showMessage("You have subscribed to notifications!");
      setSubName(''); setSubPhone(''); setSubEmail('');
    } catch (error) {
      console.error("Error subscribing:", error);
      showMessage("Subscription failed.", "Please try again.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Make a Reservation 🥩</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onSelect={() => setSelectedProduct(product)}
                  isSelected={selectedProduct?.id === product.id}
                />
              ))
            ) : (
              <p className="col-span-3 text-center text-muted-foreground">Loading products...</p>
            )}
          </div>

          {selectedProduct && (
            <form onSubmit={handleReservation} className="space-y-4 animate-in fade-in-50 duration-500">
              <div className="p-3 bg-secondary rounded-lg text-center font-bold text-secondary-foreground">
                You've selected: {selectedProduct.name}
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="rounded-full" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Primary)</Label>
                <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className="rounded-full" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-full" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} min="1" required className="rounded-full" />
              </div>
              <Button type="submit" className="w-full rounded-full font-bold text-lg" size="lg">Submit Reservation</Button>
            </form>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Subscribe for Notifications ✨</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Receive alerts for new inventory and out-of-stock items.</p>
          <form onSubmit={handleSubscribe} className="space-y-4">
             <div className="space-y-2">
                <Label htmlFor="sub-name">Your Name</Label>
                <Input id="sub-name" type="text" value={subName} onChange={(e) => setSubName(e.target.value)} required className="rounded-full" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sub-phone">Phone Number</Label>
                <Input id="sub-phone" type="tel" value={subPhone} onChange={(e) => setSubPhone(e.target.value)} required className="rounded-full" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sub-email">Email</Label>
                <Input id="sub-email" type="email" value={subEmail} onChange={(e) => setSubEmail(e.target.value)} required className="rounded-full" />
              </div>
            <Button type="submit" className="w-full rounded-full font-bold text-lg" size="lg">Subscribe Now</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
