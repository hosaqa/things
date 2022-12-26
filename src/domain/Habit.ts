export interface IHabit {
  id: string;
  name: string;
  relatedGoalIds: string[];
  dates: number[]; // array of timestamps in seconds
  addDate: (newDate: number) => void;
  removeDate: (date: number) => void;
}

export class Habit implements IHabit {
  id: string;
  name: string;
  relatedGoalIds: string[];
  dates: number[];

  constructor(id: string, name: string, relatedGoalIds: string[], dates: number[]) {
    this.id = id;
    this.name = name;
    this.relatedGoalIds = relatedGoalIds;

    const ordered = Array.from(dates.sort((a, b) => a - b));
    this.dates = ordered;
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