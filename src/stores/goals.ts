import { writable, derived } from 'svelte/store';
import type { Readable } from 'svelte/store';

import { GoalsList } from '../domain/GoalsList';
import { Goal, type IGoal } from '../domain/Goal';

import { apiService } from '../services/apiService';


const createStore = () => {
  let domain: GoalsList | null = null;

  const observableList = writable<IGoal[]>([]);
  apiService.goal.getList().then((list) => {
    domain = new GoalsList(list);
    observableList.set(domain!.list);
  });

  return {
    isFetching: false,
    list: observableList,
    getOne: (id: string) => {
      return derived(observableList, $observableList => $observableList.find(goal => goal.id === id)) as Readable<IGoal>;
    },
    add: async ({
      name,
      emoji,
      description,
      inspectionDate,
      attachedImages,
    }: {
      name: string,
      emoji?: string,
      description: string,
      inspectionDate: number,
      attachedImages: Array<{
        url: string,
        description: string;
      }>
    }): Promise<void> => {
      const goal = new Goal({
        id: 'temp',
        name: name,
        emoji,
        description: description,
        habits: [],
        inspectionDate,
        attachedImages: attachedImages.map(({ url, description }) => {
          return {
            url,
            description,
            attachedAt: Math.round(Date.now() / 1000),
          }
        }),
      });

      const model = await apiService.goal.create(goal.plain as IGoal);
      
      domain!.add(model);
      observableList.set(domain!.list);
    },
    attachHabit: async ({ habitId, goalId }: { habitId: string, goalId: string }) => {
      const goal = domain!.list.find(({ id }) => id === goalId);

      if (!goal) {
        throw new Error(`Attaching habit caused an error: goal with id ${goalId} doens't exist!`);
      }
      
      goal?.attachHabit({
        id: habitId,
        attachedAt: Math.round(Date.now() / 1000),
      });

      await apiService.goal.patch(goal.id, {
        habits: goal.habits,
      });

      observableList.set([...domain!.list]);
    },
    remove: (id: string) => {
      throw new Error('must be implemented!');
    }
  }
}
const goalsStore = createStore();

export { goalsStore };