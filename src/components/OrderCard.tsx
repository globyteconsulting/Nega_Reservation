'use client';

import { useState } from 'react';
import type { Order } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, BellRing, CheckCircle, AlertCircle } from 'lucide-react';
import { checkSmsReminder } from '@/app/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface OrderCardProps {
  order: Order;
  onAcceptOrder: (orderId: string) => void;
}

export default function OrderCard({ order, onAcceptOrder }: OrderCardProps) {
  const [reminderResult, setReminderResult] = useState<{ shouldSend: boolean; reason: string } | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const downloadTextFile = () => {
    const textContent = `Customer Name: ${order.customer.name}
Phone: ${order.customer.phone}
Email: ${order.customer.email}
Product Category: ${order.order.category}
Quantity: ${order.order.quantity}
Order Status: ${order.order.status}
Order Time: ${new Date(order.order.timestamp).toLocaleString()}`;
    
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `order_${order.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleCheckReminder = async () => {
    setIsChecking(true);
    setReminderResult(null);
    const result = await checkSmsReminder(order);
    setReminderResult({ shouldSend: result.shouldSendReminder, reason: result.reason });
    setIsChecking(false);
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">{order.customer.name}</CardTitle>
        <Badge variant={order.order.status === 'accepted' ? 'default' : 'secondary'} className={order.order.status === 'pending' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}>
          {order.order.status}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground space-y-1">
          <p><strong>Phone:</strong> {order.customer.phone}</p>
          <p><strong>Email:</strong> {order.customer.email || 'N/A'}</p>
          <p><strong>Order:</strong> {order.order.quantity} of {order.order.category}</p>
          <p><strong>Time:</strong> {new Date(order.order.timestamp).toLocaleString()}</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            onClick={() => onAcceptOrder(order.id)}
            size="sm"
            disabled={order.order.status === 'accepted'}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Accept Order
          </Button>
          <Button onClick={downloadTextFile} size="sm" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          {order.order.status === 'pending' && (
             <Button onClick={handleCheckReminder} size="sm" variant="outline" disabled={isChecking}>
                <BellRing className="mr-2 h-4 w-4" />
                {isChecking ? 'Checking...' : 'Check Reminder'}
            </Button>
          )}
        </div>
        {reminderResult && (
           <Alert className={`mt-4 ${reminderResult.shouldSend ? 'border-green-500 text-green-700' : 'border-blue-500 text-blue-700'}`}>
            {reminderResult.shouldSend ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertTitle>{reminderResult.shouldSend ? 'Reminder Recommended' : 'Reminder Not Recommended'}</AlertTitle>
            <AlertDescription>
                {reminderResult.reason}
            </AlertDescription>
           </Alert>
        )}
      </CardContent>
    </Card>
  );
}
