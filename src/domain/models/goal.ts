import type { Habit } from './habit';

export interface Goal {
  id: string;
  name: string;
  emoji?: string;
  description: string;
  inspectionDate: number; // timestamp in milliseconds
  attachedImages: Array<{
    url: string,
    description: string;
    attachedAt: number; // timestamp in milliseconds
  }>; 
  habits: Array<{
    id: Habit['id'];
    attachedAt: number; // timestamp in milliseconds
  }>;
  createdAt: number; // timestamp in milliseconds
  updatedAt: number; // timestamp in milliseconds
}