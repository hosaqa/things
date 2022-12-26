import type { IGoal } from './Goal';

export interface IGoalsList {
  list: IGoal[];
  add: (newGoal: IGoal) => void;
  remove: (id: IGoal['id']) => void;
}

export class GoalsList implements IGoalsList {
  list: IGoal[];

  constructor(goals: IGoal[]) {
    this.list = goals;
  }

  get goalsNames() {
    return this.list.map(goal => goal.name);
  }

  add = (newGoal: IGoal) => {
    if (this.goalsNames.includes(newGoal.name)) {
      throw new Error(`You already have the goal with name ${newGoal.name}`);
    }
    
    this.list.push(newGoal);
  }

  remove = (id: IGoal['id']) => {
    const index =this.list.findIndex(goal => goal.id === id);

    this.list.splice(index, 1);
  }
}