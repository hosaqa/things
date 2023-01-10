import { writable, derived, get } from 'svelte/store';
import type { Readable } from 'svelte/store';

import type { Goal } from '../models/goal';

import type { ApiService } from '../../services/apiService/interface';
import { firebaseApiService } from '../../services/apiService/firebase/firebaseApiService';

const createStore = (apiService: ApiService) => {
  const list = writable<Goal[]>([]);
  const isFetching = writable(true);

  apiService.goal.getList()
    .then((fetchedList) => {
      list.set(fetchedList);
    })
    .finally(() => {
      isFetching.set(false)
    });

  return {
    isFetching: false,
    list: list,
    getOne: (id: string) => {
      return derived(list, $list => $list.find(goal => goal.id === id)) as Readable<Goal>;
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
      inspectionDate: Date,
      attachedImages: Array<{
        url: string,
        description: string;
      }>
    }): Promise<void> => {
      const timestamp = Date.now();
      const newGoal: Goal = {
        id: 'temp',
        name: name,
        emoji,
        description: description,
        habits: [],
        inspectionDate: inspectionDate.getTime(),
        attachedImages: attachedImages.map(({ url, description }) => {
          return {
            url,
            description,
            attachedAt: timestamp,
          }
        }),
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      const created = await apiService.goal.create(newGoal);

      list.update((list) => {
        return [...list, created];
      });
    },
    attachHabit: async ({ habitId, goalId }: { habitId: string, goalId: string }) => {
      const goal = get(list).find(({ id }) => id === goalId);

      if (!goal) {
        throw new Error(`Attaching habit caused an error: goal with id ${goalId} doens't exist!`);
      }
      
      const updatedHabits = [...goal.habits, {
        id: habitId,
        attachedAt: Date.now(),
      }];

      await apiService.goal.patch(goal.id, {
        habits: updatedHabits,
      });

      list.update((prevList) => {
        const index = prevList.indexOf(goal);

        prevList[index] = {
          ...goal,
          habits: updatedHabits,
        }

        return prevList;
      })
    },
    remove: (id: string) => {
      throw new Error('must be implemented!');
    }
  }
}
const goalsStore = createStore(firebaseApiService);

export { goalsStore };