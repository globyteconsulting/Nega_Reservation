'use client';

import type { Product } from '@/types';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
  onSelect: () => void;
  isSelected: boolean;
}

export default function ProductCard({ product, onSelect, isSelected }: ProductCardProps) {
  const hints: { [key: string]: string } = {
    'Kurt': 'raw beef Kurt',
    'TIbs': 'raw beef Tibs',
    'Wot': 'raw beef wot',
  }
  return (
    <div
      className={cn(
        'p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-between',
        product.isOutOfStock ? 'bg-muted border-destructive/50 text-muted-foreground' : 'bg-secondary border-primary/50 cursor-pointer',
        isSelected && !product.isOutOfStock && 'ring-2 ring-primary border-primary'
      )}
      onClick={product.isOutOfStock ? undefined : onSelect}
    >
      <Image 
        src={product.imageUrl} 
        alt={product.name} 
        width={80} 
        height={80} 
        className="mb-2 rounded-full" 
        data-ai-hint={hints[product.name] || 'meat'}
      />
      <p className="text-center font-semibold text-lg">{product.name}</p>
      {product.isOutOfStock ? (
        <p className="text-center text-sm font-bold text-destructive">Out of Stock</p>
      ) : (
        <Button
          variant="link"
          size="sm"
          className="mt-2 text-primary"
        >
          {isSelected ? 'Selected' : 'Select'}
        </Button>
      )}
    </div>
  );
}
