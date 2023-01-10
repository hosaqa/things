export interface Habit {
  id: string;
  name: string;
  emoji?: string;
  description: string;
  dates: number[]; // array of timestamps in milliseconds
  createdAt: number; // timestamp in milliseconds
  updatedAt: number; // timestamp in milliseconds
}