import type { IHabit } from './Habit';

export interface IGoal {
  id: string;
  name: string;
  emoji?: string;
  description: string;
  inspectionDate: number; // timestamp in seconds
  attachedImages: Array<{
    id: string,
    url: string,
    description: string;
    attachedAt: number; // timestamp in seconds
  }>; 
  habits: Array<{
    id: IHabit['id'];
    attachedAt: number; // timestamp in seconds
  }>;
  attachHabit: ({ id, attachedAt }: { id: IHabit['id'], attachedAt: number }) => void;
  detachHabit: (id: IHabit['id']) => void;
  createdAt: number; // timestamp in seconds
  updatedAt: number; // timestamp in seconds
}

export class Goal implements IGoal {
  id: string;
  name: string;
  emoji?: string;
  description: string;
  inspectionDate: number;
  attachedImages: Array<{
    id: string,
    url: string,
    description: string;
    attachedAt: number; // timestamp in seconds
  }>; 
  habits: Array<{
    id: IHabit['id'];
    attachedAt: number; // timestamp in seconds
  }>;
  createdAt: number;
  updatedAt: number;

  constructor({
    id,
    name,
    emoji,
    description,
    inspectionDate,
    attachedImages,
    habits,
    createdAt,
    updatedAt,
  }: {
    id: string,
    name: string,
    emoji?: string,
    description: string,
    inspectionDate: number;
    attachedImages: Array<{
      id: string,
      url: string,
      description: string;
      attachedAt: number; // timestamp in seconds
    }>;
    habits: Array<{
      id: IHabit['id'];
      attachedAt: number; // timestamp in seconds
    }>;
    createdAt?: number;
    updatedAt?: number;
  }) {
    const todayTimestamp = Math.round(Date.now() / 1000);

    this.id = id;
    this.name = name;
    this.emoji = emoji;
    this.habits = habits;
    this.description = description;
    this.inspectionDate = inspectionDate;
    this.attachedImages = attachedImages;
    this.createdAt = createdAt || todayTimestamp;
    this.updatedAt = updatedAt || todayTimestamp;
  }

  get habitIds() {
    return this.habits.map(({id}) => id);
  }

  attachHabit = ({id, attachedAt }: { id: IHabit['id'], attachedAt: number }) => {
    if (this.habitIds.includes(id)) {
      throw new Error(`The habit with ID ${id} is already attached to the ${this.name} goal`);
    }

    this.habits.push({
      id,
      attachedAt,
    });
  }

  detachHabit = (id: IHabit['id']) => {
    const index = this.habitIds.indexOf(id);

    if (index === -1) {
      throw new Error(`The habit with ID ${id} doesn't exist for the ${this.name} goal`);
    }

    this.habitIds.splice(index, 0);
  }
}