'use server';
/**
 * @fileOverview A flow to determine if a customer should receive an SMS reminder for a pending order.
 *
 * - smsReminderForPendingOrder - A function that checks if a customer should receive an SMS reminder.
 * - SmsReminderInput - The input type for the smsReminderForPendingOrder function.
 * - SmsReminderOutput - The return type for the smsReminderForPendingOrder function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmsReminderInputSchema = z.object({
  customerName: z.string().describe('The name of the customer.'),
  customerPhone: z.string().describe('The phone number of the customer.'),
  orderStatus: z.string().describe('The status of the order (e.g., pending, accepted).'),
  lastReminderSent: z.string().optional().describe('The timestamp of the last SMS reminder sent to the customer, if any.'),
  orderTimestamp: z.string().describe('The timestamp of when the order was placed.'),
});
export type SmsReminderInput = z.infer<typeof SmsReminderInputSchema>;

const SmsReminderOutputSchema = z.object({
  shouldSendReminder: z.boolean().describe('Whether an SMS reminder should be sent to the customer.'),
  reason: z.string().describe('The reason for the decision (e.g., "Order is pending and no recent reminder was sent.").'),
});
export type SmsReminderOutput = z.infer<typeof SmsReminderOutputSchema>;

export async function smsReminderForPendingOrder(input: SmsReminderInput): Promise<SmsReminderOutput> {
  return smsReminderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smsReminderPrompt',
  input: {schema: SmsReminderInputSchema},
  output: {schema: SmsReminderOutputSchema},
  prompt: `You are an automated system that determines whether a customer should receive an SMS reminder for their order.

  Here's the information about the order and the customer:
  - Customer Name: {{{customerName}}}
  - Customer Phone: {{{customerPhone}}}
  - Order Status: {{{orderStatus}}}
  - Order Timestamp: {{{orderTimestamp}}}
  - Last Reminder Sent: {{#if lastReminderSent}}{{{lastReminderSent}}}{{else}}Never{{/if}}

  Consider the following factors to decide if a reminder should be sent:
  1. Only send reminders for orders with a 'pending' status.
  2. Do not send a reminder if one has been sent in the last 24 hours.
  3. Only send reminders for orders placed more than 24 hours ago.

  Based on this information, determine whether an SMS reminder should be sent to the customer.
  Explain the reason for your decision in the 'reason' field.
  Set shouldSendReminder to true if a reminder should be sent, and false otherwise.
  `,
});

const smsReminderFlow = ai.defineFlow(
  {
    name: 'smsReminderFlow',
    inputSchema: SmsReminderInputSchema,
    outputSchema: SmsReminderOutputSchema,
  },
  async input => {
    const now = new Date();
    const orderTime = new Date(input.orderTimestamp);
    const timeDiffInHours = (now.getTime() - orderTime.getTime()) / (1000 * 3600);

    if (input.orderStatus !== 'pending') {
      return {
        shouldSendReminder: false,
        reason: 'Order is not pending.',
      };
    }

    if (timeDiffInHours < 24) {
      return {
        shouldSendReminder: false,
        reason: 'Order was placed less than 24 hours ago.',
      };
    }

    if (input.lastReminderSent) {
      const lastReminderTime = new Date(input.lastReminderSent);
      const reminderDiffInHours = (now.getTime() - lastReminderTime.getTime()) / (1000 * 3600);
      if (reminderDiffInHours < 24) {
        return {
          shouldSendReminder: false,
          reason: 'A reminder was already sent in the last 24 hours.',
        };
      }
    }

    const {output} = await prompt(input);
    return output!;
  }
);
