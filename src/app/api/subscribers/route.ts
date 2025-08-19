
import {NextResponse} from 'next/server';
import fs from 'fs';
import path from 'path';
import type { Subscriber } from '@/types';

const subscribersFilePath = path.join(process.cwd(), 'src', 'data', 'subscribers.json');

const readSubscribersFromFile = (): Subscriber[] => {
  try {
    const fileContent = fs.readFileSync(subscribersFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    return [];
  }
};

const writeSubscribersToFile = (subscribers: Subscriber[]) => {
  fs.writeFileSync(subscribersFilePath, JSON.stringify(subscribers, null, 2));
};

export async function POST(request: Request) {
  const newSubscriberData = await request.json();
  const subscribers = readSubscribersFromFile();
  const newSubscriber: Subscriber = {
    id: new Date().getTime().toString(),
    ...newSubscriberData,
    timestamp: new Date().toISOString(),
  };
  subscribers.push(newSubscriber);
  writeSubscribersToFile(subscribers);
  return NextResponse.json(newSubscriber, {status: 201});
}
