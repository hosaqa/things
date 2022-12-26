import type { IHabit } from './Habit';

export interface IGoal {
  id: string;
  name: string;
  emoji?: string;
  description: string;
  habits: IHabit['id'][];
  attachHabit: (id: IHabit['id']) => void;
  detachHabit: (id: IHabit['id']) => void;
  createdAt: number; // timestamp in seconds
  updatedAt: number; // timestamp in seconds
}

export class Goal implements IGoal {
  id: string;
  name: string;
  emoji?: string;
  description: string;
  habits: IHabit['id'][];
  createdAt: number;
  updatedAt: number;

  constructor({ id, name, emoji, description, habits, createdAt, updatedAt }: {
    id: string,
    name: string,
    emoji?: string,
    description: string,
    habits: IHabit['id'][],
    createdAt?: number;
    updatedAt?: number;
  }) {
    const todayTimestamp = Math.round(Date.now() / 1000);

    this.id = id;
    this.name = name;
    this.emoji = emoji;
    this.habits = habits;
    this.description = description;
    this.createdAt = createdAt || todayTimestamp;
    this.updatedAt = updatedAt || todayTimestamp;
  }

  attachHabit = (id: IHabit['id']) => {
    if (this.habits.includes(id)) {
      throw new Error(`The habit with ID ${id} is already attached to the ${this.name} goal`);
    }

    this.habits.push(id);
  }

  detachHabit = (id: IHabit['id']) => {
    const index = this.habits.indexOf(id);

    if (index === -1) {
      throw new Error(`The habit with ID ${id} doesn't exist for the ${this.name} goal`);
    }

    this.habits.splice(index, 0);
  }
}