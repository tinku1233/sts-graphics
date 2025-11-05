import type { Package, Addon } from './types';

export const PACKAGES: Package[] = [
  { id: 'basic', title: 'Basic Package (Video + Normal Album)', price: 21000 },
  { id: 'standard', title: 'Standard (premium video + album Premium Bag)', price: 32500 },
  { id: 'premium', title: 'Premium (Gimbal video camera + Premium Album)', price: 47500 },
  { id: 'cinema', title: 'Cinematic Video', price: 75000 },
];

export const ADDONS: Addon[] = [
  { id: 'adAlbum', title: 'Ad Album', price: 10000 },
  { id: 'drone', title: 'Drone (1 day)', price: 5000 },
  { id: 'led1', title: 'LED Photo Frame #1', price: 2000 },
  { id: 'led2', title: 'LED Photo Frame #2', price: 2000 },
  { id: 'led3', title: 'LED Photo Frame #3', price: 2000 },
  { id: 'led4', title: 'LED Photo Frame #4', price: 2000 },
  { id: 'led5', title: 'LED Photo Frame #5', price: 2000 },
];

export const EXTRA_EVENT_PRICE: number = 3000;
export const INCLUDED_EVENTS_COUNT: number = 4;