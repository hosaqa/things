export interface IHabit {
  id: string;
  name: string;
  emoji?: string;
  description: string;
  dates: number[]; // array of timestamps in seconds
  addDate: (newDate: number) => void;
  removeDate: (date: number) => void;
  createdAt: number; // timestamp in seconds
  updatedAt: number; // timestamp in seconds
}

export class Habit implements IHabit {
  id: string;
  name: string;
  emoji?: string;
  description: string;
  dates: number[];
  createdAt: number; // timestamp in seconds
  updatedAt: number; // timestamp in seconds

  constructor({
    id,
    name,
    emoji,
    dates,
    description,
    createdAt,
    updatedAt,
  }: { 
    id: string,
    name: string,
    emoji?: string,
    dates: number[],
    description: string,
    createdAt?: number;
    updatedAt?: number;
  }) {
    this.id = id;
    this.name = name;
    this.emoji = emoji;
    this.description = description;

    const ordered = Array.from(dates.sort((a, b) => a - b));
    this.dates = ordered;

    const todayTimestamp = Math.round(Date.now() / 1000);

    this.createdAt = createdAt || todayTimestamp;
    this.updatedAt = updatedAt || todayTimestamp;
  }

  addDate = (newDate: number) => {
    if (this.dates.includes(newDate)) {
      throw new Error(`Date ${newDate} already exists in the ${this.name} habit`);
    }

    const index = this.dates.findIndex((date) => date > newDate);

    if (index === -1) {
      this.dates.push(newDate);
    } else {
      this.dates.splice(index, 0, newDate);
    }
  }

  removeDate = (date: number) => {
    const index = this.dates.indexOf(date);

    if (index === -1) {
      throw new Error(`Date ${date} doesn't exist in the ${this.name} habit`);
    }

    this.dates.splice(index, 1);
  }
}