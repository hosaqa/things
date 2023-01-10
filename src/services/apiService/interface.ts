import type { Goal } from '../../domain/models/goal';
import type { Habit } from '../../domain/models/habit';

export interface ApiService {
  goal: {
    getList: () => Promise<Goal[]>;
    create: (goal: Goal) => Promise<Goal>;
    patch: (id: string, diff: Partial<Goal>) => Promise<void>;
  };
  habit: {
    getList: () => Promise<Habit[]>;
    create: (habit: Habit) => Promise<Habit>;
    patch: (id: string, diff: Partial<Habit>) => Promise<void>;
  };
}