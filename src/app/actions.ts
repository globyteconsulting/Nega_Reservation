'use server';

import { smsReminderForPendingOrder } from '@/ai/flows/sms-reminder';
import type { Order } from '@/types';

export async function checkSmsReminder(order: Order): Promise<{ shouldSendReminder: boolean; reason: string; }> {
  try {
    const result = await smsReminderForPendingOrder({
      customerName: order.customer.name,
      customerPhone: order.customer.phone,
      orderStatus: order.order.status,
      orderTimestamp: order.order.timestamp,
      lastReminderSent: order.lastReminderSent,
    });
    return result;
  } catch (error) {
    console.error('Error checking SMS reminder:', error);
    return { shouldSendReminder: false, reason: 'An error occurred while checking.' };
  }
}
