import { writable, derived } from 'svelte/store';
import type { Readable } from 'svelte/store';

import { GoalsList } from '../domain/GoalsList';
import { Goal, type IGoal } from '../domain/Goal';

import { persistentStorage, PERSISTENT_STORAGE_KEYS } from '../services/persistentStorage';


const createStore = () => {
  const initialGoals = persistentStorage.get(PERSISTENT_STORAGE_KEYS.GOALS) as Array<{
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
      id: string;
      attachedAt: number; // timestamp in seconds
    }>;
    createdAt: number; // timestamp in seconds
    updatedAt: number; // timestamp in seconds
  }>;
  const domain = new GoalsList((initialGoals || []).map(goal => new Goal(goal)));
  const observableList = writable(domain.list);
  
  return {
    list: observableList,
    getOne: (id: string) => {
      return derived(observableList, $observableList => $observableList.find(goal => goal.id === id)) as Readable<IGoal>;
    },
    add: ({
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
    }) => {
      const goal = new Goal({
        id: Math.random().toString(),
        name: name,
        emoji,
        description: description,
        habits: [],
        inspectionDate,
        attachedImages: attachedImages.map(({ url, description }) => {
          return {
            id: Math.random().toString(),
            url,
            description,
            attachedAt: Math.round(Date.now() / 1000),
          }
        }),
      });

      domain.add(goal);
      observableList.set(domain.list);

      persistentStorage.set(PERSISTENT_STORAGE_KEYS.GOALS, domain.list);
    },
    attachHabit: ({ habitId, goalId }: { habitId: string, goalId: string }) => {
      const goal = domain.list.find(({ id }) => id === goalId);

      if (!goal) {
        throw new Error(`Attaching habit caused an error: goal with id ${goalId} doens't exist!`);
      }
      
      goal?.attachHabit({
        id: habitId,
        attachedAt: Math.round(Date.now() / 1000),
      });

      observableList.set([...domain.list]);
      persistentStorage.set(PERSISTENT_STORAGE_KEYS.GOALS, [...domain.list]);
    },
    remove: (id: string) => {
      domain.remove(id);

      observableList.set(domain.list);

      persistentStorage.set(PERSISTENT_STORAGE_KEYS.GOALS, domain.list);
    }
  }
}
const goalsStore = createStore();

export { goalsStore };